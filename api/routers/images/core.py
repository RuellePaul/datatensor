import concurrent.futures
from typing import List
from uuid import uuid4

import boto3
import cv2
import numpy

from api import errors
from api.config import Config
from api.routers.images.models import Image
from api.routers.labels.core import find_labels, regroup_labels_by_category

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

db = Config.db
s3 = boto3.client(
    "s3",
    aws_access_key_id=Config.S3_KEY,
    aws_secret_access_key=Config.S3_SECRET
)


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def compress_image(image):
    width = image.shape[1]
    height = image.shape[0]
    if width > 1280:
        compression_ratio = width / 1280
        dist_shape = (int(width / compression_ratio), int(height / compression_ratio))
        image = cv2.resize(image, dist_shape)
    elif height > 720:
        compression_ratio = height / 720
        dist_shape = (int(width / compression_ratio), int(height / compression_ratio))
        image = cv2.resize(image, dist_shape)
    return image


def upload_image(image_bytes, image_id):
    try:
        s3.put_object(Bucket=Config.S3_BUCKET, Key=image_id, Body=image_bytes, ACL='public-read')
        path = f"{Config.S3_LOCATION}{image_id}"
        return path
    except Exception as e:
        raise errors.InternalError(f'Cannot upload file to S3, {str(e)}')


def upload_file(payload) -> Image:
    file = payload['file']
    filename = payload['filename']
    dataset_id = payload['dataset_id']
    if file and allowed_file(filename):
        image_id = str(uuid4())
        name = filename  # FIXME : secure filename
        image = cv2.imdecode(numpy.fromstring(file.read(), numpy.uint8), cv2.IMREAD_UNCHANGED)
        image = compress_image(image)
        image_bytes = cv2.imencode('.jpg', image)[1].tostring()
        path = upload_image(image_bytes, image_id)
        return Image(
            id=image_id,
            dataset_id=dataset_id,
            path=path,
            name=name,
            size=len(image_bytes),
            width=image.shape[1],
            height=image.shape[0],
        )


def delete_images_from_s3(image_ids):
    def getrows_byslice(array):
        for start in range(0, len(array), 1000):
            yield array[start:start + 1000]

    try:
        for image_ids_to_delete in getrows_byslice(image_ids):
            s3.delete_objects(
                Bucket=Config.S3_BUCKET,
                Delete={'Objects': [{'Key': image_id} for image_id in image_ids_to_delete]}
            )
    except Exception as e:
        raise errors.InternalError(f'Cannot delete file from S3, {str(e)}')


def delete_image_from_s3(image_id):
    try:
        s3.delete_object(
            Bucket=Config.S3_BUCKET,
            Key=image_id
        )
    except Exception as e:
        raise errors.InternalError(f'Cannot delete file from S3, {str(e)}')


def find_all_images(dataset_id, offset=0, limit=0) -> List[Image]:
    images = list(db.images
                  .find({'dataset_id': dataset_id})
                  .skip(offset)
                  .limit(limit))
    if images is None:
        raise errors.NotFound(errors.IMAGE_NOT_FOUND)
    return [Image.from_mongo(image) for image in images]


def find_images(dataset_id, pipeline_id=None, offset=0, limit=0) -> List[Image]:
    images = list(db.images
                  .find({'dataset_id': dataset_id, 'pipeline_id': pipeline_id})
                  .skip(offset)
                  .limit(limit))
    if images is None:
        raise errors.NotFound(errors.IMAGE_NOT_FOUND)
    return [Image.from_mongo(image) for image in images]


def find_image(dataset_id, image_id) -> Image:
    image = db.images.find_one({'_id': image_id, 'dataset_id': dataset_id})
    if image is None:
        raise errors.NotFound(errors.IMAGE_NOT_FOUND)
    return Image.from_mongo(image)


def insert_images(dataset_id, request_files) -> List[Image]:
    with concurrent.futures.ThreadPoolExecutor() as executor:
        results = executor.map(upload_file, [{'filename': file.filename, 'file': file.file, 'dataset_id': dataset_id}
                                             for file in request_files])
        images = list(filter(None.__ne__, results))
        db.images.insert_many([image.mongo() for image in images])
        db.datasets.update_one({'_id': dataset_id},
                               {'$inc': {
                                   'image_count': len(images)
                               }},
                               upsert=False)
    return images


def remove_image(dataset_id, image_id):
    image_to_delete = find_image(dataset_id, image_id)
    if not image_to_delete:
        raise errors.Forbidden(errors.IMAGE_NOT_FOUND)

    # Find labels of image to delete
    labels = find_labels(image_id)

    # Delete image and associated labels
    delete_image_from_s3(image_id)
    db.labels.delete_many({'image_id': image_id})
    db.images.delete_one({'_id': image_id,
                          'dataset_id': dataset_id})

    # Decrease labels_count on associated categories
    for category_id, labels_count in regroup_labels_by_category(labels).items():
        db.categories.find_one_and_update(
            {'_id': category_id},
            {'$inc': {'labels_count': -labels_count}}
        )

    # Decrease image_count on associated dataset
    db.datasets.update_one(
        {
            '_id': dataset_id
        },
        {
            '$inc': {
                'image_count': -1
            }
        }, upsert=False)
