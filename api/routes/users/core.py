from flask import request

from authentication.core import verify_access_token
from config import Config

db = Config.db


def find_users(offset, limit):
    return list(db.users.find().skip(offset).limit(limit))


def find_user(user_id):
    return db.users.find_one({'_id': user_id})


def remove_users(user_ids):
    user = verify_access_token(request.headers['Authorization'])
    if user['_id'] in user_ids:
        user_ids.remove(user['_id'])
    Config.db.users.delete_many({'_id': {'$in': user_ids}, 'is_admin': False})


def remove_user(user_id):
    db.users.delete_one({'_id': user_id, 'is_admin': False})
