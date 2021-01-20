import requests
import os
from flask import Blueprint, request
from oauthlib.oauth2 import WebApplicationClient
from webargs import fields
from webargs.flaskparser import use_args

import errors
from config import Config
from logger import logger

# Used to login with OAuth2 without https
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

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
            redirect_uri=f'{Config.UI_URL}/oauthcallback/{website}',
            scope=['openid', 'email', 'profile'],
        )

    elif website == 'github':
        authorization_url = WebApplicationClient(Config.GITHUB_CLIENT_ID).prepare_request_uri(
            Config.GITHUB_AUTHORIZATION_ENDPOINT,
            redirect_uri=f'{Config.UI_URL}/oauthcallback/{website}',
            scope=['openid', 'email', 'profile'],
        )

    elif website == 'stackoverflow':
        authorization_url = WebApplicationClient(Config.STACKOVERFLOW_CLIENT_ID).prepare_request_uri(
            Config.STACKOVERFLOW_AUTHORIZATION_ENDPOINT,
            redirect_uri=f'{Config.UI_URL}/oauthcallback/{website}'
        )

    else:
        raise errors.BadRequest('Wrong website provided')

    logger.info(f'Fetch OAuth authorization url for {website}')

    return authorization_url, 200


@login.route('/oauth/callback', methods=['POST'])
@use_args({
    'code': fields.Str(required=True),
    'website': fields.Str(required=True)
})
def oauth_callback(args):
    """
    This function

    :return:
    """

    if args['website'] == 'google':
        client = WebApplicationClient(Config.GOOGLE_CLIENT_ID)
        token_url, headers, body = client.prepare_token_request(
            Config.GOOGLE_TOKEN_ENDPOINT,
            redirect_url=f"{Config.UI_URL}/oauthcallback/{args['website']}",
            code=args['code']
        )
        response = requests.post(
            token_url,
            headers=headers,
            data=body,
            auth=(Config.GOOGLE_CLIENT_ID, Config.GOOGLE_CLIENT_SECRET),
        )
        client.parse_request_body_response(response.text)
        uri, headers, body = client.add_token(Config.GOOGLE_USER_ENDPOINT)
        user_info = requests.get(uri, headers=headers, data=body).json()

    if args['website'] == 'github':
        client = WebApplicationClient(Config.GITHUB_CLIENT_ID)
        token_url, headers, body = client.prepare_token_request(
            Config.GITHUB_TOKEN_ENDPOINT,
            redirect_url=f"{Config.UI_URL}/oauthcallback/{args['website']}",
            code=args['code']
        )
        response = requests.post(
            token_url,
            headers=headers,
            data=body,
            auth=(Config.GITHUB_CLIENT_ID, Config.GITHUB_CLIENT_SECRET),
        )
        client.parse_request_body_response(response.text)
        uri, headers, body = client.add_token(Config.GITHUB_USER_ENDPOINT)
        user_info = requests.get(uri, headers=headers, data=body).json()

    if args['website'] == 'stackoverflow':
        client = WebApplicationClient(Config.STACKOVERFLOW_CLIENT_ID)
        token_url, headers, body = client.prepare_token_request(
            Config.STACKOVERFLOW_TOKEN_ENDPOINT,
            redirect_url=f"{Config.UI_URL}/oauthcallback/{args['website']}",
            code=args['code']
        )
        response = requests.post(
            token_url,
            headers=headers,
            data=body + '&client_secret=' + Config.STACKOVERFLOW_CLIENT_SECRET
        )
        client.parse_request_body_response(response.text)
        uri, headers, body = client.add_token(Config.STACKOVERFLOW_USER_ENDPOINT)
        user_info = requests.get(uri, headers=headers, data=body, params={
            'access_token': response.json()['access_token'],
            'key': Config.STACKOVERFLOW_KEY
        }).json()

    print(user_info)

    return {}, 200
