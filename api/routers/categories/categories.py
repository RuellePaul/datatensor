from fastapi import APIRouter, Depends

from dependencies import dataset_belongs_to_user
from logger import logger
from routers.categories.core import find_categories, find_category, find_images_of_category, remove_category, \
    insert_category
from routers.categories.models import *
from utils import parse

categories = APIRouter()


@categories.get('/', response_model=CategoriesResponse)
def get_categories(dataset_id, offset: int = 0, limit: int = 0):
    """
    Fetch paginated categories list of given dataset.
    """
    response = {'categories': find_categories(dataset_id, offset, limit)}
    logger.notify('Categories', f'Fetch categories for dataset `{dataset_id}`')
    return parse(response)


@categories.get('/{category_id}', response_model=CategoryResponse)
def get_category(dataset_id, category_id):
    """
    Fetch given category of given dataset.
    """
    response = {'category': find_category(dataset_id, category_id)}
    logger.notify('Categories', f'Fetch category `{category_id}` for dataset `{dataset_id}`')
    return parse(response)


@categories.get('/{category_id}/images', response_model=ImagesCategoryResponse)
def get_category(dataset_id, category_id, include_labels=False, offset: int = 0, limit: int = 0):
    """
    Fetch images of a given category.
    """
    images, total_count = find_images_of_category(dataset_id, category_id, include_labels, offset, limit)
    response = {'images': images, 'total_count': total_count}
    logger.notify('Images', f'Fetch images for category `{category_id}` of dataset `{dataset_id}`')
    return parse(response)


@categories.post('/')
def post_category(category: CategoryPostBody, dataset_id, dataset=Depends(dataset_belongs_to_user)):
    """
    Create a new category on given dataset, and returns it.
    """
    response = {'category': insert_category(dataset_id, category)}
    logger.notify('Categories', f'Add category `{category.name}` for dataset `{dataset_id}`')
    return parse(response)


@categories.delete('/{category_id}')
def delete_category(dataset_id, category_id, dataset=Depends(dataset_belongs_to_user)):
    """
    Delete given category of given dataset.
    """
    remove_category(dataset_id, category_id)
    logger.notify('Categories', f'Delete category `{category_id}` for dataset `{dataset_id}`')
