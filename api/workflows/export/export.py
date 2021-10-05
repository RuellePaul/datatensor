from api.config import Config
from api.routers.datasets.core import find_dataset
from api.routers.images.core import find_all_images
from api.routers.labels.core import find_labels

from api.routers.tasks.models import TaskExportProperties
from api.utils import update_task, parse, increment_task_progress

db = Config.db


def process_export(task_id, dataset_id):
    dataset = find_dataset(dataset_id)

    response = {
        **parse(dataset),
        'images': []
    }

    images = find_all_images(dataset.id)

    for image in images:
        response['images'].append({
            **parse(image),
            'labels': [{**parse(label)} for label in find_labels(image.id)]
        })
        increment_task_progress(task_id, 1 / len(images))

    return response


def main(user_id, task_id, dataset_id, properties: TaskExportProperties):
    update_task(task_id, status='active')
    process_export(task_id, dataset_id)
