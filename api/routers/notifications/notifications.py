from fastapi import APIRouter, Depends

from dependencies import logged_user
from logger import logger
from routers.notifications.core import read_notifications, remove_notifications
from routers.users.models import User

notifications = APIRouter()


@notifications.patch('/read')
def patch_notifications(user: User = Depends(logged_user)):
    """
    Fetch notifications of logged user
    """
    read_notifications(user.id)
    logger.notify('Notifications', f'Read notifications for user `{user.id}`')


@notifications.delete('/')
def delete_notifications(user: User = Depends(logged_user)):
    """
    Delete notifications of logged user
    """
    remove_notifications(user.id)
    logger.notify('Notifications', f'Remove notifications for user `{user.id}`')
