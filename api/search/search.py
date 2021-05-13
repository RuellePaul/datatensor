from flask import Blueprint
from webargs import fields
from webargs.flaskparser import use_args

from .core import search_images_by_category_name
from utils import parse

search = Blueprint('search', __name__)


@search.route('/images', methods=['GET'])
@use_args({
    'category_name': fields.Str(required=True)
}, location='query')
def search_images(args):
    result = search_images_by_category_name(args['category_name'])
    return {'images': parse(result)}, 200
