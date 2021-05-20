from bson.objectid import ObjectId

from config import Config

db = Config.db


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
