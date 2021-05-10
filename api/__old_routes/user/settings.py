from flask import Blueprint
from webargs import fields
from webargs.flaskparser import use_args

import errors
from __old_routes.user import core

settings = Blueprint('settings', __name__)


@settings.route('/update-profile', methods=['POST'])
@use_args({
    'name': fields.Str(required=True),
    'email': fields.Str(required=False),
    'phone': fields.Str(required=False),
    'country': fields.Str(required=False),
    'city': fields.Str(required=False),
    'isPublic': fields.Boolean(required=False)
})
def update_user_profile(args):
    core.find_user_and_update(args)
    return 'OK', 200


@settings.route('/change-password', methods=['POST'])
@use_args({
    'password': fields.Str(required=True),
    'password_confirm': fields.Str(required=True),
    'new_password': fields.Str(required=True),
})
def change_password(args):
    if args['password'] != args['password_confirm']:
        raise errors.Forbidden('Fill in identical passwords')

    core.check_password(args['password'])
    core.update_password(args['new_password'])

    return 'OK', 200
