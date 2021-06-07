from fastapi import APIRouter, Depends

import errors
from dependencies import logged_user
from logger import logger

from authentication import core
from authentication.models import *
from config import Config
from routers.notifications.core import insert_notification
from routers.notifications.models import NotificationPostBody, NotificationType
from routers.users.models import User
from utils import parse, password_context

auth = APIRouter()


@auth.post('/login', response_model=AuthResponse)
async def do_login(payload: AuthLoginBody):
    """
    Login workflow (email + password)
    """
    user_id = core.user_id_hash(payload.email)
    user = core.user_with_password_from_user_id(user_id)
    if not user:
        raise errors.InvalidAuthentication('Invalid email or password')

    user_password = bytes(user.password, 'utf-8')
    if not password_context.verify(payload.password, user_password):
        raise errors.InvalidAuthentication('Invalid email or password')

    logger.info(f'Logged in as `{payload.email}`')

    access_token = core.encode_access_token(user_id)
    response = {
        'accessToken': access_token,
        'user': user
    }

    return parse(response)


@auth.post('/register', response_model=AuthResponse)
async def do_register(payload: AuthRegisterBody):
    """
    Register workflow (email + password)
    """
    core.check_captcha(payload.recaptcha)

    email = payload.email

    user_id = core.user_id_hash(email)
    user = core.user_from_user_id(user_id)

    if user:
        raise errors.Forbidden(f'User `{email}` already exists')

    if Config.ENVIRONMENT == 'development' and payload.email == 'test@datatensor.io':
        activation_code = 'test_activation_code'
    else:
        activation_code = core.generate_activation_code()
    core.send_activation_code(email, activation_code)
    user = core.register_user(user_id, payload.name, email, payload.password, activation_code)

    if user.is_verified:
        notification = NotificationPostBody(type=NotificationType('REGISTRATION'))
    else:
        notification = NotificationPostBody(type=NotificationType('EMAIL_CONFIRM_REQUIRED'))
    insert_notification(user_id=user_id, notification=notification)

    logger.info(f'Registered user `{email}`')

    access_token = core.encode_access_token(user_id)
    response = {
        'accessToken': access_token,
        'user': user
    }

    return parse(response)


@auth.post('/unregister')
async def do_unregister(user: User = Depends(logged_user)):
    """
    Unregister logged user
    """
    core.unregister_user(user.id)
    logger.info(f'Unregister user `{user.email}`')


@auth.get('/me')
async def me(user: User = Depends(logged_user)):
    """
    Return user from access token
    """
    return parse(user)


@auth.post('/email-confirmation', response_model=AuthResponse)
async def do_email_confirmation(payload: AuthEmailConfirmBody):
    """
    Validates the code in the link provided in email body
    """

    user = core.verify_user_email(payload.activation_code)
    access_token = core.encode_access_token(user.id)

    notification = NotificationPostBody(type=NotificationType('EMAIL_CONFIRM_DONE'))
    insert_notification(user_id=user.id, notification=notification)

    logger.info(f"Verified email `{user.email}`")

    response = {
        'accessToken': access_token,
        'user': {
            **user.mongo(),
            'is_verified': True
        }
    }
    return parse(response)
