import os

from flask import Flask

from database import encrypt_init


class Config:
    ENVIRONMENT = 'development'

    ROOT_PATH = os.path.abspath(os.path.join(Flask(__name__).root_path, os.pardir))

    UI_URL = 'https://localhost:5069'
    API_URI = 'http://127.0.0.1:4069'

    SECRET_KEY = 'aUbrkqS8hwxj9xstp77r7s24gZx'

    SESSION_COOKIE_SECURE = True
    REMEMBER_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    REMEMBER_COOKIE_HTTPONLY = True

    DB_ENCRYPTION_KEY = 'yFbcXGnYY2xUrh6I8hwf5lyikIe9x/r21nLiqzWDmj1ZaBST+7Jfu+puRJqwmdjxAzOWivAY3QIHaf61+63kagEXAeE/jcKfDbV/1q3Q3MjR5ePvvS2gx8pvKNCbG+jA'
    DB_HOST = 'localhost:27017'
    DB_NAME = f'datatensor_{ENVIRONMENT}'
    DB_ENCRYPT_CLIENT, db = encrypt_init(DB_HOST, db_name=DB_NAME, key=DB_ENCRYPTION_KEY)
    
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
            'CLIENT_ID': 'a1c2fca55dd2294221cc',
            'CLIENT_SECRET': '2553c55f803457a4e6a199ee6c25358c59fdf67f',
            'SCOPES': ['openid', 'email', 'profile']
        },
        'stackoverflow': {
            'AUTHORIZATION_URL': 'https://stackoverflow.com/oauth',
            'TOKEN_URL': 'https://stackoverflow.com/oauth/access_token/json',
            'USER_URL': 'https://api.stackexchange.com/2.2/me?site=stackoverflow',
            'CLIENT_ID': '19511',
            'CLIENT_SECRET': 'WVoNFqJgR7R6sVr3cxKa8A((',
            'SCOPES': [],
            'KEY': 'XF2kUGVIBKKXSRFw2)u)*Q(('
        }
    }
