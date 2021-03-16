from flask import Blueprint, jsonify

from config import Config

admin_manage = Blueprint('admin_manage', __name__)


@admin_manage.route('/users')
def fetch_users():
    users = list(Config.db.users.find({}, {'_id': 0, 'password': 0}))
    return jsonify(users), 200


@admin_manage.route('/users/<user_id>')
def fetch_user(user_id):
    user = Config.db.users.find_one({'id': user_id}, {'_id': 0, 'password': 0})
    return user, 200


@admin_manage.route('/datasets/<user_id>')
def fetch_datasets(user_id):
    datasets = list(Config.db.datasets.find({'user_id': user_id}, {'_id': 0}))
    return jsonify(datasets), 200
