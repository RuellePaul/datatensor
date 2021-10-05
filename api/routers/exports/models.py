from datetime import datetime
from typing import List

from pydantic import Field, BaseModel

from api.routers.datasets.models import Dataset
from api.routers.images.models import Image
from api.routers.labels.models import Label
from api.utils import MongoModel


class ImageWithLabels(Image):
    labels: List[Label]


class ExportData(Dataset):
    images: List[ImageWithLabels]


class Export(MongoModel):
    id: str = Field()
    dataset_id: str
    date: datetime
    export_data: ExportData


class ExportsResponse(BaseModel):
    exports: List[Export]
