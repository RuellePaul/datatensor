from fastapi import APIRouter, Depends

import errors
from dependencies import logged_admin, logged_user
from routers.datasets.core import find_datasets, find_dataset, remove_dataset, remove_datasets, insert_dataset
from routers.datasets.models import *
from routers.users.models import User
from utils import parse

datasets = APIRouter()


@datasets.get('/', response_model=DatasetsResponse)
async def get_datasets(user: User = Depends(logged_user), offset: int = 0, limit: int = 0):
    """
    Fetch paginated datasets list (either user datasets, or public ones).
    """
    response = {'datasets': find_datasets(user.id, offset, limit)}
    return parse(response)


@datasets.get('/{dataset_id}', response_model=DatasetResponse)
async def get_dataset(dataset_id):
    """
    Fetch dataset.
    🌍 All users
    """
    response = {'dataset': find_dataset(dataset_id)}
    return parse(response)


@datasets.post('/')
async def post_dataset(payload: DatasetPostBody, user: User = Depends(logged_user)):
    """
    Create a new dataset.
    🔒️ Verified users
    """
    if not user.is_verified:
        raise errors.Forbidden(errors.USER_NOT_VERIFIED, data='ERR_VERIFY')
    insert_dataset(user.id, payload)


@datasets.delete('/')
async def delete_dataset(user: User = Depends(logged_admin)):
    """
    Delete all datasets of admin user, and other linked collections (`images`, `labels`, `tasks`...).
    🔒️ Admin only
    """
    remove_datasets(user.id)


@datasets.delete('/{dataset_id}')
async def delete_dataset(dataset_id, user: User = Depends(logged_user)):
    """
    Delete a dataset, and other linked collections (`images`, `labels`, `tasks`...)
    """
    remove_dataset(user.id, dataset_id)
