from typing import List, Optional

from pydantic import BaseModel, Field

from routers.labels.models import Label
from utils import MongoModel


class Image(MongoModel):
    id: str = Field()
    dataset_id: str
    path: str
    name: str
    size: int
    width: int
    height: int
    pipeline_id: Optional[str] = None
    original_image_id: Optional[str] = None


class ImageExtended(Image):
    labels: Optional[List[Label]]


class ImagesResponse(BaseModel):
    images: List[ImageExtended] = []


class ImageIdsResponse(BaseModel):
    image_ids: List[str] = []


class ImageResponse(BaseModel):
    image: Image


class ImageDeleteResponse(BaseModel):
    deleted_count: int
