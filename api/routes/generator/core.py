import os
from uuid import uuid4
from datetime import datetime

from flask import Blueprint, jsonify, request

from config import Config
from routes.authentication.core import verify_access_token


def coco_dataset_generation():
    user = verify_access_token(request.headers['Authorization'], verified=True)
    images_path = os.path.join(Config.ROOT_PATH, 'api', 'routes', 'generator', 'images')
    dataset_id = str(uuid4())

    dataset = dict(id=dataset_id,
                   user_id=user['id'],
                   created_at=datetime.now().isoformat(),
                   description='test',
                   is_public=True,
                   name='TOTOOO')
