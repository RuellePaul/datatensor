from typing import List
from uuid import uuid4

import errors
from config import Config
from routers.categories.models import Category

db = Config.db


def find_categories(dataset_id, offset, limit) -> List[Category]:
    categories_in_db = list(db.categories.find({'dataset_id': dataset_id}).skip(offset).limit(limit))
    return [Category.from_mongo(category) for category in categories_in_db]


def find_category(dataset_id, category_id) -> Category:
    category_in_db = db.categories.find_one({'_id': category_id, 'dataset_id': dataset_id})
    return Category.from_mongo(category_in_db)


def insert_category(dataset_id, category) -> Category:
    if db.categories.find_one({'dataset_id': dataset_id, 'name': category.name}):
        raise errors.Forbidden(f'Category {category.name} already exists')
    category = Category(
        _id=str(uuid4()),
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
