from fastapi import APIRouter, Depends

from dependencies import logged_user
from routers.tasks.core import find_tasks, insert_task
from routers.tasks.models import *
from routers.users.models import User
from utils import parse

tasks = APIRouter()


@tasks.get('/', response_model=TasksResponse)
async def get_tasks(dataset_id=None, user: User = Depends(logged_user), offset: int = 0, limit: int = 0):
    """
    Fetch paginated labels list of tasks.
    """
    result = find_tasks(user, dataset_id, offset, limit)
    response = {'tasks': result}
    return parse(response)


@tasks.post('/', response_model=TaskResponse)
async def post_task(payload: TaskPostBody, dataset_id=None, user: User = Depends(logged_user)):
    """
    Create a new pending task
    """
    result = insert_task(user, dataset_id, payload.type, payload.properties)
    response = {'task': result}
    return parse(response)
