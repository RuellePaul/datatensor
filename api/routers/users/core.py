from typing import List

from api import errors
from api.config import Config
from api.routers.users.models import User
from api.utils import encrypt_field, password_context

db = Config.db


def find_users(offset=0, limit=0) -> List[User]:
    users = list(db.users.find().skip(offset).limit(limit))
    return [User.from_mongo(user) for user in users]


def find_user(user_id) -> User:
    user = db.users.find_one({'_id': user_id})
    if not user:
        raise errors.NotFound(errors.USER_NOT_FOUND)
    return User.from_mongo(user)


def update_user(user, update):
    db.users.find_one_and_update({'_id': user.id},
                                 {'$set': dict(update)},
                                 projection={'_id': 0})


def update_user_password(user, password, new_password):
    user_full = db.users.find_one({'_id': user.id})
    user_password_encrypted = user_full.get('password')

    if user.scope or not user_password_encrypted:
        raise errors.BadRequest(errors.USER_HAS_A_SCOPE)

    user_password = bytes(user_password_encrypted, 'utf-8')

    if not password_context.verify(password, user_password):
        raise errors.InvalidAuthentication(errors.INVALID_PASSWORD)

    encrypted_password = password_context.hash(new_password)
    db.users.find_one_and_update({'_id': user.id},
                                 {'$set': {'password': encrypt_field(encrypted_password)}})


def remove_users(user_ids):
    db.notifications.delete_many({'user_id': {'$in': user_ids}})
    db.users.delete_many({'_id': {'$in': user_ids}, 'is_admin': False})


def remove_user(user_id):
    user_to_delete = find_user(user_id)
    if not user_to_delete:
        raise errors.NotFound(errors.USER_NOT_FOUND)
    if user_to_delete.is_admin:
        raise errors.Forbidden(errors.USER_IS_ADMIN)

    db.notifications.delete_many({'user_id': user_id})
    db.users.delete_one({'_id': user_id, 'is_admin': False})
