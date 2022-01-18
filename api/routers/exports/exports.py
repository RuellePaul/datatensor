from datetime import datetime
from uuid import uuid4

from fastapi import APIRouter, Depends

import errors
from config import Config
from dependencies import logged_user
from routers.datasets.core import find_dataset
from routers.exports.core import process_export
from routers.exports.models import *
from routers.tasks.models import Task, TaskType, TaskStatus
from routers.users.models import User
from utils import parse

db = Config.db

exports = APIRouter()


@exports.get('/', response_model=Export)
def get_export(dataset_id, user: User = Depends(logged_user)):
    """
    Process dataset export.
    """
    dataset = find_dataset(dataset_id, include_categories=True)

    if not dataset.is_public and dataset.user_id != user.id:
        raise errors.Forbidden(errors.NOT_YOUR_DATASET)

    task_id = str(uuid4())
    task = Task(
        id=task_id,
        user_id=dataset.user_id,
        dataset_id=dataset.id,
        type=TaskType('export'),
        created_at=datetime.now(),
        status=TaskStatus('pending'),
        progress=0
    )
    db.tasks.insert_one(task.mongo())

    response = process_export(dataset, task_id)
    return parse(response)
