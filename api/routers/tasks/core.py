import asyncio
from datetime import datetime
from uuid import uuid4

import errors
from authentication.core import verify_access_token
from config import Config
from manager import task_manager

db = Config.db


def _check_user_allowed_to_create_task(user, dataset_id, task_type):
    if user.is_admin:
        return

    if task_type == 'generator':
        raise errors.Forbidden(f"Task `generator` is admin only")

    user_datasets = db.datasets.find({'user_id': user.id})
    user_dataset_ids = [dataset['_id'] for dataset in user_datasets]
    if dataset_id not in user_dataset_ids:
        raise errors.Forbidden(f"Dataset {dataset_id} does not belong to user {user.id}")


def find_tasks(user_id, dataset_id, offset, limit):
    user = verify_access_token()
    if dataset_id:
        if not user.is_admin:
            return list(db.tasks.find({'user_id': user.id, 'dataset_id': dataset_id}).skip(offset).limit(limit))
        return list(db.tasks.find({'dataset_id': dataset_id}).skip(offset).limit(limit))

    if user_id:
        if not user.is_admin:
            return list(db.tasks.find({'user_id': user.id}).skip(offset).limit(limit))
        return list(db.tasks.find({'user_id': user_id}).skip(offset).limit(limit))

    else:
        if not user.is_admin:
            raise errors.Forbidden()
        return list(db.tasks.find().skip(offset).limit(limit))


def insert_task(dataset_id, task_type, properties):
    from app import scheduler

    user = verify_access_token(verified=True)

    _check_user_allowed_to_create_task(user, dataset_id, task_type)

    task = dict(
        user_id=user.id,
        dataset_id=dataset_id,
        type=task_type,
        created_at=datetime.now(),
        status='pending',
        progress=0,
        properties=properties
    )
    db.tasks.insert_one(task)

    @scheduler.scheduled_job('date',
                             id=f"{task['_id']}",
                             run_date=datetime.now(),
                             max_instances=1)
    def scheduled_task():
        asyncio.run(task_manager.run_task(task))

    return task
