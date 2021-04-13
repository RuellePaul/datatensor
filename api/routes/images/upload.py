from flask import Blueprint, request, jsonify

from logger import logger
from routes.images import core

images_upload = Blueprint('images_upload', __name__)


@images_upload.route('/<dataset_id>', methods=['POST'])
def upload_images(dataset_id):
    images = core.upload_images(dataset_id, request.files)

    logger.info(f"Uploaded {len(images)} images in dataset {dataset_id}")

    return jsonify(images), 200
