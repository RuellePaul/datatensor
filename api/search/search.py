from fastapi import APIRouter, Depends

from dependencies import dataset_belongs_to_user, logged_user
from search.core import search_categories, search_dataset_ids_from_category_names, search_unlabeled_image_id
from search.models import *
from utils import parse

search = APIRouter()


@search.get('/categories', response_model=SearchCategoriesResponse)
def search_unique_public_categories(user: User = Depends(logged_user)):
    response = {
        'categories': search_categories(user.id)
    }
    return parse(response)


@search.post('/datasets', response_model=SearchDatasetsResponse)
def search_datasets_from_category_names(payload: SearchDatasetsPayload):
    response = {
        'dataset_ids': search_dataset_ids_from_category_names(payload.category_names)
    }
    return parse(response)


@search.post('/datasets/{dataset_id}/unlabeled-image-id', response_model=SearchUnlabeledImageIdResponse)
def search_next_unlabeled_image(dataset_id,
                                offset: int = 0,
                                dataset=Depends(dataset_belongs_to_user)):
    response = {
        'image_id': search_unlabeled_image_id(dataset_id, offset)
    }
    return parse(response)
