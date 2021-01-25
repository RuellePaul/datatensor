from flask import Blueprint
from webargs import fields
from webargs.flaskparser import use_args

from logger import logger
from routes.auth import core

login = Blueprint('login', __name__)


@login.route('/oauth/<scope>')
def oauth_authorization(scope):
    """
    This function returns OAuth authorization url, depending on requested scope.
    :return: authorization_url
    """

    authorization_url = core.authorization_url_from_scope(scope)
    logger.info(f'Fetch OAuth authorization url for `{scope}`')

    return authorization_url, 200


@login.route('/oauth/callback', methods=['POST'])
@use_args({
    'code': fields.Str(required=True),
    'scope': fields.Str(required=True)
})
def oauth_callback(args):
    """
    Using code provided by OAuth workflow, fetch oauth_profile depending on requested scope, then returns DT user.
    :return: user
    """

    code = args['code']
    scope = args['scope']

    profile = core.profile_from_code(code, scope)
    user_id = core.user_id_from_profile(profile, scope)

    user = core.user_from_user_id(user_id)

    if not user:
        user = core.register_user(profile, scope)
        logger.info(f"Registered `{user['name']}` from `{scope}`")

    logger.info(f"Logged in as `{user['name']}` from `{scope}`")
    return user
