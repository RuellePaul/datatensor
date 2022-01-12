from fastapi import APIRouter
from fastapi.responses import JSONResponse

from authentication import core
from authentication.models import *
from config import Config
from logger import logger
from routers.notifications.core import insert_notification
from routers.notifications.models import NotificationPostBody, NotificationType
from utils import parse

oauth = APIRouter()


@oauth.get('/authorization/{scope}', response_model=OAuthAuthorizationResponse)
def oauth_authorization(scope: str):
    """
    Fetch and return OAuth authorization url, depending on requested scope.
    """

    authorization_url = core.authorization_url_from_scope(scope)
    logger.info(f'Fetch OAuth authorization url for `{scope}`')

    response = {'authorization_url': authorization_url}
    return response


@oauth.post('/callback', response_model=AuthResponse)
def oauth_callback(payload: OAuthCallbackBody):
    """
    Using code provided by OAuth workflow, fetch profile depending on requested scope; register user if doesn't exists
    """

    scope = payload.scope

    profile = core.profile_from_code(payload.code, scope)
    user_id = core.user_id_from_profile(profile, scope)

    user = core.user_from_user_id(user_id)

    if not user:
        user = core.register_user_from_profile(profile, scope)
        notification = NotificationPostBody(type=NotificationType('REGISTRATION'))
        insert_notification(user_id, notification)
        logger.info(f'Registered `{user.name}` from `{scope}`')

    access_token = core.encode_access_token(user_id)
    response = JSONResponse(content={
        'user': parse(user),
        'accessToken': access_token
    })
    response.set_cookie(key='access_token',
                        value=access_token,
                        domain='datatensor.io' if Config.ENVIRONMENT == 'production' else None,
                        httponly=False,
                        secure=True,
                        samesite="lax")
    logger.info(f'Logged in as `{user.name}` from `{scope}`')

    return response
