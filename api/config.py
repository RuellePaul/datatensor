import os

from flask import Flask

from database import encrypt_init


class Config:
    ENVIRONMENT = 'development'

    ROOT_PATH = os.path.abspath(os.path.join(Flask(__name__).root_path, os.pardir))

    UI_URL = 'https://localhost:5069'
    API_URI = 'http://127.0.0.1:4069'

    SECRET_KEY = 'aUbrkqS8hwxj9xstp77r7s24gZx'
    SSL_VERIFICATION = True
    SESSION_COOKIE_SECURE = True
    REMEMBER_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    REMEMBER_COOKIE_HTTPONLY = True

    DB_ENCRYPTION_KEY = 'yFbcXGnYY2xUrh6I8hwf5lyikIe9x/r21nLiqzWDmj1ZaBST+7Jfu+puRJqwmdjxAzOWivAY3QIHaf61+63kagEXAeE/jcKfDbV/1q3Q3MjR5ePvvS2gx8pvKNCbG+jA'
    DB_HOST = 'localhost:27017'
    DB_NAME = 'datatensor'
    DB_ENCRYPT_CLIENT, db = encrypt_init(DB_HOST, db_name=DB_NAME, key=DB_ENCRYPTION_KEY)

    GOOGLE_AUTHORIZATION_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth'
    GOOGLE_CLIENT_ID = '1020592902157-8elmelc4n4l2fh3jk4jltf5ulb3mqp5v.apps.googleusercontent.com'
    GOOGLE_CLIENT_SECRET = 'LTixFBum9XdzDScsnckmfTaE'

    GITHUB_AUTHORIZATION_ENDPOINT = 'https://github.com/login/oauth/authorize'
    GITHUB_CLIENT_ID = 'a1c2fca55dd2294221cc'
    GITHUB_CLIENT_SECRET = '2553c55f803457a4e6a199ee6c25358c59fdf67f'

    STACKOVERFLOW_AUTHORIZATION_ENDPOINT = 'https://stackoverflow.com/oauth'
    STACKOVERFLOW_CLIENT_ID = '19503'
    STACKOVERFLOW_CLIENT_SECRET = 'TSIjuHsvqZtpsr9Bibx48w(('
