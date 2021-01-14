from flask import Blueprint
from webargs import fields
from webargs.flaskparser import use_args

import errors
from config import Config
from logger import logger

login = Blueprint('login', __name__)


@login.route('/oauth/authorization/<origin>')
def get_x_connect_authorization(origin):
    """
    This function return origin's OAuth authorization endpoint.

    :return: authorization_url (keypad)
    """
    return ''
