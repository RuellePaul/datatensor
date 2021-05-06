from uuid import uuid4

import errors
from config import Config


def create_category(name, supercategory, dataset_id):
    name = name.lower()

    created_category = {
        'name': name,
        'supercategory': supercategory
    }
    categories = Config.db.datasets.find_one({'id': dataset_id}).get('categories')

    if categories is None:
        raise errors.InternalError(f'Categories not fond for dataset {dataset_id}')

    if name in [category['name'] for category in categories]:
        raise errors.Forbidden(f'Category {name} already exists')

    Config.db.datasets.update({'id': dataset_id},
                              {'$addToSet': {'categories': created_category}})
    created_category.pop('_id', None)
    return created_category
