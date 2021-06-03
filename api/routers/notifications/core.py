from datetime import datetime
from uuid import uuid4
from marshmallow import Schema
from webargs import fields

from authentication.core import verify_access_token
from config import Config

db = Config.db


class Notification(Schema):
    _id = fields.Str(dump_only=True)
    user_id = fields.Str(dump_only=True)
    type = fields.Str(required=True)
    description = fields.Str()


def find_notifications(offset, limit):
    user_id = verify_access_token().get('_id')
    return list(db.notifications.find({'user_id': user_id}).skip(offset).limit(limit))


def find_notification(notification_id):
    return db.notifications.find_one({'_id': notification_id})


def insert_notification(notification, user_id):
    db.notifications.insert_one({'_id': str(uuid4()),
                                 'user_id': user_id,
                                 'created_at': datetime.now(),
                                 **notification})


def remove_notifications():
    user_id = verify_access_token().get('_id')
    db.notifications.delete_many({'user_id': user_id})
