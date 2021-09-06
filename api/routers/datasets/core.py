from datetime import datetime
from typing import List
from uuid import uuid4

from api import errors
from api.config import Config
from api.routers.datasets.models import Dataset, DatasetPostBody, DatasetPatchPrivacyBody
from api.routers.images.core import delete_images_from_s3, find_images

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


def update_dataset_privacy(user_id, dataset_id, payload: DatasetPatchPrivacyBody):
    dataset_to_update = db.datasets.find_one({'_id': dataset_id})

    if not dataset_to_update:
        raise errors.NotFound(errors.DATASET_NOT_FOUND)

    if dataset_to_update['user_id'] != user_id:
        raise errors.Forbidden(errors.NOT_YOUR_DATASET)

    db.datasets.find_one_and_update({'_id': dataset_id},
                                    {'$set': {'is_public': payload.is_public}})


def insert_dataset(user_id, payload: DatasetPostBody):
    dataset = Dataset(
        id=str(uuid4()),
        user_id=user_id,
        name=payload.name,
        description=payload.description,
        is_public=payload.is_public,
        created_at=datetime.now(),
        image_count=0,
        augmented_count=0
    )
    db.datasets.insert_one(dataset.mongo())


def remove_dataset(user_id, dataset_id):
    dataset_to_remove = db.datasets.find_one({'_id': dataset_id})

    if not dataset_to_remove:
        raise errors.NotFound(errors.DATASET_NOT_FOUND)

    if dataset_to_remove['user_id'] != user_id:
        raise errors.Forbidden(errors.NOT_YOUR_DATASET)

    images = find_images(dataset_id)
    if images:
        image_ids_to_remove = [image.id for image in images]
        delete_images_from_s3(image_ids_to_remove)
        db.images.delete_many({'dataset_id': dataset_id})
        db.labels.delete_many({'image_id': {'$in': image_ids_to_remove}})

    db.categories.delete_many({'dataset_id': dataset_id})
    db.tasks.delete_many({'dataset_id': dataset_id})
    db.pipelines.delete_many({'dataset_id': dataset_id})
    db.datasets.delete_one({'_id': dataset_id, 'user_id': user_id})


def remove_datasets(user_id):
    datasets = find_datasets(user_id)

    for dataset in datasets:
        try:
            remove_dataset(user_id, dataset.id)
        except errors.Forbidden:
            pass
