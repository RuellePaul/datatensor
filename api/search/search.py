from fastapi import APIRouter
from webargs import fields
from webargs.flaskparser import use_args

from .core import search_datasets_by_category_name
from utils import parse

search = APIRouter()


@search.get('/')
@use_args({
    'query': fields.Str(required=True)
}, location='query')
def search_datatensor(args):
    result = search_datasets_by_category_name(args['category_name'])
    return {'datasets': parse(result)}, 200
