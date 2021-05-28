import os
import json
import zipfile

import requests

import errors
from config import Config


db = Config.db


ANNOTATIONS_CONFIG = {
    'coco2014': {
        'download_url': 'http://images.cocodataset.org/annotations/annotations_trainval2014.zip',
        'filename': 'instances_val2014.json'
    },
    'coco2015': {
        'download_url': 'http://images.cocodataset.org/annotations/annotations_trainval2015.zip',
        'filename': 'instances_val2015.json'
    }
}


def find_datasources():
    return Config.DATASOURCES


def find_categories(datasource_categories):
    pass


def _download_annotations(datasource_key):
    url = ANNOTATIONS_CONFIG[datasource_key]['download_url']
    response = requests.get(url, stream=True)

    datasource_path = os.path.join(Config.DATASOURCES_PATH, datasource_key)

    zip_path = os.path.join(datasource_path, f'{datasource_key}.zip')
    with open(zip_path, 'wb') as fd:
        for chunk in response.iter_content(chunk_size=128):
            fd.write(chunk)

    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(datasource_path)

    os.remove(zip_path)


def main(datasource_key):
    if not os.path.exists(Config.DATASOURCES_PATH):
        os.mkdir(Config.DATASOURCES_PATH)

    datasource_path = os.path.join(Config.DATASOURCES_PATH, datasource_key)
    if not os.path.exists(datasource_path):
        os.mkdir(datasource_path)

    try:
        annotations_path = os.path.join(datasource_path, 'annotations')
        if not os.path.exists(annotations_path):
            _download_annotations(datasource_key)
    except Exception as e:
        raise errors.InternalError(f'download of {datasource_key} failed, {str(e)}')

    json_file = open(os.path.join(annotations_path, ANNOTATIONS_CONFIG[datasource_key]['filename']), 'r')
    json_remote_dataset = json.load(json_file)

    json_file.close()

    images_remote_dataset = json_remote_dataset['images'][:image_count]
    categories_remote_dataset = json_remote_dataset['categories']
    labels_remote_dataset = json_remote_dataset['annotations']
    del json_remote_dataset

    categories = [{
        '_id': str(uuid4()),
        '_internal_id': category['id'],
        'dataset_id': dataset_id,
        'name': category['name'],
        'supercategory': category['supercategory']
    } for category in categories_remote_dataset]

    dataset = dict(_id=ObjectId(dataset_id),
                   user_id=user_id,
                   created_at=datetime.now().isoformat(),
                   name='COCO 2014',
                   description=f"Official COCO dataset, with {len(categories)} categories.",
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
        executor.map(process_image,
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
        Config.db.datasets.find_one_and_update({'_id': ObjectId(dataset_id)}, {'$set': {'image_count': image_count}})
    return
