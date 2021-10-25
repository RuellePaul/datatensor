from fastapi import Depends, Header

import errors
from authentication.core import verify_access_token
from config import Config
from routers.datasets.core import find_dataset
from routers.datasets.models import Dataset
from routers.users.models import User


def logged_user(authorization: str = Header(...)) -> User:
    user = verify_access_token(access_token=authorization)
    return user


def logged_admin(user: User = Depends(logged_user)) -> User:
    if user.id not in Config.ADMIN_USER_IDS:
        raise errors.Forbidden(errors.USER_NOT_ADMIN)
    return user


def dataset_belongs_to_user(dataset_id, user: User = Depends(logged_user)) -> Dataset:
    dataset = find_dataset(dataset_id)
    if dataset.user_id != user.id:
        raise errors.Forbidden(errors.NOT_YOUR_DATASET)
    return Dataset.parse_obj(dataset)
