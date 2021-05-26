from config import Config

db = Config.db


def search_datasets_by_query(query):
    datasets = list(db.datasets.find(
        {'$or': [{'user_id': {'$regex': query, '$options': 'i'}},
                 {'name': {'$regex': query, '$options': 'i'}},
                 {'description': {'$regex': query, '$options': 'i'}}]}))
    return datasets


def search_images_by_query(query):
    images = list(db.images.find({'name': {'$regex': query, '$options': 'i'}}))
    return images


def search_users_by_query(query):
    users = list(db.users.find(
        {'$or': [{'email': {'$regex': query, '$options': 'i'}},
                 {'name': {'$regex': query, '$options': 'i'}}]}))
    return users


def search_categories_by_query(query):
    categories = list(db.categories.find(
        {'$or': [{'name': {'$regex': query, '$options': 'i'}},
                 {'supercategory': {'$regex': query, '$options': 'i'}}]}))
    return categories
