import concurrent.futures
from datetime import datetime
from typing import List
from uuid import uuid4

import errors
from config import Config
from routers.datasets.models import Dataset
from routers.images.core import delete_image_from_s3, find_images

db = Config.db


def find_datasets(user_id, offset=0, limit=0) -> List[Dataset]:
    datasets = list(db.datasets
                    .find({'$or': [{'user_id': user_id}, {'is_public': True}]})
                    .skip(offset)
                    .limit(limit))
    if datasets is None:
        raise errors.NotFound(errors.DATASET_NOT_FOUND)
    return [Dataset.from_mongo(dataset) for dataset in datasets]


def find_dataset(dataset_id) -> Dataset:
    dataset = db.datasets.find_one({'_id': dataset_id})
    if dataset is None:
        raise errors.NotFound(errors.DATASET_NOT_FOUND)
    return Dataset.from_mongo(dataset)


def insert_dataset(user_id, dataset):
    db.datasets.insert_one({'_id': str(uuid4()),
                            'user_id': user_id,
                            'created_at': datetime.now(),
                            'image_count': 0,
                            **dataset.dict()})


def remove_dataset(user_id, dataset_id):
    dataset_to_remove = db.datasets.find_one({'_id': dataset_id})

    if not dataset_to_remove:
        raise errors.NotFound(errors.DATASET_NOT_FOUND)

    if dataset_to_remove['user_id'] != user_id:
        raise errors.Forbidden(errors.NOT_YOUR_DATASET)

    images = find_images(dataset_id)
    if images:
        with concurrent.futures.ThreadPoolExecutor(max_workers=16) as executor:
            executor.map(delete_image_from_s3,
                         [image.id for image in images])

        for image in images:
            db.labels.delete_many({'image_id': image.id})
        db.images.delete_many({'dataset_id': dataset_id})

    db.categories.delete_many({'dataset_id': dataset_id})
    db.tasks.delete_many({'dataset_id': dataset_id})
    db.datasets.delete_one({'_id': dataset_id, 'user_id': user_id})


def remove_datasets(user_id):
    datasets = find_datasets(user_id)

    for dataset in datasets:
        try:
            remove_dataset(user_id, dataset.id)
        except errors.Forbidden:
            pass
