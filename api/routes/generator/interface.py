from flask import Blueprint
from webargs import fields
from webargs.flaskparser import use_args

from routes.generator import core

generator = Blueprint('generator', __name__)


@generator.route('/coco', methods=['POST'])
@use_args({
    'dataset_name': fields.Str(required=True),
    'image_count': fields.Int(missing=10)
})
def init_dataset(args):
    core.dataset_generation(args['dataset_name'], args['image_count'])
    return 'OK', 200
