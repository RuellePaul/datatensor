import os

from flask import Flask
from flask_cors import CORS
from flask_wtf.csrf import CSRFProtect, CSRFError, generate_csrf

import errors
from config import Config
from database import encrypt_init
from logger import logger
from routes.account.login import login
from routes.account.oauth import oauth
from routes.account.register import register
from routes.datasets.management import management
from routes.users.users import users

app = Flask(__name__)

config_name = os.getenv('FLASK_UI_CONFIGURATION', 'development')
app.config.from_object(Config)
app.secret_key = app.config['SECRET_KEY']

CORS(app)
CSRFProtect(app)

app.register_blueprint(login, url_prefix='/api/v1/account/login')
app.register_blueprint(register, url_prefix='/api/v1/account/register')
app.register_blueprint(oauth, url_prefix='/api/v1/account/oauth')

app.register_blueprint(management, url_prefix='/api/v1/datasets/management')

app.register_blueprint(users, url_prefix='/api/v1/users/')


@app.after_request
def inject_csrf_token_cookie(response):
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    response.set_cookie('csrf_token', generate_csrf(), samesite='Lax', secure=True)
    return response


@app.errorhandler(CSRFError)
def handle_csrf_error(error):
    logger.warning(f'{error.code} Rejected by CSRF protection : {error.description}')
    return errors.Forbidden(error.description, data='ERR_CSRF').flask_response()


@app.errorhandler(errors.APIError)
def handle_api_error(error):
    if error.http_status != 404:
        logger.error(f'{error.http_status} {error.message}')
    return error.flask_response()


if __name__ == '__main__':
    encrypt_init(Config.DB_HOST, key=Config.DB_ENCRYPTION_KEY, setup=True)
    app.run(debug=True, threaded=True, host='0.0.0.0', port=4069)
