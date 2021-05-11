from bson.objectid import ObjectId
from marshmallow import Schema
from webargs import fields

import errors
from config import Config

db = Config.db


class Category(Schema):
    _id = fields.Str(dump_only=True)
    dataset_id = fields.Str(dump_only=True)
    name = fields.Str(required=True)
    supercategory = fields.Str()


def find_categories(dataset_id, offset, limit):
    return list(db.categories.find({'dataset_id': dataset_id}).skip(offset).limit(limit))


def find_category(dataset_id, category_id):
    return db.categories.find_one({'_id': ObjectId(category_id),
                                   'dataset_id': dataset_id})


def insert_category(dataset_id, category):
    name = category['name']
    if db.categories.find_one({'dataset_id': dataset_id, 'name': name}):
        raise errors.Forbidden(f'Category {name} already exists')
    inserted_id = db.categories.insert_one({'dataset_id': dataset_id, **category}).inserted_id
    return inserted_id


def remove_categories(dataset_id):
    db.categories.delete_many({'dataset_id': dataset_id})


def remove_category(dataset_id, category_id):
    db.categories.delete_one({'_id': ObjectId(category_id),
                              'dataset_id': dataset_id})
