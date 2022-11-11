import logging
from datetime import datetime

from pytz import timezone


def timetz(*args):
    return datetime.now(tz).timetuple()


tz = timezone('Europe/Paris')


def create_logger():
    logging.setLoggerClass(DatatensorLogger)
    _logger = logging.getLogger('api_logger')
    console_handler = logging.StreamHandler()

    formatter = logging.Formatter('%(asctime)s %(levelname)s %(message)s', '%Y-%m-%dT%H:%M:%S%z')
    console_handler.setFormatter(formatter)

    _logger.addHandler(console_handler)

    _logger.setLevel(logging.INFO)

    return _logger


class DatatensorLogger(logging.Logger):

    def notify(self, router, message, level='info'):
        getattr(logger, level)(f'{router} | {message}')


logger = create_logger()
