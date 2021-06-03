import os
import json
import zipfile

import requests
from uuid import uuid4

import errors
from config import Config
from logger import logger


db = Config.db


def _download_annotations(datasource_key):
    if not os.path.exists(Config.DATASOURCES_PATH):
        os.mkdir(Config.DATASOURCES_PATH)

    datasource_path = os.path.join(Config.DATASOURCES_PATH, datasource_key)
    if not os.path.exists(datasource_path):
        os.mkdir(datasource_path)

    annotations_path = os.path.join(datasource_path, 'annotations')
    datasource = [datasource for datasource in Config.DATASOURCES if datasource['key'] == datasource_key][0]

    if os.path.exists(annotations_path):
        return annotations_path, datasource

    logger.info(f"Downloading {datasource['name']}...")

    response = requests.get(datasource['download_url'], stream=True)
    if response.status_code != 200:
        raise errors.APIError(503, f"Datasource {datasource['name']} unreachable")

    datasource_path = os.path.join(Config.DATASOURCES_PATH, datasource_key)
    zip_path = os.path.join(datasource_path, f'{datasource_key}.zip')
    with open(zip_path, 'wb') as fd:
        for chunk in response.iter_content(chunk_size=128):
            fd.write(chunk)

    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(datasource_path)

    os.remove(zip_path)
    return annotations_path, datasource


def find_datasources():
    return Config.DATASOURCES


def find_categories(datasource_key):
    try:
        annotations_path, datasource = _download_annotations(datasource_key)
    except Exception as e:
        raise errors.InternalError(f'Download of {datasource_key} failed, {str(e)}')

    filename = datasource['filenames'][0]
    try:
        json_file = open(os.path.join(annotations_path, filename), 'r')
        datasource_content = json.load(json_file)
        categories = datasource_content['categories']
        datasource_annotations = datasource_content['annotations']
        json_file.close()
    except FileNotFoundError:
        raise errors.NotFound(f'Filename {filename} not found for datasource {datasource_key}')

    for category in categories:
        category['labels_count'] = 0

    for datasource_label in datasource_annotations:
        category_id = datasource_label['category_id']
        category_to_update = next(category for category in categories if category['id'] == category_id)
        category_to_update['labels_count'] += 1

    for category in categories:
        category['_id'] = str(uuid4())
        category.pop('id', None)

    return categories


def find_max_image_count(datasource_key, selected_categories):
    pass
