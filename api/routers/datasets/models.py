from datetime import datetime
from typing import List

from pydantic import Field, BaseModel

from utils import  MongoModel


class Dataset(MongoModel):
    id: str = Field(alias='_id')
    user_id: str
    name: str
    description: str
    is_public: bool = False
    created_at: datetime
    image_count: int


class DatasetsResponse(BaseModel):
    datasets: List[Dataset] = []


class DatasetResponse(BaseModel):
    dataset: Dataset


class DatasetPostBody(BaseModel):
    name: str
    description: str
    is_public: bool = False
