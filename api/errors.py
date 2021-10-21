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
USER_NOT_VERIFIED = 'User email is not verified.'
USER_NOT_ADMIN = 'This action requires admin privileges.'
USER_IS_ADMIN = 'This user has admin privileges.'
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
PIPELINE_NOT_FOUND = 'This pipeline does not exist.'
PIPELINE_ALREADY_EXISTS = 'This pipeline already exists.'
LABEL_NOT_FOUND = 'This label does not exist.'
LABEL_ALREADY_EXISTS = 'This label already exists.'
TASK_NOT_FOUND = 'This task does not exist.'
TASK_ALREADY_EXISTS = 'This task already exists.'
NOTIFICATION_NOT_FOUND = 'This notification does not exist.'
NOTIFICATION_ALREADY_EXISTS = 'This notification already exists.'

NOT_YOUR_DATASET = 'Action not permitted : not your dataset'
USER_HAS_A_SCOPE = 'Action not permitted : your account is linked to external authentication.'
TOO_MANY_PIPELINES = 'Action not permitted : this dataset already has augmented images.'
