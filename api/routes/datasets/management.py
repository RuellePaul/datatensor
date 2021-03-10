from flask import Blueprint, jsonify
from webargs import fields
from webargs.flaskparser import use_args

from routes.account.core import protect_blueprint
from routes.datasets import core

management = Blueprint('management', __name__)
protect_blueprint(management)


@management.route('/', methods=['POST'])
@use_args({
    'user_id': fields.Str(required=True),
})
def fetch_datasets(args):
    datasets = core.datasets_from_user_id(args['user_id'])
    return jsonify(datasets), 200


@management.route('/create', methods=['POST'])
@use_args({
    'name': fields.Str(required=True),
    'user_id': fields.Str(required=True),
})
def create_dataset(args):
    dataset = core.generate_dataset(user_id=args['user_id'], name=args['name'])
    core.store_dataset(dataset)
    del dataset['_id']
    return dataset, 200
