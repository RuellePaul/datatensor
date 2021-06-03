from pydantic import Field
from typing import List, Optional

from utils import BaseModel, MongoModel


class Image(MongoModel):
    id: str = Field(alias='_id')
    dataset_id: str
    path: str
    name: str
    size: int
    width: int
    height: int
    pipeline_id: Optional[str] = None


class ImagesResponse(BaseModel):
    images: List[Image] = []


class ImageResponse(BaseModel):
    image: Image
