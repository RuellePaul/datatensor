import concurrent.futures
from typing import List
from uuid import uuid4

import boto3
import cv2
import numpy

import errors
from config import Config
from routers.images.models import Image, ImageExtended
from routers.labels.core import find_labels_from_image_ids, regroup_labels_by_category
from routers.labels.models import Label

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
        print(e)
        raise errors.InternalError('Images', f'Cannot upload file to S3, {str(e)}')


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
        raise errors.InternalError('Images', f'Cannot delete file from S3, {str(e)}')


def delete_image_from_s3(image_id):
    try:
        s3.delete_object(
            Bucket=Config.S3_BUCKET,
            Key=image_id
        )
    except Exception as e:
        raise errors.InternalError('Images', f'Cannot delete file from S3, {str(e)}')


def find_all_images(dataset_id, offset=0, limit=0) -> List[Image]:
    images = list(db.images
                  .find({'dataset_id': dataset_id})
                  .skip(offset)
                  .limit(limit))
    if images is None:
        raise errors.NotFound('Images', errors.IMAGE_NOT_FOUND)
    images = [ImageExtended.from_mongo(image) for image in images]
    return images


def find_images(dataset_id,
                original_image_id=None,
                pipeline_id=None,
                include_labels=False,
                offset=0,
                limit=0) -> List[ImageExtended]:
    if original_image_id and pipeline_id:
        query = {'dataset_id': dataset_id, 'original_image_id': original_image_id, 'pipeline_id': pipeline_id}
    elif pipeline_id:
        query = {'dataset_id': dataset_id, 'pipeline_id': pipeline_id}
    elif original_image_id:
        query = {'dataset_id': dataset_id, 'original_image_id': original_image_id}
    else:
        query = {'dataset_id': dataset_id, 'original_image_id': None, 'pipeline_id': None}

    images = list(db.images
                  .find(query)
                  .skip(offset)
                  .limit(limit))
    if images is None:
        raise errors.NotFound('Images', errors.IMAGE_NOT_FOUND)
    images = [ImageExtended.from_mongo(image) for image in images]
    if include_labels:
        labels = find_labels_from_image_ids([image.id for image in images])
        if labels is not None:
            for image in images:
                image.labels = [label for label in labels if label.image_id == image.id]
    return images


def find_image(dataset_id, image_id) -> Image:
    image = db.images.find_one({'_id': image_id, 'dataset_id': dataset_id})
    if image is None:
        raise errors.NotFound('Images', errors.IMAGE_NOT_FOUND)
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


def remove_all_images(dataset_id):
    images = find_all_images(dataset_id)
    image_ids = [image.id for image in images if image.original_image_id is None]
    augmented_image_ids = [image.id for image in images if image.original_image_id]
    remove_original_images(dataset_id, image_ids)
    remove_augmented_images(dataset_id, augmented_image_ids)
    db.pipelines.delete_many({'dataset_id': dataset_id})


def remove_original_images(dataset_id, image_ids):
    # Find labels of images to delete
    labels = list(db.labels.find({'image_id': {'$in': image_ids}}))
    labels = [Label.from_mongo(label) for label in labels]

    # Delete images and associated labels
    delete_images_from_s3(image_ids)
    db.images.delete_many({'dataset_id': dataset_id, '_id': {'$in': image_ids}})
    db.labels.delete_many({'image_id': {'$in': image_ids}})

    # Decrease labels_count on associated categories
    for category_id, labels_count in regroup_labels_by_category(labels).items():
        db.categories.find_one_and_update(
            {'dataset_id': dataset_id, '_id': category_id},
            {'$inc': {'labels_count': -labels_count}}
        )

    # Decrease image_count on associated dataset
    db.datasets.update_one({'_id': dataset_id},
                           {'$inc': {'image_count': -len(image_ids)}},
                           upsert=False)


def remove_augmented_images(dataset_id, augmented_image_ids):
    # Find labels of augmented images to delete
    labels = list(db.labels.find({'image_id': {'$in': augmented_image_ids}}))
    labels = [Label.from_mongo(label) for label in labels]

    # Delete augmented images and associated labels
    delete_images_from_s3(augmented_image_ids)
    db.images.delete_many({'dataset_id': dataset_id, '_id': {'$in': augmented_image_ids}})
    db.labels.delete_many({'image_id': {'$in': augmented_image_ids}})

    # Decrease labels_count on associated categories
    for category_id, labels_count in regroup_labels_by_category(labels).items():
        db.categories.find_one_and_update(
            {'dataset_id': dataset_id, '_id': category_id},
            {'$inc': {'labels_count': -labels_count}}
        )

    # Decrease augmented_count on associated dataset
    db.datasets.update_one({'_id': dataset_id},
                           {'$inc': {'augmented_count': -len(augmented_image_ids)}},
                           upsert=False)


def remove_image(dataset_id, image_id) -> int:
    remove_original_images(dataset_id, [image_id])
    augmented_image_ids_to_delete = [image.id for image in find_images(dataset_id, original_image_id=image_id)]
    if augmented_image_ids_to_delete:
        remove_augmented_images(dataset_id, augmented_image_ids_to_delete)
    return 1 + len(augmented_image_ids_to_delete)
