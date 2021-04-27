from flask import Blueprint

from routes.generator import core

generator = Blueprint('generator', __name__)


@generator.route('/<dataset_id>', methods=['POST'])
def init_dataset():
    core.default_dataset_generation()
    return 'OK', 200
