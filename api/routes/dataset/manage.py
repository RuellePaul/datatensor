from flask import Blueprint
from webargs import fields
from webargs.flaskparser import use_args

from logger import logger

dataset_manage = Blueprint('dataset_manage', __name__)


@dataset_manage.route('/create', methods=['POST'])
@use_args({
    'name': fields.Str(required=True),
    'description': fields.Str(),
    'files': fields.List(fields.Dict(), required=True),
})
def func_name(args):
    print(args)
    return {}, 200
