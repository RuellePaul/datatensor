from typing import List

from pydantic import BaseModel

from routers.datasets.models import DatasetExtended
from routers.images.models import ImageExtended
from routers.labels.models import Label
from routers.pipelines.models import Operation


class PublicDatasetResponse(BaseModel):
    datasets: List[DatasetExtended]
    images: List[ImageExtended]


class PublicSampleBody(BaseModel):
    image_id: str
    operations: List[Operation]
    labels: List[Label]


class NewsletterBody(BaseModel):
    email: str
