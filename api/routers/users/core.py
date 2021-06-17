from typing import List

import errors
from config import Config
from routers.users.models import User
from utils import encrypt_field, password_context

db = Config.db


def find_users(offset, limit) -> List[User]:
    users_in_db = list(db.users.find().skip(offset).limit(limit))
    return [User.from_mongo(user) for user in users_in_db]


def find_user(user_id) -> User:
    user_in_db = db.users.find_one({'_id': user_id})
    if not user_in_db:
        raise errors.NotFound(f'User {user_id} not found')
    return User.from_mongo(user_in_db)


def update_user(user, update):
    db.users.find_one_and_update({'_id': user.id},
                                 {'$set': dict(update)},
                                 projection={'_id': 0})


def update_user_password(user, password, new_password):
    user_full = db.users.find_one({'_id': user.id})
    user_password_encrypted = user_full.get('password')

    if user.scope or not user_password_encrypted:
        raise errors.BadRequest(f'Your account is linked with {str(user.scope)}, you cannot modify your password')

    user_password = bytes(user_password_encrypted, 'utf-8')

    if not password_context.verify(password, user_password):
        raise errors.InvalidAuthentication("Passwords don't match")

    encrypted_password = password_context.hash(new_password)
    db.users.find_one_and_update({'_id': user.id},
                                 {'$set': {'password': encrypt_field(encrypted_password)}})


def remove_users(user_ids):
    db.notifications.delete_many({'user_id': {'$in': user_ids}})
    db.users.delete_many({'_id': {'$in': user_ids}, 'is_admin': False})


def remove_user(user_id):
    db.notifications.delete_many({'user_id': user_id})
    db.users.delete_one({'_id': user_id, 'is_admin': False})
