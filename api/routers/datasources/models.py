from enum import Enum
from typing import List, Optional

from pydantic import AnyHttpUrl

from routers.categories.models import SuperCategory
from utils import BaseModel


class DatasourceKey(str, Enum):
    coco2014 = 'coco2014'
    coco2017 = 'coco2017'


class Datasource(BaseModel):
    key: DatasourceKey
    name: str
    download_url: AnyHttpUrl
    filenames: List[str]


class DatasourcesResponse(BaseModel):
    datasources: List[Datasource]


class DatasourceCategory(BaseModel):
    name: str
    labels_count: int
    supercategory: Optional[SuperCategory] = None


class DatasourceCategoriesResponse(BaseModel):
    categories: List[DatasourceCategory] = []


class DatasourceMaxImageCountBody(BaseModel):
    datasource_key: DatasourceKey
    selected_categories: List[str]


class DatasourceMaxImageCountResponse(BaseModel):
    max_image_count: int
