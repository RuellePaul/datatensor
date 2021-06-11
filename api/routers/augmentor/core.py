import random
from typing import List

import cv2
import numpy
import requests
from Augmentor import DataPipeline
from PIL import Image as PILImage

from routers.augmentor.models import Operation
from routers.images.models import Image


class AugmentorPipeline(DataPipeline):

    def __init__(self, images, **kwargs):
        self.images = images
        super().__init__(images, **kwargs)

    def sample(self, n):
        image_bytes = requests.get(self.images[0]['path']).content
        input_images = [cv2.imdecode(numpy.fromstring(image_bytes, numpy.uint8), cv2.IMREAD_UNCHANGED)]
        input_images = [PILImage.fromarray(x) for x in input_images]

        output_images = []
        for i in range(0, n):
            augmented_images = input_images
            for operation in self.operations:
                roll = round(random.uniform(0, 1), 1)
                if roll <= operation.probability:
                    augmented_images = operation.perform_operation(augmented_images)
            output_images.extend([numpy.asarray(x) for x in augmented_images])

        return output_images


def perform_augmentation(image: Image, operations: List[Operation]):
    pipeline = AugmentorPipeline(images=[image])
    for operation in operations:
        getattr(pipeline, operation.type)(probability=operation.probability, **{})
    return pipeline.sample(1)
