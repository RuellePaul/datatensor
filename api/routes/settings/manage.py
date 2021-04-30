from flask import Blueprint, request
from webargs import fields
from webargs.flaskparser import use_args

from config import Config
from routes.authentication import core

update_profile = Blueprint('update_profile', __name__)


@update_profile.route('/update_profile', methods=['POST'])
@use_args({
    'name': fields.Str(required=True),
    'email': fields.Str(required=False),
    'phone': fields.Str(required=False),
    'country': fields.Str(required=False),
    'city': fields.Str(required=False),
    'isPublic': fields.Boolean(required=False)
})
def update_user_profile(args):
    user = core.verify_access_token(request.headers.get('Authorization'))
    user_id = user['id']
    Config.db.users.find_one_and_update({'id': user_id},
                                        {'$set': args},
                                        projection={'_id': 0})
    return 'OK', 200
