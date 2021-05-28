from flask import Blueprint

from utils import parse
from .core import find_datasources

datasources = Blueprint('datasources', __name__)


@datasources.route('/')
def get_datasources():
    result = find_datasources()
    return {'datasources': parse(result)}, 200
