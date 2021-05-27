from config import Config

db = Config.db


def search_datasets_by_query(query):
    datasets_matched_by_features = list(db.datasets.find(
        {'$or': [{'user_id': query},
                 {'name': {'$regex': query, '$options': 'i'}},
                 {'description': {'$regex': query, '$options': 'i'}}]},
        {'user_id': 1, 'name': 1, 'description': 1}))

    categories = list(db.categories.find(
        {'$or': [{'name': {'$regex': query, '$options': 'i'}},
                 {'supercategory': {'$regex': query, '$options': 'i'}}]}))
    if categories:
        datatsets_matched_by_categories = list(set([category['dataset_id'] for category in categories]))
        datasets = datatsets_matched_by_categories + datasets_matched_by_features
        return datasets

    return datasets_matched_by_features


def search_images_by_query(query):
    images = list(db.images.find({'name': {'$regex': query, '$options': 'i'}},
                                 {'name': 1}))
    return images


def search_users_by_query(query):
    users = list(db.users.find(
        {'$or': [{'email': {'$regex': query, '$options': 'i'}},
                 {'name': {'$regex': query, '$options': 'i'}}]},
        {'email': 1, 'name': 1}))
    return users


def search_categories_by_query(query):
    categories = list(db.categories.find(
        {'$or': [{'name': {'$regex': query, '$options': 'i'}},
                 {'supercategory': {'$regex': query, '$options': 'i'}}]},
        {'name': 1, 'supercategory': 1}))
    return categories
