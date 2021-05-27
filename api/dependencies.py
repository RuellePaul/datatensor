from fastapi import Header

from authentication.core import verify_access_token


async def logged_user(authorization: str = Header(...)):
    user = verify_access_token(access_token=authorization)
    return user
