import concurrent.futures
from datetime import datetime

from bson.objectid import ObjectId
from flask import request
from marshmallow import Schema
from webargs import fields

from authentication.core import verify_access_token
from config import Config
from routers.images.core import delete_image_from_s3

db = Config.db


class Dataset(Schema):
    name = fields.Str(required=True)
    description = fields.Str()
    is_public = fields.Bool()


def find_datasets(offset, limit):
    user_id = verify_access_token().get('_id')
    return list(db.datasets.find({'$or': [{'user_id': user_id}, {'is_public': True}]}).skip(offset).limit(limit))


def find_dataset(dataset_id):
    return db.datasets.find_one({'_id': ObjectId(dataset_id)})


def insert_dataset(dataset):
    user_id = verify_access_token(verified=True).get('_id')
    db.datasets.insert_one({'user_id': user_id,
                            'created_at': datetime.now(),
                            'image_count': 0,
                            **dataset})


def remove_dataset(dataset_id):
    user_id = verify_access_token().get('_id')
    images = list(Config.db.images.find({'dataset_id': dataset_id}))
    if images:
        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
            executor.map(delete_image_from_s3,
                         [image['_id'] for image in images])

        for image in images:
            Config.db.labels.delete_many({'image_id': image['_id']})
        Config.db.images.delete_many({'dataset_id': dataset_id})

    Config.db.categories.delete_many({'dataset_id': dataset_id})
    db.datasets.delete_one({'_id': ObjectId(dataset_id), 'user_id': user_id})
