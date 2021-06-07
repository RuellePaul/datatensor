from fastapi import APIRouter, WebSocket
from websockets.exceptions import ConnectionClosedOK
from routers.tasks.core import find_tasks

from api.utils import parse
from api.logger import logger

sockets = APIRouter()


@sockets.websocket('/ws/tasks')
async def get_tasks(websocket: WebSocket):
    """
    Websocket | paginated list of tasks.
    """
    await websocket.accept()
    while True:
        try:
            await websocket.receive()
            tasks = find_tasks()
            await websocket.send_json(parse(tasks))
        except ConnectionClosedOK:
            logger.warning('Connexion websocket break')
            break
