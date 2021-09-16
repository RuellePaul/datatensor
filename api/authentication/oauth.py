from fastapi import APIRouter, Depends

from api.authentication import core
from api.authentication.models import *
from api.dependencies import logged_user
from api.logger import logger
from api.routers.notifications.core import insert_notification
from api.routers.notifications.models import NotificationPostBody, NotificationType
from api.routers.users.models import User

oauth = APIRouter()


@oauth.get('/authorization/{scope}', response_model=OAuthAuthorizationResponse)
async def oauth_authorization(scope: str):
    """
    Fetch and return OAuth authorization url, depending on requested scope.
    """

    authorization_url = core.authorization_url_from_scope(scope)
    logger.info(f'Fetch OAuth authorization url for `{scope}`')

    response = {'authorization_url': authorization_url}
    return response


@oauth.post('/callback', response_model=AuthResponse)
async def oauth_callback(payload: OAuthCallbackBody):
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

    logger.info(f'Logged in as `{user.name}` from `{scope}`')

    access_token = core.encode_access_token(user_id)
    response = {
        'accessToken': access_token,
        'user': user
    }

    return response


@oauth.post('/unregister')
async def oauth_unregister(user: User = Depends(logged_user)):
    """
    Unregister logged user
    """
    core.unregister_user(user.id)
    logger.info(f'Unregister user `{user.email}` (scope : {user.scope})')
