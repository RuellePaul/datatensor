from datetime import datetime

from config import Config
from routers.datasets.core import find_dataset
from routers.datasets.models import DatasetExtended
from routers.exports.models import Export
from routers.images.core import find_all_images
from utils import parse

db = Config.db


def process_export(dataset: DatasetExtended) -> Export:

    export = Export.parse_obj({
        **parse(dataset),
        'images': find_all_images(dataset.id, include_labels=True)
    })
    db.datasets.find_one_and_update({'_id': dataset.id},
                                    {'$set': {'exported_at': datetime.now()}})
    return export
