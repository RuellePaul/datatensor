from typing import List

from pydantic import BaseModel

from routers.categories.models import Category
from routers.datasets.models import Dataset
from routers.images.models import Image
from routers.users.models import User


class SearchResult(BaseModel):
    datasets: List[Dataset]
    categories: List[Category]
    images: List[Image]
    users: List[User]


class SearchResponse(BaseModel):
    result: SearchResult
