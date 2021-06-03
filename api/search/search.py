from fastapi import APIRouter
from webargs import fields
from webargs.flaskparser import use_args

import errors
from api.search.core import *
from utils import parse

search = APIRouter()


@search.get('/')
@use_args({
    'query': fields.Str(required=True)
}, location='query')
def search_datatensor(args):
    if len(args['query']) <= 2:
        raise errors.BadRequest('Query must be >3 chars')
    result = {
        'datasets': search_datasets_by_query(args['query']),
        'images': search_images_by_query(args['query']),
        'users': search_users_by_query(args['query']),
        'categories': search_categories_by_query(args['query'])
    }
    return {'result': parse(result)}, 200
