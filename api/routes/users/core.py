from flask_bcrypt import check_password_hash, generate_password_hash
from marshmallow import Schema
from webargs import fields

import errors
from authentication.core import verify_access_token
from config import Config
from utils import encrypt_field

db = Config.db


class User(Schema):
    name = fields.Str(required=True)
    is_public = fields.Boolean()
    phone = fields.Str()
    city = fields.Str()
    country = fields.Str()


def find_users(offset, limit):
    return list(db.users.find().skip(offset).limit(limit))


def find_user(user_id):
    return db.users.find_one({'_id': user_id})


def update_user(user_id, payload):
    user = verify_access_token()
    if user_id != user['_id']:
        raise errors.Forbidden()
    Config.db.users.find_one_and_update({'_id': user_id},
                                        {'$set': payload},
                                        projection={'_id': 0})


def update_user_password(user_id, password, new_password):
    user = verify_access_token()
    if user_id != user['_id']:
        raise errors.Forbidden()

    user = Config.db.users.find_one({'_id': user_id})
    user_password_encrypted = user.get('password')
    user_scope = user.get('scope')

    if user_scope or not user_password_encrypted:
        raise errors.BadRequest(f'Your account is linked with {str(user_scope)}, you cannot modify your password')

    user_password = bytes(user_password_encrypted, 'utf-8')

    if not check_password_hash(user_password, password):
        raise errors.Forbidden("Passwords don't match")

    encrypted_password = generate_password_hash(new_password).decode('utf-8')
    Config.db.users.find_one_and_update({'_id': user_id},
                                        {'$set': {'password': encrypt_field(encrypted_password)}})


def remove_users(user_ids):
    user = verify_access_token()
    if user['_id'] in user_ids:
        user_ids.remove(user['_id'])
    Config.db.users.delete_many({'_id': {'$in': user_ids}, 'is_admin': False})


def remove_user(user_id):
    db.users.delete_one({'_id': user_id, 'is_admin': False})
