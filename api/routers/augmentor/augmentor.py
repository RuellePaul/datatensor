import base64

import cv2
from fastapi import APIRouter, Depends

import errors
from dependencies import logged_user
from routers.augmentor.core import perform_sample
from routers.augmentor.models import SampleBody
from routers.datasets.core import find_dataset
from routers.images.core import find_image
from routers.labels.core import find_labels
from routers.users.models import User
from utils import parse

augmentor = APIRouter()


@augmentor.post('/sample')
async def augmentor_sample(payload: SampleBody, user: User = Depends(logged_user)):
    """
    Execute a sample of augmentor operations pipeline
    """
    dataset_id = payload.dataset_id
    image_id = payload.image_id
    operations = payload.operations

    dataset = find_dataset(dataset_id)
    if dataset.user_id != user.id:
        raise errors.Forbidden(errors.NOT_YOUR_DATASET)

    image = find_image(dataset_id, image_id)
    labels = find_labels(image_id, offset=0, limit=0)

    augmented_images, augmented_labels = perform_sample(
        image,
        labels,
        operations
    )

    encoded_images = [cv2.imencode('.jpg', augmented_image)[1].tostring() for augmented_image in augmented_images]
    base64_encoded_images = [base64.b64encode(image) for image in encoded_images]
    return {
        'images': base64_encoded_images,
        'images_labels': parse(augmented_labels)
    }
