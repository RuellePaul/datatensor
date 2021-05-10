from bson.objectid import ObjectId
from flask import request
from marshmallow import Schema
from webargs import fields

from authentication.core import verify_access_token
from config import Config

db = Config.db


class User(Schema):
    _id = fields.Str(dump_only=True)
    email = fields.Str()
    name = fields.Str()
    created_at = fields.Str()
    is_verified = fields.Bool()
    is_admin = fields.Bool()
    scope = fields.Str()
    avatar = fields.Str(allow_none=True)
    tier = fields.Str()


def find_users(offset, limit):
    return list(db.users.find().skip(offset).limit(limit))


def find_user(user_id):
    return db.users.find_one({'_id': ObjectId(user_id)})


def remove_users(user_ids):
    user = verify_access_token(request.headers['Authorization'])
    if user['id'] in user_ids:
        user_ids.remove(user['id'])
    if user['id'] in Config.ADMIN_USER_IDS:
        user_ids.remove(user['id'])
    Config.db.users.delete_many({'id': {'$in': user_ids}})


def remove_user(user_id):
    db.users.delete_one({'_id': ObjectId(user_id)})
