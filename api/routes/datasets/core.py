from bson.objectid import ObjectId
from flask import request
from marshmallow import Schema
from webargs import fields

from authentication.core import verify_access_token
from config import Config

db = Config.db


class Dataset(Schema):
    _id = fields.Str(dump_only=True)
    user_id: fields.Str(dump_only=True)
    name = fields.Str(required=True)
    created_at = fields.Str(required=True)
    description = fields.Str()


def find_datasets(offset, limit):
    user_id = verify_access_token(request.headers['Authorization']).get('_id')
    return list(db.datasets.find({'user_id': ObjectId(user_id)}).skip(offset).limit(limit))


def find_dataset(dataset_id):
    user_id = verify_access_token(request.headers['Authorization']).get('_id')
    return db.datasets.find_one({'_id': ObjectId(dataset_id),
                                 'user_id': ObjectId(user_id)})


def insert_dataset(dataset):
    user_id = verify_access_token(request.headers['Authorization']).get('_id')
    db.datasets.insert_one({'user_id': ObjectId(user_id), **dataset})


def remove_datasets():
    user_id = verify_access_token(request.headers['Authorization']).get('_id')
    db.datasets.delete_many({'user_id': ObjectId(user_id)})


def remove_dataset(dataset_id):
    user_id = verify_access_token(request.headers['Authorization']).get('_id')
    db.datasets.delete_one({'_id': ObjectId(dataset_id),
                            'user_id': ObjectId(user_id)})
