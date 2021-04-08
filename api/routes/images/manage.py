from flask import Blueprint, jsonify

from config import Config

images_manage = Blueprint('images_manage', __name__)


@images_manage.route('/<dataset_id>')
def fetch_images(dataset_id):
    images = list(Config.db.images.find({'dataset_id': dataset_id}, {'_id': 0}))
    return jsonify(images), 200
