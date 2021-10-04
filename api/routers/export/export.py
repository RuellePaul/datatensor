from fastapi import APIRouter, Depends

from api.dependencies import dataset_belongs_to_user

export = APIRouter()


@export.post('/')
async def post_export(dataset_id, dataset=Depends(dataset_belongs_to_user)):
    """
    Export a dataset and download .json.
    """
    print(dataset)
