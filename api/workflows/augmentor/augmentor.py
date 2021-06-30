import random
from uuid import uuid4

import cv2
import numpy
from Augmentor import DataPipeline
from PIL import Image as PILImage

from config import Config
from routers.augmentor.core import from_image_path, draw_ellipsis, retrieve_label_from_ellipsis
from routers.images.core import find_images, upload_image
from routers.images.models import Image
from routers.labels.core import find_labels
from routers.tasks.models import TaskAugmentorProperties
from utils import update_task, increment_task_progress

db = Config.db


class Pipeline(DataPipeline):

    def __init__(self, task_id, dataset_id):
        self.task_id = task_id
        self.dataset_id = dataset_id
        self.images = find_images(dataset_id)
        self.labels = [find_labels(image.id) for image in self.images]
        super().__init__(self.images, self.labels)

    def sample(self, image_count):
        for index in range(image_count):
            index = index % len(self.images)

            image = self.images[index]
            images = [from_image_path(image.path)]

            for label in self.labels[index]:
                images.append(draw_ellipsis(image.width, image.height, label))

            input_images = [PILImage.fromarray(x) for x in images]

            augmented_images = input_images

            for operation in self.operations:
                roll = round(random.uniform(0, 1), 1)
                if roll <= operation.probability:
                    augmented_images = operation.perform_operation(augmented_images)

            new_image_id = str(uuid4())

            new_labels = [retrieve_label_from_ellipsis(numpy.asarray(augmented_image), new_image_id)
                          for augmented_image in augmented_images[1:]]
            for j, label in enumerate(new_labels):
                if label:
                    label.category_id = self.labels[index][j].category_id
            new_labels = list(filter(None.__ne__, new_labels))

            image_bytes = cv2.imencode('.jpg', numpy.asarray(augmented_images[0]))[1].tostring()
            path = upload_image(image_bytes, new_image_id)
            new_image = Image(
                id=new_image_id,
                dataset_id=self.dataset_id,
                path=path,
                name=f'{image.name} (augmented)',
                size=len(image_bytes),
                width=augmented_images[0].width,
                height=augmented_images[0].height,
            )
            db.images.insert_one(new_image.mongo())
            if new_labels:
                db.labels.insert_many([label.mongo() for label in new_labels])

            increment_task_progress(self.task_id, 1 / image_count)


def main(user_id, task_id, dataset_id, properties: TaskAugmentorProperties):
    update_task(task_id, status='active')
    pipeline = Pipeline(task_id, dataset_id)
    for operation in properties.operations:
        getattr(pipeline, operation.type)(probability=operation.probability, **operation.properties)
    pipeline.sample(properties.image_count)
