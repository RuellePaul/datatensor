from flask import Blueprint
from flask_bcrypt import generate_password_hash
from webargs import fields
from webargs.flaskparser import use_args

import errors
from config import Config
from logger import logger
from routes.auth import core

register = Blueprint('register', __name__)


@register.route('/', methods=['POST'])
@use_args({
    'email': fields.Str(required=True),
    'password': fields.Str(required=True),
    'name': fields.Str(required=True),
    'captcha': fields.Str(required=True)
})
def do_register(args):
    captcha = args['captcha']
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
        password=encrypted_password,
        name=args['name'],
        scope=None
    )
    Config.db.users.insert_one(user)
    del user['_id']

    logger.info(f"Registered user `{email}`")
    return user, 201
