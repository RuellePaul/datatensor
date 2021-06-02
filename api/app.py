import os

import uvicorn
from apscheduler.schedulers.background import BackgroundScheduler
from fastapi import FastAPI, Depends, Request
from starlette.middleware.cors import CORSMiddleware

import errors
from authentication.auth import auth
from authentication.oauth import oauth
from config import Config
from database import encrypt_init
from dependencies import logged_user
from logger import logger
from routers.categories.categories import categories
from routers.datasets.datasets import datasets
from routers.images.images import images
from routers.labels.labels import labels
from routers.notifications.notifications import notifications
from routers.pipelines.pipelines import pipelines
from routers.tasks.tasks import tasks
from routers.users.users import users

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

app.include_router(auth,
                   prefix=f'{PREFIX}/auth',
                   tags=['auth'])
app.include_router(oauth,
                   prefix=f'{PREFIX}/oauth',
                   tags=['oauth'])

app.include_router(users,
                   prefix=f'{PREFIX}/users',
                   dependencies=[Depends(logged_user)],
                   tags=['users'])

app.include_router(notifications, prefix=f'{PREFIX}/notifications',
                   dependencies=[Depends(logged_user)],
                   tags=['notifications'])

app.include_router(datasets,
                   prefix=f'{PREFIX}/datasets',
                   dependencies=[Depends(logged_user)],
                   tags=['datasets'])
datasets.include_router(categories, prefix='/{dataset_id}/categories', tags=['categories'])
datasets.include_router(images, prefix='/{dataset_id}/images', tags=['images'])
datasets.include_router(pipelines, prefix='/{dataset_id}/pipelines', tags=['pipelines'])

app.include_router(labels,
                   prefix=f'{PREFIX}/images/<image_id>/labels',
                   dependencies=[Depends(logged_user)],
                   tags=['labels'])

app.include_router(tasks,
                   prefix=f'{PREFIX}/tasks',
                   dependencies=[Depends(logged_user)],
                   tags=['tasks'])
app.include_router(tasks,
                   prefix=f'{PREFIX}/users/<user_id>/tasks',
                   dependencies=[Depends(logged_user)],
                   tags=['tasks'])
app.include_router(tasks,
                   prefix=f'{PREFIX}/datasets/<dataset_id>/tasks',
                   dependencies=[Depends(logged_user)],
                   tags=['tasks'])


@app.exception_handler(errors.APIError)
def handle_api_error(request: Request, error: errors.APIError):
    logger.error(error)
    return error.json_response()


if __name__ == '__main__':
    encrypt_init(Config.DB_HOST, key=Config.DB_ENCRYPTION_KEY, setup=True)
    uvicorn.run('app:app',
                host='127.0.0.1',
                port=4069,
                debug=Config.ENVIRONMENT != 'production',
                reload=Config.ENVIRONMENT == 'development')
