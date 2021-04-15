import uuid

import boto3
import cv2
import numpy
from werkzeug.utils import secure_filename

import errors
from config import Config

s3 = boto3.client(
    "s3",
    aws_access_key_id=Config.S3_KEY,
    aws_secret_access_key=Config.S3_SECRET
)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}


# S3 related
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
        compression_ratio = height / 1280
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


def delete_image(image_id):
    try:
        s3.delete_object(
            Bucket=Config.S3_BUCKET,
            Key=image_id
        )
    except Exception as e:
        raise errors.InternalError(f'Cannot delete file from S3, {str(e)}')


def upload_images(dataset_id, request_files):
    images = []
    for file in request_files.values():
        if file and allowed_file(file.filename):
            image_id = str(uuid.uuid4())
            name = secure_filename(file.filename)
            image = cv2.imdecode(numpy.fromstring(file.read(), numpy.uint8), cv2.IMREAD_UNCHANGED)
            image = compress_image(image)
            image_bytes = cv2.imencode('.jpg', image)[1].tostring()
            path = upload_image(image_bytes, image_id)
            images.append({
                'id': image_id,
                'dataset_id': dataset_id,
                'path': path,
                'name': name,
                'size': len(image_bytes),
                'width': image.shape[1],
                'height': image.shape[0]
            })

    Config.db.images.insert_many(images)

    for image in images:
        image.pop('_id', None)

    return images
