from pydantic import Field
from typing import List

from utils import BaseModel, MongoModel


class Dataset(MongoModel):
    id: str = Field(alias='_id')
    name: str
    description: str
    is_public: bool = False


class DatasetsResponse(BaseModel):
    datasets: List[Dataset] = []


class DatasetResponse(BaseModel):
    dataset: Dataset


class DatasetPostBody(BaseModel):
    name: str
    description: str
    is_public: bool = False
