from typing import List, Optional

from pydantic import BaseModel, Field

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


class ImageWithBase64(Image):
    base64: str


class ImagesResponse(BaseModel):
    images: List[Image] = []


class ImageIdsResponse(BaseModel):
    image_ids: List[str] = []


class ImageResponse(BaseModel):
    image: Image
