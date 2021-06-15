from fastapi.testclient import TestClient

from app import app, PREFIX
from routers.users.models import UsersResponse
from tests.conftest import Store

client = TestClient(app)


class TestUsers:

    def test_valid_get_users(self):
        response = client.get(f'{PREFIX}/users/', headers={'Authorization': Store.admin_access_token})
        assert response.status_code == 200
        assert UsersResponse.validate(response.json())
