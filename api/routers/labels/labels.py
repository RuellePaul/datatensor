from fastapi import APIRouter, Depends
from typing import Dict

from dependencies import dataset_belongs_to_user
from routers.labels.core import find_labels, find_label, replace_labels
from routers.labels.models import *
from utils import parse

labels = APIRouter()


@labels.get('/', response_model=LabelsResponse)
async def get_labels(image_id, offset: int = 0, limit: int = 0):
    """
    Fetch paginated labels list of given image.
    """
    response = {'labels': find_labels(image_id, offset, limit)}
    return parse(response)


@labels.get('/{label_id}', response_model=LabelResponse)
async def get_label(image_id, label_id):
    """
    Fetch given label of given image.
    """
    response = {'label': find_label(image_id, label_id)}
    return parse(response)


@labels.post('/', response_model=Dict[str, int])
async def post_labels(image_id, payload: LabelPostBody, dataset=Depends(dataset_belongs_to_user)):
    """
    Replace labels to a given image.
    """
    response = replace_labels(image_id, payload.labels)
    return parse(response)
