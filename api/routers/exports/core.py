from datetime import datetime

from config import Config
from routers.datasets.models import DatasetExtended
from routers.exports.models import Export
from routers.images.core import find_all_images, find_labels_from_image_ids
from utils import parse

db = Config.db


def process_export(dataset: DatasetExtended) -> Export:
    images = find_all_images(dataset.id)
    export = Export.parse_obj({
        **parse(dataset),
        'images': images,
        'labels': find_labels_from_image_ids([image.id for image in images])
    })
    db.datasets.find_one_and_update({'_id': dataset.id},
                                    {'$set': {'exported_at': datetime.now()}})
    return export
