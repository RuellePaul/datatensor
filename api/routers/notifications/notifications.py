from fastapi import APIRouter
from webargs import fields
from webargs.flaskparser import use_args

from utils import build_schema, parse
from routers.notifications.core import Notification, find_notifications, find_notification, insert_notification

notifications = APIRouter()
Notification = build_schema(Notification)


@notifications.get('/')
@use_args({
    'offset': fields.Int(required=False, missing=0),
    'limit': fields.Int(required=False, missing=0)
}, location='query')
async def get_notifications(args):
    result = find_notifications(args['offset'], args['limit'])
    return {'notifications': parse(result)}


@notifications.get('/{notification_id}')
async def get_notification(notification_id):
    result = find_notification(notification_id)
    return {'notification': parse(result)}


@notifications.post('/')
@use_args(Notification)
async def post_notification(args):
    insert_notification(args)


# @notifications.delete('/{notification_id}')
# async def delete_notification(notification_id):
#     remove_notification(notification_id)
