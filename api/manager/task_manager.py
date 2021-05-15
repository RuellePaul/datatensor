import pymongo
from bson.objectid import ObjectId

import errors
from config import Config
from logger import logger

db = Config.db


async def run_task(task):
    task_id = task['_id']
    try:
        if task['type'] == 'generator':
            from manager.generator import generator
            generator.main(task['user_id'], task_id, properties=task['properties'])
    except errors.APIError as error:
        update_task(task_id, status='failed', error=error.message)
    except Exception as e:
        logger.error(f'Task {task_id} failed : {str(e)}')
        message = f"An error occured {str(e) if Config.ENVIRONMENT == 'development' else ''}"
        update_task(task_id, status='failed', error=message)


def update_task(task_id, **args):
    db.tasks.find_one_and_update({'_id': ObjectId(task_id)}, {'$set': args})


def increment_task_progress(task_id, delta):
    db.tasks.update_one(
        {
            '_id': task_id
        },
        {
            '$inc': {
                'progress': delta
            }
        }, upsert=False)
