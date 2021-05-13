from datetime import datetime

from bson.objectid import ObjectId
from flask import request
from marshmallow import Schema
from webargs import fields

from authentication.core import verify_access_token
from routes.images.core import delete_image_from_s3
from config import Config

db = Config.db


class Dataset(Schema):
    name = fields.Str(required=True)
    description = fields.Str()
    is_public = fields.Bool()


def find_datasets(offset, limit):
    user_id = verify_access_token(request.headers['Authorization']).get('_id')
    return list(db.datasets.find({'user_id': user_id}).skip(offset).limit(limit))


def find_dataset(dataset_id):
    user_id = verify_access_token(request.headers['Authorization']).get('_id')
    return db.datasets.find_one({'_id': ObjectId(dataset_id),
                                 'user_id': user_id})


def insert_dataset(dataset):
    user_id = verify_access_token(request.headers['Authorization'], verified=True).get('_id')
    db.datasets.insert_one({'user_id': user_id,
                            'created_at': datetime.now(),
                            **dataset})


def remove_datasets():
    user_id = verify_access_token(request.headers['Authorization']).get('_id')
    db.datasets.delete_many({'user_id': user_id})


def remove_dataset(dataset_id):
    user_id = verify_access_token(request.headers['Authorization']).get('_id')
    images = list(Config.db.images.find({'dataset_id': dataset_id}))
    if images:
        for image in images:
            Config.db.labels.delete_many({'image_id': image['_id']})
            delete_image_from_s3(image['_id'])
        Config.db.images.delete_many({'dataset_id': dataset_id})

    Config.db.categories.delete_many({'dataset_id': dataset_id})
    db.datasets.delete_one({'_id': ObjectId(dataset_id), 'user_id': user_id})
