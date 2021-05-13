import json
import os
import zipfile
from datetime import datetime
from uuid import uuid4

import cv2
import numpy
import requests
from bson.objectid import ObjectId
from flask import request

import errors
from authentication.core import verify_access_token
from config import Config
from routes.images.core import allowed_file, compress_image, upload_image, secure_filename

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


def _labels_from_annotations(image_id, current_image, annotations):
    category_labels = [el for el in annotations if el['image_id'] == current_image['id']]
    labels = [{
        '_id': str(uuid4()),
        'image_id': image_id,
        'x': category_label['bbox'][0] / current_image['width'],
        'y': category_label['bbox'][1] / current_image['height'],
        'w': category_label['bbox'][2] / current_image['width'],
        'h': category_label['bbox'][3] / current_image['height'],
        'category_id': category_label['category_id']
    } for category_label in category_labels]
    return labels


def dataset_generator(dataset_name, count=2):
    user = verify_access_token(request.headers['Authorization'], verified=True)
    dataset_id = Config.DEFAULT_DATASET_IDS[dataset_name]

    if Config.db.datasets.find_one({'id': dataset_id}):
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
    annotations = json.load(json_file)
    annotations['images'] = annotations['images'][:count]

    categories = [{
        'internal_category_id': category['id'],
        'dataset_id': dataset_id,
        'name': category['name'],
        'supercategory': category['supercategory']
    } for category in annotations['categories']]

    images = []
    labels = []
    for index, current_image in enumerate(annotations['images']):
        filename = current_image['file_name']
        if filename and allowed_file(filename):
            image_id = str(uuid4())
            image_url = current_image['coco_url']
            response = requests.get(image_url)
            if response.status_code != 200:
                continue
            image = numpy.asarray(bytearray(response.content), dtype='uint8')
            image = cv2.imdecode(image, cv2.IMREAD_COLOR)
            image = compress_image(image)
            image_bytes = cv2.imencode('.jpg', image)[1].tostring()
            path = upload_image(image_bytes, image_id)
            images.append({
                '_id': image_id,
                'dataset_id': dataset_id,
                'path': path,
                'name': secure_filename(str(filename)),
                'size': len(image_bytes),
                'width': image.shape[1],
                'height': image.shape[0]
            })
            labels.extend(_labels_from_annotations(image_id, current_image, annotations['annotations']))

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

        if category['name'] not in [category['name'] for category in saved_categories]:
            saved_categories.append(category)

    for category in saved_categories:
        category.pop('internal_category_id', None)

    dataset = dict(_id=ObjectId(dataset_id),
                   user_id=user['_id'],
                   created_at=datetime.now().isoformat(),
                   name='COCO dataset',
                   description=f"Official COCO dataset, with {len(saved_categories)} categories.<br/>Generated by admin {user['name']}.",
                   is_public=True,
                   dataset_name=dataset_name)

    Config.db.categories.insert_many(saved_categories)
    Config.db.labels.insert_many(saved_labels)
    Config.db.images.insert_many(images)
    Config.db.datasets.insert_one(dataset)


if __name__ == '__main__':
    dataset_generator('coco')
