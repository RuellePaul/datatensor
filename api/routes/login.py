from flask import Blueprint
from webargs import fields
from webargs.flaskparser import use_args

import errors
from config import Config
from logger import logger

login = Blueprint('login', __name__)


@login.route('/oauth/<website>')
def oauth_authorization(website):
    """
    This function return OAuth authorization endpoint, depending on requested website.

    :return: redirect_url
    """
    logger.info(f'Fetch OAuth endpoint for {website}')
    return ''
