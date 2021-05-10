from bson.objectid import ObjectId
from marshmallow import Schema
from webargs import fields

from config import Config

db = Config.db


class Image(Schema):
    _id = fields.Str(dump_only=True)
    dataset_id = fields.Str(dump_only=True)
    name = fields.Str(required=True)
    path = fields.Str(required=True)
    width = fields.Int(required=True)
    height = fields.Int(required=True)
    size = fields.Int(required=True)


def find_images(dataset_id, offset, limit):
    return list(db.images.find({'dataset_id': ObjectId(dataset_id)}).skip(offset).limit(limit))


def find_image(dataset_id, image_id):
    return db.images.find_one({'_id': ObjectId(image_id),
                               'dataset_id': ObjectId(dataset_id)})


def insert_image(dataset_id, image):
    db.images.insert_one({'dataset_id': ObjectId(dataset_id), **image})


def remove_images(dataset_id):
    db.images.delete_many({'dataset_id': ObjectId(dataset_id)})


def remove_image(dataset_id, image_id):
    db.images.delete_one({'_id': ObjectId(image_id),
                          'dataset_id': ObjectId(dataset_id)})
