import os

from apscheduler.schedulers.background import BackgroundScheduler
from flask import Flask, request
from flask_cors import CORS
from flask_wtf.csrf import CSRFProtect, CSRFError, generate_csrf

import errors
from config import Config
from database import encrypt_init
from logger import logger

from authentication.auth import auth
from authentication.core import require_authorization
from authentication.oauth import oauth
from routes.categories.categories import categories
from routes.datasets.datasets import datasets
from routes.images.images import images
from routes.labels.labels import labels
from routes.notifications.notifications import notifications
from routes.users.users import users
from routes.tasks.tasks import tasks
from search.search import search

app = Flask(__name__)

scheduler = BackgroundScheduler()
scheduler.start()

config_name = os.getenv('FLASK_UI_CONFIGURATION', 'development')
app.config.from_object(Config)

app.secret_key = app.config['SECRET_KEY']

CORS(app)
CSRFProtect(app)

PREFIX = '/api/v2'

app.register_blueprint(auth, url_prefix=f'{PREFIX}/auth')
app.register_blueprint(oauth, url_prefix=f'{PREFIX}/oauth')

require_authorization([datasets, categories, images, labels])

app.register_blueprint(users, url_prefix=f'{PREFIX}/users')

app.register_blueprint(notifications, url_prefix=f'{PREFIX}/notifications')

app.register_blueprint(search, url_prefix=f'{PREFIX}/search')

app.register_blueprint(datasets, url_prefix=f'{PREFIX}/datasets')

app.register_blueprint(categories, url_prefix=f'{PREFIX}/datasets/<dataset_id>/categories')

app.register_blueprint(images, url_prefix=f'{PREFIX}/datasets/<dataset_id>/images')

app.register_blueprint(labels, url_prefix=f'{PREFIX}/images/<image_id>/labels')

app.register_blueprint(tasks, url_prefix=f'{PREFIX}/tasks')
app.register_blueprint(tasks, url_prefix=f'{PREFIX}/users/<user_id>/tasks')
app.register_blueprint(tasks, url_prefix=f'{PREFIX}/datasets/<dataset_id>/tasks')


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
    app.run(debug=Config.ENVIRONMENT != 'production', threaded=True, host='127.0.0.1', port=4069)
