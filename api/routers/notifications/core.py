from datetime import datetime
from uuid import uuid4
from typing import List

from config import Config
from routers.notifications.models import Notification

db = Config.db


def find_notifications(user_id) -> List[Notification]:
    notifications = list(db.notifications.find({'user_id': user_id}))
    return [Notification.from_mongo(notification) for notification in notifications]


def insert_notification(user_id, notification):
    db.notifications.insert_one({'_id': str(uuid4()),
                                 'user_id': user_id,
                                 'created_at': datetime.now(),
                                 'opened': False,
                                 **notification.dict()})


def read_notifications(user_id):
    db.notifications.update_many({'user_id': user_id}, {'$set': {'opened': True}})


def remove_notifications(user_id):
    db.notifications.delete_many({'user_id': user_id})
