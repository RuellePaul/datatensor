from flask import Blueprint, jsonify
from flask_bcrypt import check_password_hash
from webargs import fields
from webargs.flaskparser import use_args

import errors
from logger import logger
from routes.account import core


login = Blueprint('login', __name__)


@login.route('/', methods=['POST'])
@use_args({
    'email': fields.Str(required=True),
    'password': fields.Str(required=True)
})
def do_login(args):
    email = args['email']

    user_id = core.user_id_hash(email)
    user = core.user_from_user_id(user_id)
    if not user:
        raise errors.InvalidAuthentication('Invalid email or password')

    user_password = bytes(user['password'], 'utf-8')
    if not check_password_hash(user_password, args['password']):
        raise errors.InvalidAuthentication('Invalid email or password')

    response = jsonify(user)
    response.set_cookie('access_token', core.encode_access_token(user_id))

    logger.info(f'Logged in as `{email}`')

    return response, 200
