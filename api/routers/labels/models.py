from pydantic import Field
from typing import List, Optional

from utils import BaseModel, MongoModel


class Label(MongoModel):
    id: str = Field()
    image_id: str
    x: float
    y: float
    w: float
    h: float
    category_id: Optional[str] = None


class LabelsResponse(BaseModel):
    labels: List[Label] = []


class LabelResponse(BaseModel):
    label: Label


class LabelPostBody(BaseModel):
    labels: List[Label]
