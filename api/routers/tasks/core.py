import asyncio
from datetime import datetime
from uuid import uuid4

import errors
from config import Config
from manager import task_manager
from routers.tasks.models import Task, TaskStatus
from utils import parse

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


def find_tasks():
    return list(db.tasks.find())


def find_users_tasks(user):
    return list(db.tasks.find({'user_id': user.id}))


def insert_task(user, dataset_id, task_type, properties):
    from app import scheduler

    _check_user_allowed_to_create_task(user, dataset_id, task_type)

    task = Task(
        id=str(uuid4()),
        user_id=user.id,
        dataset_id=dataset_id,
        type=task_type,
        created_at=datetime.now(),
        status=TaskStatus('pending'),
        progress=0,
        properties=properties
    )
    db.tasks.insert_one(parse(task.mongo()))

    @scheduler.scheduled_job('date',
                             id=task.id,
                             run_date=datetime.now(),
                             max_instances=1)
    def scheduled_task():
        asyncio.run(task_manager.run_task(task))

    return task
