from flask import Blueprint
from webargs import fields
from webargs.flaskparser import use_args

from utils import parse
from .core import find_datasources, find_categories, find_max_image_count

datasources = Blueprint('datasources', __name__)


@datasources.route('/')
def get_datasources():
    result = find_datasources()
    return {'datasources': parse(result)}, 200


@datasources.route('/categories')
@use_args({
    'datasource_key': fields.Str(required=True),
}, location='query')
def get_categories(args):
    result = find_categories(args['datasource_key'])
    return {'categories': parse(result)}, 200


@datasources.route('/max-image-count')
@use_args({
    'datasource_key': fields.Str(required=True),
    'selected_categories': fields.List(fields.Str(), required=True)
}, location='query')
def get_image_count(args):
    result = find_max_image_count(args['datasource_key'], args['selected_categories'])
    return {'max_image_count': parse(result)}, 200
