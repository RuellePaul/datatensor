from typing import List

from pydantic import BaseModel

from routers.categories.models import Category
from routers.datasets.models import Dataset
from routers.images.models import Image
from routers.users.models import User


class SearchDatatensorResult(BaseModel):
    datasets: List[Dataset]
    categories: List[Category]
    images: List[Image]
    users: List[User]


class SearchDatatensorResponse(BaseModel):
    result: SearchDatatensorResult


class SearchDatasetsPayload(BaseModel):
    category_names: List[str]


class SearchCategoriesResponse(BaseModel):
    categories: List[Category]


class SearchDatasetsResponse(BaseModel):
    dataset_ids: List[str]
