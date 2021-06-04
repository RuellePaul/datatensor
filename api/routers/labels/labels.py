from fastapi import APIRouter

from routers.labels.core import find_labels, find_label, replace_labels
from routers.labels.models import *
from utils import parse

labels = APIRouter()


@labels.get('/', response_model=LabelsResponse)
async def get_labels(image_id, offset: int = 0, limit: int = 0):
    """
    Fetch paginated labels list of given image.
    """
    result = find_labels(image_id, offset, limit)
    response = {'labels': result}
    return parse(response)


@labels.get('/{label_id}', response_model=LabelResponse)
async def get_label(image_id, label_id):
    """
    Fetch given label of given image.
    """
    result = find_label(image_id, label_id)
    response = {'label': result}
    return parse(response)


@labels.post('/')
async def post_labels(image_id, payload: LabelPostBody):
    """
    Replace labels to a given image.
    """
    replace_labels(image_id, payload.labels)
