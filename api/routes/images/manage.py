from flask import Blueprint, jsonify
from webargs import fields
from webargs.flaskparser import use_args

from config import Config
from routes.images import core

images_manage = Blueprint('images_manage', __name__)


@images_manage.route('/<dataset_id>')
@use_args({
    'offset': fields.Int(required=False, missing=0),
    'count': fields.Int(required=False, missing=0)
})
def fetch_images(args, dataset_id):
    images = Config.db.images.find({'dataset_id': dataset_id}, {'_id': 0}).skip(args['offset']).limit(args['offset'])
    return jsonify(list(images)), 200


@images_manage.route('/<image_id>/delete', methods=['POST'])
def delete_image(image_id):
    core.delete_image_from_s3(image_id)
    core.delete_image_from_database(image_id)
    return 'OK', 200
