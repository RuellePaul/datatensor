from fastapi import Depends, Header

from api import errors
from api.authentication.core import verify_access_token
from api.config import Config
from api.routers.datasets.core import find_dataset
from api.routers.datasets.models import Dataset
from api.routers.users.models import User


async def logged_user(authorization: str = Header(...)) -> User:
    user = verify_access_token(access_token=authorization)
    return user


async def logged_admin(user: User = Depends(logged_user)) -> User:
    if user.id not in Config.ADMIN_USER_IDS:
        raise errors.Forbidden(errors.USER_NOT_ADMIN)
    return user


async def dataset_belongs_to_user(dataset_id, user: User = Depends(logged_user)) -> Dataset:
    dataset = find_dataset(dataset_id)
    if dataset.user_id != user.id:
        raise errors.Forbidden(errors.NOT_YOUR_DATASET)
    return Dataset.parse_obj(dataset)
