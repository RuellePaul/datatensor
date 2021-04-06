from flask import Blueprint, request
from werkzeug.utils import secure_filename

from config import Config
from helpers import upload_file_to_s3

images_upload = Blueprint('images_upload', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@images_upload.route('/', methods=['POST'])
def upload_images():
    for file in request.files.values():
        if file and allowed_file(file.filename):
            file.filename = secure_filename(file.filename)
            upload_file_to_s3(file, Config.S3_BUCKET)

    return 'OK', 200
