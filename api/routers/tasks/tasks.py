from fastapi import APIRouter, Depends

from api.dependencies import logged_user
from api.routers.tasks.core import insert_task
from api.routers.tasks.models import *
from api.routers.users.models import User
from api.utils import parse

tasks = APIRouter()


@tasks.post('/', response_model=TaskResponse)
async def post_task(payload: TaskPostBody, dataset_id=None, user: User = Depends(logged_user)):
    """
    Create a new pending task
    """
    response = {'task': insert_task(user, dataset_id, payload.type, payload.properties)}
    return parse(response)
