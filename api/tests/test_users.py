from uuid import uuid4

from fastapi.testclient import TestClient

from app import app, PREFIX
from routers.users.models import UsersResponse, UserResponse
from tests.conftest import Store

client = TestClient(app)


class TestUsers:

    def test_invalid_get_users(self):
        response = client.get(f'{PREFIX}/users/',
                              headers={'Authorization': Store.access_token})
        assert response.status_code == 403

        response = client.get(f'{PREFIX}/users/',
                              headers={'Authorization': None})
        assert response.status_code == 422

    def test_valid_get_users(self):
        response = client.get(f'{PREFIX}/users/',
                              headers={'Authorization': Store.admin_access_token})
        assert response.status_code == 200
        assert UsersResponse.validate(response.json())

    def test_invalid_get_user(self):
        response = client.get(f'{PREFIX}/users/{Store.user["id"]}',
                              headers={'Authorization': None})
        assert response.status_code == 422

        response = client.get(f'{PREFIX}/users/{str(uuid4())}',
                              headers={'Authorization': Store.access_token})
        assert response.status_code == 404

    def test_valid_get_user(self):
        response = client.get(f'{PREFIX}/users/{Store.user["id"]}',
                              headers={'Authorization': Store.access_token})
        assert response.status_code == 200
        assert UserResponse.validate(response.json())

        response = client.get(f'{PREFIX}/users/{Store.admin_user["id"]}',
                              headers={'Authorization': Store.access_token})
        assert response.status_code == 200
        assert UserResponse.validate(response.json())

        response = client.get(f'{PREFIX}/users/{Store.user["id"]}',
                              headers={'Authorization': Store.admin_access_token})
        assert response.status_code == 200
        assert UserResponse.validate(response.json())

        response = client.get(f'{PREFIX}/users/{Store.admin_user["id"]}',

                              headers={'Authorization': Store.admin_access_token})
        assert response.status_code == 200
        assert UserResponse.validate(response.json())

    def test_invalid_delete_user(self):
        response = client.delete(f'{PREFIX}/users/{Store.user["id"]}',
                                 headers={'Authorization': Store.access_token})
        assert response.status_code == 403

        response = client.delete(f'{PREFIX}/users/{Store.user["id"]}',
                                 headers={'Authorization': None})
        assert response.status_code == 422

    def test_valid_delete_user(self):
        response = client.delete(f'{PREFIX}/users/{Store.user["id"]}',
                                 headers={'Authorization': Store.admin_access_token})
        assert response.status_code == 200

        response = client.get(f'{PREFIX}/users/{Store.user["id"]}',
                              headers={'Authorization': Store.admin_access_token})
        assert response.status_code == 404
