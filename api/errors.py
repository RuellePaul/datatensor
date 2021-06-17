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


CAPTCHA_MISSING = 'Missing google recatpcha.'
CAPTCHA_INVALID = 'Invalid captcha. Try again.'
ALREADY_VERIFIED = 'User is already verified.'
NOT_VERIFIED = 'User email is not verified.'
NOT_ADMIN = 'This action requires admin privileges.'
INVALID_CREDENTIALS = 'Invalid email or password. Please try again.'
INVALID_CODE = 'Invalid code provided.'
INVALID_PASSWORD = "Passwords don't match. Please try again."

USER_NOT_FOUND = 'User not found.'
USER_ALREADY_EXISTS = 'This user already exists'
DATASET_NOT_FOUND = 'This dataset does not exist.'
DATASET_ALREADY_EXISTS = 'This dataset already exists'
IMAGE_NOT_FOUND = 'This image does not exists.'
IMAGE_ALREADY_EXISTS = 'This image already exists.'
CATEGORY_NOT_FOUND = 'This category does not exist.'
CATEGORY_ALREADY_EXISTS = 'This category already exists.'

NOT_YOUR_DATASET = 'Action not permitted : not your dataset'
USER_HAS_A_SCOPE = 'Action not permitted : your account is linked to external authentication.'
