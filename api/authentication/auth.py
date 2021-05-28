from fastapi import APIRouter, Depends
from flask_bcrypt import check_password_hash

import errors
from dependencies import logged_user
from logger import logger

from authentication import core
from authentication.models import *
from routers.users.models import User

auth = APIRouter()


@auth.post('/login', response_model=AuthResponse)
def do_login(payload: AuthLoginBody):
    """
    Login workflow (email + password)
    """
    user_id = core.user_id_hash(payload.email)
    user = core.user_from_user_id(user_id)
    if not user:
        raise errors.InvalidAuthentication('Invalid email or password')

    user_password = bytes(user['password'], 'utf-8')
    if not check_password_hash(user_password, payload.password):
        raise errors.InvalidAuthentication('Invalid email or password')

    logger.info(f'Logged in as `{payload.email}`')

    access_token = core.encode_access_token(user_id)
    response = {
        'accessToken': access_token,
        'user': user
    }

    return response


@auth.post('/register', response_model=AuthResponse)
def do_register(payload: AuthRegisterBody):
    """
    Register workflow (email + password)
    """
    core.check_captcha(payload.recaptcha)

    email = payload.email

    user_id = core.user_id_hash(email)
    user = core.user_from_user_id(user_id)

    if user:
        raise errors.Forbidden(f'User `{email}` already exists')

    activation_code = core.generate_activation_code()
    core.send_activation_code(email, activation_code)
    user = core.register_user(user_id, payload.name, email, payload.password, activation_code)

    logger.info(f'Registered user `{email}`')

    access_token = core.encode_access_token(user_id)
    response = {
        'accessToken': access_token,
        'user': user
    }

    return response


@auth.get('/me')
def me(user: User = Depends(logged_user)):
    """
    Return user from access token
    """

    if not user:
        raise errors.ExpiredAuthentication
    response = {'user': user}
    return response


@auth.post('/email-confirmation', response_model=AuthResponse)
def do_email_confirmation(payload: AuthEmailConfirmBody):
    """
    Validates the code in the link provided in email body
    """

    user = core.verify_user_email(payload.activation_code)
    access_token = core.encode_access_token(user['_id'])

    logger.info(f"Verified email `{user['email']}`")

    response = {
        'accessToken': access_token,
        'user': {
            **user,
            'is_verified': True
        }
    }
    return response
