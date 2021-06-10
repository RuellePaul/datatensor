from fastapi import APIRouter, Depends

import errors
from dependencies import logged_user
from routers.augmentor.core import perform_augmentation
from routers.augmentor.models import SampleBody
from routers.datasets.core import find_dataset
from routers.images.core import find_image
from routers.images.models import ImagesResponse
from routers.users.models import User

augmentor = APIRouter()


@augmentor.post('/sample', response_model=ImagesResponse)
async def augmentor_sample(payload: SampleBody, user: User = Depends(logged_user)):
    """
    Execute a sample of augmentor operations pipeline
    """
    dataset_id = payload.dataset_id
    image_id = payload.image_id
    operations = payload.operations

    dataset = find_dataset(dataset_id)
    if dataset.user_id != user.id:
        raise errors.Forbidden('You can only sample your own datasets')

    image = find_image(dataset_id, image_id)

    images = perform_augmentation(
        image,
        operations
    )

    return {'images': images}