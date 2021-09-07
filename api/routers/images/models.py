from typing import List, Optional

from pydantic import BaseModel, Field

from api.utils import MongoModel


class Image(MongoModel):
    id: str = Field()
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
