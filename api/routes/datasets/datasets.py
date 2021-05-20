from flask import Blueprint
from webargs import fields
from webargs.flaskparser import use_args

from utils import build_schema, parse
from .core import Dataset, find_datasets, find_dataset, remove_dataset, insert_dataset

datasets = Blueprint('datasets', __name__)
Dataset = build_schema(Dataset)


@datasets.route('/')
@use_args({
    'offset': fields.Int(required=False, missing=0),
    'limit': fields.Int(required=False, missing=0)
}, location='query')
def get_datasets(args):
    result = find_datasets(args['offset'], args['limit'])
    return {'datasets': parse(result)}, 200


@datasets.route('/<dataset_id>')
def get_dataset(dataset_id):
    result = find_dataset(dataset_id)
    return {'dataset': parse(result)}, 200


@datasets.route('/', methods=['POST'])
@use_args(Dataset)
def post_dataset(args):
    insert_dataset(args)
    return 'OK', 201


@datasets.route('/<dataset_id>', methods=['DELETE'])
def delete_dataset(dataset_id):
    remove_dataset(dataset_id)
    return 'OK', 200
