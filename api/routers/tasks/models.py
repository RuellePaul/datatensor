from datetime import datetime
from enum import Enum
from typing import List, Optional, Union

from pydantic import BaseModel, Field

from routers.datasources.models import DatasourceKey
from utils import MongoModel


class TaskType(str, Enum):
    generator = 'generator'
    augmentor = 'augmentor'


class TaskStatus(str, Enum):
    pending = 'pending'
    active = 'active'
    success = 'success'
    failed = 'failed'


class TaskGeneratorProperties(BaseModel):
    datasource_key: DatasourceKey
    selected_categories: List[str]
    image_count: int


class TaskAugmentorProperties(BaseModel):
    pass


TaskProperties = Union[TaskGeneratorProperties, TaskAugmentorProperties]


class Task(MongoModel):
    id: str = Field()
    user_id: str
    dataset_id: Optional[str] = None
    type: TaskType
    properties: TaskProperties
    status: TaskStatus
    progress: float
    created_at: datetime
    ended_at: Optional[datetime] = None
    error: Optional[str] = None


class TaskResponse(BaseModel):
    task: Task


class TaskPostBody(BaseModel):
    type: TaskType
    properties: TaskProperties
