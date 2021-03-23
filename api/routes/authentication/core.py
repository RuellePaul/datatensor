import functools
import hashlib
import random
import string
from datetime import datetime, timedelta

import jwt
import requests
from flask import request
from flask_bcrypt import generate_password_hash
from oauthlib.oauth2 import WebApplicationClient
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

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

    user = Config.db.users.find_one({'id': user_id}, {'_id': 0, 'password': 0})
    if not user:
        raise errors.InvalidAuthentication("User doesn't exists")
    if not user.get('is_verified'):
        raise errors.Forbidden('User must verify email')

    return user_id


def require_authorization(blueprints):
    def authorized():
        if request.method in ['GET', 'POST', 'PUT', 'DELETE']:
            verify_access_token(request.headers.get('Authorization'))

    for blueprint in blueprints:
        blueprint.before_request(authorized)


def admin_guard(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        if request.method in ['GET', 'POST', 'PUT', 'DELETE']:
            user_id = verify_access_token(request.headers.get('Authorization'))
            if user_id not in Config.ADMIN_USER_IDS:
                raise errors.Forbidden('Not an admin user')
        result = func(*args, **kwargs)
        return result

    return wrapper


def require_admin(blueprints):
    def admin_authorized():
        if request.method in ['GET', 'POST', 'PUT', 'DELETE']:
            user_id = verify_access_token(request.headers.get('Authorization'))
            if user_id not in Config.ADMIN_USER_IDS:
                raise errors.Forbidden('Not an admin user')

    for blueprint in blueprints:
        blueprint.before_request(admin_authorized)


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


def generate_activation_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=32))


def register_user(user_id, name, email, password, activation_code):
    user = dict(id=user_id,
                created_at=datetime.now().isoformat(),
                email=email,
                name=name,
                is_admin=user_id in Config.ADMIN_USER_IDS,
                avatar=None,
                tier='premium',
                is_verified=False)
    encrypted_password = generate_password_hash(password).decode('utf-8')
    Config.db.users.insert_one({
        **user,
        'name': encrypt_field(user['name']),
        'email': encrypt_field(user['email']),
        'password': encrypt_field(encrypted_password),
        'activation_code': activation_code
    })
    return user


def register_user_from_profile(profile, scope):
    user_id = user_id_from_profile(profile, scope)

    if scope == 'github':
        user = dict(id=user_id,
                    created_at=datetime.now().isoformat(),
                    email=None,
                    name=profile.get('name'),
                    is_admin=user_id in Config.ADMIN_USER_IDS,
                    avatar=profile.get('avatar_url'),
                    tier='premium',
                    scope=scope,
                    is_verified=True)

    elif scope == 'google':
        user = dict(id=user_id,
                    created_at=datetime.now().isoformat(),
                    email=profile.get('email'),
                    name=profile.get('name'),
                    is_admin=user_id in Config.ADMIN_USER_IDS,
                    avatar=profile.get('picture'),
                    tier='premium',
                    scope=scope,
                    is_verified=True)

    elif scope == 'stackoverflow':
        user = dict(id=user_id,
                    created_at=datetime.now().isoformat(),
                    email=None,
                    name=profile['items'][0]['display_name'],
                    is_admin=user_id in Config.ADMIN_USER_IDS,
                    avatar=profile['items'][0]['profile_image'],
                    tier='premium',
                    scope=scope,
                    is_verified=True)
    else:
        raise ValueError('Invalid scope')

    Config.db.users.insert_one({
        **user,
        'id': user['id'],
        'name': encrypt_field(user['name']),
        'email': encrypt_field(user['email']) if user.get('email') else None,
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


def send_activation_code(email, activation_code):
    if Config.ENVIRONMENT == 'development':
        raise errors.Forbidden('Not available in dev environment')

    subject = "Welcome to Datatensor ! Confirm your email"
    html_content = f"""
        <h2>You're on your way!</h2><br/>
        <h4>Let's confirm your email address.</h4><br/>
        <h5>By clicking on the following link, you are confirming your email address.</h5><br/>
        {Config.UI_URL}/email-confirmation?activation_code={activation_code}
   """

    message = Mail(
        from_email='noreply@test.datatensor.io',
        to_emails=email,
        subject=subject,
        html_content=html_content
    )
    try:
        sg = SendGridAPIClient(Config.SENDGRID_API_KEY)
        sg.send(message)
    except Exception as e:
        raise errors.InternalError(f'Unable to send email with SendGrid | {str(e)}')


def verify_user_email(user, activation_code):
    if user.get('is_verified'):
        raise errors.BadRequest(f"User already verified")

    if user.get('activation_code') != activation_code:
        raise errors.Forbidden('Invalid code provided')

    Config.db.users.find_one_and_update({'id': user['id']},
                                        {'$set': {'is_verified': True, 'activation_code': None}})
