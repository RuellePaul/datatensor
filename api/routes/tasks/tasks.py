from flask import Blueprint
from webargs import fields
from webargs.flaskparser import use_args

from utils import parse
from .core import find_tasks, insert_task

tasks = Blueprint('tasks', __name__)


@tasks.route('/')
@use_args({
    'offset': fields.Int(required=False, missing=0),
    'limit': fields.Int(required=False, missing=0)
}, location='query')
def get_tasks(args, user_id=None, dataset_id=None):
    result = find_tasks(user_id, dataset_id, args['offset'], args['limit'])
    return {'tasks': parse(result)}, 200


@tasks.route('/', methods=['POST'])
@use_args({
    'type': fields.Str(required=True),
    'properties': fields.Dict(required=True)
})
def post_task(args, dataset_id=None):
    result = insert_task(dataset_id, args['type'], args['properties'])
    return {'task': parse(result)}, 200
