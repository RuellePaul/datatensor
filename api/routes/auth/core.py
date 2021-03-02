import hashlib
from datetime import datetime, timedelta

import jwt
import requests
from flask import request
from oauthlib.oauth2 import WebApplicationClient

import errors
from config import Config
from utils import encrypt_field


# Token
def encode_access_token(user_id):
    payload = {'user_id': user_id, 'exp': datetime.utcnow() + timedelta(minutes=Config.SESSION_DURATION_IN_MINUTES)}
    return jwt.encode(payload, Config.ACCESS_TOKEN_KEY, algorithm='HS256')


def verify_access_token(access_token):
    if not access_token:
        raise errors.InvalidAuthentication

    try:
        user_id = jwt.decode(access_token, Config.ACCESS_TOKEN_KEY, algorithms='HS256').get('user_id')
        if not user_id:
            raise errors.InvalidAuthentication
    except jwt.exceptions.ExpiredSignatureError:
        raise errors.ExpiredAuthentication

    if not Config.db.users.find_one({'id': user_id}, {'_id': 0}):
        raise errors.InvalidAuthentication


def protect_blueprint(blueprint):
    def authorized():
        if request.method in ['GET', 'POST', 'PUT', 'DELETE']:
            verify_access_token(request.cookies.get('access_token'))

    blueprint.before_request(authorized)


# User related

def authorization_url_from_scope(scope):
    client = WebApplicationClient(Config.OAUTH[scope]['CLIENT_ID'])
    authorization_url = client.prepare_request_uri(
        Config.OAUTH[scope]['AUTHORIZATION_URL'],
        redirect_uri=f'{Config.UI_URL}/oauthcallback/{scope}',
        scope=Config.OAUTH[scope]['SCOPES']
    )
    return authorization_url


def profile_from_code(code, scope):
    client = WebApplicationClient(Config.OAUTH[scope]['CLIENT_ID'])
    token_url, headers, body = client.prepare_token_request(
        Config.OAUTH[scope]['TOKEN_URL'],
        redirect_url=f"{Config.UI_URL}/oauthcallback/{scope}",
        code=code
    )
    response = requests.post(
        token_url,
        headers=headers,
        data=f'''{body}{f"&client_secret={Config.OAUTH[scope]['CLIENT_SECRET']}"
        if scope == 'stackoverflow' else ''}''',
        auth=((Config.OAUTH[scope]['CLIENT_ID'], Config.OAUTH[scope]['CLIENT_SECRET'])
              if scope != 'stackoverflow' else None),
    )
    client.parse_request_body_response(response.text)
    uri, headers, body = client.add_token(Config.OAUTH[scope]['USER_URL'])
    profile = requests.get(uri, headers=headers, data=body, params={
        'access_token': response.json()['access_token'],
        'key': Config.OAUTH[scope]['KEY']
    } if scope == 'stackoverflow' else {}).json()
    return profile


def user_id_from_profile(profile, scope):
    if scope == 'github':
        oauth_id = profile['node_id']
    elif scope == 'google':
        oauth_id = profile['sub']
    elif scope == 'stackoverflow':
        oauth_id = profile['items'][0]['user_id']
    else:
        raise ValueError('Invalid scope')

    user_id = user_id_hash(oauth_id)
    return user_id


def user_id_hash(identifier):
    user_id = hashlib.sha256(str(identifier).encode('utf-8')).hexdigest()
    return user_id


def user_from_user_id(user_id):
    return Config.db.users.find_one({'id': user_id}, {'_id': 0})


def register_user_from_profile(profile, scope):
    user_id = user_id_from_profile(profile, scope)

    if scope == 'github':
        user = dict(id=user_id,
                    name=profile.get('name'),
                    avatar=profile.get('avatar_url'),
                    scope=scope)

    elif scope == 'google':
        user = dict(id=user_id,
                    name=profile.get('name'),
                    avatar=profile.get('picture'),
                    scope=scope)

    elif scope == 'stackoverflow':
        user = dict(id=user_id,
                    name=profile['items'][0]['display_name'],
                    avatar=profile['items'][0]['profile_image'],
                    scope=scope)
    else:
        raise ValueError('Invalid scope')

    Config.db.users.insert_one({
        **user,
        'id': user['id'],
        'name': encrypt_field(user['name'])
    })
    return user


def check_captcha(captcha):
    if not captcha:
        raise errors.Forbidden('Invalid captcha')
    url = 'https://www.google.com/recaptcha/api/siteverify'
    data = {
        'secret': Config.GOOGLE_CAPTCHA_SECRET_KEY,
        'response': captcha
    }
    r = requests.post(url, data=data)
    if r.status_code != 200:
        raise errors.InternalError('Invalid captcha')
    if not r.json().get('success'):
        raise errors.BadRequest('Invalid captcha')
