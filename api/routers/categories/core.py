from typing import List
from uuid import uuid4

import errors
from config import Config
from routers.categories.models import Category, SuperCategory
from routers.images.models import ImageExtended
from routers.labels.core import find_labels, find_labels_of_category

db = Config.db


def find_categories(dataset_id, offset=0, limit=0) -> List[Category]:
    categories = list(db.categories.find({'dataset_id': dataset_id}).skip(offset).limit(limit))
    if categories is None:
        raise errors.NotFound(errors.CATEGORY_NOT_FOUND)
    return [Category.from_mongo(category) for category in categories]


def find_category(dataset_id, category_id) -> Category:
    category = db.categories.find_one({'_id': category_id, 'dataset_id': dataset_id})
    if category is None:
        raise errors.NotFound(errors.CATEGORY_NOT_FOUND)
    return Category.from_mongo(category)


def find_images_of_category(dataset_id, category_id, include_labels=False, offset=0, limit=0) -> tuple[List[ImageExtended], int]:
    labels = find_labels_of_category(category_id)
    images = db.images.find({'dataset_id': dataset_id,
                             'pipeline_id': None,
                             '_id': {'$in': [label.image_id for label in labels]}}
                            ).skip(offset).limit(limit)
    total_count = db.images.count({'dataset_id': dataset_id,
                                   'pipeline_id': None,
                                   '_id': {'$in': [label.image_id for label in labels]}})
    images = [ImageExtended.from_mongo(image) for image in images]
    if include_labels:
        for image in images:
            image.labels = find_labels(image.id)
    return images, total_count


def insert_category(dataset_id, category) -> Category:
    if db.categories.find_one({'dataset_id': dataset_id, 'name': category.name}):
        raise errors.Forbidden(errors.CATEGORY_ALREADY_EXISTS)
    category = Category(
        id=str(uuid4()),
        dataset_id=dataset_id,
        name=category.name,
        supercategory=category.supercategory or SuperCategory('miscellaneous')
    )
    db.categories.insert_one(category.mongo())
    return category


def remove_category(dataset_id, category_id):
    db.labels.delete_many({'category_id': category_id})
    db.categories.delete_one({'_id': category_id,
                              'dataset_id': dataset_id})
