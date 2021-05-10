import boto3

from config import Config
from __old_routes.images.core import delete_image_from_s3, delete_images_from_database

s3 = boto3.client(
    "s3",
    aws_access_key_id=Config.S3_KEY,
    aws_secret_access_key=Config.S3_SECRET
)


def delete_dataset(dataset_id):
    images = list(Config.db.images.find({'dataset_id': dataset_id}, {'_id': 0}))
    if images:
        for image in images:
            delete_image_from_s3(image['id'])
        image_ids = [image['id'] for image in images]
        delete_images_from_database(image_ids)
    Config.db.datasets.delete_one({'id': dataset_id})