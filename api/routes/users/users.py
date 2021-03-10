from flask import Blueprint, jsonify
from webargs import fields
from webargs.flaskparser import use_args

from routes.account.core import protect_blueprint
from routes.users import core

users = Blueprint('users', __name__)
protect_blueprint(users)


@users.route('/', methods=['GET'])
def fetch_users():
    users = core.retrieve_users()
    return jsonify(users), 200
