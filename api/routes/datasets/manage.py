from uuid import uuid4
from datetime import datetime

from flask import Blueprint, jsonify, request
from webargs import fields
from webargs.flaskparser import use_args

from config import Config
from routes.authentication.core import verify_access_token
from routes.datasets import core

dataset_manage = Blueprint('dataset_manage', __name__)


@dataset_manage.route('/')
@dataset_manage.route('/<dataset_id>')
def fetch_datasets(dataset_id=None):
    if dataset_id:
        user = verify_access_token(request.headers['Authorization'])
        dataset = Config.db.datasets.find_one({'id': dataset_id, 'user_id': user['id']}, {'_id': 0})
        return dataset, 200
    user = verify_access_token(request.headers['Authorization'])
    datasets = list(Config.db.datasets.find({'user_id': user['id']}, {'_id': 0}))
    return jsonify(datasets), 200


@dataset_manage.route('/create', methods=['POST'])
@use_args({
    'description': fields.Str(),
    'images': fields.List(fields.Dict(), required=True),
    'name': fields.Str(required=True),
    'is_public': fields.Boolean(missing=False)
})
def create_dataset(args):
    user = verify_access_token(request.headers['Authorization'], verified=True)

    dataset_id = str(uuid4())
    dataset = dict(id=dataset_id,
                   user_id=user['id'],
                   created_at=datetime.now().isoformat(),
                   description=args['description'],
                   is_public=args['is_public'],
                   name=args['name'],
                   objects=[])  # TODO : Add objects in create form
    Config.db.datasets.insert_one(dataset)

    images = args['images']
    if images:
        pass

    return {}, 200


@dataset_manage.route('/<dataset_id>/delete', methods=['POST'])
def delete_dataset(dataset_id):
    core.delete_dataset(dataset_id)
    return 'OK', 200
