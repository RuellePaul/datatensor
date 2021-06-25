from celery import Celery
from datetime import datetime

import errors
from config import Config
from workflows.generator.generator import main
from routers.notifications.core import insert_notification
from routers.notifications.models import NotificationPostBody, NotificationType
from utils import update_task

app = Celery('worker', broker='pyamqp://', backend='rpc://')


class CeleryConfig:
    task_serializer = 'pickle'
    result_serializer = 'pickle'
    event_serializer = 'json'
    accept_content = ['application/json', 'application/x-python-serialize']
    result_accept_content = ['application/json', 'application/x-python-serialize']


app.config_from_object(CeleryConfig)


@app.task
def generator(user_id, task_id, properties):
    try:
        main(user_id, task_id, properties)
    except errors.APIError as error:
        update_task(task_id, status='failed', error=error.detail, ended_at=datetime.now())
        notification = NotificationPostBody(type=NotificationType('TASK_FAILED'),
                                            task_id=task_id,
                                            description=error.detail)
    except Exception as e:
        message = f"An error occured {str(e) if Config.ENVIRONMENT == 'development' else ''}"
        update_task(task_id, status='failed', error=message, ended_at=datetime.now())
        notification = NotificationPostBody(type=NotificationType('TASK_FAILED'),
                                            task_id=task_id,
                                            description=message)
    else:
        update_task(task_id, status='success', progress=1, ended_at=datetime.now())
        notification = NotificationPostBody(type=NotificationType('TASK_SUCCEED'),
                                            task_id=task_id)
    finally:
        insert_notification(user_id=user_id, notification=notification)
