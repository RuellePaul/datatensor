from fastapi import APIRouter
from webargs import fields
from webargs.flaskparser import use_args

from api.search.core import search_datasets_by_category_name

search = APIRouter()


@search.get('/')
@use_args({
    'query': fields.Str(required=True)
}, location='query')
async def search_datatensor(args):
    result = search_datasets_by_category_name(args['category_name'])
    return {'datasets': parse(result)}
