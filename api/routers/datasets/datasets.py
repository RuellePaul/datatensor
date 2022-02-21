from fastapi import APIRouter, Depends

import errors
from dependencies import logged_admin, logged_user
from routers.datasets.core import find_datasets, find_dataset, remove_dataset, remove_datasets, insert_dataset, \
    update_dataset
from routers.datasets.models import *
from routers.users.models import User
from utils import parse

datasets = APIRouter()


@datasets.get('/', response_model=DatasetsResponse)
def get_datasets(user: User = Depends(logged_user),
                 include_user: bool = False,
                 include_categories: bool = False,
                 offset: int = 0,
                 limit: int = 0):
    """
    Fetch paginated datasets list (either user datasets, or public ones).
    """
    response = {'datasets': find_datasets(user.id, offset, limit,
                                          include_user=include_user,
                                          include_categories=include_categories)}
    return parse(response)


@datasets.get('/{dataset_id}', response_model=DatasetResponse)
def get_dataset(dataset_id,
                include_user: bool = False,
                include_categories: bool = False):
    """
    Fetch dataset.
    """
    response = {'dataset': find_dataset(dataset_id,
                                        include_user=include_user,
                                        include_categories=include_categories)}
    return parse(response)


@datasets.post('/', response_model=DatasetResponse)
def post_dataset(payload: DatasetPostBody, user: User = Depends(logged_user)):
    """
    Create a new dataset.
    🔒️ Verified users
    """
    if not user.is_verified:
        raise errors.Forbidden(errors.USER_NOT_VERIFIED, data='ERR_VERIFY')
    response = {'dataset': insert_dataset(user.id, payload)}
    return parse(response)


@datasets.patch('/{dataset_id}')
def patch_dataset(dataset_id, payload: DatasetPatchBody, user: User = Depends(logged_user)):
    """
    Update dataset (name, description & privacy)..
    """
    update_dataset(user.id, dataset_id, payload)


@datasets.delete('/')
def delete_datasets(user: User = Depends(logged_admin)):
    """
    Delete all datasets of admin user, and other linked collections (`images`, `labels`, `tasks`...).
    🔒️ Admin only
    """
    remove_datasets(user.id)


@datasets.delete('/{dataset_id}')
def delete_dataset(dataset_id, user: User = Depends(logged_user)):
    """
    Delete a dataset, and other linked collections (`images`, `labels`, `tasks`...)
    """
    remove_dataset(user.id, dataset_id)
