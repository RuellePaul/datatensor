import errors
from config import Config
from routers.exports.models import *

db = Config.db


def find_exports(dataset_id) -> List[Export]:
    exports = list(db.exports.find({'dataset_id': dataset_id}))
    if exports is None:
        raise errors.NotFound(errors.LABEL_NOT_FOUND)
    return [Export.from_mongo(export) for export in exports]
