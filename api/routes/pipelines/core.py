from marshmallow import Schema
from webargs import fields

from config import Config

db = Config.db


class Pipeline(Schema):
    _id = fields.Str()


def find_pipelines(dataset_id, offset, limit):
    return list(db.pipelines.find({'dataset_id': dataset_id}).skip(offset).limit(limit))


def find_pipeline(dataset_id, pipeline_id):
    return db.categories.find_one({'dataset_id': dataset_id, '_id': pipeline_id})
