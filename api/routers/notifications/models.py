from enum import Enum
from datetime import datetime
from typing import List, Optional

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
    type: NotificationType


class NotificationPostBody(BaseModel):
    type: NotificationType


class NotificationsResponse(BaseModel):
    notifications: List[Notification] = []


class NotificationResponse(BaseModel):
    notification: Notification
