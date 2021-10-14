import os
from typing import Any, List

from fastapi import FastAPI
from pydantic import AnyHttpUrl, BaseSettings

import errors
from database import encrypt_init

os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'  # to use OAuth2 without https

if 'ACCESS_TOKEN_KEY' not in os.environ:
    raise errors.InternalError(
        'Environment variable are not set. Use init_env.sh script, or edit Pycharm configuration')


class Settings(BaseSettings):
    ENVIRONMENT = os.environ['ENVIRONMENT']

    ROOT_PATH: str = os.path.abspath(os.path.join(FastAPI().root_path, os.pardir))
    DATASOURCES_PATH: str = os.path.join(ROOT_PATH, 'api', 'workflows', 'generator', 'datasources')

    UI_URL: str = 'https://datatensor.io'
    API_URI: str = 'https://api.datatensor.io'

    MAX_CONTENT_LENGTH: int = 1 * 1000 * 1024 * 1024  # 1 Go

    ADMIN_USER_IDS: List[str] = [
        '58a802c1b350056c737ca447db48c7c645581b265e61d2ceeae5e0320adc7e6a',  # RuellePaul (github)
        'b813fd7e62edcdd7b630837e2f7314e0aa28684eca85a15787be242386ee4e0f'  # RuellePaul (google)
    ]

    DATASOURCES: List[dict] = [
        {
            'key': 'coco2014',
            'name': 'COCO 2014',
            'download_url': 'http://images.cocodataset.org/annotations/annotations_trainval2014.zip',
            'filenames': ['instances_val2014.json', 'instances_train2014.json']
        },
        {
            'key': 'coco2017',
            'name': 'COCO 2017',
            'download_url': 'http://images.cocodataset.org/annotations/annotations_trainval2017.zip',
            'filenames': ['instances_val2017.json', 'instances_train2017.json']
        },
    ]

    ACCESS_TOKEN_KEY: str = os.environ['ACCESS_TOKEN_KEY']
    SESSION_DURATION_IN_MINUTES: int = 120

    GOOGLE_CAPTCHA_SECRET_KEY: str = os.environ['GOOGLE_CAPTCHA_SECRET_KEY']

    SENDGRID_API_KEY: str = os.environ['SENDGRID_API_KEY']

    OAUTH: dict = {
        'github': {
            'AUTHORIZATION_URL': 'https://github.com/login/oauth/authorize',
            'TOKEN_URL': 'https://github.com/login/oauth/access_token',
            'USER_URL': 'https://api.github.com/user',
            'CLIENT_ID': '0eff110490cfa6f0efc0',
            'CLIENT_SECRET': os.environ['OAUTH_GITHUB_CLIENT_SECRET'],
            'SCOPES': ['openid', 'email', 'profile']
        },
        'google': {
            'AUTHORIZATION_URL': 'https://accounts.google.com/o/oauth2/v2/auth',
            'TOKEN_URL': 'https://oauth2.googleapis.com/token',
            'USER_URL': 'https://openidconnect.googleapis.com/v1/userinfo',
            'CLIENT_ID': '1015468889518-qfog501sgfjv8jusml7pvjpps8gdoeru.apps.googleusercontent.com',
            'CLIENT_SECRET': os.environ['OAUTH_GOOGLE_CLIENT_SECRET'],
            'SCOPES': ['openid', 'email', 'profile']
        },
        'stackoverflow': {
            'AUTHORIZATION_URL': 'https://stackoverflow.com/oauth',
            'TOKEN_URL': 'https://stackoverflow.com/oauth/access_token/json',
            'USER_URL': 'https://api.stackexchange.com/2.2/me?site=stackoverflow',
            'CLIENT_ID': '21110',
            'CLIENT_SECRET': os.environ['OAUTH_STACKOVERFLOW_CLIENT_SECRET'],
            'SCOPES': [],
            'KEY': os.environ['OAUTH_STACKOVERFLOW_KEY']
        }
    }

    S3_BUCKET: str = 'dtproductionbucket'
    S3_KEY: str = os.environ['S3_KEY']
    S3_SECRET: str = os.environ['S3_SECRET']
    S3_LOCATION: AnyHttpUrl = f'http://{S3_BUCKET}.s3.amazonaws.com/'

    DB_ENCRYPTION_KEY: str = os.environ['DB_ENCRYPTION_KEY']
    DB_HOST: str = 'mongodb://127.0.0.1:27017/'
    DB_NAME: str = ''
    DB_ENCRYPT_CLIENT: Any = None
    db: Any = None

    def __init__(self):
        super().__init__()
        self.DB_NAME: str = f'datatensor_{self.ENVIRONMENT}'
        self.DB_ENCRYPT_CLIENT, self.db = encrypt_init(self.DB_HOST,
                                                       db_name=self.DB_NAME,
                                                       key=self.DB_ENCRYPTION_KEY)


Config = Settings()
