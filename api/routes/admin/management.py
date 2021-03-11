from flask import Blueprint, jsonify

from config import Config

management = Blueprint('management', __name__)


@management.route('/users')
def fetch_users():
    return jsonify(list(Config.db.users.find({}, {'_id': 0, 'password': 0})))
