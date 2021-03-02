from flask import Blueprint
from webargs import fields
from webargs.flaskparser import use_args

from config import Config
from routes.auth.core import protect_blueprint

management = Blueprint('management', __name__)
protect_blueprint(management)


@management.route('/create', methods=['POST'])
@use_args({
    'name': fields.Str(required=True),
})
def create_dataset(args):
    print('hello')
    return 'ok', 200
