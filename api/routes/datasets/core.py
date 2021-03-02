import uuid

import errors
from config import Config


def datasets_from_user_id(user_id):
    datasets = list(Config.db.datasets.find({'user_id': user_id}, {'_id': 0}))
    return datasets or []


def generate_dataset(user_id, name):
    dataset = {
        'id': str(uuid.uuid4()),
        'user_id': user_id,
        'name': name,
        'desc': '',
    }
    return dataset


def name_from_dataset_name(dataset):
    return Config.db.datasets.find_one({'name': dataset['name']}, {'_id': 0})


def store_dataset(dataset):
    if Config.db.datasets.find_one({'name': dataset['name']}, {'_id': 0}):
        raise errors.Forbidden(f"Dataset: {dataset['name']} already exists")
    Config.db.datasets.insert_one(dataset)
