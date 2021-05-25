import errors
from config import Config

from manager.task_utils import update_task
from routes.notifications.core import insert_notification

db = Config.db


async def run_task(task):
    task_id = task['_id']
    try:
        if task['type'] == 'generator':
            from manager.generator import generator
            generator.main(task['user_id'], task_id, properties=task['properties'])
    except errors.APIError as error:
        update_task(task_id, status='failed', error=error.message)
        notification = dict(type='TASK_FAILED', description=error.message)
    except Exception as e:
        message = f"An error occured {str(e) if Config.ENVIRONMENT == 'development' else ''}"
        update_task(task_id, status='failed', error=message)
        notification = dict(type='TASK_FAILED', description=message)
    else:
        update_task(task_id, status='success')
        notification = dict(type='TASK_SUCCEED')
    finally:
        insert_notification(notification, user_id=task['user_id'])
