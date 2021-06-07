import concurrent.futures
from datetime import datetime
from uuid import uuid4

import errors
from config import Config
from routers.images.core import delete_image_from_s3

db = Config.db


def find_datasets(user_id, offset, limit):
    return list(db.datasets.find({'$or': [{'user_id': user_id}, {'is_public': True}]}).skip(offset).limit(limit))


def find_dataset(dataset_id):
    return db.datasets.find_one({'_id': dataset_id})


def insert_dataset(user_id, dataset):
    db.datasets.insert_one({'_id': str(uuid4()),
                            'user_id': user_id,
                            'created_at': datetime.now(),
                            'image_count': 0,
                            **dataset.dict()})


def remove_dataset(user_id, dataset_id):
    dataset_to_remove = db.datasets.find_one({'_id': dataset_id})
    if dataset_to_remove['user_id'] != user_id:
        raise errors.Forbidden("You can only remove your own datasets")

    images = list(Config.db.images.find({'dataset_id': dataset_id}))
    if images:
        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
            executor.map(delete_image_from_s3,
                         [image['_id'] for image in images])

        for image in images:
            db.labels.delete_many({'image_id': image['_id']})
        db.images.delete_many({'dataset_id': dataset_id})

    db.categories.delete_many({'dataset_id': dataset_id})
    db.datasets.delete_one({'_id': dataset_id, 'user_id': user_id})