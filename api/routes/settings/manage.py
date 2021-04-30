from flask import Blueprint
from webargs import fields
from webargs.flaskparser import use_args

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
    email = args['email']
    return 'OK', 200
