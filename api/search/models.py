from typing import List, Union

from pydantic import BaseModel

from api.routers.categories.models import Category
from api.routers.datasets.models import Dataset
from api.routers.images.models import Image
from api.routers.users.models import User


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


class SearchUnlabeledImageIdResponse(BaseModel):
    image_id: Union[str, None]
