import errors
from config import Config

from manager.task_utils import update_task

db = Config.db


async def run_task(task):
    task_id = task['_id']
    try:
        if task['type'] == 'generator':
            from manager.generator import generator
            generator.main(task['user_id'], task_id, properties=task['properties'])
    except errors.APIError as error:
        update_task(task_id, status='failed', error=error.message)
        # TODO : POST NOTIFICATION
    except Exception as e:
        message = f"An error occured {str(e) if Config.ENVIRONMENT == 'development' else ''}"
        update_task(task_id, status='failed', error=message)
        # TODO : POST NOTIFICATION
    else:
        update_task(task_id, status='success')
        # TODO : POST NOTIFICATION
