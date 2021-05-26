from flask import Blueprint
from webargs import fields
from webargs.flaskparser import use_args

from .core import *
from utils import parse

search = Blueprint('search', __name__)


@search.route('/', methods=['GET'])
@use_args({
    'query': fields.Str(required=True)
}, location='query')
def search_datatensor(args):
    result = {
        'datasets': search_datasets_by_query(args['query']),
        'images': search_images_by_query(args['query']),
        'users': search_users_by_query(args['query']),
        'categories': search_categories_by_query(args['query'])
    }
    return {'result': parse(result)}, 200
