from enum import Enum
from typing import List

from pydantic import BaseModel


class OperationType(str, Enum):
    ROTATE = 'rotate'
    FLIP = 'flip'
    SKEW = 'skew'
    SCALE = 'scale'
    CROP = 'crop'
    SHEAR = 'shear'
    ELASTIC_DISTORTION = 'elastic_distortion'
    GAUSSIAN_DISTORTION = 'gaussian_distortion'
    RANDOM_BRIGHTNESS = 'random_brightness'
    RANDOM_COLOR = 'random_color'
    RANDOM_CONTRAST = 'random_contrast'
    HISTOGRAM_EQUALISATION = 'histogram_equalisation'
    INVERT = 'invert'
    GREY_SCALE = 'grey_scale'
    BLACK_AND_WHITE = 'black_and_white'


class Operation(BaseModel):
    id: str
    type: OperationType
    probability: float


class SampleBody(BaseModel):
    dataset_id: str
    image_id: str
    operations: List[Operation]
