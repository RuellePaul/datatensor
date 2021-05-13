import datetime
import json

from bson import json_util
from bson.objectid import ObjectId
from pymongo.encryption import Algorithm

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
    else:
        return json_util.default(value)


def parse(data):
    return json.loads(json.dumps(data, default=default))


def build_schema(schema):
    def handler(request):
        fields = request.args.get('fields', None)
        only = fields.split(',') if fields else None
        partial = request.method == 'PATCH'
        return schema(only=only, partial=partial, context={'request': request})

    return handler
