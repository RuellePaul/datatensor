import concurrent.futures
import json
import os
import zipfile
from datetime import datetime
from uuid import uuid4

import requests
from bson.objectid import ObjectId

import errors
from config import Config
from manager.task_manager import update_task, increment_task_progress
from routes.images.core import allowed_file, upload_image, secure_filename

ANNOTATIONS_CONFIG = {
    'coco': {
        'download_url': 'http://images.cocodataset.org/annotations/annotations_trainval2014.zip',
        'filename': 'instances_val2014.json'
    }
}


def _download_annotations(dataset_name):
    url = ANNOTATIONS_CONFIG[dataset_name]['download_url']
    response = requests.get(url, stream=True)

    dataset_path = os.path.join(Config.DEFAULT_DATASETS_PATH, dataset_name)

    zip_path = os.path.join(dataset_path, f'{dataset_name}.zip')
    with open(zip_path, 'wb') as fd:
        for chunk in response.iter_content(chunk_size=128):
            fd.write(chunk)

    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(dataset_path)

    os.remove(zip_path)


def _download_image(image_url):
    try:
        response = requests.get(image_url)
        if response.status_code != 200:
            return
        return response
    except requests.exceptions.ConnectionError:
        return


def process_image(args):
    task_id = args['task_id']
    dataset_id = args['dataset_id']
    image_remote_dataset = args['image_remote_dataset']
    image_count = args['image_count']
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
        return {
            '_id': image_id,
            'dataset_id': dataset_id,
            'path': path,
            'name': secure_filename(str(filename)),
            'size': len(image_bytes),
            'width': image_remote_dataset['width'],
            'height': image_remote_dataset['height']
        }


def main(user_id, task_id, properties):
    dataset_name = properties['dataset_name']
    image_count = int(properties['image_count'])

    dataset_id = Config.DEFAULT_DATASET_IDS[dataset_name]
    update_task(task_id, dataset_id=dataset_id, status='active')

    if Config.db.datasets.find_one({'_id': ObjectId(dataset_id)}):
        raise errors.Forbidden(f'Dataset {dataset_name} is already built')

    if not os.path.exists(Config.DEFAULT_DATASETS_PATH):
        os.mkdir(Config.DEFAULT_DATASETS_PATH)

    dataset_path = os.path.join(Config.DEFAULT_DATASETS_PATH, dataset_name)
    if not os.path.exists(dataset_path):
        os.mkdir(dataset_path)

    try:
        annotations_path = os.path.join(dataset_path, 'annotations')
        if not os.path.exists(annotations_path):
            _download_annotations(dataset_name)
    except Exception as e:
        raise errors.InternalError(f'download of {dataset_name} failed, {str(e)}')

    json_file = open(os.path.join(annotations_path, ANNOTATIONS_CONFIG[dataset_name]['filename']), 'r')
    json_remote_dataset = json.load(json_file)

    json_file.close()

    images_remote_dataset = json_remote_dataset['images'][:image_count]
    categories_remote_dataset = json_remote_dataset['categories']
    labels_remote_dataset = json_remote_dataset['annotations']
    del json_remote_dataset

    categories = [{
        'internal_category_id': category['id'],
        'dataset_id': dataset_id,
        'name': category['name'],
        'supercategory': category['supercategory']
    } for category in categories_remote_dataset]

    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        results = executor.map(process_image,
                               ({'task_id': task_id,
                                 'dataset_id': dataset_id,
                                 'image_remote_dataset': image,
                                 'image_count': image_count}
                                for image in images_remote_dataset))
        images = list(filter(None.__ne__, results))

        labels = []
        for image_remote_dataset in images_remote_dataset:
            category_labels = [el for el in labels_remote_dataset if el['image_id'] == image_remote_dataset['id']]
            labels.extend([{
                '_id': str(uuid4()),
                'image_id': str(image_remote_dataset['id']),
                'x': category_label['bbox'][0] / image_remote_dataset['width'],
                'y': category_label['bbox'][1] / image_remote_dataset['height'],
                'w': category_label['bbox'][2] / image_remote_dataset['width'],
                'h': category_label['bbox'][3] / image_remote_dataset['height'],
                'category_id': category_label['category_id']
            } for category_label in category_labels])

        saved_categories = []
        saved_labels = []
        for label in labels:
            category = [category for category in categories
                        if category['internal_category_id'] == label['category_id']][0]
            saved_labels.append({
                'image_id': label['image_id'],
                'x': label['x'],
                'y': label['y'],
                'w': label['w'],
                'h': label['h'],
                'category_name': category['name']})

            if category['name'] not in [saved_category['name'] for saved_category in saved_categories]:
                saved_categories.append(category)

        for category in saved_categories:
            category.pop('internal_category_id', None)

        dataset = dict(_id=ObjectId(dataset_id),
                       user_id=user_id,
                       created_at=datetime.now().isoformat(),
                       name='COCO 2014',
                       description=f"Official COCO dataset, with {len(saved_categories)} categories.",
                       is_public=True,
                       dataset_name=dataset_name)

        Config.db.categories.insert_many(saved_categories)
        Config.db.labels.insert_many(saved_labels)
        Config.db.images.insert_many(images)
        Config.db.datasets.insert_one(dataset)

    update_task(task_id, status='success')
    return
