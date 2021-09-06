from typing import List

from config import Config
from routers.categories.models import Category
from routers.datasets.core import find_datasets
from utils import get_unique

db = Config.db


def search_categories(user_id) -> List[Category]:
    datasets = find_datasets(user_id)
    categories = list(db.categories.find({'dataset_id': {'$in': [dataset.id for dataset in datasets]}}))
    categories = get_unique(categories, 'name')
    return [Category.from_mongo(category) for category in categories]


def search_dataset_ids_from_category_names(category_names: List[str]):
    query = '|'.join(category_names)
    categories = list(db.categories.find({'$or': [{'name': {'$regex': query, '$options': 'i'}},
                                                  {'supercategory': {'$regex': query, '$options': 'i'}}]}))
    matched_datasets_ids = [category['dataset_id'] for category in categories]
    return list(set(matched_datasets_ids))
