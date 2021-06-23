from fastapi.testclient import TestClient

import errors
from app import app, PREFIX
from routers.datasets.models import DatasetPostBody, DatasetsResponse, DatasetResponse
from tests.conftest import Store

client = TestClient(app)


class TestDatasets:

    def test_valid_get_datasets(self):
        response = client.get(f'{PREFIX}/datasets/',
                              headers={'Authorization': Store.access_token})
        assert response.status_code == 200
        assert DatasetsResponse.validate(response.json())
        datasets = response.json().get('datasets')
        assert len(datasets) == 2

        response = client.get(f'{PREFIX}/datasets/',
                              headers={'Authorization': Store.admin_access_token})
        assert response.status_code == 200
        assert DatasetsResponse.validate(response.json())
        datasets = response.json().get('datasets')
        assert len(datasets) == 1

    def test_valid_get_dataset(self):
        response = client.get(f'{PREFIX}/datasets/83b06b61-fcf4-48a1-8fd3-9233b2e15a25',
                              headers={'Authorization': Store.access_token})
        assert response.status_code == 200
        assert DatasetResponse.validate(response.json())

    def test_invalid_dataset_post(self):
        body = DatasetPostBody(name='Dogs',
                               description='Several species of dogs',
                               is_public=False)
        response = client.post(f'{PREFIX}/datasets/',
                               headers={'Authorization': Store.unverified_access_token},
                               json=body.dict())
        assert response.status_code == 403
        assert response.json().get('message') == errors.USER_NOT_VERIFIED

    def test_valid_dataset_post(self):
        body = DatasetPostBody(name='Dogs',
                               description='Several species of dogs',
                               is_public=False)
        response = client.post(f'{PREFIX}/datasets/',
                               headers={'Authorization': Store.access_token},
                               json=body.dict())
        assert response.status_code == 200

    # TODO: test delete datasets

    def test_invalid_delete_dataset(self):
        response = client.delete(f'{PREFIX}/datasets/83b06b61-fcf4-48a1-8fd3-9233b2e15a25',
                                 headers={'Authorization': Store.access_token})
        assert response.status_code == 403
        assert response.json().get('message') == errors.NOT_YOUR_DATASET

        response = client.delete(f'{PREFIX}/datasets/ba865075-3b3c-48b5-833f-641cbafe1143',
                                 headers={'Authorization': Store.admin_access_token})
        assert response.status_code == 403
        assert response.json().get('message') == errors.NOT_YOUR_DATASET

    def test_valid_delete_dataset(self):
        response = client.delete(f'{PREFIX}/datasets/ba865075-3b3c-48b5-833f-641cbafe1143',
                                 headers={'Authorization': Store.access_token})
        assert response.status_code == 200

        response = client.delete(f'{PREFIX}/datasets/83b06b61-fcf4-48a1-8fd3-9233b2e15a25',
                                 headers={'Authorization': Store.admin_access_token})
        assert response.status_code == 200

        response = client.delete(f'{PREFIX}/datasets/ba865075-3b3c-48b5-833f-641cbafe1143',
                                 headers={'Authorization': Store.access_token})
        assert response.status_code == 404
        assert response.json().get('message') == errors.DATASET_NOT_FOUND
