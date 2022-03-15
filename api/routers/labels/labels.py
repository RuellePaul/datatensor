from fastapi import APIRouter, Depends
from typing import Dict

from dependencies import dataset_belongs_to_user
from logger import logger
from routers.labels.core import find_labels, find_label, replace_labels
from routers.labels.models import *
from utils import parse

labels = APIRouter()


@labels.get('/', response_model=LabelsResponse)
def get_labels(image_id, offset: int = 0, limit: int = 0):
    """
    Fetch paginated labels list of given image.
    """
    response = {'labels': find_labels(image_id, offset, limit)}
    logger.notify('Labels', f'Fetch labels of image `{image_id}`')
    return parse(response)


@labels.get('/{label_id}', response_model=LabelResponse)
def get_label(image_id, label_id):
    """
    Fetch given label of given image.
    """
    response = {'label': find_label(image_id, label_id)}
    logger.notify('Labels', f'Fetch label `{label_id}` of image `{image_id}`')
    return parse(response)


@labels.post('/', response_model=Dict[str, int])
def post_labels(image_id, payload: LabelPostBody, dataset=Depends(dataset_belongs_to_user)):
    """
    Replace labels to a given image.
    """
    response = replace_labels(image_id, payload.labels)
    logger.notify('Labels', f'Update labels of image `{image_id}`')
    return parse(response)
