import concurrent.futures
from uuid import uuid4

import boto3
import cv2
import numpy

import errors
from config import Config

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


def upload_file(payload):
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
        return {
            '_id': image_id,
            'dataset_id': dataset_id,
            'path': path,
            'name': name,
            'size': len(image_bytes),
            'width': image.shape[1],
            'height': image.shape[0]
        }


def delete_image_from_s3(image_id):
    try:
        s3.delete_object(
            Bucket=Config.S3_BUCKET,
            Key=image_id
        )
    except Exception as e:
        raise errors.InternalError(f'Cannot delete file from S3, {str(e)}')


def find_images(dataset_id, offset, limit):
    return list(db.images.find({'dataset_id': dataset_id}).skip(offset).limit(limit))


def find_image(dataset_id, image_id):
    return db.images.find_one({'_id': image_id,
                               'dataset_id': dataset_id})


def insert_images(dataset_id, request_files):
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        results = executor.map(upload_file, [{'filename': file.filename, 'file': file.file, 'dataset_id': dataset_id}
                                             for file in request_files])
        images = list(filter(None.__ne__, results))
        db.images.insert_many(images)
        db.datasets.update_one({'_id': dataset_id},
                               {'$inc': {
                                   'image_count': len(images)
                               }},
                               upsert=False)
        return images


def remove_image(dataset_id, image_id):
    delete_image_from_s3(image_id)
    db.labels.delete_many({'image_id': image_id})
    db.images.delete_one({'_id': image_id,
                          'dataset_id': dataset_id})
    db.datasets.update_one(
        {
            '_id': dataset_id
        },
        {
            '$inc': {
                'image_count': -1
            }
        }, upsert=False)