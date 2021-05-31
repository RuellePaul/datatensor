from fastapi import APIRouter
from webargs import fields
from webargs.flaskparser import use_args

from utils import build_schema, parse
from routers.categories.core import Category, find_categories, find_category, remove_categories, remove_category, insert_category

categories = APIRouter()
Category = build_schema(Category)


@categories.get('/')
@use_args({
    'offset': fields.Int(required=False, missing=0),
    'limit': fields.Int(required=False, missing=0)
}, location='query')
async def get_categories(args, dataset_id):
    result = find_categories(dataset_id, args['offset'], args['limit'])
    return {'categories': parse(result)}


@categories.get('/{category_id}')
async def get_category(dataset_id, category_id):
    result = find_category(dataset_id, category_id)
    return {'category': parse(result)}


@categories.post('/')
@use_args(Category)
async def post_category(args, dataset_id):
    inserted_id = insert_category(dataset_id, args)
    result = {'_id': inserted_id, **args}
    return {'category': parse(result)}


@categories.delete('/')
async def delete_categories(dataset_id):
    remove_categories(dataset_id)


@categories.delete('/{category_id}')
async def delete_category(dataset_id, category_id):
    remove_category(dataset_id, category_id)
