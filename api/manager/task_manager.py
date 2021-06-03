from datetime import datetime

import errors
from config import Config
from manager.task_utils import update_task
from routers.notifications.core import insert_notification
from routers.notifications.models import NotificationPostBody, NotificationType

db = Config.db


async def run_task(task):
    task_id = task['_id']
    try:
        if task['type'] == 'generator':
            from manager.generator import generator
            generator.main(task['user_id'], task_id, properties=task['properties'])
    except errors.APIError as error:
        update_task(task_id, status='failed', error=error.message, ended_at=datetime.now())
        notification = NotificationPostBody(type=NotificationType('TASK_FAILED'), description=error.message)
    except Exception as e:
        message = f"An error occured {str(e) if Config.ENVIRONMENT == 'development' else ''}"
        update_task(task_id, status='failed', error=message, ended_at=datetime.now())
        notification = NotificationPostBody(type=NotificationType('TASK_FAILED'), description=message)
    else:
        update_task(task_id, status='success', ended_at=datetime.now())
        notification = NotificationPostBody(type=NotificationType('TASK_SUCCEED'))
    finally:
        insert_notification(user_id=task['user_id'], notification=notification)
