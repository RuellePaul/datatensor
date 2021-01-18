from flask import Blueprint, request
from oauthlib.oauth2 import WebApplicationClient
from webargs import fields
from webargs.flaskparser import use_args

import errors
from config import Config
from logger import logger

login = Blueprint('login', __name__)


@login.route('/oauth/<website>')
def oauth_authorization(website):
    """
    This function return OAuth authorization url, depending on requested website.

    :return: authorization_url
    """

    if website == 'google':
        authorization_url = WebApplicationClient(Config.GOOGLE_CLIENT_ID).prepare_request_uri(
            Config.GOOGLE_AUTHORIZATION_ENDPOINT,
            redirect_uri=f'{Config.UI_URL}/oauthcallback',
            scope=['openid', 'email', 'profile'],
        )

    elif website == 'github':
        authorization_url = WebApplicationClient(Config.GITHUB_CLIENT_ID).prepare_request_uri(
            Config.GITHUB_AUTHORIZATION_ENDPOINT,
            redirect_uri=f'{Config.UI_URL}/oauthcallback',
            scope=['openid', 'email', 'profile'],
        )

    elif website == 'stackoverflow':
        authorization_url = WebApplicationClient(Config.STACKOVERFLOW_CLIENT_ID).prepare_request_uri(
            Config.STACKOVERFLOW_AUTHORIZATION_ENDPOINT,
            redirect_uri=f'{Config.UI_URL}/oauthcallback',
            scope=['openid', 'email', 'profile'],
        )

    else:
        raise errors.BadRequest('Wrong website provided')

    logger.info(f'Fetch OAuth authorization url for {website}')

    return authorization_url
