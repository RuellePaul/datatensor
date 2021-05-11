from flask import Blueprint
from webargs import fields
from webargs.flaskparser import use_args

from authentication.core import admin_guard
from .core import dataset_generator

generator = Blueprint('generator', __name__)


@generator.route('/', methods=['POST'])
@admin_guard
@use_args({
    'dataset_name': fields.Str(required=True),
    'image_count': fields.Int(missing=10)
})
def init_dataset(args):
    dataset_generator(args['dataset_name'], args['image_count'])
    return 'OK', 200
