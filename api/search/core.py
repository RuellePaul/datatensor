from config import Config

db = Config.db


def search_datasets_by_query(query):
    datasets = list(db.datasets.find(
        {'$or': [{'user_id': query}, {'name': query}, {'description': query}]}))
    return datasets


def search_images_by_query(query):
    images = list(db.images.find({'name': query}))
    return images


def search_users_by_query(query):
    users = list(db.users.find(
        {'$or': [{'email': query}, {'name': query}]}))
    return users


def search_categories_by_query(query):
    categories = list(db.categories.find(
        {'$or': [{'name': query}, {'supercategory': query}]}))
    return categories
