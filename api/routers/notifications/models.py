from enum import Enum
from datetime import datetime
from typing import List, Optional

from pydantic import Field

from utils import BaseModel, MongoModel


class NotificationType(str, Enum):
    TASK_SUCCEED = 'TASK_SUCCEED'
    TASK_FAILED = 'TASK_FAILED'


class Notification(MongoModel):
    id: str = Field(alias='_id')
    user_id: str
    created_at: datetime
    type: NotificationType
    description: Optional[str] = None


class NotificationPostBody(BaseModel):
    type: NotificationType
    description: Optional[str] = None


class NotificationsResponse(BaseModel):
    notifications: List[Notification] = []


class NotificationResponse(BaseModel):
    notification: Notification
