from datetime import datetime

from config import Config
from routers.datasets.models import DatasetExtended
from routers.exports.models import Export
from routers.images.core import find_all_images
from utils import parse, update_task

db = Config.db


def process_export(dataset: DatasetExtended, task_id) -> Export:
    update_task(task_id, status='active', progress=0)
    export = Export.parse_obj({
        **parse(dataset),
        'images': find_all_images(dataset.id, include_labels=True, task_id=task_id)
    })
    db.datasets.find_one_and_update({'_id': dataset.id},
                                    {'$set': {'exported_at': datetime.now()}})
    update_task(task_id, status='success', progress=1, ended_at=datetime.now())
    return export
