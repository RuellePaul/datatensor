import uuid
from typing import List

import boto3

from api import errors
from api.config import Config
from api.routers.labels.models import Label

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

db = Config.db
s3 = boto3.client(
    "s3",
    aws_access_key_id=Config.S3_KEY,
    aws_secret_access_key=Config.S3_SECRET
)


def find_labels(image_id, offset=0, limit=0) -> List[Label]:
    labels = list(db.labels.find({'image_id': image_id}).skip(offset).limit(limit))
    if labels is None:
        raise errors.NotFound(errors.LABEL_NOT_FOUND)
    return [Label.from_mongo(label) for label in labels]


def find_labels_count_for_category(category_id) -> int:
    labels_count = db.labels.count({'category_id': category_id})
    return labels_count


def find_label(image_id, label_id) -> Label:
    label = db.labels.find_one({'_id': label_id,
                                'image_id': image_id})
    if label is None:
        raise errors.NotFound(errors.LABEL_NOT_FOUND)
    return Label.from_mongo(label)


def replace_labels(image_id, labels):
    db.labels.delete_many({'image_id': image_id})
    if labels:
        db.labels.insert_many([{**label.dict(),
                                'image_id': image_id,
                                '_id': str(uuid.uuid4())} for label in labels])
