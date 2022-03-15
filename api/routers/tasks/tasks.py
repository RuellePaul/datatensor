from fastapi import APIRouter, Depends

from dependencies import logged_user
from logger import logger
from routers.tasks.core import insert_task
from routers.tasks.models import *
from routers.users.models import User

tasks = APIRouter()


@tasks.post('/')
def post_task(payload: TaskPostBody, dataset_id=None, user: User = Depends(logged_user)):
    """
    Create a new pending task
    """
    insert_task(user, dataset_id, payload.type, payload.properties)
    logger.notify('Tasks', f'Add task `{payload.type}` for user `{user.id}`')
