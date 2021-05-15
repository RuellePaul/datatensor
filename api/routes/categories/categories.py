from flask import Blueprint
from webargs import fields
from webargs.flaskparser import use_args

from utils import build_schema, parse
from .core import Category, find_categories, find_category, remove_categories, remove_category, insert_category

categories = Blueprint('categories', __name__)
Category = build_schema(Category)


@categories.route('/')
@use_args({
    'offset': fields.Int(required=False, missing=0),
    'limit': fields.Int(required=False, missing=0)
}, location='query')
def get_categories(args, dataset_id):
    result = find_categories(dataset_id, args['offset'], args['limit'])
    return {'categories': parse(result)}, 200


@categories.route('/<category_id>')
def get_category(dataset_id, category_id):
    result = find_category(dataset_id, category_id)
    return {'category': parse(result)}, 200


@categories.route('/', methods=['POST'])
@use_args(Category)
def post_category(args, dataset_id):
    inserted_id = insert_category(dataset_id, args)
    result = {'_id': inserted_id, **args}
    return {'category': parse(result)}, 201


@categories.route('/', methods=['DELETE'])
def delete_categories(dataset_id):
    remove_categories(dataset_id)
    return 'OK', 200


@categories.route('/<category_id>', methods=['DELETE'])
@use_args({
    'name': fields.Str(allow_none=True),
}, location='query')
def delete_category(args, dataset_id, category_id):
    category_name = args.get('name')
    if category_name:
        remove_category_by_name(dataset_id, category_name)
    else:
        remove_category(dataset_id, category_id)
    return 'OK', 200
