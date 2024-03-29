import base64
import json
import os
from typing import List

import cv2
from fastapi import APIRouter, Depends

import errors
from config import Config
from dependencies import get_ip_address
from logger import logger
from routers.images.models import Image
from routers.labels.models import Label
from routers.pipelines.core import perform_sample
from routers.pipelines.models import SampleResponse
from utils import parse
from .models import PublicDatasetResponse, PublicSampleBody, NewsletterBody

db = Config.db

public = APIRouter()

public_data_path = os.path.join(Config.ROOT_PATH, 'api', 'public', 'public-dataset')
json_file = open(os.path.join(public_data_path, 'data.json'), 'r')
public_data = json.load(json_file)


def _find_public_image(image_id) -> Image:
    return Image.parse_obj(next(image for image in public_data['images'] if image['id'] == image_id))


def _find_public_labels(image_id) -> List[Label]:
    return [Label.parse_obj(label) for label in public_data['labels'] if label['image_id'] == image_id]


@public.get('/', response_model=PublicDatasetResponse)
def get_public_data(ip_address: str = Depends(get_ip_address)):
    logger.notify('Public', f'Fetch public data from {ip_address or "unknown"}')
    return public_data


@public.post('/sample', response_model=SampleResponse)
def get_public_sample(payload: PublicSampleBody):
    image_id = payload.image_id
    operations = payload.operations

    image = _find_public_image(image_id)
    labels = payload.labels

    image_path = os.path.join(Config.ROOT_PATH, 'api', 'public', 'public-dataset', image.path.split('/')[0], image.name)
    cv2image = cv2.imread(image_path)

    augmented_images, augmented_labels = perform_sample(
        image,
        labels,
        operations,
        cv2image=cv2image
    )

    encoded_images = [cv2.imencode('.jpg', augmented_image)[1].tostring()
                      for augmented_image in augmented_images]
    base64_encoded_images = [base64.b64encode(image) for image in encoded_images]

    logger.notify('Public', f'Fetch public sample on image `{image.name}`')

    return {
        'images': base64_encoded_images,
        'images_labels': parse(augmented_labels)
    }


@public.post('/newsletter')
def register_newsletter(payload: NewsletterBody):
    email = payload.email

    if not email:
        raise errors.BadRequest('Newsletter', "Missing email")

    if email in [user['email'] for user in list(db.newsletter_users.find())]:
        raise errors.Forbidden('Newsletter', f"Email {email} already registered to newsletter")

    db.newsletter_users.insert_one({'email': payload.email})
    logger.notify('Newsletter', f'Add {payload.email} in newsletter email collection')