from datetime import datetime
from typing import List, Optional

from pydantic import Field, BaseModel

from routers.categories.models import Category
from routers.users.models import User
from utils import MongoModel


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


class DatasetExtended(Dataset):
    categories: Optional[List[Category]]
    user: Optional[User]


class DatasetsResponse(BaseModel):
    datasets: List[DatasetExtended] = []


class DatasetResponse(BaseModel):
    dataset: DatasetExtended


class DatasetPostBody(BaseModel):
    name: str
    description: str


class DatasetPatchBody(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_public: Optional[bool] = None
