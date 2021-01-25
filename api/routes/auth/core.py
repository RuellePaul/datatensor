import hashlib

import requests
from oauthlib.oauth2 import WebApplicationClient

from config import Config


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


def user_from_user_id(user_id):
    return Config.db.users.find_one({'id': user_id}, {'_id': 0})


def user_id_from_profile(profile, scope):
    if scope == 'github':
        oauth_id = profile['node_id']
    elif scope == 'google':
        oauth_id = profile['sub']
    elif scope == 'stackoverflow':
        oauth_id = profile['items'][0]['user_id']
    else:
        raise ValueError('Invalid scope')

    user_id = hashlib.sha256(str(oauth_id).encode('utf-8')).hexdigest()
    return user_id


def register_user(profile, scope):
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

    Config.db.users.insert_one(user)
    del user['_id']
    return user
