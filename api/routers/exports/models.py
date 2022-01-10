from typing import List

from routers.datasets.models import DatasetExtended
from routers.images.models import ImageExtended


class Export(DatasetExtended):
    images: List[ImageExtended]
