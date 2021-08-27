import logging
import os


def create_logger():
    _logger = logging.getLogger('api_logger')
    console_handler = logging.StreamHandler()

    formatter = logging.Formatter('%(asctime)s %(levelname)s %(message)s', '%Y-%m-%dT%H:%M:%S%z')
    console_handler.setFormatter(formatter)

    _logger.addHandler(console_handler)

    _logger.setLevel(logging.INFO)

    return _logger


logger = create_logger()
