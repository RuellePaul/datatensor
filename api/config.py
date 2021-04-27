import os

from flask import Flask

import errors
from database import encrypt_init

os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'  # to use OAuth2 without https

if 'ENVIRONMENT' not in os.environ:
    raise errors.Forbidden('Environment variable are not set. Use init_env.sh script, or edit Pycharm configuration')


class Config:
    ENVIRONMENT = os.environ['ENVIRONMENT']

    ROOT_PATH = os.path.abspath(os.path.join(Flask(__name__).root_path, os.pardir))
    LOCAL_DATASETS_PATH = os.path.join(ROOT_PATH, 'api', 'routes', 'generator', 'local_datasets')

    UI_URL = 'https://localhost:5069'
    API_URI = 'http://127.0.0.1:4069'

    SECRET_KEY = os.environ['FLASK_SECRET_KEY']

    MAX_CONTENT_LENGTH = 1 * 1000 * 1024 * 1024  # 1 Go

    ADMIN_USER_IDS = [
        '58a802c1b350056c737ca447db48c7c645581b265e61d2ceeae5e0320adc7e6a',  # RuellePaul (github)
        '83d2218ec37d73a99944dbcd90e5753908a418b99fa79678402ba6bc97a81f83'  # ThomasRoudil (github)
    ]

    LOCAL_DATASET_IDS = {
        'coco': '5e6fb198-56ea-4557-9948-e37be7ab6f12'
    }

    SESSION_COOKIE_SECURE = True
    REMEMBER_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    REMEMBER_COOKIE_HTTPONLY = True

    DB_ENCRYPTION_KEY = os.environ['DB_ENCRYPTION_KEY']
    DB_HOST = 'localhost:27017'
    DB_NAME = f'datatensor_{ENVIRONMENT}'
    DB_ENCRYPT_CLIENT, db = encrypt_init(DB_HOST, db_name=DB_NAME, key=DB_ENCRYPTION_KEY)

    ACCESS_TOKEN_KEY = os.environ['ACCESS_TOKEN_KEY']
    SESSION_DURATION_IN_MINUTES = 120

    GOOGLE_CAPTCHA_PUBLIC_KEY = '6LcFmzcaAAAAAHWoKJ-oEJRO_grEjEjQb0fedPHo'
    GOOGLE_CAPTCHA_SECRET_KEY = os.environ['GOOGLE_CAPTCHA_SECRET_KEY']

    SENDGRID_API_KEY = os.environ['SENDGRID_API_KEY']

    OAUTH = {
        'github': {
            'AUTHORIZATION_URL': 'https://github.com/login/oauth/authorize',
            'TOKEN_URL': 'https://github.com/login/oauth/access_token',
            'USER_URL': 'https://api.github.com/user',
            'CLIENT_ID': 'a1c2fca55dd2294221cc',
            'CLIENT_SECRET': os.environ['OAUTH_GITHUB_CLIENT_SECRET'],
            'SCOPES': ['openid', 'email', 'profile']
        },
        'google': {
            'AUTHORIZATION_URL': 'https://accounts.google.com/o/oauth2/v2/auth',
            'TOKEN_URL': 'https://oauth2.googleapis.com/token',
            'USER_URL': 'https://openidconnect.googleapis.com/v1/userinfo',
            'CLIENT_ID': '1020592902157-8elmelc4n4l2fh3jk4jltf5ulb3mqp5v.apps.googleusercontent.com',
            'CLIENT_SECRET': os.environ['OAUTH_GOOGLE_CLIENT_SECRET'],
            'SCOPES': ['openid', 'email', 'profile']
        },
        'stackoverflow': {
            'AUTHORIZATION_URL': 'https://stackoverflow.com/oauth',
            'TOKEN_URL': 'https://stackoverflow.com/oauth/access_token/json',
            'USER_URL': 'https://api.stackexchange.com/2.2/me?site=stackoverflow',
            'CLIENT_ID': '19511',
            'CLIENT_SECRET': os.environ['OAUTH_STACKOVERFLOW_CLIENT_SECRET'],
            'SCOPES': [],
            'KEY': os.environ['OAUTH_STACKOVERFLOW_KEY']
        }
    }

    S3_BUCKET = 'dtservertestbucket'
    S3_KEY = os.environ['S3_KEY']
    S3_SECRET = os.environ['S3_SECRET']
    S3_LOCATION = f'http://{S3_BUCKET}.s3.amazonaws.com/'
