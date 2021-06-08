from fastapi import APIRouter, WebSocket
from websockets.exceptions import ConnectionClosedOK
from starlette.websockets import WebSocketDisconnect

from api.logger import logger
from api.utils import parse
from authentication.core import verify_access_token
from routers.tasks.core import find_tasks, find_users_tasks
from routers.users.models import User

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
            user = User.from_mongo(verify_access_token(access_token))
            if user.is_admin:
                tasks = find_tasks()
            else:
                tasks = find_users_tasks(user)
            await websocket.send_json(parse(tasks))
        except ConnectionClosedOK:
            logger.info('Connexion closed.')
            break
        except WebSocketDisconnect:
            logger.warning('Connexion websocket disconnected.')
            break
