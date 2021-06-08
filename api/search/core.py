from config import Config

db = Config.db


def search_datasets(query):
    categories = list(db.categories.find({'$or': [{'name': {'$regex': query, '$options': 'i'}},
                                                  {'supercategory': {'$regex': query, '$options': 'i'}}]}))
    matched_datasets_ids = [category['dataset_id'] for category in categories]

    datasets_matched = list(db.datasets.find(
        {'$or': [{'user_id': query},
                 {'name': {'$regex': query, '$options': 'i'}},
                 {'description': {'$regex': query, '$options': 'i'}},
                 {'_id': {'$in': matched_datasets_ids}}]}
    ))
    return datasets_matched


def search_images(query):
    images = list(db.images.find({'name': {'$regex': query, '$options': 'i'}}))
    return images


def search_users(query):
    users = list(db.users.find(
        {'$or': [{'email': {'$regex': query, '$options': 'i'}},
                 {'name': {'$regex': query, '$options': 'i'}}]}
    ))
    return users


def search_categories(query):
    categories = list(db.categories.find(
        {'$or': [{'name': {'$regex': query, '$options': 'i'}},
                 {'supercategory': {'$regex': query, '$options': 'i'}}]}
    ))
    return categories
