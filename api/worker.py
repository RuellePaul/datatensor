import functools
from datetime import datetime

from celery import Celery

import errors
from config import Config
from routers.notifications.core import insert_notification
from routers.notifications.models import NotificationPostBody, NotificationType
from utils import update_task
from workflows.augmentor import augmentor
from workflows.generator import generator

app = Celery('worker', broker='pyamqp://', backend='rpc://')


class CeleryConfig:
    task_serializer = 'pickle'
    result_serializer = 'pickle'
    event_serializer = 'json'
    accept_content = ['application/json', 'application/x-python-serialize']
    result_accept_content = ['application/json', 'application/x-python-serialize']


app.config_from_object(CeleryConfig)


def handle_task_error(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        user_id = args[0]
        task_id = args[1]
        try:
            result = func(*args, **kwargs)
        except errors.APIError as error:
            update_task(task_id, status='failed', error=error.detail, ended_at=datetime.now())
            notification = NotificationPostBody(type=NotificationType('TASK_FAILED'),
                                                task_id=task_id,
                                                description=error.detail)
            insert_notification(user_id=user_id, notification=notification)
        except Exception as e:
            message = f"An error occured {str(e) if Config.ENVIRONMENT == 'development' else ''}"
            update_task(task_id, status='failed', error=message, ended_at=datetime.now())
            notification = NotificationPostBody(type=NotificationType('TASK_FAILED'),
                                                task_id=task_id,
                                                description=message)
            insert_notification(user_id=user_id, notification=notification)
        else:
            update_task(task_id, status='success', progress=1, ended_at=datetime.now())
            notification = NotificationPostBody(type=NotificationType('TASK_SUCCEED'),
                                                task_id=task_id)
            insert_notification(user_id=user_id, notification=notification)
            return result
    return wrapper


@app.task
@handle_task_error
def run_generator(user_id, task_id, properties):
    generator.main(user_id, task_id, properties)


@app.task
@handle_task_error
def run_augmentor(user_id, task_id, properties):
    augmentor.main(user_id, task_id, properties)
