from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field
from utils import MongoModel

from authentication.models import Scope


class User(MongoModel):
    id: str = Field(alias='_id')
    email: str = None
    name: str
    created_at: datetime
    is_verified: bool
    is_admin: bool
    tier: str = 'standard'
    scope: Optional[Scope] = None
    avatar: Optional[str] = None
    phone: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    is_public: Optional[bool] = True


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
