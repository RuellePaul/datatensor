import errors
from config import Config
from utils import encrypt_field, password_context

db = Config.db


def find_users(offset, limit):
    return list(db.users.find().skip(offset).limit(limit))


def find_user(user_id):
    return db.users.find_one({'_id': user_id})


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
        raise errors.Forbidden("Passwords don't match")

    encrypted_password = password_context.hash(new_password)
    db.users.find_one_and_update({'_id': user.id},
                                 {'$set': {'password': encrypt_field(encrypted_password)}})


def remove_users(user_ids):
    db.users.delete_many({'_id': {'$in': user_ids}, 'is_admin': False})


def remove_user(user_id):
    db.users.delete_one({'_id': user_id, 'is_admin': False})
