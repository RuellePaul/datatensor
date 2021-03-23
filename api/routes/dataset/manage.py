import uuid
from datetime import datetime

from flask import Blueprint, jsonify, request
from webargs import fields
from webargs.flaskparser import use_args

from config import Config
from routes.authentication.core import verify_access_token

dataset_manage = Blueprint('dataset_manage', __name__)


@dataset_manage.route('/')
def fetch_datasets():
    user_id = verify_access_token(request.headers['Authorization'])
    datasets = list(Config.db.datasets.find({'user_id': user_id}, {'_id': 0}))
    return jsonify(datasets), 200


@dataset_manage.route('/create', methods=['POST'])
@use_args({
    'description': fields.Str(),
    'images': fields.List(fields.Dict(), required=True),
    'name': fields.Str(required=True)
})
def create_dataset(args):
    user_id = verify_access_token(request.headers['Authorization'], verified=True)

    dataset_id = str(uuid.uuid4())
    dataset = dict(id=dataset_id,
                   created_at=datetime.now().isoformat(),
                   description=args['description'],
                   name=args['name'],
                   user_id=user_id)
    Config.db.datasets.insert_one(dataset)

    images = args['images']
    if images:
        pass

    return {}, 200
