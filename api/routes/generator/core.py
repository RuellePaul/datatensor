import os
from uuid import uuid4
from datetime import datetime

import cv2
import json

from flask import request

import errors
from config import Config
from routes.authentication.core import verify_access_token
from routes.images.core import allowed_file, compress_image, upload_image, secure_filename


def labels_from_annotations(annotations, filename):
    annotations_path = os.path.join(Config.LOCAL_DATASETS_PATH, dataset_name, 'annotations', 'captions_train2014.json')
    return []


def dataset_generation(dataset_name):
    user = verify_access_token(request.headers['Authorization'], verified=True)
    dataset_id = Config.LOCAL_DATASET_IDS[dataset_name]

    if Config.db.datasets.find_one({'id': dataset_id}):
        raise errors.Forbidden(f'Dataset {dataset_name} is already built')

    images_path = os.path.join(Config.LOCAL_DATASETS_PATH, dataset_name, 'images')

    try:
        image_filenames = os.listdir(images_path)
    except FileNotFoundError:
        raise errors.NotFound(f"{images_path} doesn't exists")

    annotations_path = os.path.join(Config.LOCAL_DATASETS_PATH, dataset_name, 'annotations', 'instances_val2014.json')
    json_file = open(annotations_path, 'r')
    annotations = json.load(json_file)

    images = []
    for filename in image_filenames:
        if filename and allowed_file(filename):
            image_id = str(uuid4())
            image = cv2.imread(os.path.join(images_path, filename))
            image = compress_image(image)
            image_bytes = cv2.imencode('.jpg', image)[1].tostring()
            path = upload_image(image_bytes, image_id)
            images.append({
                'id': image_id,
                'dataset_id': dataset_id,
                'path': path,
                'dataset_name': secure_filename(str(filename)),
                'size': len(image_bytes),
                'width': image.shape[1],
                'height': image.shape[0],
                'labels': labels_from_annotations(annotations, filename)
            })

    dataset = dict(id=dataset_id,
                   user_id=user['id'],
                   created_at=datetime.now().isoformat(),
                   description='test',
                   is_public=True,
                   dataset_name=dataset_name)

    Config.db.datasets.insert_one(dataset)
    Config.db.images.insert_many(images)
