from fastapi import APIRouter, Depends

from dependencies import logged_user
from routers.notifications.core import find_notifications, remove_notifications
from routers.notifications.models import *
from routers.users.models import User
from utils import parse

notifications = APIRouter()


@notifications.get('/', response_model=NotificationsResponse)
async def get_notifications(user: User = Depends(logged_user), count: int = 0, limit: int = 0):
    """
    Fetch paginated notifications list of logged user
    """
    result = find_notifications(user.id, count, limit)
    response = {'notifications': parse(result)}
    return parse(response)


@notifications.delete('/')
async def delete_notifications(user: User = Depends(logged_user)):
    """
    Fetch notifications of logged user
    """
    remove_notifications(user.id)
