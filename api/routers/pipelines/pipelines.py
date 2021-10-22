import base64

import cv2
from fastapi import APIRouter, Depends

from dependencies import dataset_belongs_to_user
from routers.images.core import find_image
from routers.labels.core import find_labels
from routers.pipelines.core import find_pipelines, perform_sample, delete_pipeline
from routers.pipelines.models import SampleBody, PipelinesResponse
from utils import parse

pipelines = APIRouter()


@pipelines.get('/', response_model=PipelinesResponse)
def get_pipelines(dataset_id, offset: int = 0, limit: int = 0):
    """
    Fetch paginated pipelines list of given dataset.
    """
    response = {'pipelines': find_pipelines(dataset_id, offset, limit)}
    return parse(response)


@pipelines.post('/sample')
def sample(dataset_id, payload: SampleBody, dataset=Depends(dataset_belongs_to_user)):
    """
    Execute a sample of augmentor operations pipeline
    """
    image_id = payload.image_id
    operations = payload.operations

    image = find_image(dataset_id, image_id)
    labels = find_labels(image_id, offset=0, limit=0)

    augmented_images, augmented_labels = perform_sample(
        image,
        labels,
        operations
    )

    encoded_images = [cv2.imencode('.jpg', augmented_image)[1].tostring()
                      for augmented_image in augmented_images]
    base64_encoded_images = [base64.b64encode(image) for image in encoded_images]
    return {
        'images': base64_encoded_images,
        'images_labels': parse(augmented_labels)
    }


@pipelines.delete('/{pipeline_id}')
def sample(dataset_id, pipeline_id, dataset=Depends(dataset_belongs_to_user)):
    """
    Delete a pipeline & associated images, labels, and task
    """
    delete_pipeline(dataset_id, pipeline_id)
