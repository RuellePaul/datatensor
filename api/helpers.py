import boto3

import errors
from config import Config

s3 = boto3.client(
    "s3",
    aws_access_key_id=Config.S3_KEY,
    aws_secret_access_key=Config.S3_SECRET
)


def upload_file_to_s3(file, bucket_name, acl="public-read"):
    try:
        s3.upload_fileobj(
            file,
            bucket_name,
            file.id,
            ExtraArgs={
                "ACL": acl,
                "ContentType": file.content_type
            }
        )
        path = f"{Config.S3_LOCATION}{file.id}"
        return path
    except Exception as e:
        raise errors.InternalError(f'Cannot upload file to S3, {str(e)}')


def delete_file_from_s3(image_id, bucket_name):
    try:
        s3.delete_object(
            Bucket=bucket_name,
            Key=image_id
        )
    except Exception as e:
        raise errors.InternalError(f'Cannot delete file from S3, {str(e)}')
