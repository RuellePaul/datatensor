from fastapi import APIRouter
from webargs import fields
from webargs.flaskparser import use_args

from routers.tasks.core import find_tasks, insert_task

tasks = APIRouter()


@tasks.get('/')
@use_args({
    'offset': fields.Int(required=False, missing=0),
    'limit': fields.Int(required=False, missing=0)
}, location='query')
async def get_tasks(args, user_id=None, dataset_id=None):
    result = find_tasks(user_id, dataset_id, args['offset'], args['limit'])
    return {'tasks': parse(result)}


@tasks.post('/')
@use_args({
    'type': fields.Str(required=True),
    'properties': fields.Dict(required=True)
})
async def post_task(args, dataset_id=None):
    result = insert_task(dataset_id, args['type'], args['properties'])
    return {'task': parse(result)}
