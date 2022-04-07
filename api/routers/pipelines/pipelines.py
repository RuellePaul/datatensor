import base64

import cv2
from fastapi import APIRouter, Depends

from dependencies import dataset_belongs_to_user
from logger import logger
from routers.images.core import find_images
from routers.pipelines.core import find_pipelines, perform_sample, delete_pipeline
from routers.pipelines.models import *
from utils import parse

pipelines = APIRouter()


@pipelines.get('/', response_model=PipelinesResponse)
def get_dataset_pipelines(dataset_id, offset: int = 0, limit: int = 0):
    """
    Fetch paginated pipelines list of given dataset.
    """
    response = {'pipelines': find_pipelines(dataset_id, offset, limit)}
    logger.notify('Pipelines', f'Fetch pipelines of dataset `{dataset_id}`')
    return parse(response)


@pipelines.post('/sample', response_model=SampleResponse)
def do_sample(dataset_id, payload: SampleBody, dataset=Depends(dataset_belongs_to_user)):
    """
    Execute a sample of augmentor operations pipeline
    """
    operations = payload.operations

    images = find_images(dataset_id, limit=1, include_labels=True)

    augmented_images = []
    augmented_labels = []

    for image in images:
        current_images, current_labels = perform_sample(image, image.labels, operations)
        augmented_images.extend(current_images)
        augmented_labels.extend(current_labels)

    encoded_images = [cv2.imencode('.jpg', augmented_image)[1].tostring()
                      for augmented_image in augmented_images]
    base64_encoded_images = [base64.b64encode(image) for image in encoded_images]

    logger.notify('Pipelines', f'Do sample with {len(operations)} operations for dataset `{dataset_id}`')

    return {
        'images': base64_encoded_images,
        'images_labels': parse(augmented_labels)
    }


@pipelines.delete('/{pipeline_id}')
def delete_dataset_pipeline(dataset_id, pipeline_id, dataset=Depends(dataset_belongs_to_user)):
    """
    Delete a pipeline & associated images, labels, and task
    """
    delete_pipeline(dataset_id, pipeline_id)
    logger.notify('Pipelines', f'Delete pipeline `{pipeline_id}` of dataset `{dataset_id}`')
