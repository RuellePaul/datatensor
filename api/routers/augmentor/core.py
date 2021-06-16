import random
from typing import List

import cv2
import numpy
import requests
from Augmentor import DataPipeline
from PIL import Image as PILImage

from routers.augmentor.models import Operation
from routers.images.models import Image
from routers.labels.models import Label


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
    cv2.ellipse(blank_image, center, axes, 0, 0, 360, (255, 0, 0), -1)
    return blank_image


class AugmentorPipeline(DataPipeline):

    def __init__(self, image: Image, labels: List[Label], **kwargs):
        self.image = image
        self.labels = labels
        super().__init__(image, labels, **kwargs)

    def sample(self, n):

        images = [from_image_path(self.image.path)]
        for label in self.labels:
            images.append(draw_ellipsis(self.image.width, self.image.height, label))

        input_images = [PILImage.fromarray(x) for x in images]

        output_images = []
        for i in range(0, n):
            augmented_images = input_images
            for operation in self.operations:
                roll = round(random.uniform(0, 1), 1)
                if roll <= operation.probability:
                    augmented_images = operation.perform_operation(augmented_images)
            output_images.extend([numpy.asarray(x) for x in augmented_images])

        return output_images


def perform_augmentation(image: Image, labels: List[Label], operations: List[Operation]):
    pipeline = AugmentorPipeline(image, labels)
    for operation in operations:
        getattr(pipeline, operation.type)(probability=operation.probability, **operation.properties)
    return pipeline.sample(4)
