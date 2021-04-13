import uuid
from flask import Blueprint, request
from io import BytesIO
from PIL import Image
from werkzeug.utils import secure_filename

from config import Config
from helpers import upload_file_to_s3

images_upload = Blueprint('images_upload', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def upload_file(file):
    file.filename = secure_filename(file.filename)
    path = upload_file_to_s3(file, Config.S3_BUCKET)
    return path


@images_upload.route('/<dataset_id>', methods=['POST'])
def upload_images(dataset_id):

    images = []

    for file in request.files.values():
        file.id = str(uuid.uuid4())

        if file and allowed_file(file.filename):
            image = Image.open(BytesIO(file.stream.read()))
            images.append({
                'id': file.id,
                'dataset_id': dataset_id,
                'path': upload_file(file),
                'name': secure_filename(file.filename),
                'size': 0,  # TODO : size
                'width': image.width,
                'height': image.height
            })

    Config.db.images.insert_many(images)

    return 'OK', 200
