from pydantic import BaseModel


class AuthLoginBody(BaseModel):
    email: str
    password: str


class AuthRegisterBody(BaseModel):
    email: str
    password: str
    name: str
    recaptcha: str


class AuthEmailConfirmBody(BaseModel):
    activation_code: str


class AuthResponse(BaseModel):
    user: dict
    accessToken: str


class OAuthAuthorizationResponse(BaseModel):
    authorization_url: str


class OAuthCallbackPayload(BaseModel):
    code: str
    scope: str


