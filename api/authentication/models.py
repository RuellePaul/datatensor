from enum import Enum

from pydantic import BaseModel, HttpUrl


class Scope(str, Enum):
    github = 'github'
    google = 'google'
    stackoverflow = 'stackoverflow'


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
