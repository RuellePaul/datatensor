import uuid

from werkzeug.utils import secure_filename

from config import Config
from helpers import upload_file_to_s3

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def upload_file(file):
    file.filename = secure_filename(file.filename)
    path = upload_file_to_s3(file, Config.S3_BUCKET)
    return path


def upload_images(dataset_id, request_files):
    images = []
    for file in request_files.values():
        file.id = str(uuid.uuid4())
        if file and allowed_file(file.filename):
            images.append({
                'id': file.id,
                'dataset_id': dataset_id,
                'path': upload_file(file),
                'name': secure_filename(file.filename),
                'size': 0,  # TODO : size
                'width': 0,
                'height': 0
            })

    Config.db.images.insert_many(images)

    for image in images:
        image.pop('_id', None)

    return images
