from fastapi import APIRouter
from webargs.flaskparser import use_args

from utils import build_schema, parse
from .core import Dataset, find_datasets, find_dataset, remove_dataset, insert_dataset

datasets = APIRouter()
Dataset = build_schema(Dataset)


@datasets.get('/')
def get_datasets(offset: int = 0, limit: int = 0):
    result = find_datasets(offset, limit)
    return {'datasets': parse(result)}, 200


@datasets.get('/<dataset_id>')
def get_dataset(dataset_id):
    result = find_dataset(dataset_id)
    return {'dataset': parse(result)}, 200


@datasets.post('/')
@use_args(Dataset)
def post_dataset(args):
    insert_dataset(args)
    return 'OK', 201


@datasets.delete('/<dataset_id>')
def delete_dataset(dataset_id):
    remove_dataset(dataset_id)
    return 'OK', 200
