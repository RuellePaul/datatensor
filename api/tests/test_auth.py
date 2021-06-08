import unittest

from fastapi.testclient import TestClient

from app import app, PREFIX
from authentication.models import AuthLoginBody, AuthRegisterBody, AuthEmailConfirmBody, AuthResponse

client = TestClient(app)


class TestAuth(unittest.TestCase):

    def test_oauth_authorization_github(self):
        response = client.get(f'{PREFIX}/oauth/authorization/github')
        assert response.status_code == 200, response.text
        data = response.json()
        assert data['authorization_url'].startswith('https://github.com/login/oauth/authorize')

    def test_oauth_authorization_google(self):
        response = client.get(f'{PREFIX}/oauth/authorization/google')
        assert response.status_code == 200, response.text
        data = response.json()
        assert data['authorization_url'].startswith('https://accounts.google.com/o/oauth2/v2/auth')

    def test_oauth_authorization_stackoverflow(self):
        response = client.get(f'{PREFIX}/oauth/authorization/stackoverflow')
        assert response.status_code == 200, response.text
        data = response.json()
        assert data['authorization_url'].startswith('https://stackoverflow.com/oauth')

    def test_auth(self):
        register_body = AuthRegisterBody(email='test@datatensor.io',
                                         password='TestPassword123$%',
                                         name='Session Test',
                                         recaptcha='test')
        response = client.post(f'{PREFIX}/auth/register', json=register_body.dict())
        assert response.status_code == 200
        assert AuthResponse.validate(response.json())

        access_token = response.json().get('accessToken')
        user = response.json().get('user')
        assert not user['is_verified']

        email_confirm_body = AuthEmailConfirmBody(activation_code='test_activation_code')
        response = client.post(f'{PREFIX}/auth/email-confirmation', json=email_confirm_body.dict())
        assert response.status_code == 200

        response = client.get(f'{PREFIX}/users/{user["id"]}', headers={'Authorization': access_token})
        assert response.status_code == 200
        user = response.json().get('user')
        assert user['is_verified']

        login_body = AuthLoginBody(email='test@datatensor.io',
                                   password='TestPassword123$%')
        response = client.post(f'{PREFIX}/auth/login', json=login_body.dict())
        assert response.status_code == 200
        assert AuthResponse.validate(response.json())

        access_token = response.json().get('accessToken')

        response = client.post(f'{PREFIX}/auth/unregister', headers={'Authorization': access_token})
        assert response.status_code == 200
