import os
import json

from fastapi import APIRouter

from config import Config
from .models import PublicDatasetResponse

db = Config.db

public = APIRouter()


@public.get('/', response_model=PublicDatasetResponse)
def get_public_data():
    public_data_path = os.path.join(Config.ROOT_PATH, 'api', 'public')
    json_file = open(os.path.join(public_data_path, 'public_data.json'), 'r')
    public_data = json.load(json_file)
    return public_data
