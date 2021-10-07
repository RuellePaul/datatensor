from fastapi import APIRouter, Depends

from api.dependencies import dataset_belongs_to_user
from api.routers.exports.core import find_exports
from api.routers.exports.models import *
from api.utils import parse

exports = APIRouter()


@exports.get('/', response_model=ExportsResponse)
async def get_exports(dataset_id, dataset=Depends(dataset_belongs_to_user)):
    """
    Get dataset exports.
    """
    response = {'exports': find_exports(dataset_id)}
    return parse(response)
