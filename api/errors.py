from fastapi import HTTPException


class APIError(HTTPException):
    def __init__(self, status_code, detail=None, data=None):
        super().__init__(status_code,
                         detail=detail or 'Something went wrong')
        self.data = data


class BadRequest(APIError):
    def __init__(self, detail=None, data=None):
        super().__init__(400,
                         detail=detail or 'Bad request',
                         data=data)


class InvalidAuthentication(APIError):
    def __init__(self, detail=None, data=None):
        super().__init__(401,
                         detail=detail or 'Invalid Authentication',
                         data=data)


class ExpiredAuthentication(APIError):
    def __init__(self, detail=None, data=None):
        super().__init__(401,
                         detail=detail or 'Expired authentication token',
                         data=data)


class Forbidden(APIError):
    def __init__(self, detail=None, data=None):
        super().__init__(403,
                         detail=detail or 'Forbidden',
                         data=data)


class NotFound(APIError):
    def __init__(self, detail=None, data=None):
        super().__init__(404,
                         detail=detail or 'Not found',
                         data=data)


class InternalError(APIError):
    def __init__(self, detail=None, data=None):
        super().__init__(500,
                         detail=detail or 'Internal error',
                         data=data)
