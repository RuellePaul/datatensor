from fastapi import APIRouter

import errors
from api.search.core import search_users, search_images, search_datasets, search_categories, search_dataset_ids_from_category_names
from api.search.models import *
from utils import parse

search = APIRouter()


@search.get('/', response_model=SearchDatatensorResponse)
async def search_datatensor(query: str):
    if len(query) <= 2:
        raise errors.BadRequest('Query must be >3 chars')
    result = {
        'datasets': search_datasets(query),
        'images': search_images(query),
        'users': search_users(query),
        'categories': search_categories(query)
    }
    response = {'result': result}
    return parse(response)


@search.post('/datasets', response_model=SearchDatasetsResponse)
async def search_datasets_from_category_names(payload: SearchDatasetsPayload):
    response = {
        'dataset_ids': search_dataset_ids_from_category_names(payload.category_names)
    }
    return parse(response)
