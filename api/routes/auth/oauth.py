from flask import Blueprint
from webargs import fields
from webargs.flaskparser import use_args

from logger import logger
from routes.auth import core

oauth = Blueprint('oauth', __name__)


@oauth.route('/<scope>', methods=['GET'])
def oauth_authorization(scope):
    """
    This function returns OAuth authorization url, depending on requested scope.
    :return: authorization_url
    """

    authorization_url = core.authorization_url_from_scope(scope)
    logger.info(f'Fetch OAuth authorization url for `{scope}`')

    return authorization_url, 200


@oauth.route('/callback', methods=['POST'])
@use_args({
    'code': fields.Str(required=True),
    'scope': fields.Str(required=True)
})
def oauth_callback(args):
    """
    Using code provided by OAuth workflow, fetch profile depending on requested scope; register user if doesn't exists
    :return: user
    """

    code = args['code']
    scope = args['scope']

    profile = core.profile_from_code(code, scope)
    user_id = core.user_id_from_profile(profile, scope)

    user = core.user_from_user_id(user_id)

    if not user:
        user = core.register_user_from_profile(profile, scope)
        logger.info(f"Registered `{user['name']}` from `{scope}`")

    logger.info(f"Logged in as `{user['name']}` from `{scope}`")
    return user
