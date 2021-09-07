import datetime
import json
from uuid import UUID

from bson import json_util
from bson.objectid import ObjectId
from passlib.context import CryptContext
from pydantic import BaseModel, BaseConfig
from pymongo.encryption import Algorithm

from api.config import Config

db = Config.db

password_context = CryptContext(schemes=['bcrypt'], deprecated='auto')


def encrypt_field(data):
    return Config.DB_ENCRYPT_CLIENT.encrypt(
        data,
        Algorithm.AEAD_AES_256_CBC_HMAC_SHA_512_Random,
        key_alt_name='datatensor_key'
    )


def default(value):
    if isinstance(value, (datetime.date, datetime.datetime)):
        return value.isoformat()
    elif isinstance(value, ObjectId):
        return str(value)
    elif isinstance(value, UUID):
        return str(value)
    elif isinstance(value, BaseModel):
        return value.dict()
    else:
        return json_util.default(value)


def parse(data):
    return json.loads(json.dumps(data, default=default))


def update_task(task_id, **args):
    db.tasks.find_one_and_update({'_id': task_id}, {'$set': args})


def increment_task_progress(task_id, delta):
    db.tasks.update_one(
        {'_id': task_id},
        {
            '$inc': {
                'progress': delta
            }
        }, upsert=False)


class OID(str):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        return ObjectId(str(v))


class MongoModel(BaseModel):
    class Config(BaseConfig):
        allow_population_by_field_name = True
        json_encoders = {
            datetime: lambda dt: dt.isoformat(),
            ObjectId: lambda oid: str(oid),
            UUID: lambda: str(UUID)
        }

    def mongo(self, **kwargs):
        exclude_unset = kwargs.pop('exclude_unset', True)
        by_alias = kwargs.pop('by_alias', True)

        parsed = self.dict(
            exclude_unset=exclude_unset,
            by_alias=by_alias,
            **kwargs,
        )

        # Mongo uses `_id` as default key. We should stick to that as well.
        if '_id' not in parsed and 'id' in parsed:
            parsed['_id'] = parsed.pop('id')

        return parsed

    @classmethod
    def from_mongo(cls, data: dict):
        if not data:
            return data
        id = data.pop('_id', None)
        return cls(**dict(data, id=id))


def get_unique(iterable, key):
    unique_keys = list(set([el[key] for el in iterable]))
    return [next(el for el in iterable if el[key] == unique_key) for unique_key in unique_keys]
