from typing import List

from config import Config
from routers.categories.models import Category
from routers.datasets.models import Dataset
from routers.images.models import Image
from routers.users.models import User

db = Config.db


def search_datasets(query) -> List[Dataset]:
    categories = list(db.categories.find({'$or': [{'name': {'$regex': query, '$options': 'i'}},
                                                  {'supercategory': {'$regex': query, '$options': 'i'}}]}))
    matched_datasets_ids = [category['dataset_id'] for category in categories]

    datasets = list(db.datasets.find(
        {'$or': [{'user_id': query},
                 {'name': {'$regex': query, '$options': 'i'}},
                 {'description': {'$regex': query, '$options': 'i'}},
                 {'_id': {'$in': matched_datasets_ids}}]}
    ))
    return [Dataset.from_mongo(dataset) for dataset in datasets]


def search_images(query) -> List[Image]:
    images = list(db.images.find({'name': {'$regex': query, '$options': 'i'}}))
    return [Image.from_mongo(image) for image in images]


def search_users(query) -> List[User]:
    users = list(db.users.find(
        {'$or': [{'email': {'$regex': query, '$options': 'i'}},
                 {'name': {'$regex': query, '$options': 'i'}}]}
    ))
    return [User.from_mongo(user) for user in users]


def search_categories(query) -> List[Category]:
    categories = list(db.categories.find(
        {'$or': [{'name': {'$regex': query, '$options': 'i'}},
                 {'supercategory': {'$regex': query, '$options': 'i'}}]}
    ))
    return [Category.from_mongo(category) for category in categories]
