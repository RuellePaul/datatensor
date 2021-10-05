from api.routers.datasets.models import Dataset
from api.routers.images.core import find_all_images
from api.routers.labels.core import find_labels
from api.utils import parse


def generate_dataset_export(dataset: Dataset) -> dict:
    response = {
        **parse(dataset),
        'images': []
    }

    images = find_all_images(dataset.id)

    response['images'] = [{
        **parse(image),
        'labels': [{
            **parse(label)
        } for label in find_labels(image.id)]
    } for image in images]

    return response
