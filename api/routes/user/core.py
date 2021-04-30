from flask import request
from flask_bcrypt import check_password_hash, generate_password_hash

import errors
from utils import encrypt_field

from config import Config
from routes.authentication import core


def find_user_and_update(args):
    user = core.verify_access_token(request.headers.get('Authorization'))
    user_id = user['id']
    Config.db.users.find_one_and_update({'id': user_id},
                                        {'$set': args},
                                        projection={'_id': 0})


def check_password(password):
    user = core.verify_access_token(request.headers.get('Authorization'))
    user_password_encrypted = Config.db.users.find_one({'id': user['id']}).get('password')
    user_scope = Config.db.users.find_one({'id': user['id']}).get('scope')

    if not user_password_encrypted:
        raise errors.BadRequest(f'Your account is linked with {str(user_scope)}, you cannot modify your password')

    user_password = bytes(user_password_encrypted, 'utf-8')

    if not check_password_hash(user_password, password):
        raise errors.Forbidden("Passwords don't match")


def update_password(new_password):
    user = core.verify_access_token(request.headers.get('Authorization'))
    encrypted_password = generate_password_hash(new_password).decode('utf-8')
    Config.db.users.find_one_and_update({'id': user['id']},
                                        {'$set': {'password': encrypt_field(encrypted_password)}},
                                        projection={'_id': 0})
