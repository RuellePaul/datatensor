from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse, Response

import errors
from authentication import core
from authentication.models import *
from config import Config
from dependencies import get_access_token, logged_user
from logger import logger
from routers.notifications.core import insert_notification
from routers.notifications.models import NotificationPostBody, NotificationType
from routers.users.core import find_user_by_email, find_user_by_recovery_code, reset_user_password
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
        raise errors.InvalidAuthentication('Auth', errors.INVALID_CREDENTIALS)

    user_password = bytes(user.password, 'utf-8')
    if not password_context.verify(payload.password, user_password):
        raise errors.InvalidAuthentication('Auth', errors.INVALID_CREDENTIALS)

    access_token = core.encode_access_token(user_id)

    response = JSONResponse(content={
        'user': parse(user),
        'accessToken': access_token
    })
    response.set_cookie(key='access_token',
                        value=access_token,
                        domain='datatensor.io' if Config.ENVIRONMENT == 'production' else None,
                        httponly=True,
                        secure=True,
                        samesite="none")
    response.set_cookie(key='access_token',
                        value=access_token,
                        domain='app.datatensor.io' if Config.ENVIRONMENT == 'production' else None,
                        httponly=True,
                        secure=True,
                        samesite="none")
    response.set_cookie(key='access_token',
                        value=access_token,
                        domain='docs.datatensor.io' if Config.ENVIRONMENT == 'production' else None,
                        httponly=True,
                        secure=True,
                        samesite="none")

    logger.notify('Auth', f'Logged in as `{payload.email}`')

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
        raise errors.Forbidden('Auth', errors.USER_ALREADY_EXISTS)

    activation_code = core.generate_code()

    core.send_email_with_activation_code(email, activation_code)
    user = core.register_user(user_id, payload.name, email, payload.password, activation_code)

    if user.is_verified:
        notification = NotificationPostBody(type=NotificationType('REGISTRATION'))
    else:
        notification = NotificationPostBody(type=NotificationType('EMAIL_CONFIRM_REQUIRED'))
    insert_notification(user_id=user_id, notification=notification)

    access_token = core.encode_access_token(user_id)

    response = JSONResponse(content={
        'user': parse(user),
        'accessToken': access_token
    })
    response.set_cookie(key='access_token',
                        value=access_token,
                        domain='.datatensor.io' if Config.ENVIRONMENT == 'production' else None,
                        httponly=True,
                        secure=True,
                        samesite="lax" if Config.ENVIRONMENT == 'production' else "none")

    logger.notify('Auth', f'Registered user `{email}`')

    return response


@auth.post('/send-password-recovery-link')
def send_password_recovery_link(payload: AuthSendPasswordRecoveryBody):
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

    logger.notify('Auth', f'Send password recovery link to `{email}`')


@auth.post('/reset-password')
def do_reset_password(payload: AuthResetPasswordBody):
    """
    Forgot password workflow (reset password using recovery code)
    """
    new_password = payload.new_password
    recovery_code = payload.recovery_code

    user = find_user_by_recovery_code(recovery_code)
    reset_user_password(user, new_password)

    logger.notify('Auth', f'Send password recovery to user `{user.id}`')


@auth.get('/me', response_model=User)
def me(user: User = Depends(logged_user)):
    """
    Return user from access token
    """

    logger.notify('Auth', f'Fetch whoami for user `{user.id}`')

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

    response = JSONResponse(content={
        'user': parse({
            **user.mongo(),
            'is_verified': True
        }),
        'accessToken': access_token
    })
    response.set_cookie(key='access_token',
                        value=access_token,
                        domain='.datatensor.io' if Config.ENVIRONMENT == 'production' else None,
                        httponly=True,
                        secure=True,
                        samesite="lax" if Config.ENVIRONMENT == 'production' else "none")

    logger.notify('Auth', f'Verified email `{user.email}`')

    return response


@auth.post('/logout')
def do_logout(access_token: str = Depends(get_access_token)):
    """
    Logout logged user
    """
    response = Response()
    response.delete_cookie(key='access_token',
                           domain='.datatensor.io' if Config.ENVIRONMENT == 'production' else None)
    return response


@auth.post('/unregister')
def do_unregister(user: User = Depends(logged_user)):
    """
    Unregister logged user
    """
    core.unregister_user(user.id)
    logger.notify('Auth', f'Unregister user `{user.id}`')
