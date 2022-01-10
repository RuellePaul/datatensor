from datetime import datetime
from typing import List
from uuid import uuid4

import errors
from config import Config
from routers.datasets.core import find_own_datasets
from routers.tasks.models import Task, TaskStatus
from worker import run_generator, run_augmentor

db = Config.db


def user_is_allowed_to_create_task(user, dataset_id, task_type) -> bool:
    if task_type == 'generator':
        if not user.is_admin:
            raise errors.Forbidden(errors.USER_NOT_ADMIN)

    if task_type == 'augmentor':
        if dataset_id is None:
            raise errors.Forbidden(errors.DATASET_NOT_FOUND)
        user_dataset_ids = [dataset.id for dataset in find_own_datasets(user.id)]
        if dataset_id not in user_dataset_ids:
            raise errors.Forbidden(errors.NOT_YOUR_DATASET)
        if task_type == 'augmentor':
            pipelines_count = db.pipelines.count({'dataset_id': dataset_id})
            if pipelines_count >= 1:
                raise errors.Forbidden(errors.TOO_MANY_PIPELINES)
    return True


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
        run_generator.delay(user.id, task.id, properties=task.properties)

    if task.type == 'augmentor':
        run_augmentor.delay(user.id, task.id, dataset_id, properties=task.properties)

    return task
