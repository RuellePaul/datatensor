import os

from flask import Flask
from flask_cors import CORS
from flask_wtf.csrf import CSRFProtect, CSRFError, generate_csrf

import errors
from authentication.auth import auth
from authentication.core import require_authorization
from authentication.oauth import oauth
from config import Config
from database import encrypt_init
from logger import logger
from routes.categories.categories import categories
from routes.datasets.datasets import datasets
from routes.images.images import images
# from routes.tasks.tasks import tasks
from routes.users.users import users

app = Flask(__name__)

config_name = os.getenv('FLASK_UI_CONFIGURATION', 'development')
app.config.from_object(Config)

app.secret_key = app.config['SECRET_KEY']

CORS(app)
CSRFProtect(app)

PREFIX = '/api/v2'

app.register_blueprint(auth, url_prefix=f'{PREFIX}/auth')
app.register_blueprint(oauth, url_prefix=f'{PREFIX}/oauth')

require_authorization([datasets, categories, images])

app.register_blueprint(users, url_prefix=f'{PREFIX}/users')
app.register_blueprint(datasets, url_prefix=f'{PREFIX}/datasets')
app.register_blueprint(categories, url_prefix=f'{PREFIX}/datasets/<dataset_id>/categories')
app.register_blueprint(images, url_prefix=f'{PREFIX}/datasets/<dataset_id>/images')


# app.register_blueprint(labels, url_prefix=f'{PREFIX}/labels')
# app.register_blueprint(tasks, url_prefix=f'{PREFIX}/tasks')


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
