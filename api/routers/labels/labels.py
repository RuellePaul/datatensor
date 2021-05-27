from fastapi import APIRouter
from webargs import fields
from webargs.flaskparser import use_args

from utils import parse
from .core import find_labels, find_label, remove_labels, remove_label, insert_labels

labels = APIRouter()


@labels.get('/')
@use_args({
    'offset': fields.Int(required=False, missing=0),
    'limit': fields.Int(required=False, missing=0)
}, location='query')
def get_labels(args, image_id):
    result = find_labels(image_id, args['offset'], args['limit'])
    return {'labels': parse(result)}, 200


@labels.get('/<label_id>')
def get_label(image_id, label_id):
    result = find_label(image_id, label_id)
    return {'label': parse(result)}, 200


@labels.post('/')
@use_args({
    'labels': fields.List(fields.Dict(), required=True)
})
def post_labels(args, image_id):
    insert_labels(image_id, args['labels'])
    return 'OK', 200


@labels.delete('/')
def delete_labels(image_id):
    remove_labels(image_id)
    return 'OK', 200


@labels.delete('/<label_id>')
def delete_label(image_id, label_id):
    remove_label(image_id, label_id)
    return 'OK', 200
