from fastapi import APIRouter

from logger import logger
from routers.datasources.core import find_datasources, find_categories, find_max_image_count
from routers.datasources.models import *
from utils import parse

datasources = APIRouter()


@datasources.get('/', response_model=DatasourcesResponse)
def get_datasources():
    """
    Fetch list of datasources.
    🔒️ Admin only
    """
    response = {'datasources': find_datasources()}
    logger.info(f'Datasources | Fetch datasources')
    return parse(response)


@datasources.get('/categories', response_model=DatasourceCategoriesResponse)
def get_categories(datasource_key: DatasourceKey):
    """
    Fetch available categories for given datasource.
    🔒️ Admin only
    """
    response = {'categories': find_categories(datasource_key)}
    logger.info(f'Datasources | Fetch categories for datasource `{datasource_key}`')
    return parse(response)


@datasources.post('/max-image-count', response_model=DatasourceMaxImageCountResponse)
def post_image_count(payload: DatasourceMaxImageCountBody):
    """
    Fetch max image count for given datasource and selected categories.
    🔒️ Admin only
    """
    result = find_max_image_count(payload.datasource_key, payload.selected_categories)
    response = {'max_image_count': result}
    logger.info(f'Datasources | Fetch image_count ({result}) for datasource `{payload.datasource_key}`')
    return parse(response)
