from fastapi.testclient import TestClient

from app import app, PREFIX
from authentication.models import AuthLoginBody, AuthResponse
from routers.users.models import UsersResponse

client = TestClient(app)


class TestUsers:

    def test_valid_get_users(self):
        login_body = AuthLoginBody(email='admin@datatensor.io',
                                   password='TestPassword123$%')
        response = client.post(f'{PREFIX}/auth/login', json=login_body.dict())
        assert response.status_code == 200
        assert AuthResponse.validate(response.json())

        access_token = response.json().get('accessToken')

        response = client.get(f'{PREFIX}/users/', headers={'Authorization': access_token})
        assert response.status_code == 200
        assert UsersResponse.validate(response.json())
