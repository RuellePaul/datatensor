import random
from typing import List, Union
from uuid import uuid4

import cv2
import numpy
import requests
from Augmentor import DataPipeline
from PIL import Image as PILImage

from api import errors
from api.config import Config
from api.routers.images.models import Image
from api.routers.labels.models import Label
from api.routers.pipelines.models import Operation
from api.routers.pipelines.models import Pipeline

db = Config.db


def find_pipelines(dataset_id, offset=0, limit=0) -> List[Label]:
    pipelines = list(db.pipelines.find({'dataset_id': dataset_id}).skip(offset).limit(limit))
    if pipelines is None:
        raise errors.NotFound(errors.PIPELINE_NOT_FOUND)
    return [Pipeline.from_mongo(pipeline) for pipeline in pipelines]


def from_image_bytes(image_bytes):
    return cv2.imdecode(numpy.fromstring(image_bytes, numpy.uint8), cv2.IMREAD_UNCHANGED)


def from_image_path(path):
    image_bytes = requests.get(path).content
    return from_image_bytes(image_bytes)


def draw_ellipsis(width, height, label: Label):
    blank_image = numpy.zeros((height, width, 3), numpy.uint8)
    x = int(label.x * width)
    y = int(label.y * height)
    w = int(label.w * width)
    h = int(label.h * height)
    center = tuple([int(x + w / 2), int(y + h / 2)])
    axes = tuple([int(w / 2) + 1, int(h / 2) + 1])
    cv2.ellipse(blank_image, center, axes, 0, 0, 360, (255, 255, 255), -1)
    return blank_image


def retrieve_label_from_ellipsis(image, image_id) -> Union[Label, None]:
    mask = cv2.inRange(image, (120, 120, 120), (255, 255, 255))
    rect = cv2.boundingRect(mask)
    if not rect:
        return None
    label = Label(
        id=str(uuid4()),
        image_id=image_id,
        x=round(rect[0] / image.shape[1], 6),
        y=round(rect[1] / image.shape[0], 6),
        w=round(rect[2] / image.shape[1], 6),
        h=round(rect[3] / image.shape[0], 6)
    )
    return label


class AugmentorPipeline(DataPipeline):

    def __init__(self, image: Image, labels: List[Label]):
        self.image = image
        self.labels = labels
        super().__init__(image, labels)

    def sample(self, n):
        images = [from_image_path(self.image.path)]
        for label in self.labels:
            images.append(draw_ellipsis(self.image.width, self.image.height, label))

        input_images = [PILImage.fromarray(x) for x in images]

        output_images = []
        output_images_labels: List[List[Label]] = []
        for i in range(0, n):
            augmented_images = input_images

            for operation in self.operations:
                roll = round(random.uniform(0, 1), 1)
                if roll <= operation.probability:
                    augmented_images = operation.perform_operation(augmented_images)

            output_images.append(numpy.asarray(augmented_images[0]))

            labels = [retrieve_label_from_ellipsis(numpy.asarray(image), self.image.id)
                      for image in augmented_images[1:]]

            for index, label in enumerate(labels):
                if label:
                    label.category_id = self.labels[index].category_id

            labels = list(filter(None.__ne__, labels))

            output_images_labels.append(labels)

        return output_images, output_images_labels


def perform_sample(image: Image, labels: List[Label], operations: List[Operation]):
    pipeline = AugmentorPipeline(image, labels)
    for operation in operations:
        getattr(pipeline, operation.type)(probability=operation.probability, **operation.properties)
    if image.width > image.height:
        return pipeline.sample(4)
    else:
        return pipeline.sample(3)
