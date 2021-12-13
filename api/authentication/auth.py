from fastapi import APIRouter, Depends

import errors
from authentication import core
from authentication.models import *
from dependencies import logged_user
from logger import logger
from routers.notifications.core import insert_notification
from routers.notifications.models import NotificationPostBody, NotificationType
from routers.users.core import find_user_by_email
from routers.users.models import User
from utils import parse, password_context

auth = APIRouter()


@auth.post('/login', response_model=AuthResponse)
def do_login(payload: AuthLoginBody):
    """
    Login workflow (email + password)
    """
    user_id = core.user_id_hash(payload.email)
    user = core.user_with_password_from_user_id(user_id)
    if not user:
        raise errors.InvalidAuthentication(errors.INVALID_CREDENTIALS)

    user_password = bytes(user.password, 'utf-8')
    if not password_context.verify(payload.password, user_password):
        raise errors.InvalidAuthentication(errors.INVALID_CREDENTIALS)

    logger.info(f'Logged in as `{payload.email}`')

    access_token = core.encode_access_token(user_id)
    response = {
        'accessToken': access_token,
        'user': user
    }

    return parse(response)


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
        raise errors.Forbidden(errors.USER_ALREADY_EXISTS)

    activation_code = core.generate_code()

    core.send_email_with_activation_code(email, activation_code)
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


@auth.post('/forgot-password')
def do_forgot_password(payload: AuthForgotPasswordBody):
    """
    Forgot password workflow (send recovery link)
    """
    core.check_captcha(payload.recaptcha)

    email = payload.email
    if not find_user_by_email(email):
        return
    recovery_code = core.generate_code()
    core.store_recovery_code(email, recovery_code)
    core.send_email_with_recovery_link(email, recovery_code)


@auth.get('/me')
def me(user: User = Depends(logged_user)):
    """
    Return user from access token
    """
    return parse(user)


@auth.post('/email-confirmation', response_model=AuthResponse)
def do_email_confirmation(payload: AuthEmailConfirmBody):
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


@auth.post('/unregister')
def do_unregister(user: User = Depends(logged_user)):
    """
    Unregister logged user
    """
    core.unregister_user(user.id)
    logger.info(f'Unregister user `{user.email}` (scope: {user.scope})')
