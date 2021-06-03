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


def filter_annotations(json_remote_dataset, selected_categories, image_count=None):
    categories_remote = [category for category in json_remote_dataset['categories']
                         if category['name'] in selected_categories]
    category_ids = [category['id'] for category in categories_remote]

    labels_remote = [label for label in json_remote_dataset['annotations']
                     if label['category_id'] in category_ids]
    label_ids = [label['image_id'] for label in labels_remote]

    images_remote = [image for image in json_remote_dataset['images'] if image['id'] in label_ids]
    if image_count:
        images_remote = images_remote[:image_count]
    return images_remote, categories_remote, labels_remote
