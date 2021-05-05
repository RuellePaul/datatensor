from flask import Blueprint
from webargs import fields
from webargs.flaskparser import use_args

from routes.objects import core

object_manage = Blueprint('object_manage', __name__)


@object_manage.route('/', methods=['POST'])
@use_args({
    'name': fields.Str(required=True),
    'supercategory': fields.Str(),
    'dataset_id': fields.Str(required=True)
})
def create_object(args):
    object = core.create_object(name=args['name'],
                                supercategory=args.get('supercategory'),
                                dataset_id=args['dataset_id'])
    return object, 200
