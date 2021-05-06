from flask import Blueprint
from webargs import fields
from webargs.flaskparser import use_args

from routes.categories import core

category_manage = Blueprint('category_manage', __name__)


@category_manage.route('/', methods=['POST'])
@use_args({
    'name': fields.Str(required=True),
    'supercategory': fields.Str(),
    'dataset_id': fields.Str(required=True)
})
def create_category(args):
    category = core.create_category(name=args['name'],
                                    supercategory=args.get('supercategory'),
                                    dataset_id=args['dataset_id'])
    return category, 200
