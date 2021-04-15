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


def get_size(file):
    if file.content_length:
        return file.content_length

    try:
        pos = file.tell()
        file.seek(0, 2)  # seek to end
        size = file.tell()
        file.seek(pos)  # back to original position
        return size
    except (AttributeError, IOError):
        pass

    return 0


def upload_images(dataset_id, request_files):
    images = []
    for file in request_files.values():
        file.id = str(uuid.uuid4())
        if file and allowed_file(file.filename):
            name = secure_filename(file.filename)
            size = get_size(file)  # TODO : compression / conversion before upload
            images.append({
                'id': file.id,
                'dataset_id': dataset_id,
                'path': upload_file(file),
                'name': name,
                'size': size,
                'width': 0,  # TODO : resolution
                'height': 0
            })

    Config.db.images.insert_many(images)

    for image in images:
        image.pop('_id', None)

    return images
