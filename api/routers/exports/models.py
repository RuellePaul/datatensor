from typing import List

from pydantic import Field, BaseModel

from routers.datasets.models import Dataset
from routers.images.models import Image
from routers.labels.models import Label
from utils import MongoModel


class ImageWithLabels(Image):
    labels: List[Label]


class ExportData(Dataset):
    images: List[ImageWithLabels]


class Export(MongoModel):
    id: str = Field()
    dataset_id: str
    export_data: ExportData


class ExportsResponse(BaseModel):
    exports: List[Export]
