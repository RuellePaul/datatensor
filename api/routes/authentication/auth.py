from flask import Blueprint, request
from flask_bcrypt import check_password_hash, generate_password_hash
from webargs import fields
from webargs.flaskparser import use_args

import errors
from config import Config
from logger import logger
from routes.authentication import core
from utils import encrypt_field

auth = Blueprint('auth', __name__)


@auth.route('/me')
def me():
    user_id = core.verify_access_token(request.headers.get('Authorization'))
    user = core.user_from_user_id(user_id)
    if not user:
        raise errors.ExpiredAuthentication
    user.pop('password', None)
    response = {'user': user}
    return response, 200


@auth.route('/login', methods=['POST'])
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

    logger.info(f'Logged in as `{email}`')

    access_token = core.encode_access_token(user_id)
    response = {
        'accessToken': access_token,
        'user': user
    }

    return response, 200


@auth.route('/register', methods=['POST'])
@use_args({
    'email': fields.Str(required=True),
    'password': fields.Str(required=True),
    'name': fields.Str(required=True),
    'recaptcha': fields.Str(required=True)
})
def do_register(args):
    captcha = args['recaptcha']
    core.check_captcha(captcha)

    email = args['email']

    user_id = core.user_id_hash(email)
    user = core.user_from_user_id(user_id)

    if user:
        raise errors.Forbidden(f'User {user_id} already exists')

    encrypted_password = generate_password_hash(args['password']).decode('utf-8')

    user = dict(
        id=user_id,
        email=args['email'],
        name=args['name'],
        avatar=None,
        tier='premium',
    )
    Config.db.users.insert_one({
        **user,
        'name': encrypt_field(user['name']),
        'email': encrypt_field(user['email']),
        'password': encrypt_field(encrypted_password),
    })

    logger.info(f'Registered user `{email}`')

    access_token = core.encode_access_token(user_id)
    response = {
        'accessToken': access_token,
        'user': user
    }

    return response, 201
