from fastapi import APIRouter, Depends

from api.dependencies import dataset_belongs_to_user
from api.routers.categories.core import find_categories, find_category, find_images_of_category, remove_category, \
    insert_category
from api.routers.categories.models import *
from api.routers.images.models import ImagesResponse
from api.utils import parse

categories = APIRouter()


@categories.get('/', response_model=CategoriesResponse)
async def get_categories(dataset_id, offset: int = 0, limit: int = 0):
    """
    Fetch paginated categories list of given dataset.
    """
    response = {'categories': find_categories(dataset_id, offset, limit)}
    return parse(response)


@categories.get('/{category_id}', response_model=CategoryResponse)
async def get_category(dataset_id, category_id):
    """
    Fetch given category of given dataset.
    """
    response = {'category': find_category(dataset_id, category_id)}
    return parse(response)


@categories.get('/{category_id}/images', response_model=ImagesResponse)
async def get_category(dataset_id, category_id, offset: int = 0, limit: int = 0):
    """
    Fetch images of a given category.
    """
    response = {'images': find_images_of_category(dataset_id, category_id, offset, limit)}
    return parse(response)


@categories.post('/')
async def post_category(category: CategoryPostBody, dataset_id, dataset=Depends(dataset_belongs_to_user)):
    """
    Create a new category on given dataset, and returns it.
    """
    response = {'category': insert_category(dataset_id, category)}
    return parse(response)


@categories.delete('/{category_id}')
async def delete_category(dataset_id, category_id, dataset=Depends(dataset_belongs_to_user)):
    """
    Delete given category of given dataset.
    """
    remove_category(dataset_id, category_id)
