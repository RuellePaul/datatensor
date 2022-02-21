from typing import List

from routers.datasets.models import DatasetExtended
from routers.images.models import Image
from routers.labels.models import Label


class Export(DatasetExtended):
    images: List[Image]
    labels: List[Label]
