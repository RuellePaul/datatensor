import json
import os
import zipfile

import requests

import errors
from config import Config

ANNOTATIONS_CONFIG = {
    'coco': {
        'download_url': 'http://images.cocodataset.org/annotations/annotations_trainval2014.zip',
        'filename': 'coco.zip'
    }
}


def _download_annotations(dataset_name):
    url = ANNOTATIONS_CONFIG[dataset_name]['download_url']
    response = requests.get(url, stream=True)

    dataset_path = os.path.join(Config.DEFAULT_DATASETS_PATH, dataset_name)

    zip_path = os.path.join(dataset_path, ANNOTATIONS_CONFIG[dataset_name]['filename'])
    with open(zip_path, 'wb') as fd:
        for chunk in response.iter_content(chunk_size=128):
            fd.write(chunk)

    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(dataset_path)


def dataset_generation(dataset_name):
    dataset_id = 'iuerghzief'

    if Config.db.datasets.find_one({'id': dataset_id}):
        raise errors.Forbidden(f'Dataset {dataset_name} is already built')

    dataset_path = os.path.join(Config.DEFAULT_DATASETS_PATH, dataset_name)
    if not os.path.exists(dataset_path):
        os.mkdir(dataset_path)

    zip_path = os.path.join(dataset_path, ANNOTATIONS_CONFIG[dataset_name]['filename'])
    if not os.path.exists(zip_path):
        _download_annotations(dataset_name)

    # TODO : extraire le json du download (annotations)
    annotations_path = 'instances_val2014.json'
    json_file = open(annotations_path, 'r')
    annotations = json.load(json_file)

    '''
    for filename in ...:
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
                   dataset_name=dataset_name)

    Config.db.datasets.insert_one(dataset)
    Config.db.images.insert_many(images)
    '''


if __name__ == '__main__':
    dataset_generation('coco')
