from typing import Optional, Union

from fastapi import Depends, Header, Request

import errors
from authentication.core import verify_access_token
from config import Config
from routers.datasets.core import find_dataset
from routers.datasets.models import Dataset
from routers.users.models import User


def get_access_token(authorization: Optional[str] = Header(None)) -> Union[str, None]:
    return authorization


def logged_user(access_token: str = Depends(get_access_token)) -> User:
    user = verify_access_token(access_token=access_token)
    return user


def logged_admin(user: User = Depends(logged_user)) -> User:
    if user.id not in Config.ADMIN_USER_IDS:
        raise errors.Forbidden('Auth', errors.USER_NOT_ADMIN)
    return user


def dataset_belongs_to_user(dataset_id, user: User = Depends(logged_user)) -> Dataset:
    dataset = find_dataset(dataset_id)
    if dataset.user_id != user.id:
        raise errors.Forbidden('Auth', errors.NOT_YOUR_DATASET)
    return Dataset.parse_obj(dataset)


def get_ip_address(request: Request, x_forwarded_for: Union[str, None] = Header(None)) -> Union[str, None]:
    print(dict(request.headers))
    if Config.ENVIRONMENT == 'development':
        return '127.0.0.1'
    return x_forwarded_for
