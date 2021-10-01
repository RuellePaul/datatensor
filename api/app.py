import os

import uvicorn
from fastapi import FastAPI, Depends, Request, HTTPException
from fastapi.responses import JSONResponse
from pydantic import ValidationError
from starlette.middleware.cors import CORSMiddleware

from api.authentication.auth import auth
from api.authentication.oauth import oauth
from api.config import Config
from api.database import encrypt_init
from api.dependencies import logged_user, logged_admin
from api.errors import APIError
from api.logger import logger
from api.routers.categories.categories import categories
from api.routers.datasets.datasets import datasets
from api.routers.datasources.datasources import datasources
from api.routers.images.images import images
from api.routers.labels.labels import labels
from api.routers.notifications.notifications import notifications
from api.routers.pipelines.pipelines import pipelines
from api.routers.tasks.tasks import tasks
from api.routers.users.users import users
from api.search.search import search
from api.socket.socket import sockets

app = FastAPI(
    title='Datatensor API',
    description='Datatensor API Documentation | With valid access token, interact with Datatensor collections such as '
                'datasets, images, labels, categories and more...',
    version='0.7.1'
)

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
