from flask import Blueprint
from webargs import fields
from webargs.flaskparser import use_args

from .core import search_datasets_by_category_name
from utils import parse

search = Blueprint('search', __name__)


@search.route('/', methods=['GET'])
@use_args({
    'query': fields.Str(required=True)
}, location='query')
def search_datatensor(args):
    result = search_datasets_by_category_name(args['category_name'])
    return {'datasets': parse(result)}, 200
