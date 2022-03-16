import hashlib
import random
import ssl
import string
from datetime import datetime, timedelta

import jwt
import oauthlib.oauth2.rfc6749.errors
import requests
from oauthlib.oauth2 import WebApplicationClient
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

import errors
from config import Config
from routers.datasets.core import remove_datasets
from routers.users.models import User, UserWithPassword
from utils import encrypt_field, password_context

# allow sendgrid email
ssl._create_default_https_context = ssl._create_unverified_context

db = Config.db


# Token
def encode_access_token(user_id):
    payload = {'user_id': user_id, 'exp': datetime.utcnow() + timedelta(minutes=Config.SESSION_DURATION_IN_MINUTES)}
    access_token = jwt.encode(payload, Config.ACCESS_TOKEN_KEY, algorithm='HS256')
    return access_token


def verify_access_token(access_token) -> User:
    if not access_token:
        raise errors.InvalidAuthentication()

    try:
        user_id = jwt.decode(access_token, Config.ACCESS_TOKEN_KEY, algorithms='HS256').get('user_id')
        if not user_id:
            raise errors.InvalidAuthentication()
    except jwt.exceptions.ExpiredSignatureError:
        raise errors.ExpiredAuthentication(data='ERR_EXPIRED')

    user = db.users.find_one({'_id': user_id}, {'password': 0})
    if not user:
        raise errors.InvalidAuthentication('Auth', errors.USER_NOT_FOUND)

    return User.from_mongo(user)


# User related
def authorization_url_from_scope(scope):
    client = WebApplicationClient(Config.OAUTH[scope]['CLIENT_ID'])
    authorization_url = client.prepare_request_uri(
        Config.OAUTH[scope]['AUTHORIZATION_URL'],
        redirect_uri=f'{Config.APP_URL}/oauthcallback/{scope}',
        scope=Config.OAUTH[scope]['SCOPES']
    )
    return authorization_url


def profile_from_code(code, scope):
    client = WebApplicationClient(Config.OAUTH[scope]['CLIENT_ID'])
    token_url, headers, body = client.prepare_token_request(
        Config.OAUTH[scope]['TOKEN_URL'],
        redirect_url=f"{Config.APP_URL}/oauthcallback/{scope}",
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
    try:
        client.parse_request_body_response(response.text)
    except oauthlib.oauth2.rfc6749.errors.OAuth2Error as e:
        raise errors.InternalError('OAuth', f'Cannot fetch OAuth2 profile : {str(e)}')
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


def google_profile_from_google_access_token(google_access_token):
    google_profile = jwt.decode(google_access_token, options={"verify_signature": False})
    return google_profile


def user_id_hash(identifier):
    user_id = hashlib.sha256(str(identifier).encode('utf-8')).hexdigest()
    return user_id


def user_from_user_id(user_id) -> User:
    return User.from_mongo(db.users.find_one({'_id': user_id}))


def user_with_password_from_user_id(user_id) -> UserWithPassword:
    return UserWithPassword.from_mongo(db.users.find_one({'_id': user_id}))


def user_from_activation_code(activation_code) -> User:
    return User.from_mongo(db.users.find_one({'activation_code': activation_code}))


def generate_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=32))


def register_user(user_id, name, email, password, activation_code) -> User:
    user = User(id=user_id,
                created_at=datetime.now(),
                email=email,
                name=name,
                is_admin=user_id in Config.ADMIN_USER_IDS,
                avatar=None,
                is_verified=False)
    encrypted_password = password_context.hash(password)
    db.users.insert_one({
        **user.mongo(),
        'email': user.email,
        'password': encrypt_field(encrypted_password),
        'activation_code': activation_code
    })
    return user


def register_user_from_profile(profile, scope) -> User:
    user_id = user_id_from_profile(profile, scope)

    if scope == 'github':
        user = User(id=user_id,
                    created_at=datetime.now(),
                    name=profile.get('name'),
                    is_admin=user_id in Config.ADMIN_USER_IDS,
                    avatar=profile.get('avatar_url'),
                    scope=scope,
                    is_verified=True)

    elif scope == 'google':
        user = User(id=user_id,
                    created_at=datetime.now(),
                    email=profile.get('email'),
                    name=profile.get('name'),
                    is_admin=user_id in Config.ADMIN_USER_IDS,
                    avatar=profile.get('picture'),
                    scope=scope,
                    is_verified=True)

    elif scope == 'stackoverflow':
        user = User(id=user_id,
                    created_at=datetime.now(),
                    name=profile['items'][0]['display_name'],
                    is_admin=user_id in Config.ADMIN_USER_IDS,
                    avatar=profile['items'][0]['profile_image'],
                    scope=scope,
                    is_verified=True)
    else:
        raise ValueError('Invalid scope')

    db.users.insert_one({
        **user.mongo(),
        'email': user.email if user.email else None,
    })
    return user


def check_captcha(captcha):
    url = 'https://www.google.com/recaptcha/api/siteverify'
    data = {
        'secret': Config.GOOGLE_CAPTCHA_SECRET_KEY,
        'response': captcha
    }
    r = requests.post(url, data=data)
    if r.status_code != 200:
        raise errors.InternalError('Auth', errors.CAPTCHA_INVALID)
    if not r.json().get('success'):
        raise errors.BadRequest('Auth', errors.CAPTCHA_INVALID)


def send_email_with_activation_code(email, activation_code):
    subject = "Welcome to Datatensor ! Confirm your email"
    activation_url = f'{Config.APP_URL}/email-confirmation?activation_code={activation_code}'
    html_content = f"""
        <h5>Welcome to Datatensor !</h5>
        By clicking on the following link, you are confirming your email address.
        <br/>
        <a href="{activation_url}">Confirm your email</a>
        <br/>
        <br/>
        Happy hacking !
   """

    message = Mail(
        from_email='noreply@datatensor.io',
        to_emails=email,
        subject=subject,
        html_content=html_content
    )
    try:
        sg = SendGridAPIClient(Config.SENDGRID_API_KEY)
        sg.send(message)
    except Exception as e:
        raise errors.InternalError('Auth', f'Unable to send email | {str(e)}')


def store_recovery_code(email, recovery_code):
    db.users.find_one_and_update({'email': email},
                                 {'$set': {'recovery_code': recovery_code}})


def send_email_with_recovery_link(email, recovery_code):
    subject = "Datatensor | Forgot password"
    recovery_url = f'{Config.APP_URL}/forgot-password?recovery_code={recovery_code}'
    html_content = f"""
         <h5>Forgot password</h5>
         Reset password of your Datatensor account by clinking the following link :
         <br/>
         <a href="{recovery_url}">Reset password</a>
         <br/>
         <br/>
         Happy hacking !
    """

    message = Mail(
        from_email='noreply@datatensor.io',
        to_emails=email,
        subject=subject,
        html_content=html_content
    )
    try:
        sg = SendGridAPIClient(Config.SENDGRID_API_KEY)
        sg.send(message)
    except Exception as e:
        raise errors.InternalError('Auth', f'Unable to send email | {str(e)}')


def verify_user_email(activation_code) -> User:
    user = user_from_activation_code(activation_code)

    if not user:
        raise errors.Forbidden('Auth', errors.INVALID_CODE)

    if user.is_verified:
        raise errors.BadRequest('Auth', errors.ALREADY_VERIFIED)

    db.users.find_one_and_update({'_id': user.id},
                                 {'$set': {'is_verified': True, 'activation_code': None}})

    return user


def unregister_user(user_id):
    remove_datasets(user_id)
    db.notifications.delete_many({'user_id': user_id})
    db.tasks.delete_many({'user_id': user_id})
    db.users.delete_one({'_id': user_id})
