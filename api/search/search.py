from fastapi import APIRouter

import errors
from api.search.core import search_users, search_images, search_datasets, search_categories
from api.search.models import *
from utils import parse

search = APIRouter()


@search.get('/', response_model=SearchResponse)
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
