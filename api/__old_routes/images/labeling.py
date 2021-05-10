from flask import Blueprint
from webargs import fields
from webargs.flaskparser import use_args

from config import Config

images_labeling = Blueprint('image_labeling', __name__)


@images_labeling.route('/<image_id>', methods=['POST'])
@use_args({
    'labels': fields.List(fields.Dict(), required=True),
})
def save_labels(args, image_id):
    image = Config.db.images.find_one_and_update({'id': image_id},
                                                 {'$set': {'labels': args['labels']}},
                                                 projection={'_id': 0},
                                                 return_document=True)
    return image
