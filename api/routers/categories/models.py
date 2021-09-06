from enum import Enum
from pydantic import Field
from typing import List, Optional

from utils import BaseModel, MongoModel


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


class CategoriesResponse(BaseModel):
    categories: List[Category] = []


class CategoryResponse(BaseModel):
    category: Category


class CategoryPostBody(BaseModel):
    name: str
    supercategory: Optional[SuperCategory] = None
