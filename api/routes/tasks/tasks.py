from flask import Blueprint
from webargs import fields
from webargs.flaskparser import use_args

from utils import parse
from .core import find_tasks

tasks = Blueprint('tasks', __name__)


@tasks.route('/')
@use_args({
    'offset': fields.Int(required=False, missing=0),
    'limit': fields.Int(required=False, missing=0)
}, location='query')
def get_tasks(args, user_id=None, dataset_id=None):
    result = find_tasks(user_id, dataset_id, args['offset'], args['limit'])
    return {'tasks': parse(result)}, 200
