from datetime import datetime
from typing import List
from uuid import uuid4

import errors
from config import Config
from routers.categories.core import find_categories
from routers.datasets.models import Dataset, DatasetExtended, DatasetPostBody, DatasetPatchBody
from routers.users.core import find_user
from routers.images.core import find_all_images, remove_images

db = Config.db


def find_datasets(user_id, offset=0, limit=0, include_user=False, include_categories=False) -> List[DatasetExtended]:
    datasets = list(db.datasets
                    .find({'$or': [{'user_id': user_id}, {'is_public': True}]})
                    .skip(offset)
                    .limit(limit))
    if datasets is None:
        raise errors.NotFound(errors.DATASET_NOT_FOUND)
    datasets = [DatasetExtended.from_mongo(dataset) for dataset in datasets]
    if include_user:
        for dataset in datasets:
            dataset.user = find_user(dataset.user_id)
    if include_categories:
        for dataset in datasets:
            dataset.categories = find_categories(dataset.id)
    return datasets


def find_own_datasets(user_id) -> List[Dataset]:
    datasets = list(db.datasets
                    .find({'user_id': user_id}))
    if datasets is None:
        raise errors.NotFound(errors.DATASET_NOT_FOUND)
    return [Dataset.from_mongo(dataset) for dataset in datasets]


def find_dataset(dataset_id, include_user=False, include_categories=False) -> DatasetExtended:
    dataset = db.datasets.find_one({'_id': dataset_id})
    if dataset is None:
        raise errors.NotFound(errors.DATASET_NOT_FOUND)
    dataset = DatasetExtended.from_mongo(dataset)
    if include_user:
        dataset.user = find_user(dataset.user_id)
    if include_categories:
        dataset.categories = find_categories(dataset_id)
    return dataset


def update_dataset(user_id, dataset_id, payload: DatasetPatchBody):
    dataset_to_update = db.datasets.find_one({'_id': dataset_id})

    if not dataset_to_update:
        raise errors.NotFound(errors.DATASET_NOT_FOUND)

    if dataset_to_update['user_id'] != user_id:
        raise errors.Forbidden(errors.NOT_YOUR_DATASET)

    db.datasets.find_one_and_update({'_id': dataset_id},
                                    {'$set': {k: v for k, v in payload.dict().items() if v is not None}})


def insert_dataset(user_id, payload: DatasetPostBody) -> Dataset:
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
    return dataset


def remove_dataset(user_id, dataset_id):
    dataset_to_remove = db.datasets.find_one({'_id': dataset_id})

    if not dataset_to_remove:
        raise errors.NotFound(errors.DATASET_NOT_FOUND)

    if dataset_to_remove['user_id'] != user_id:
        raise errors.Forbidden(errors.NOT_YOUR_DATASET)

    images = find_all_images(dataset_id)
    image_ids = [image.id for image in images]
    remove_images(dataset_id, image_ids)

    db.categories.delete_many({'dataset_id': dataset_id})
    db.tasks.delete_many({'dataset_id': dataset_id})
    db.pipelines.delete_many({'dataset_id': dataset_id})
    db.datasets.delete_one({'_id': dataset_id, 'user_id': user_id})
    # TODO : delete notifications (with their task_id)


def remove_datasets(user_id):
    datasets = find_own_datasets(user_id)

    for dataset in datasets:
        try:
            remove_dataset(user_id, dataset.id)
        except errors.Forbidden:
            pass
