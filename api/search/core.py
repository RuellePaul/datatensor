from typing import List, Union

from config import Config
from routers.categories.models import Category
from routers.datasets.core import find_datasets
from routers.images.core import find_images
from routers.labels.models import Label
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


def search_unlabeled_image_id(dataset_id, pipeline_id, offset) -> Union[str, None]:
    image_ids = [image.id for image in find_images(dataset_id, pipeline_id)]
    labels = list(db.labels.find({'image_id': {'$in': image_ids}}))
    labels = [Label.from_mongo(label) for label in labels]

    unlabeled_image_id = None

    labeled_image_ids = set(label.image_id for label in labels)
    try:
        unlabeled_image_id = next(image_id for image_id in image_ids[offset:]
                                  if image_id not in labeled_image_ids
                                  and image_ids.index(image_id) > offset)
    except StopIteration:
        try:
            if not unlabeled_image_id:
                unlabeled_image_id = next(image_id for image_id in image_ids
                                          if image_id not in labeled_image_ids)
        except StopIteration:
            pass
    return unlabeled_image_id
