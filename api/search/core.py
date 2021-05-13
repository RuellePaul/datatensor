from flask import request

from authentication.core import verify_access_token
from config import Config

db = Config.db


def search_images_by_category_name(category_name):
    user_id = verify_access_token(request.headers['Authorization']).get('_id')
    user_datasets = list(db.datasets.find({'user_id': user_id}))
    user_dataset_ids = [dataset['_id'] for dataset in user_datasets]

    matching_labels = list(db.labels.find({'category_name': category_name}))
    matching_image_ids = [label['image_id'] for label in matching_labels]
    matching_images = list(db.images.find({'_id': {'$in': matching_image_ids},
                                           'dataset_id': {'$nin': user_dataset_ids}}))
    return matching_images
