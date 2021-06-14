from fastapi import APIRouter

from routers.categories.core import find_categories, find_category, remove_category, insert_category
from routers.categories.models import *
from utils import parse

categories = APIRouter()


@categories.get('/', response_model=CategoriesResponse)
async def get_categories(dataset_id, offset: int = 0, limit: int = 0):
    """
    Fetch paginated categories list of given dataset.
    """
    result = find_categories(dataset_id, offset, limit)
    response = {'categories': result}
    return parse(response)


@categories.get('/{category_id}', response_model=CategoryResponse)
async def get_category(dataset_id, category_id):
    """
    Fetch given category of given dataset.
    """
    result = find_category(dataset_id, category_id)
    response = {'category': result}
    return parse(response)


@categories.post('/')
async def post_category(category: CategoryPostBody, dataset_id):
    """
    Create a new category on given dataset, and return it.
    """
    response = {'category': insert_category(dataset_id, category)}
    return parse(response)


@categories.delete('/{category_id}')
async def delete_category(dataset_id, category_id):
    """
    Delete given category of given dataset.
    """
    remove_category(dataset_id, category_id)
