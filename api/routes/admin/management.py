from flask import Blueprint, jsonify

from config import Config

management = Blueprint('management', __name__)


@management.route('/users')
def fetch_users():
    users = list(Config.db.users.find({}, {'_id': 0, 'password': 0}))
    response = {'users': users}
    return response, 200
