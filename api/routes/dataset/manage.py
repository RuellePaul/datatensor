import uuid
from datetime import datetime

from flask import Blueprint, request
from webargs import fields
from webargs.flaskparser import use_args

from config import Config
from routes.authentication.core import verify_access_token

dataset_manage = Blueprint('dataset_manage', __name__)


@dataset_manage.route('/create', methods=['POST'])
@use_args({
    'name': fields.Str(required=True),
    'description': fields.Str(),
    'files': fields.List(fields.Dict(), required=True),
})
def create_dataset(args):
    user_id = verify_access_token(request.headers['Authorization'])

    dataset_id = str(uuid.uuid4())
    dataset = dict(id=dataset_id,
                   name=args['name'],
                   description=args['description'],
                   createdAt=datetime.now().isoformat(),
                   user_id=user_id)
    Config.db.datasets.insert_one(dataset)

    files = args['files']
    if files:
        pass

    return {}, 200
