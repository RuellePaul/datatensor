from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field

from routers.images.models import Image
from utils import MongoModel


class SuperCategory(str, Enum):
    person = 'person'
    vehicle = 'vehicle'
    electronic = 'electronic'
    indoor = 'indoor'
    outdoor = 'outdoor'
    sports = 'sports'
    furniture = 'furniture'
    accessory = 'accessory'
    kitchen = 'kitchen'
    animal = 'animal'
    appliance = 'appliance'
    food = 'food'
    miscellaneous = 'miscellaneous'


class Category(MongoModel):
    id: str = Field()
    dataset_id: str
    name: str
    supercategory: Optional[SuperCategory] = None
    labels_count: Optional[int] = None


class CategoriesResponse(BaseModel):
    categories: List[Category] = []


class CategoryResponse(BaseModel):
    category: Category


class ImagesCategoryResponse(BaseModel):
    images: List[Image]
    total_count: int


class CategoryPostBody(BaseModel):
    name: str
    supercategory: Optional[SuperCategory] = None
