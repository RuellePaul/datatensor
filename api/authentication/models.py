from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field, HttpUrl

from utils import MongoModel


class Scope(str, Enum):
    github = 'github'
    google = 'google'
    stackoverflow = 'stackoverflow'


class User(MongoModel):
    id: str = Field()
    email: Optional[str] = None  # github oauth users doesn't have an email
    name: Optional[str] = None  # github users can have a non specified name
    created_at: datetime
    is_verified: bool
    is_admin: bool
    scope: Optional[Scope] = None
    avatar: Optional[str] = None
    phone: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    is_public: Optional[bool] = True


class AuthLoginBody(BaseModel):
    email: str
    password: str


class AuthRegisterBody(BaseModel):
    email: str
    password: str
    name: str
    recaptcha: str


class AuthSendPasswordRecoveryBody(BaseModel):
    email: str
    recaptcha: str


class AuthResetPasswordBody(BaseModel):
    new_password: str
    recovery_code: str


class AuthEmailConfirmBody(BaseModel):
    activation_code: str


class AuthResponse(BaseModel):
    user: dict
    accessToken: str


class OAuthAuthorizationResponse(BaseModel):
    authorization_url: HttpUrl


class OAuthCallbackBody(BaseModel):
    code: str
    scope: Scope
