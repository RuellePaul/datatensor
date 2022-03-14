from fastapi import APIRouter, Depends, File, UploadFile

from dependencies import dataset_belongs_to_user
from logger import logger
from routers.images.core import find_images, find_image, remove_all_images, remove_image, insert_images
from routers.images.models import *
from utils import parse

images = APIRouter()


@images.get('/', response_model=ImagesResponse)
def get_images(dataset_id: str,
               original_image_id: Optional[str] = None,
               include_labels=False,
               offset: int = 0,
               limit: int = 0):
    """
    Fetch paginated images list of given dataset.
    """
    response = {'images': find_images(dataset_id,
                                      original_image_id,
                                      include_labels=include_labels,
                                      offset=offset,
                                      limit=limit)}
    logger.info(f'Images | Fetch images of dataset `{dataset_id}`')
    return parse(response)


@images.get('/ids', response_model=ImageIdsResponse)
def get_image_ids(dataset_id: str):
    """
    Fetch all image_ids of given dataset (original image_ids or <pipeline> image ids).
    """
    response = {'image_ids': [image.id for image in find_images(dataset_id)]}
    logger.info(f'Images | Fetch image_ids of dataset `{dataset_id}`')
    return parse(response)


@images.get('/{image_id}', response_model=ImageResponse)
def get_image(dataset_id, image_id):
    """
    Fetch given image of given dataset.
    """
    response = {'image': find_image(dataset_id, image_id)}
    logger.info(f'Images | Fetch image `{image_id}` of dataset `{dataset_id}`')
    return parse(response)


@images.post('/')
def post_images(dataset_id, files: List[UploadFile] = File(...), dataset=Depends(dataset_belongs_to_user)):
    """
    Upload a list of images.
    """
    response = {'images': insert_images(dataset_id, files)}
    logger.info(f'Images | Upload {len(files)} for dataset `{dataset_id}`')
    return parse(response)


@images.delete('/')
def delete_images(dataset_id, dataset=Depends(dataset_belongs_to_user)):
    """
    Delete all images (original & augmented) of given dataset.
    """
    logger.info(f'Images | Delete images of dataset `{dataset_id}`')
    remove_all_images(dataset_id)


@images.delete('/{image_id}', response_model=ImageDeleteResponse)
def delete_image(dataset_id, image_id, dataset=Depends(dataset_belongs_to_user)):
    """
    Delete given image of given dataset.
    """
    response = {'deleted_count': remove_image(dataset_id, image_id)}
    logger.info(f'Images | Delete image `{image_id}` of dataset `{dataset_id}`')
    return parse(response)
