from fastapi import APIRouter
from webargs import fields
from webargs.flaskparser import use_args

from utils import build_schema, parse
from routers.images.core import Image, find_images, find_image, remove_images, remove_image, insert_images

images = APIRouter()
Image = build_schema(Image)


@images.get('/')
@use_args({
    'offset': fields.Int(required=False, missing=0),
    'limit': fields.Int(required=False, missing=0)
}, location='query')
async def get_images(args, dataset_id=None):
    result = find_images(dataset_id, args['offset'], args['limit'])
    return {'images': parse(result)}


@images.get('/{image_id}')
async def get_image(dataset_id, image_id):
    result = find_image(dataset_id, image_id)
    return {'image': parse(result)}


@images.post('/')
async def post_images(dataset_id):
    result = insert_images(dataset_id, request.files)
    return {'images': parse(result)}


@images.delete('/')
async def delete_images(dataset_id):
    remove_images(dataset_id)


@images.delete('/{image_id}')
async def delete_image(dataset_id, image_id):
    remove_image(dataset_id, image_id)
