from flask import Blueprint
from webargs import fields
from webargs.flaskparser import use_args

from utils import build_schema, parse
from .core import Notification, find_notifications, find_notification, remove_notifications, insert_notification

notifications = Blueprint('notifications', __name__)
Notification = build_schema(Notification)


@notifications.route('/')
@use_args({
    'offset': fields.Int(required=False, missing=0),
    'limit': fields.Int(required=False, missing=0)
}, location='query')
def get_notifications(args):
    result = find_notifications(args['offset'], args['limit'])
    return {'notifications': parse(result)}, 200


@notifications.route('/<notification_id>')
def get_notification(notification_id):
    result = find_notification(notification_id)
    return {'notification': parse(result)}, 200


@notifications.route('/', methods=['POST'])
@use_args(Notification)
def post_notification(args):
    insert_notification(args)
    return 'OK', 201


@notifications.route('/', methods=['DELETE'])
def delete_notification():
    remove_notifications()
    return 'OK', 200
