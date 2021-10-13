from fastapi import APIRouter, Depends

from dependencies import dataset_belongs_to_user
from routers.exports.core import find_exports
from routers.exports.models import *
from utils import parse

exports = APIRouter()


@exports.get('/', response_model=ExportsResponse)
async def get_exports(dataset_id, dataset=Depends(dataset_belongs_to_user)):
    """
    Get dataset exports.
    """
    response = {'exports': find_exports(dataset_id)}
    return parse(response)
