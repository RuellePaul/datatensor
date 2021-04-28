from flask import Blueprint
from webargs import fields
from webargs.flaskparser import use_args

from routes.generator import core

generator = Blueprint('generator', __name__)


@generator.route('/coco', methods=['POST'])
@use_args({
    'image_count': fields.Int(missing=10)
})
def init_dataset(args):
    core.dataset_generation('coco', args['image_count'])
    return 'OK', 200
