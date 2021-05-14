from datetime import datetime

import errors
from authentication.core import verify_access_token
from config import Config

db = Config.db


def _check_user_allowed_to_create_task(user, dataset_id, task_type):
    user_datasets = db.datasets.find({'user_id': user['_id']})
    user_dataset_ids = [dataset['_id'] for dataset in user_datasets]
    if dataset_id not in user_dataset_ids:
        raise errors.Forbidden(f"Dataset {dataset_id} does not belong to user {user['_id']}")

    if task_type == 'generator' and not user['is_admin']:
        raise errors.Forbidden(f"Task `generator` is admin only")


def find_tasks(user_id, dataset_id, offset, limit):
    user = verify_access_token()
    if dataset_id:
        if not user['is_admin']:
            return list(db.tasks.find({'user_id': user['_id'], 'dataset_id': dataset_id}).skip(offset).limit(limit))
        return list(db.tasks.find({'dataset_id': dataset_id}).skip(offset).limit(limit))

    if user_id:
        if not user['is_admin']:
            return list(db.tasks.find({'user_id': user['_id']}).skip(offset).limit(limit))
        return list(db.tasks.find({'user_id': user_id}).skip(offset).limit(limit))

    else:
        if not user['is_admin']:
            raise errors.Forbidden()
        return list(db.tasks.find().skip(offset).limit(limit))


def insert_task(dataset_id, task_type):
    user = verify_access_token(verified=True)

    _check_user_allowed_to_create_task(user, dataset_id, task_type)

    task = dict(
        user_id=user['_id'],
        dataset_id=dataset_id,
        type=task_type,
        created_at=datetime.now(),
        status='pending',
        progress=0
    )
    db.tasks.insert_one(task)
