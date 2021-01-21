import os

import requests
from flask import Blueprint
from oauthlib.oauth2 import WebApplicationClient
from webargs import fields
from webargs.flaskparser import use_args

from config import Config
from logger import logger

# Used to login with OAuth2 without https
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

login = Blueprint('login', __name__)


@login.route('/oauth/<website>')
def oauth_authorization(website):
    """
    This function returns OAuth authorization url, depending on requested website.

    :return: authorization_url
    """

    client = WebApplicationClient(Config.OAUTH[website]['CLIENT_ID'])
    authorization_url = client.prepare_request_uri(
        Config.OAUTH[website]['AUTHORIZATION_URL'],
        redirect_uri=f'{Config.UI_URL}/oauthcallback/{website}',
        scope=Config.OAUTH[website]['SCOPES']
    )

    logger.info(f'Fetch OAuth authorization url for {website}')

    return authorization_url, 200


@login.route('/oauth/callback', methods=['POST'])
@use_args({
    'code': fields.Str(required=True),
    'website': fields.Str(required=True)
})
def oauth_callback(args):
    """
    Using code provided by OAuth workflow, fetch user_info depending on requested website.

    :return: user
    """

    website = args['website']
    client = WebApplicationClient(Config.OAUTH[website]['CLIENT_ID'])
    token_url, headers, body = client.prepare_token_request(
        Config.OAUTH[website]['TOKEN_URL'],
        redirect_url=f"{Config.UI_URL}/oauthcallback/{args['website']}",
        code=args['code']
    )
    response = requests.post(
        token_url,
        headers=headers,
        data=f'''{body}{f"&client_secret={Config.OAUTH[website]['CLIENT_SECRET']}"
        if website == "stackoverflow" else ""}''',
        auth=((Config.OAUTH[website]['CLIENT_ID'], Config.OAUTH[website]['CLIENT_SECRET'])
              if website != 'stackoverflow' else None),
    )
    client.parse_request_body_response(response.text)
    uri, headers, body = client.add_token(Config.OAUTH[website]['USER_URL'])
    user_info = requests.get(uri, headers=headers, data=body, params={
        'access_token': response.json()['access_token'],
        'key': Config.OAUTH[website]['KEY']
    } if args['website'] == 'stackoverflow' else {}).json()

    return user_info, 200
