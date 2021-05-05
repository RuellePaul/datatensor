from uuid import uuid4

from config import Config


def create_category(name, supercategory, dataset_id):
    existing_category = Config.db.categories.find_one({'name': name}, {'_id': 0})

    if existing_category:
        Config.db.datasets.update({'id': dataset_id},
                                  {'$push': {'categories': existing_category}})
        existing_category.pop('_id')
        return existing_category

    if not existing_category:
        created_category = {
            'id': str(uuid4()),
            'name': name,
            'supercategory': supercategory
        }
        Config.db.datasets.update({'id': dataset_id},
                                  {'$push': {'categories': created_category}})
        Config.db.categories.insert_one(created_category)
        created_category.pop('_id')
        return created_category
