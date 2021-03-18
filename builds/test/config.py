import os

from flask import Flask

from database import encrypt_init

os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'  # to use OAuth2 without https


class Config:
    ENVIRONMENT = os.environ['ENVIRONMENT']

    ROOT_PATH = os.path.abspath(os.path.join(Flask(__name__).root_path, os.pardir))

    UI_URL = 'https://test.datatensor.io'
    API_URI = 'https://test.datatensor.io/api'

    SECRET_KEY = os.environ['FLASK_SECRET_KEY']

    ADMIN_USER_IDS = [
        '58a802c1b350056c737ca447db48c7c645581b265e61d2ceeae5e0320adc7e6a',  # RuellePaul (github)
        'ac586bc7204fefce386b92981a14ac4dc9ba570e76954ddcf25663fb4dda1f0a'  # ThomasRoudil (github)
    ]

    SESSION_COOKIE_SECURE = True
    REMEMBER_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    REMEMBER_COOKIE_HTTPONLY = True

    DB_ENCRYPTION_KEY = os.environ['DB_ENCRYPTION_KEY']
    DB_HOST = 'mongodb://127.0.0.1:27017/'
    DB_NAME = f'datatensor_{ENVIRONMENT}'
    DB_ENCRYPT_CLIENT, db = encrypt_init(DB_HOST, db_name=DB_NAME, key=DB_ENCRYPTION_KEY)

    ACCESS_TOKEN_KEY = os.environ['ACCESS_TOKEN_KEY']
    SESSION_DURATION_IN_MINUTES = 120

    GOOGLE_CAPTCHA_PUBLIC_KEY = '6LcOwYEaAAAAAHyOrVAYf4arn2jrrJi3-OBWURm5'
    GOOGLE_CAPTCHA_SECRET_KEY = '6LcOwYEaAAAAAOq9jJs07V_kxDHeWnBbHE9Io4Px'

    OAUTH = {
        'google': {
            'AUTHORIZATION_URL': 'https://accounts.google.com/o/oauth2/v2/auth',
            'TOKEN_URL': 'https://oauth2.googleapis.com/token',
            'USER_URL': 'https://openidconnect.googleapis.com/v1/userinfo',
            'CLIENT_ID': '1020592902157-8elmelc4n4l2fh3jk4jltf5ulb3mqp5v.apps.googleusercontent.com',
            'CLIENT_SECRET': 'LTixFBum9XdzDScsnckmfTaE',
            'SCOPES': ['openid', 'email', 'profile']
        },
        'github': {
            'AUTHORIZATION_URL': 'https://github.com/login/oauth/authorize',
            'TOKEN_URL': 'https://github.com/login/oauth/access_token',
            'USER_URL': 'https://api.github.com/user',
            'CLIENT_ID': '6ae3c85edc3eed0601cb',
            'CLIENT_SECRET': 'e8167d787efbdff3af1d3d92346b139eda5a0aaa',
            'SCOPES': ['openid', 'email', 'profile']
        },
        'stackoverflow': {
            'AUTHORIZATION_URL': 'https://stackoverflow.com/oauth',
            'TOKEN_URL': 'https://stackoverflow.com/oauth/access_token/json',
            'USER_URL': 'https://api.stackexchange.com/2.2/me?site=stackoverflow',
            'CLIENT_ID': '19844',
            'CLIENT_SECRET': 'Qkm*o*4BR3cukTkzVTCa3A((',
            'SCOPES': [],
            'KEY': 'KJ42cvws83mKc5MQ*JUSpg(('
        }
    }
