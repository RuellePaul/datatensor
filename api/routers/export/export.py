import json

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

from api.dependencies import dataset_belongs_to_user
from api.routers.export.core import generate_dataset_export

export = APIRouter()


@export.get('/', response_class=JSONResponse)
async def post_export(dataset_id, dataset=Depends(dataset_belongs_to_user)):
    """
    Export a dataset and download .json.
    """
    response = generate_dataset_export(dataset)
    return JSONResponse(json.dumps(response, indent=4))
