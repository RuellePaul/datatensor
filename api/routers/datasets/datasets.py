from fastapi import APIRouter, Depends

from dependencies import logged_user
from routers.datasets.core import find_datasets, find_dataset, remove_dataset, insert_dataset
from routers.datasets.models import *
from routers.users.models import User

datasets = APIRouter()


@datasets.get('/', response_model=DatasetsResponse)
async def get_datasets(user: User = Depends(logged_user), offset: int = 0, limit: int = 0):
    """
    Fetch paginated datasets list of logged user.
    """
    result = find_datasets(user.id, offset, limit)
    return {'datasets': [Dataset.from_mongo(dataset) for dataset in result]}


@datasets.get('/{dataset_id}', response_model=DatasetResponse)
async def get_dataset(dataset_id):
    """
    Fetch dataset.
    """
    result = find_dataset(dataset_id)
    return {'dataset': Dataset.from_mongo(result)}


@datasets.post('/')
async def post_dataset(dataset: DatasetPostBody, user: User = Depends(logged_user)):
    """
    Create a new dataset.
    """
    insert_dataset(user.id, dataset)


@datasets.delete('/{dataset_id}')
async def delete_dataset(dataset_id, user: User = Depends(logged_user)):
    """
    Delete a dataset.
    """
    remove_dataset(user.id, dataset_id)
