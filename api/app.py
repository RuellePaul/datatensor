import os

import uvicorn
from apscheduler.schedulers.background import BackgroundScheduler
from fastapi import FastAPI, Depends, Request, WebSocket, HTTPException
from fastapi.responses import JSONResponse
from starlette.middleware.cors import CORSMiddleware

from api.authentication.auth import auth
from api.authentication.oauth import oauth
from api.config import Config
from api.database import encrypt_init
from api.dependencies import logged_user, logged_admin
from api.errors import APIError
from api.logger import logger
from api.routers.augmentor.augmentor import augmentor
from api.routers.categories.categories import categories
from api.routers.datasets.datasets import datasets
from api.routers.datasources.datasources import datasources
from api.routers.images.images import images
from api.routers.labels.labels import labels
from api.routers.notifications.notifications import notifications
from api.routers.tasks.tasks import tasks
from api.routers.users.users import users
from api.search.search import search
from api.socket.socket import sockets

app = FastAPI()

scheduler = BackgroundScheduler()
scheduler.start()

config_name = os.getenv('FLASK_UI_CONFIGURATION', 'development')

PREFIX = '/api/v2'

app.add_middleware(
    CORSMiddleware,
    allow_origins=[Config.UI_URL],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

# Socket
app.include_router(sockets)

# Authentication
app.include_router(auth, prefix=f'{PREFIX}/auth', tags=['auth'])
app.include_router(oauth, prefix=f'{PREFIX}/oauth', tags=['oauth'])

# Users | 🔒 Admin partially
app.include_router(users, prefix=f'{PREFIX}/users',
                   dependencies=[Depends(logged_user)], tags=['users'])

# Datasources | 🔒 Admin only
app.include_router(datasources, prefix=f'{PREFIX}/datasources',
                   dependencies=[Depends(logged_admin)], tags=['datasources'])

# Notifications
app.include_router(notifications, prefix=f'{PREFIX}/notifications',
                   dependencies=[Depends(logged_user)], tags=['notifications'])

# Search
app.include_router(search, prefix=f'{PREFIX}/search',
                   dependencies=[Depends(logged_user)], tags=['search'])

# Datasets
app.include_router(datasets, prefix=f'{PREFIX}/datasets',
                   dependencies=[Depends(logged_user)], tags=['datasets'])

# Augmentor
app.include_router(augmentor, prefix=f'{PREFIX}/augmentor',
                   dependencies=[Depends(logged_user)], tags=['augmentor'])

# Datasets ➤ Categories
datasets.include_router(categories, prefix='/{dataset_id}/categories', tags=['categories'])

# Datasets ➤ Images
datasets.include_router(images, prefix='/{dataset_id}/images', tags=['images'])

# Dataset ➤ Tasks
datasets.include_router(tasks, prefix='/{dataset_id}/tasks', tags=['tasks'])

# Images ➤ Labels
app.include_router(labels, prefix=f'{PREFIX}/images/{{image_id}}/labels',
                   dependencies=[Depends(logged_user)], tags=['labels'])

# Users ➤ Tasks 🔒 Admin partially
app.include_router(tasks, prefix=f'{PREFIX}/tasks', tags=['tasks'], dependencies=[Depends(logged_user)])


@app.exception_handler(HTTPException)
def handle_api_error(request: Request, error: APIError):
    logger.error(error)
    return JSONResponse(status_code=error.status_code, content={'message': error.detail, 'data': error.data})


@app.websocket('/message')
async def get_tasks(websocket: WebSocket):
    """
    Websocket | paginated list of tasks.
    """
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message text was: {data}")


if __name__ == '__main__':
    encrypt_init(Config.DB_HOST, key=Config.DB_ENCRYPTION_KEY, setup=True)
    uvicorn.run('app:app',
                host='127.0.0.1',
                port=4069,
                debug=Config.ENVIRONMENT != 'production',
                reload=Config.ENVIRONMENT == 'development')
