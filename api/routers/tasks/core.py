from datetime import datetime
from typing import List
from uuid import uuid4

import errors
from config import Config
from routers.tasks.models import Task, TaskStatus
from worker import generator

db = Config.db


def user_is_allowed_to_create_task(user, dataset_id, task_type):
    if user.is_admin:
        return True

    if task_type == 'generator':
        raise errors.Forbidden(errors.USER_NOT_ADMIN)

    user_datasets = db.datasets.find({'user_id': user.id})
    user_dataset_ids = [dataset['_id'] for dataset in user_datasets]
    if dataset_id not in user_dataset_ids:
        raise errors.Forbidden(errors.NOT_YOUR_DATASET)


def find_tasks() -> List[Task]:
    tasks = list(db.tasks.find())
    if tasks is None:
        raise errors.NotFound(errors.TASK_NOT_FOUND)
    return [Task.from_mongo(task) for task in tasks]


def find_users_tasks(user_id) -> List[Task]:
    tasks = list(db.tasks.find({'user_id': user_id}))
    if tasks is None:
        raise errors.NotFound(errors.TASK_NOT_FOUND)
    return [Task.from_mongo(task) for task in tasks]


def find_dataset_tasks(dataset_id) -> List[Task]:
    tasks = list(db.tasks.find({'dataset_id': dataset_id}))
    if tasks is None:
        raise errors.NotFound(errors.TASK_NOT_FOUND)
    return [Task.from_mongo(task) for task in tasks]


def insert_task(user, dataset_id, task_type, properties) -> Task:
    assert user_is_allowed_to_create_task(user, dataset_id, task_type)

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
    db.tasks.insert_one(task.mongo())

    if task.type == 'generator':
        generator.delay(task.user_id, task.id, properties=task.properties)

    return task
