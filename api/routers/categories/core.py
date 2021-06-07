import errors
from config import Config

db = Config.db


def find_categories(dataset_id, offset, limit):
    return list(db.categories.find({'dataset_id': dataset_id}).skip(offset).limit(limit))


def find_category(dataset_id, category_id):
    return db.categories.find_one({'_id': category_id,
                                   'dataset_id': dataset_id})


def insert_category(dataset_id, category):
    if db.categories.find_one({'dataset_id': dataset_id, 'name': category.name}):
        raise errors.Forbidden(f'Category {category.name} already exists')
    inserted_id = db.categories.insert_one({'dataset_id': dataset_id, **category.dict()}).inserted_id
    return inserted_id


def remove_category(dataset_id, category_id):
    db.labels.delete_many({'category_id': category_id})
    db.categories.delete_one({'_id': category_id,
                              'dataset_id': dataset_id})
