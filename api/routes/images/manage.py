from flask import Blueprint, jsonify

from config import Config
from helpers import delete_file_from_s3

images_manage = Blueprint('images_manage', __name__)


@images_manage.route('/<dataset_id>')
def fetch_images(dataset_id):
    images = list(Config.db.images.find({'dataset_id': dataset_id}, {'_id': 0}))
    return jsonify(images), 200


@images_manage.route('/<image_id>/delete', methods=['POST'])
def delete_image(image_id):
    delete_file_from_s3(image_id, Config.S3_BUCKET)
    Config.db.images.delete_one({'id': image_id})
    return 'OK', 200
