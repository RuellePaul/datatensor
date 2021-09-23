import uuid
from typing import Dict, List

from api import errors
from api.config import Config
from api.routers.labels.models import Label

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

db = Config.db


def regroup_labels_by_category(labels: List[Label]) -> Dict[str, int]:
    result = {}
    for label in labels:
        if label.category_id in result.keys():
            result[label.category_id] += 1
        else:
            result[label.category_id] = 1
    return result


def merge_regrouped_labels(old, new) -> Dict[str, int]:
    result = new
    for category_id, labels_count in old.items():
        if category_id in result.keys():
            result[category_id] -= labels_count
        else:
            result[category_id] = -labels_count
    return result


def find_labels(image_id, offset=0, limit=0) -> List[Label]:
    labels = list(db.labels.find({'image_id': image_id}).skip(offset).limit(limit))
    if labels is None:
        raise errors.NotFound(errors.LABEL_NOT_FOUND)
    return [Label.from_mongo(label) for label in labels]


def find_label(image_id, label_id) -> Label:
    label = db.labels.find_one({'_id': label_id,
                                'image_id': image_id})
    if label is None:
        raise errors.NotFound(errors.LABEL_NOT_FOUND)
    return Label.from_mongo(label)


def replace_labels(image_id, labels) -> Dict[str, int]:
    # Find current image labels
    old_labels = find_labels(image_id)

    # Delete these labels
    db.labels.delete_many({'image_id': image_id})

    # Update labels_count on associated categories
    old = regroup_labels_by_category(old_labels)
    new = regroup_labels_by_category(labels)
    merged = merge_regrouped_labels(old, new)
    for category_id, labels_count in merged.items():
        db.categories.find_one_and_update(
            {'_id': category_id},
            {'$inc': {'labels_count': labels_count}}
        )

    # Insert new labels
    if labels:
        db.labels.insert_many([{**label.dict(),
                                'image_id': image_id,
                                '_id': str(uuid.uuid4())} for label in labels])

    return merged
