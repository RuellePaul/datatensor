from flask_bcrypt import check_password_hash, generate_password_hash

import errors
from config import Config
from utils import encrypt_field

db = Config.db


def find_users(offset, limit):
    return list(db.users.find().skip(offset).limit(limit))


def find_user(user_id):
    return db.users.find_one({'_id': user_id})


def update_user(user, update):
    db.users.find_one_and_update({'_id': user['_id']},
                                 {'$set': dict(update)},
                                 projection={'_id': 0})


def update_user_password(user, password, new_password):
    user = db.users.find_one({'_id': user['_id']})
    user_password_encrypted = user.get('password')
    user_scope = user.get('scope')

    if user_scope or not user_password_encrypted:
        raise errors.BadRequest(f'Your account is linked with {str(user_scope)}, you cannot modify your password')

    user_password = bytes(user_password_encrypted, 'utf-8')

    if not check_password_hash(user_password, password):
        raise errors.Forbidden("Passwords don't match")

    encrypted_password = generate_password_hash(new_password).decode('utf-8')
    db.users.find_one_and_update({'_id': user['_id']},
                                 {'$set': {'password': encrypt_field(encrypted_password)}})


def remove_users(user_ids):
    db.users.delete_many({'_id': {'$in': user_ids}, 'is_admin': False})


def remove_user(user_id):
    db.users.delete_one({'_id': user_id, 'is_admin': False})
