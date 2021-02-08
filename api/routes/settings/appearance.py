from flask import Blueprint
from webargs import fields
from webargs.flaskparser import use_args

from config import Config
from routes.auth.core import protect_blueprint

appearance = Blueprint('appearance', __name__)
protect_blueprint(appearance)


@appearance.route('/update_theme', methods=['POST'])
@use_args({
    'user_id': fields.Str(required=True),
    'theme': fields.Str(required=True)
})
def update_theme(args):
    user_id = args['user_id']
    theme = args['theme']

    Config.db.users.find_one_and_update({'id': user_id},
                                        {'$set': {'theme': theme}})
    return theme, 200
