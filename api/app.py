import os

import uvicorn
from fastapi import FastAPI, Depends, Request, HTTPException
from fastapi.responses import JSONResponse
from pydantic import ValidationError
from starlette.middleware.cors import CORSMiddleware

from authentication.auth import auth
from authentication.oauth import oauth
from config import Config
from database import encrypt_init
from dependencies import logged_user, logged_admin
from errors import APIError
from logger import logger
from routers.categories.categories import categories
from routers.datasets.datasets import datasets
from routers.datasources.datasources import datasources
from routers.exports.exports import exports
from routers.images.images import images
from routers.labels.labels import labels
from routers.notifications.notifications import notifications
from routers.pipelines.pipelines import pipelines
from routers.tasks.tasks import tasks
from routers.users.users import users
from search.search import search
from websocket.socket import sockets

PREFIX = '/v2'

app = FastAPI(
    title='Datatensor API',
    version='0.7.1',
    docs_url=f'{PREFIX}/docs'
)

config_name = os.getenv('FLASK_UI_CONFIGURATION', 'development')

app.add_middleware(
    CORSMiddleware,
    allow_origins=[Config.UI_URL, Config.API_URI],
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

# Datasets ➤ Categories
datasets.include_router(categories, prefix='/{dataset_id}/categories', tags=['categories'])

# Datasets ➤ Pipelines
datasets.include_router(pipelines, prefix='/{dataset_id}/pipelines', tags=['pipelines'])

# Images ➤ Labels
images.include_router(labels, prefix='/{image_id}/labels', tags=['labels'])

# Datasets ➤ Images
datasets.include_router(images, prefix='/{dataset_id}/images', tags=['images'])

# Dataset ➤ Tasks
datasets.include_router(tasks, prefix='/{dataset_id}/tasks', tags=['tasks'])

# Dataset ➤ Exports
datasets.include_router(exports, prefix='/{dataset_id}/exports', tags=['exports'])

# Users ➤ Tasks 🔒 Admin partially
app.include_router(tasks, prefix=f'{PREFIX}/tasks', tags=['tasks'], dependencies=[Depends(logged_user)])


@app.exception_handler(HTTPException)
def handle_api_error(request: Request, error: APIError):
    logger.error(error)
    return JSONResponse(status_code=error.status_code, content={'message': error.detail, 'data': error.data})


@app.exception_handler(ValidationError)
def handle_api_error(request: Request, error: ValidationError):
    logger.error(error)
    return JSONResponse(status_code=500, content={'message': error.json()})


if __name__ == '__main__':
    encrypt_init(Config.DB_HOST, key=Config.DB_ENCRYPTION_KEY, setup=True)
    uvicorn.run('app:app',
                host='127.0.0.1',
                port=4069,
                debug=Config.ENVIRONMENT != 'production',
                reload=Config.ENVIRONMENT == 'development')
