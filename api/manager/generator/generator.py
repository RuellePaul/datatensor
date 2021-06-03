import concurrent.futures
import json
import os
from datetime import datetime
from time import sleep
from uuid import uuid4

import requests

import errors
from config import Config
from manager.task_utils import update_task, increment_task_progress
from routes.images.core import allowed_file, upload_image, secure_filename
from utils import filter_annotations


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
        image_id = str(image_remote_dataset['id'])
        response = _download_image(image_remote_dataset['flickr_url'])
        if not response:
            response = _download_image(image_remote_dataset['coco_url'])
        if not response:
            return
        image_bytes = response.content
        path = upload_image(image_bytes, image_id)
        increment_task_progress(task_id, 1 / image_count)
        saved_image = {
            '_id': image_id,
            'dataset_id': dataset_id,
            'path': path,
            'name': secure_filename(str(filename)),
            'size': len(image_bytes),
            'width': image_remote_dataset['width'],
            'height': image_remote_dataset['height']
        }
        labels = [{
            '_id': str(uuid4()),
            'image_id': str(image_remote_dataset['id']),
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

        Config.db.images.insert_one(saved_image)
        Config.db.labels.insert_many(labels)


def _generate_dataset_name(categories):
    supercategories = list(set(category['supercategory'] for category in categories))[:4]
    dataset_name = f"{', '.join(supercategories)}"
    return dataset_name.title()


def main(user_id, task_id, properties):
    datasource_key = properties['datasource_key']
    selected_categories = properties['selected_categories']
    image_count = int(properties['image_count'])

    dataset_id = str(uuid4())
    update_task(task_id, dataset_id=dataset_id, status='active')

    if Config.db.datasets.find_one({'_id': dataset_id}):
        raise errors.Forbidden(f'Dataset {dataset_id} is already built')

    datasource = [datasource for datasource in Config.DATASOURCES if datasource['key'] == datasource_key][0]
    # TODO : use multiple filenames
    filename = datasource['filenames'][0]

    annotations_path = os.path.join(Config.DATASOURCES_PATH, datasource_key, 'annotations')
    json_file = open(os.path.join(annotations_path, filename), 'r')
    json_remote_dataset = json.load(json_file)
    json_file.close()

    images_remote_dataset, categories_remote_dataset, labels_remote_dataset = filter_annotations(json_remote_dataset,
                                                                                                  selected_categories,
                                                                                                  image_count)
    del json_remote_dataset

    categories = [{
        '_id': str(uuid4()),
        '_internal_id': category['id'],
        'dataset_id': dataset_id,
        'name': category['name'],
        'supercategory': category['supercategory']
    } for category in categories_remote_dataset]

    dataset = dict(_id=dataset_id,
                   user_id=user_id,
                   created_at=datetime.now().isoformat(),
                   name=_generate_dataset_name(categories),
                   description=f"Generated with {len(categories)} categories, from {datasource['name']}",
                   image_count=image_count,
                   is_public=True)

    Config.db.datasets.insert_one(dataset)
    Config.db.categories.insert_many([{
        '_id': category['_id'],
        'dataset_id': category['dataset_id'],
        'name': category['name'],
        'supercategory': category['supercategory']
    } for category in categories])

    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        executor.map(_process_image,
                     ({'task_id': task_id,
                       'dataset_id': dataset_id,
                       'image_remote_dataset': image,
                       'image_count': image_count,
                       'category_labels': [el for el in labels_remote_dataset if
                                           el['image_id'] == image['id']],
                       'categories': categories}
                      for image in images_remote_dataset))

    update_task(task_id, progress=1)
    sleep(2)
    image_count = len(list(Config.db.images.find({'dataset_id': dataset_id})))
    Config.db.datasets.find_one_and_update({'_id': dataset_id}, {'$set': {'image_count': image_count}})
    return
