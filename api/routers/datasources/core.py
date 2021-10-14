import json
import os
import zipfile
from typing import List
from uuid import uuid4

import requests

import errors
from config import Config
from logger import logger
from routers.datasources.models import DatasourceKey

db = Config.db


def download_annotations(datasource_key: DatasourceKey):
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


def find_datasources() -> List[dict]:
    return Config.DATASOURCES


def find_categories(datasource_key: DatasourceKey):
    try:
        annotations_path, datasource = download_annotations(datasource_key)
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
        raise errors.InternalError(f'Filename {filename} not found for datasource {datasource_key}')

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
    datasource_path = os.path.join(Config.DATASOURCES_PATH, datasource_key)
    annotations_path = os.path.join(datasource_path, 'annotations')
    datasource = [datasource for datasource in Config.DATASOURCES if datasource['key'] == datasource_key][0]
    filename = datasource['filenames'][0]

    try:
        json_file = open(os.path.join(annotations_path, filename), 'r')
        json_remote_dataset = json.load(json_file)
        json_file.close()
        categories_remote = [category for category in json_remote_dataset['categories']
                             if category['name'] in selected_categories]
        category_ids = [category['id'] for category in categories_remote]

        labels_remote = [label for label in json_remote_dataset['annotations'] if label['category_id'] in category_ids]
        del json_remote_dataset

        image_remote_ids = [label['image_id'] for label in labels_remote]
    except FileNotFoundError:
        raise errors.InternalError(f'Filename {filename} not found for datasource {datasource_key}')

    return len(set(image_remote_ids))
