import json

import flask


class APIError(Exception):
    def __init__(self, http_status, message=None, code=None, data=None):
        self.http_status = http_status
        self.code = code
        self.message = message
        self.data = data

    def __str__(self):
        return json.dumps(self.as_dict())

    def as_dict(self):
        return {'status': self.http_status,
                'code': self.code,
                'message': self.message,
                'errorData': self.data}

    def flask_response(self):
        return flask.Response(response=json.dumps(self.as_dict()),
                              status=self.http_status,
                              mimetype='application/json')


class CSRF(APIError):
    def __init__(self, message=None):
        super().__init__(302,
                         code='csrf_error',
                         message=message or 'CSRF Error',
                         data='ERR_CSRF')


class BadRequest(APIError):
    def __init__(self, message=None, data=None):
        super().__init__(400,
                         code='bad_request',
                         message=message or 'Bad request',
                         data=data)


class InvalidAuthentication(APIError):
    def __init__(self, message=None, data=None):
        super().__init__(401,
                         code='invalid_authentication',
                         message=message or 'Invalid Authentication',
                         data=data)


class ExpiredAuthentication(APIError):
    def __init__(self, message=None, data=None):
        super().__init__(401,
                         code='expired_authentication',
                         message=message or 'Expired authentication token',
                         data=data)


class Forbidden(APIError):
    def __init__(self, message=None, data=None):
        super().__init__(403,
                         code='forbidden',
                         message=message or 'Forbidden',
                         data=data)


class NotFound(APIError):
    def __init__(self, message=None, data=None):
        super().__init__(404,
                         code='not_found',
                         message=message or 'Not found',
                         data=data)


class InternalError(APIError):
    def __init__(self, message=None, data=None):
        super().__init__(500,
                         code='internal_error',
                         message=message or 'Internal error',
                         data=data)
