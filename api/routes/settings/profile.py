from flask import Blueprint
from webargs import fields
from webargs.flaskparser import use_args

import errors
from logger import logger
from routes.auth.core import protect_blueprint

profile = Blueprint('profile', __name__)
protect_blueprint(profile)


@profile.route('/update_name', methods=['POST'])
@use_args({
    'name': fields.Str(required=True)
})
def update_username(args):
    print('...')

    return {}, 200
