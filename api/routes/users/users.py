from flask import Blueprint
from webargs import fields
from webargs.flaskparser import use_args

from authentication.core import admin_guard
from utils import build_schema, parse
from .core import User, find_users, find_user, remove_users, remove_user

users = Blueprint('users', __name__)
User = build_schema(User)


@users.route('/')
@admin_guard
@use_args({
    'offset': fields.Int(required=False, missing=0),
    'limit': fields.Int(required=False, missing=0)
}, location='query')
def get_users(args):
    result = find_users(args['offset'], args['limit'])
    return {'users': parse(result)}, 200


@users.route('/<user_id>')
@admin_guard
def get_user(user_id):
    result = find_user(user_id)
    return {'user': parse(result)}, 200


# ⚠️ User POST is authentication role


@users.route('/', methods=['DELETE'])
@admin_guard
@use_args({
    'user_ids': fields.List(fields.Str(required=True), required=True)
})
def delete_users(args):
    remove_users(args['user_ids'])
    return 'OK', 200


@users.route('/<user_id>', methods=['DELETE'])
@admin_guard
def delete_user(user_id):
    remove_user(user_id)
    return 'OK', 200
