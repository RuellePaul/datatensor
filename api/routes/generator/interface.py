from flask import Blueprint

from routes.generator import core

generator = Blueprint('generator', __name__)


@generator.route('/coco', methods=['POST'])
def init_dataset():
    core.coco_dataset_generation()
    return 'OK', 200
