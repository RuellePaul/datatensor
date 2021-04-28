import cv2
import json
import os
import zipfile
from datetime import datetime
from uuid import uuid4

import numpy
import requests
from flask import request

import errors
from config import Config
from routes.authentication.core import verify_access_token
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


def dataset_generation(dataset_name, count=2):
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

    images = []
    for image_object in annotations['images'][:count]:
        filename = image_object['file_name']
        if filename and allowed_file(filename):
            image_id = str(uuid4())
            image_url = image_object['coco_url']
            response = requests.get(image_url)
            image = numpy.asarray(bytearray(response.content), dtype='uint8')
            image = cv2.imdecode(image, cv2.IMREAD_COLOR)
            image = compress_image(image)
            image_bytes = cv2.imencode('.jpg', image)[1].tostring()
            path = upload_image(image_bytes, image_id)
            images.append({
                'id': image_id,
                'dataset_id': dataset_id,
                'path': path,
                'name': secure_filename(str(filename)),
                'size': len(image_bytes),
                'width': image.shape[1],
                'height': image.shape[0],
                'labels': []
            })

    dataset = dict(id=dataset_id,
                   user_id=user['id'],
                   created_at=datetime.now().isoformat(),
                   description='test',
                   is_public=True,
                   dataset_name=dataset_name)

    Config.db.datasets.insert_one(dataset)
    Config.db.images.insert_many(images)


if __name__ == '__main__':
    dataset_generation('coco')
