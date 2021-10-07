from datetime import datetime
from typing import List, Optional

from pydantic import Field, BaseModel

from api.utils import MongoModel


class Dataset(MongoModel):
    id: str = Field()
    user_id: str
    name: str
    description: str
    is_public: bool = False
    created_at: datetime
    image_count: int
    augmented_count: int = 0
    exported_at: Optional[datetime] = None


class DatasetsResponse(BaseModel):
    datasets: List[Dataset] = []


class DatasetResponse(BaseModel):
    dataset: Dataset


class DatasetPostBody(BaseModel):
    name: str
    description: str
    is_public: bool = False


class DatasetPatchBody(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_public: Optional[bool] = None
