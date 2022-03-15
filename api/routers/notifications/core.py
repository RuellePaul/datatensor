from datetime import datetime
from typing import List
from uuid import uuid4

import errors
from config import Config
from routers.notifications.models import Notification

db = Config.db


def find_notifications(user_id) -> List[Notification]:
    notifications = list(db.notifications.find({'user_id': user_id}))
    if notifications is None:
        raise errors.NotFound('Notifications', errors.NOTIFICATION_NOT_FOUND)
    return [Notification.from_mongo(notification) for notification in notifications]


def insert_notification(user_id, notification: Notification):
    db.notifications.insert_one({'_id': str(uuid4()),
                                 'user_id': user_id,
                                 'created_at': datetime.now(),
                                 'opened': False,
                                 **notification.dict()})


def read_notifications(user_id):
    db.notifications.update_many({'user_id': user_id}, {'$set': {'opened': True}})


def remove_notifications(user_id):
    db.notifications.delete_many({'user_id': user_id})
