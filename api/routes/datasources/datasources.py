from flask import Blueprint
from webargs import fields
from webargs.flaskparser import use_args

from utils import parse
from .core import find_datasources, find_categories

datasources = Blueprint('datasources', __name__)


@datasources.route('/')
def get_datasources():
    result = find_datasources()
    return {'datasources': parse(result)}, 200


@datasources.route('/categories/')
@use_args({
    'datasource_key': fields.Str(required=True),
})
def get_categories(datasource_key):
    result = find_categories(datasource_key)
    return {'categories': parse(result)}, 200
