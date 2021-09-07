from fastapi import APIRouter, Depends

from api.dependencies import logged_user
from api.routers.notifications.core import read_notifications, remove_notifications
from api.routers.users.models import User

notifications = APIRouter()


@notifications.patch('/read')
async def patch_notifications(user: User = Depends(logged_user)):
    """
    Fetch notifications of logged user
    """
    read_notifications(user.id)


@notifications.delete('/')
async def delete_notifications(user: User = Depends(logged_user)):
    """
    Fetch notifications of logged user
    """
    remove_notifications(user.id)
