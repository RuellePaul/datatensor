from typing import List

from pydantic import BaseModel

from routers.categories.models import Category
from routers.datasets.models import Dataset
from routers.images.models import Image, ImageWithBase64
from routers.labels.models import Label
from routers.pipelines.models import Operation


class PublicDatasetResponse(BaseModel):
    datasets: List[Dataset]
    categories: List[Category]
    images: List[Image]
    labels: List[Label]
