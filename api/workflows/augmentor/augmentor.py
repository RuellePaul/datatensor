from routers.tasks.models import TaskAugmentorProperties
from utils import update_task


def main(user_id, task_id, properties: TaskAugmentorProperties):
    update_task(task_id, status='active')

    # TODO : 💀💀 hardcore backend here 💀💀
