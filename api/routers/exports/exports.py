from fastapi import APIRouter, Depends

import errors
from dependencies import logged_user
from routers.datasets.core import find_dataset
from routers.exports.core import process_export
from routers.exports.models import *
from routers.users.models import User
from utils import parse

exports = APIRouter()


@exports.get('/', response_model=Export)
def get_export(dataset_id, user: User = Depends(logged_user)):
    """
    Process dataset export.
    """
    dataset = find_dataset(dataset_id, include_categories=True)

    if not dataset.is_public and dataset.user_id != user.id:
        raise errors.Forbidden(errors.NOT_YOUR_DATASET)

    response = process_export(dataset)
    return parse(response)
