from datetime import datetime
from uuid import uuid4

from config import Config
from routers.datasets.core import find_dataset
from routers.exports.models import Export
from routers.images.core import find_all_images
from routers.labels.core import find_labels
from routers.tasks.models import TaskExportProperties
from utils import update_task, parse, increment_task_progress

db = Config.db


def process_export(task_id, dataset_id):
    dataset = find_dataset(dataset_id)

    export_data = {
        **parse(dataset),
        'images': []
    }

    images = find_all_images(dataset.id)

    for image in images:
        export_data['images'].append({
            **parse(image),
            'labels': [{**parse(label)} for label in find_labels(image.id)]
        })
        increment_task_progress(task_id, 1 / len(images))

    export = Export(
        id=str(uuid4()),
        dataset_id=dataset_id,
        export_data=export_data,
    )

    db.exports.delete_many({'dataset_id': dataset_id})
    db.exports.insert_one(export.mongo())
    db.datasets.find_one_and_update({'_id': dataset_id},
                                    {'$set': {'exported_at': datetime.now()}})

    return export_data


def main(user_id, task_id, dataset_id, properties: TaskExportProperties):
    update_task(task_id, status='active')
    process_export(task_id, dataset_id)
