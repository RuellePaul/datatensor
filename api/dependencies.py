from fastapi import Depends, Header

import errors
from authentication.core import verify_access_token
from config import Config
from routers.users.models import User


async def logged_user(authorization: str = Header(...)):
    user = verify_access_token(access_token=authorization)
    return user


async def logged_admin(user: User = Depends(logged_user)):
    if user.id not in Config.ADMIN_USER_IDS:
        raise errors.Forbidden(errors.USER_NOT_ADMIN)
    return user
