import concurrent.futures
import json
import os
from datetime import datetime
from time import sleep
from uuid import uuid4

import requests

from api.config import Config
from api.routers.datasets.models import Dataset
from api.routers.images.core import allowed_file, upload_image
from api.routers.labels.core import regroup_labels_by_category
from api.routers.labels.models import Label
from api.routers.tasks.models import TaskGeneratorProperties
from api.utils import update_task, increment_task_progress

db = Config.db


# TODO : refactor this (use models)


def _download_image(image_url):
    try:
        response = requests.get(image_url)
        if response.status_code != 200:
            return
        return response
    except requests.exceptions.ConnectionError:
        return


def _process_image(args):
    task_id = args['task_id']
    dataset_id = args['dataset_id']
    image_remote_dataset = args['image_remote_dataset']
    image_count = args['image_count']
    category_labels = args['category_labels']
    categories = args['categories']
    filename = image_remote_dataset['file_name']
    if filename and allowed_file(filename):
        image_id = str(uuid4())
        response = _download_image(image_remote_dataset['flickr_url'])
        if not response:
            response = _download_image(image_remote_dataset['coco_url'])
        if not response:
            return
        image_bytes = response.content
        path = upload_image(image_bytes, image_id)
        saved_image = {
            '_id': image_id,
            'dataset_id': dataset_id,
            'path': path,
            'name': str(filename),
            'size': len(image_bytes),
            'width': image_remote_dataset['width'],
            'height': image_remote_dataset['height']
        }
        labels = [{
            '_id': str(uuid4()),
            'image_id': image_id,
            'x': category_label['bbox'][0] / image_remote_dataset['width'],
            'y': category_label['bbox'][1] / image_remote_dataset['height'],
            'w': category_label['bbox'][2] / image_remote_dataset['width'],
            'h': category_label['bbox'][3] / image_remote_dataset['height'],
            'category_id': category_label['category_id']
        } for category_label in category_labels]
        saved_categories = []
        for label in labels:
            category = [category for category in categories
                        if category['_internal_id'] == label['category_id']][0]
            label['category_id'] = category['_id']

            if category['name'] not in [saved_category['name'] for saved_category in saved_categories]:
                saved_categories.append(category)

        db.images.insert_one(saved_image)
        db.labels.insert_many(labels)
        labels = [Label.from_mongo(label) for label in labels]
        for category_id, labels_count in regroup_labels_by_category(labels).items():
            db.categories.find_one_and_update(
                {'_id': category_id},
                {'$inc': {'labels_count': labels_count}}
            )
        increment_task_progress(task_id, 1 / image_count)


def _filter_annotations(json_remote_dataset, selected_categories, image_count=None):
    categories_remote = [category for category in json_remote_dataset['categories']
                         if category['name'] in selected_categories]
    category_ids = [category['id'] for category in categories_remote]

    labels_remote = [label for label in json_remote_dataset['annotations']
                     if label['category_id'] in category_ids]
    label_ids = [label['image_id'] for label in labels_remote]

    images_remote = [image for image in json_remote_dataset['images'] if image['id'] in label_ids]
    if image_count:
        images_remote = images_remote[:image_count]
    return images_remote, categories_remote, labels_remote


def _generate_dataset_name(categories):
    supercategories = list(set(category['supercategory'] for category in categories))[:4]
    dataset_name = f"{', '.join(supercategories)}"
    return dataset_name.title()


def main(user_id, task_id, properties: TaskGeneratorProperties):
    datasource_key = properties.datasource_key
    selected_categories = properties.selected_categories
    image_count = properties.image_count

    dataset_id = str(uuid4())
    update_task(task_id, dataset_id=dataset_id, status='active')

    datasource = [datasource for datasource in Config.DATASOURCES if datasource['key'] == datasource_key][0]

    # TODO : use multiple filenames
    filename = datasource['filenames'][0]

    annotations_path = os.path.join(Config.DATASOURCES_PATH, datasource_key, 'annotations')
    json_file = open(os.path.join(annotations_path, filename), 'r')
    json_remote_dataset = json.load(json_file)
    json_file.close()

    images_remote, categories_remote, labels_remote = _filter_annotations(json_remote_dataset,
                                                                          selected_categories,
                                                                          image_count)
    del json_remote_dataset

    categories = [{
        '_id': str(uuid4()),
        '_internal_id': category['id'],
        'dataset_id': dataset_id,
        'name': category['name'],
        'supercategory': category['supercategory']
    } for category in categories_remote]

    dataset = Dataset(id=dataset_id,
                      user_id=user_id,
                      created_at=datetime.now(),
                      name=_generate_dataset_name(categories),
                      description=f"Generated with {len(categories)} categorie{'s' if len(categories) > 1 else ''}, from {datasource['name']}",
                      image_count=image_count,
                      augmented_count=0,
                      is_public=True)
    db.datasets.insert_one(dataset.mongo())
    db.categories.insert_many([{
        '_id': category['_id'],
        'dataset_id': category['dataset_id'],
        'name': category['name'],
        'supercategory': category['supercategory'],
        'labels_count': 0
    } for category in categories])

    with concurrent.futures.ThreadPoolExecutor() as executor:
        executor.map(_process_image,
                     ({'task_id': task_id,
                       'dataset_id': dataset_id,
                       'image_remote_dataset': image,
                       'image_count': image_count,
                       'category_labels': [el for el in labels_remote if el['image_id'] == image['id']],
                       'categories': categories}
                      for image in images_remote))

    sleep(1)

    image_count = db.images.count({'dataset_id': dataset_id})
    db.datasets.find_one_and_update({'_id': dataset_id}, {'$set': {'image_count': image_count}})
