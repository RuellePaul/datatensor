from enum import Enum
from datetime import datetime
from typing import Optional

from pydantic import Field

from utils import BaseModel, MongoModel


class NotificationType(str, Enum):
    EMAIL_CONFIRM_REQUIRED = 'EMAIL_CONFIRM_REQUIRED'
    EMAIL_CONFIRM_DONE = 'EMAIL_CONFIRM_DONE'
    REGISTRATION = 'REGISTRATION'
    TASK_SUCCEED = 'TASK_SUCCEED'
    TASK_FAILED = 'TASK_FAILED'


class Notification(MongoModel):
    id: str = Field(alias='_id')
    user_id: str
    created_at: datetime
    opened: bool
    type: NotificationType
    task_id: Optional[str] = None


class NotificationPostBody(BaseModel):
    type: NotificationType
    task_id: Optional[str] = None
    description: Optional[str] = None
