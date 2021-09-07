from fastapi import APIRouter

from api.routers.datasources.core import find_datasources, find_categories, find_max_image_count
from api.routers.datasources.models import *
from api.utils import parse

datasources = APIRouter()


@datasources.get('/', response_model=DatasourcesResponse)
def get_datasources():
    """
    Fetch list of datasources.
    🔒️ Admin only
    """
    response = {'datasources': find_datasources()}
    return parse(response)


@datasources.get('/categories', response_model=DatasourceCategoriesResponse)
def get_categories(datasource_key: DatasourceKey):
    """
    Fetch available categories for given datasource.
    🔒️ Admin only
    """
    response = {'categories': find_categories(datasource_key)}
    return parse(response)


@datasources.post('/max-image-count', response_model=DatasourceMaxImageCountResponse)
def post_image_count(payload: DatasourceMaxImageCountBody):
    """
    Fetch max image count for given datasource and selected categories.
    🔒️ Admin only
    """
    result = find_max_image_count(payload.datasource_key, payload.selected_categories)
    response = {'max_image_count': result}
    return parse(response)
