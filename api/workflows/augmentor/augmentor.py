import concurrent.futures
import random
from uuid import uuid4

import cv2
import numpy
from Augmentor import DataPipeline
from PIL import Image as PILImage

from config import Config
from routers.images.core import find_images, upload_image
from routers.images.models import Image
from routers.labels.core import find_labels
from routers.pipelines.core import from_image_path, draw_ellipsis, retrieve_label_from_ellipsis
from routers.pipelines.models import Pipeline
from routers.tasks.models import TaskAugmentorProperties
from utils import update_task, increment_task_progress

db = Config.db


def process_augmentation(payload):
    index = payload['index']
    image = payload['image']
    labels = payload['labels']
    operations = payload['operations']
    dataset_id = payload['dataset_id']
    pipeline_id = payload['pipeline_id']
    task_id = payload['task_id']
    image_count = payload['image_count']

    images = [from_image_path(image.path)]

    for label in labels[index]:
        images.append(draw_ellipsis(image.width, image.height, label))

    input_images = [PILImage.fromarray(x) for x in images]

    augmented_images = input_images

    for operation in operations:
        roll = round(random.uniform(0, 1), 1)
        if roll <= operation.probability:
            augmented_images = operation.perform_operation(augmented_images)

    new_image_id = str(uuid4())

    new_labels = [retrieve_label_from_ellipsis(numpy.asarray(augmented_image), new_image_id)
                  for augmented_image in augmented_images[1:]]
    for j, label in enumerate(new_labels):
        if label:
            label.category_id = labels[index][j].category_id
    new_labels = list(filter(None.__ne__, new_labels))

    image_bytes = cv2.imencode('.jpg', numpy.asarray(augmented_images[0]))[1].tostring()
    path = upload_image(image_bytes, new_image_id)
    new_image = Image(
        id=new_image_id,
        dataset_id=dataset_id,
        path=path,
        name=f'augmented-{image.name}',
        size=len(image_bytes),
        width=augmented_images[0].width,
        height=augmented_images[0].height,
        pipeline_id=pipeline_id
    )
    db.images.insert_one(new_image.mongo())
    if new_labels:
        db.labels.insert_many([label.mongo() for label in new_labels])

    increment_task_progress(task_id, 1 / image_count)


class AugmentorPipeline(DataPipeline):

    def __init__(self, task_id, dataset_id, properties):
        self.task_id = task_id
        self.dataset_id = dataset_id
        self.images = find_images(dataset_id)
        self.labels = [find_labels(image.id) for image in self.images]
        self.properties = properties
        super().__init__(self.images, self.labels)

    def sample(self):
        pipeline_id = str(uuid4())
        pipeline = Pipeline(
            id=pipeline_id,
            dataset_id=self.dataset_id,
            operations=self.properties.operations,
            image_count=self.properties.image_count
        )
        db.pipelines.insert_one(pipeline.mongo())
        db.datasets.update_one({'_id': self.dataset_id},
                               {'$inc': {'augmented_count': self.properties.image_count}},
                               upsert=False)
        with concurrent.futures.ThreadPoolExecutor() as executor:
            result = executor.map(process_augmentation,
                         [{'index': index % len(self.images),
                           'image': self.images[index % len(self.images)],
                           'labels': self.labels,
                           'operations': self.operations,
                           'dataset_id': self.dataset_id,
                           'pipeline_id': pipeline_id,
                           'task_id': self.task_id,
                           'image_count': self.properties.image_count
                           } for index in range(self.properties.image_count)])


def main(user_id, task_id, dataset_id, properties: TaskAugmentorProperties):
    update_task(task_id, status='active')
    pipeline = AugmentorPipeline(task_id, dataset_id, properties)
    for operation in properties.operations:
        getattr(pipeline, operation.type)(probability=operation.probability, **operation.properties)
    pipeline.sample()
