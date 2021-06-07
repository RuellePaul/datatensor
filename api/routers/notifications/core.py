from datetime import datetime
from uuid import uuid4

from config import Config

db = Config.db


def find_notifications(user_id, offset, limit):
    return list(db.notifications.find({'user_id': user_id}).skip(offset).limit(limit))


def insert_notification(user_id, notification):
    db.notifications.insert_one({'_id': str(uuid4()),
                                 'user_id': user_id,
                                 'created_at': datetime.now(),
                                 **notification.dict()})


def remove_notifications(user_id):
    db.notifications.delete_many({'user_id': user_id})
