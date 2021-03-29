from flask import request

from config import Config
from routes.authentication.core import verify_access_token


def delete_users(user_ids):
    user = verify_access_token(request.headers.get('Authorization'))
    if user['id'] in user_ids:
        user_ids.remove(user['id'])
    Config.db.users.delete_many({'id': {'$in': user_ids}})
