import boto3

from config import Config

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

db = Config.db
s3 = boto3.client(
    "s3",
    aws_access_key_id=Config.S3_KEY,
    aws_secret_access_key=Config.S3_SECRET
)


def find_labels(image_id, offset, limit):
    return list(db.labels.find({'image_id': image_id}).skip(offset).limit(limit))


def find_label(image_id, label_id):
    return db.labels.find_one({'_id': label_id,
                               'image_id': image_id})


def replace_labels(image_id, labels):
    db.labels.delete_many({'image_id': image_id})
    if labels:
        db.labels.insert_many([{**label.dict(), 'image_id': image_id} for label in labels])
