from fastapi import APIRouter, Depends

from dependencies import logged_user
from routers.notifications.core import remove_notifications
from routers.users.models import User

notifications = APIRouter()


@notifications.delete('/')
async def delete_notifications(user: User = Depends(logged_user)):
    """
    Fetch notifications of logged user
    """
    remove_notifications(user.id)
