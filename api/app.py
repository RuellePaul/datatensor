import os

from flask import Flask
from flask_cors import CORS
from flask_wtf.csrf import CSRFProtect, CSRFError, generate_csrf

import errors
from config import Config
from database import encrypt_init
from logger import logger

from routes.authentication.auth import auth
from routes.authentication.oauth import oauth
from routes.admin.manage import admin_manage
from routes.dataset.manage import dataset_manage

from routes.authentication.core import require_authorization, require_admin

app = Flask(__name__)

config_name = os.getenv('FLASK_UI_CONFIGURATION', 'development')
app.config.from_object(Config)
app.secret_key = app.config['SECRET_KEY']

CORS(app)
CSRFProtect(app)

require_authorization([admin_manage, dataset_manage])
require_admin([admin_manage])

app.register_blueprint(auth, url_prefix='/api/v1/auth')
app.register_blueprint(oauth, url_prefix='/api/v1/oauth')
app.register_blueprint(dataset_manage, url_prefix='/api/v1/dataset/manage')

app.register_blueprint(admin_manage, url_prefix='/api/v1/admin/manage')


@app.after_request
def inject_csrf_token_cookie(response):
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    response.set_cookie('csrf_token', generate_csrf(), samesite='Lax', secure=True)
    return response


@app.errorhandler(CSRFError)
def handle_csrf_error(error):
    return errors.CSRF(error.description).flask_response()


@app.errorhandler(errors.APIError)
def handle_api_error(error):
    if error.http_status != 404:
        logger.error(f'{error.http_status} {error.message}')
    return error.flask_response()


if __name__ == '__main__':
    encrypt_init(Config.DB_HOST, key=Config.DB_ENCRYPTION_KEY, setup=True)
    app.run(debug=Config.ENVIRONMENT != 'production', threaded=True, host='0.0.0.0', port=4069)
