import uuid

import errors
from config import Config


def retrieve_users():
    users = list(Config.db.users.find({}, {'_id': 0}))
    return users or []
