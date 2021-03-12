from flask import Blueprint, jsonify

from config import Config

admin_manage = Blueprint('admin_manage', __name__)


@admin_manage.route('/users')
def fetch_users():
    users = list(Config.db.users.find({}, {'_id': 0, 'password': 0}))
    return jsonify(users), 200
