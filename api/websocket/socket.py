from fastapi import APIRouter, WebSocket
from starlette.websockets import WebSocketDisconnect
from websockets.exceptions import ConnectionClosedOK

from authentication.core import verify_access_token
from logger import logger
from routers.notifications.core import find_notifications
from routers.tasks.core import find_dataset_tasks
from utils import parse, update_task

sockets = APIRouter()


@sockets.websocket('/ws/datasets/{dataset_id}/tasks')
async def get_tasks(dataset_id: str, websocket: WebSocket):
    """
    Websocket | paginated list of tasks.
    """
    await websocket.accept()
    while True:
        try:
            access_token = await websocket.receive_text()
            user = verify_access_token(access_token)
            tasks = find_dataset_tasks(user.id, dataset_id)
            await websocket.send_json(parse(tasks))
        except ConnectionClosedOK:
            logger.notify('Websocket', f'Tasks websocket closed')
            break
        except WebSocketDisconnect:
            logger.notify('Websocket', f'Tasks websocket disconnected')
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
            logger.notify('Websocket', f'Notifications closed')
            break
        except WebSocketDisconnect:
            logger.notify('Websocket', f'Notifications websocket disconnected')
            break
