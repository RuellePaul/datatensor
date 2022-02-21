from enum import Enum
from typing import List

from pydantic import BaseModel, Field
from routers.labels.models import Label

from utils import MongoModel


class OperationType(str, Enum):
    ROTATE = 'rotate'
    FLIP_RANDOM = 'flip_random'
    SKEW = 'skew'
    CROP_RANDOM = 'crop_random'
    SHEAR = 'shear'
    RANDOM_DISTORTION = 'random_distortion'
    GAUSSIAN_DISTORTION = 'gaussian_distortion'
    RANDOM_BRIGHTNESS = 'random_brightness'
    RANDOM_COLOR = 'random_color'
    RANDOM_CONTRAST = 'random_contrast'
    HISTOGRAM_EQUALISATION = 'histogram_equalisation'
    INVERT = 'invert'
    GREYSCALE = 'greyscale'


class Operation(BaseModel):
    id: str
    type: OperationType
    probability: float
    properties: dict


class Pipeline(MongoModel):
    id: str = Field()
    dataset_id: str
    image_count: int
    operations: List[Operation]


class PipelinesResponse(BaseModel):
    pipelines: List[Pipeline]


class SampleBody(BaseModel):
    operations: List[Operation]


class SampleResponse(BaseModel):
    images: List[str]  # base64 encoded
    images_labels: List[List[Label]]
