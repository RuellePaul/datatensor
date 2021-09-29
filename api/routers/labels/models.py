from typing import Dict, List, Optional

from pydantic import BaseModel, Field

from api.utils import MongoModel


class Label(MongoModel):
    id: str = Field()
    x: float
    y: float
    w: float
    h: float
    image_id: Optional[str] = None
    category_id: Optional[str] = None


class LabelsResponse(BaseModel):
    labels: List[Label] = []


class LabelResponse(BaseModel):
    label: Label


class LabelPostBody(BaseModel):
    labels: List[Label]
