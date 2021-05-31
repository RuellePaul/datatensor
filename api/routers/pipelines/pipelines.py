from fastapi import APIRouter
from webargs import fields
from webargs.flaskparser import use_args

from routers.pipelines.core import find_pipeline, find_pipelines

pipelines = APIRouter()


@pipelines.get('/')
@use_args({
    'offset': fields.Int(required=False, missing=0),
    'limit': fields.Int(required=False, missing=0)
})
async def get_pipelines(args, dataset_id):
    result = find_pipelines(dataset_id, args['offset'], args['limit'])
    return {'pipelines': parse(result)}


@pipelines.get('/{pipeline_id}')
async def get_pipeline(dataset_id, pipeline_id):
    result = find_pipeline(dataset_id, pipeline_id)
    return {'pipeline': parse(result)}
