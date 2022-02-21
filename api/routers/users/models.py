from typing import Any, List

from pydantic import BaseModel

from authentication.models import User


class UserWithPassword(User):
    password: Any


class UsersResponse(BaseModel):
    users: List[User] = []


class UserResponse(BaseModel):
    user: User


class UserUpdateProfileBody(BaseModel):
    city: str
    country: str
    is_public: bool
    name: str
    phone: str


class UserUpdatePasswordBody(BaseModel):
    password: str
    new_password: str


class UserDeleteBody(BaseModel):
    user_ids: List[str]
