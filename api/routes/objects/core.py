from uuid import uuid4

from config import Config


def create_object(name, supercategory, dataset_id):
    existing_object = Config.db.objects.find_one({'name': name}, {'_id': 0})

    if existing_object:
        Config.db.datasets.update({'id': dataset_id},
                                  {'$push': {'objects': existing_object}})

    if not existing_object:
        created_object = {
            'id': str(uuid4()),
            'name': name,
            'supercategory': supercategory
        }
        Config.db.datasets.update({'id': dataset_id},
                                  {'$push': {'objects': created_object}})
        Config.db.objects.insert_one(created_object)
