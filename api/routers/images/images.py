from fastapi import APIRouter, Depends, File, UploadFile

from api.dependencies import dataset_belongs_to_user
from api.routers.images.core import find_images, find_image, remove_image, insert_images
from api.routers.images.models import *
from api.utils import parse

images = APIRouter()


@images.get('/', response_model=ImagesResponse)
async def get_images(dataset_id: str, pipeline_id: Optional[str] = None, offset: int = 0, limit: int = 0):
    """
    Fetch paginated images list of given dataset.
    """
    response = {'images': find_images(dataset_id, pipeline_id, offset, limit)}
    return parse(response)


@images.get('/ids', response_model=ImageIdsResponse)
async def get_image_ids(dataset_id: str, pipeline_id: Optional[str] = None):
    """
    Fetch all image_ids of given dataset (original image_ids or <pipeline> image ids).
    """
    response = {'image_ids': [image.id for image in find_images(dataset_id, pipeline_id)]}
    return parse(response)


@images.get('/{image_id}', response_model=ImageResponse)
async def get_image(dataset_id, image_id):
    """
    Fetch given image of given dataset.
    """
    response = {'image': find_image(dataset_id, image_id)}
    return parse(response)


@images.post('/')
async def post_images(dataset_id, files: List[UploadFile] = File(...), dataset=Depends(dataset_belongs_to_user)):
    """
    Upload a list of images.
    """
    response = {'images': insert_images(dataset_id, files)}
    return parse(response)


@images.delete('/{image_id}')
async def delete_image(dataset_id, image_id, dataset=Depends(dataset_belongs_to_user)):
    """
    Delete given image of given dataset.
    """
    remove_image(dataset_id, image_id)
