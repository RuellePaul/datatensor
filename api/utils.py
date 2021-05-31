import datetime
import json

from bson import json_util
from bson.objectid import ObjectId
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel, BaseConfig
from pymongo.encryption import Algorithm
from uuid import UUID

from config import Config


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
    else:
        return json_util.default(value)


def parse(data):
    return json.loads(json.dumps(jsonable_encoder(data), default=default))


def build_schema(schema):
    def handler(request):
        fields = request.args.get('fields', None)
        only = fields.split(',') if fields else None
        partial = request.method == 'PATCH'
        return schema(only=only, partial=partial, context={'request': request})

    return handler


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
        }

    @classmethod
    def from_mongo(cls, data: dict):
        if not data:
            return data
        id = data.pop('_id', None)
        return cls(**dict(data, id=id))
