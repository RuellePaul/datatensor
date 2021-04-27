import os
from uuid import uuid4
from datetime import datetime

import cv2

from flask import request

import errors
from config import Config
from routes.authentication.core import verify_access_token
from routes.images.core import allowed_file, compress_image, upload_image, secure_filename


def dataset_generation(name):
    user = verify_access_token(request.headers['Authorization'], verified=True)
    dataset_id = Config.LOCAL_DATASET_IDS[name]

    if Config.db.datasets.find_one({'id': dataset_id}):
        raise errors.Forbidden(f'Dataset {name} is already built')

    images_path = os.path.join(Config.LOCAL_DATASETS_PATH, name, 'images')

    try:
        image_filenames = os.listdir(images_path)
    except FileNotFoundError:
        raise errors.NotFound(f"{images_path} doesn't exists")

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
                   name=name)

    Config.db.datasets.insert_one(dataset)
    Config.db.images.insert_many(images)