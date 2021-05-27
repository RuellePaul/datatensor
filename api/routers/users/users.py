from fastapi import APIRouter
from webargs import fields
from webargs.flaskparser import use_args

from authentication.core import admin_guard
from utils import parse, build_schema
from .core import User, find_users, find_user, remove_users, remove_user, update_user, update_user_password

users = APIRouter()


@users.get('/')
@admin_guard
@use_args({
    'offset': fields.Int(required=False, missing=0),
    'limit': fields.Int(required=False, missing=0)
}, location='query')
def get_users(args):
    result = find_users(args['offset'], args['limit'])
    return {'users': parse(result)}, 200


@users.get('/<user_id>')
def get_user(user_id):
    result = find_user(user_id)
    return {'user': parse(result)}, 200


# ⚠️ User POST is authentication role


@users.patch('/<user_id>')
@use_args(build_schema(User))
def patch_user(args, user_id):
    update_user(user_id, args)
    return 'OK', 200


@users.patch('/<user_id>/password')
@use_args({
    'password': fields.Str(required=True),
    'password_confirm': fields.Str(required=True),
    'new_password': fields.Str(required=True),
})
def patch_user_password(args, user_id):
    update_user_password(user_id, args['password'], args['new_password'])
    return 'OK', 200


@users.delete('/')
@admin_guard
@use_args({
    'user_ids': fields.List(fields.Str(required=True), required=True)
})
def delete_users(args):
    remove_users(args['user_ids'])
    return 'OK', 200


@users.delete('/<user_id>')
@admin_guard
def delete_user(user_id):
    remove_user(user_id)
    return 'OK', 200
