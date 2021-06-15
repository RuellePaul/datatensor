from fastapi.testclient import TestClient

from app import app, PREFIX
from routers.users.models import UsersResponse
from tests.conftest import Store

client = TestClient(app)


class TestUsers:

    def test_invalid_get_users(self):
        response = client.get(f'{PREFIX}/users/', headers={'Authorization': Store.access_token})
        assert response.status_code == 403

        response = client.get(f'{PREFIX}/users/', headers={'Authorization': None})
        assert response.status_code == 422

    def test_valid_get_users(self):
        response = client.get(f'{PREFIX}/users/', headers={'Authorization': Store.admin_access_token})
        assert response.status_code == 200
        assert UsersResponse.validate(response.json())
