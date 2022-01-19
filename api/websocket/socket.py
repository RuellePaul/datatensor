from fastapi import APIRouter, WebSocket
from starlette.websockets import WebSocketDisconnect
from websockets.exceptions import ConnectionClosedOK

from authentication.core import verify_access_token
from logger import logger
from routers.notifications.core import find_notifications
from routers.tasks.core import find_tasks, find_users_tasks
from utils import parse, update_task

sockets = APIRouter()


@sockets.websocket('/ws/tasks')
async def get_tasks(websocket: WebSocket):
    """
    Websocket | paginated list of tasks.
    """
    await websocket.accept()
    while True:
        try:
            access_token = await websocket.receive_text()
            user = verify_access_token(access_token)
            if user.is_admin:
                tasks = find_tasks()
            else:
                tasks = find_users_tasks(user.id)
            await websocket.send_json(parse(tasks))
        except ConnectionClosedOK:
            logger.info('Tasks websocket | closed')
            break
        except WebSocketDisconnect:
            logger.info('Tasks websocket | disconnected.')
            try:
                if tasks and user:
                    for task in tasks:
                        if task.user_id == user.id and task.type == 'export' and task.status in ['pending', 'active']:
                            update_task(task.id, status="failed", error="Operation cancelled")
            except UnboundLocalError:
                pass
            break


@sockets.websocket('/ws/notifications')
async def get_tasks(websocket: WebSocket):
    """
    Websocket | paginated list of tasks.
    """
    await websocket.accept()
    while True:
        try:
            access_token = await websocket.receive_text()
            user = verify_access_token(access_token)
            result = find_notifications(user.id)
            response = {'notifications': result}
            await websocket.send_json(parse(response))
        except ConnectionClosedOK:
            logger.info('Notifications closed.')
            break
        except WebSocketDisconnect:
            logger.info('Notifications websocket | disconnected.')
            break
