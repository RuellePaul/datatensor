from flask import Blueprint, jsonify
from webargs import fields
from webargs.flaskparser import use_args

from config import Config
from routes.objects import core

object_manage = Blueprint('object_manage', __name__)


@object_manage.route('/', methods=['POST'])
@use_args({
    'name': fields.Str(required=True),
    'supercategory': fields.Str()
})
def create_object(args):
    core.create_object(**args)
    return 'OK', 200
