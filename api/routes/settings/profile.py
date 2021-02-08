from flask import Blueprint
from webargs import fields
from webargs.flaskparser import use_args

import errors
from config import Config
from logger import logger
from routes.auth.core import protect_blueprint

profile = Blueprint('profile', __name__)
protect_blueprint(profile)


@profile.route('/update_name', methods=['POST'])
@use_args({
    'user_id': fields.Str(required=True),
    'name': fields.Str(required=True)
})
def update_name(args):
    user_id = args['user_id']
    name = args['name']

    Config.db.users.find_one_and_update({'id': user_id},
                                        {'$set': {'name': name}})
    return name, 200
