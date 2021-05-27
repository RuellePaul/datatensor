from fastapi import APIRouter
from webargs import fields
from webargs.flaskparser import use_args

from utils import build_schema, parse
from .core import Notification, find_notifications, find_notification, remove_notification, insert_notification

notifications = APIRouter()
Notification = build_schema(Notification)


@notifications.get('/')
@use_args({
    'offset': fields.Int(required=False, missing=0),
    'limit': fields.Int(required=False, missing=0)
}, location='query')
def get_notifications(args):
    result = find_notifications(args['offset'], args['limit'])
    return {'notifications': parse(result)}, 200


@notifications.get('/<notification_id>')
def get_notification(notification_id):
    result = find_notification(notification_id)
    return {'notification': parse(result)}, 200


@notifications.post('/')
@use_args(Notification)
def post_notification(args):
    insert_notification(args)
    return 'OK', 201


@notifications.delete('/<notification_id>')
def delete_notification(notification_id):
    remove_notification(notification_id)
    return 'OK', 200
