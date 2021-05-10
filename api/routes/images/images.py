from flask import Blueprint
from webargs import fields
from webargs.flaskparser import use_args

from utils import build_schema, parse
from .core import Image, find_images, find_image, remove_images, remove_image, insert_image

images = Blueprint('images', __name__)
Image = build_schema(Image)


@images.route('/')
@use_args({
    'offset': fields.Int(required=False, missing=0),
    'limit': fields.Int(required=False, missing=0)
}, location='query')
def get_images(args, dataset_id):
    result = find_images(dataset_id, args['offset'], args['limit'])
    return {'images': parse(result)}, 200


@images.route('/<image_id>')
def get_image(dataset_id, image_id):
    result = find_image(dataset_id, image_id)
    return {'image': parse(result)}, 200


@images.route('/', methods=['POST'])
@use_args(Image)
def post_image(args, dataset_id):
    insert_image(dataset_id, args)
    return 'OK', 201


@images.route('/', methods=['DELETE'])
def delete_images(dataset_id):
    remove_images(dataset_id)
    return 'OK', 200


@images.route('/<image_id>', methods=['DELETE'])
def delete_image(dataset_id, image_id):
    remove_image(dataset_id, image_id)
    return 'OK', 200
