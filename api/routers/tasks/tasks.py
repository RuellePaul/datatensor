from fastapi import APIRouter, Depends

from dependencies import logged_user
from routers.tasks.core import insert_task
from routers.tasks.models import *
from routers.users.models import User
from utils import parse

tasks = APIRouter()


@tasks.post('/', response_model=TaskResponse)
def post_task(payload: TaskPostBody, dataset_id=None, user: User = Depends(logged_user)):
    """
    Create a new pending task
    """
    response = {'task': insert_task(user, dataset_id, payload.type, payload.properties)}
    return parse(response)
