from typing import List
from uuid import uuid4

import errors
from config import Config
from routers.categories.models import Category

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


def insert_category(dataset_id, category) -> Category:
    if db.categories.find_one({'dataset_id': dataset_id, 'name': category.name}):
        raise errors.Forbidden(errors.CATEGORY_ALREADY_EXISTS)
    category = Category(
        id=str(uuid4()),
        dataset_id=dataset_id,
        name=category.name,
        supercategory=category.supercategory
    )
    db.categories.insert_one(category.mongo())
    return category


def remove_category(dataset_id, category_id):
    db.labels.delete_many({'category_id': category_id})
    db.categories.delete_one({'_id': category_id,
                              'dataset_id': dataset_id})
