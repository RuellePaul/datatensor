from fastapi.testclient import TestClient

from app import app, PREFIX
from authentication.models import AuthLoginBody, AuthRegisterBody, AuthEmailConfirmBody, AuthResponse
from config import Config
from routers.users.models import User
from tests.conftest import Store
from tests.init_db import init_db

client = TestClient(app)

if Config.DB_NAME != 'datatensor_development_test':
    raise ValueError('Invalid database selected.')

Config.db.client.drop_database(Config.DB_NAME)
init_db(Config.db)


class TestOAuthWorkflow:

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


class TestJWTAuthWorkflow:

    def test_invalid_login(self):
        login_body = AuthLoginBody(email='test@datatensor.io',
                                   password='TestPassword123$%')
        response = client.post(f'{PREFIX}/auth/login', json=login_body.dict())
        assert response.status_code == 401

    def test_valid_register(self):
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
        assert not user['is_admin']

        Store.access_token = access_token
        Store.user = user

    def test_valid_activation_code(self):
        email_confirm_body = AuthEmailConfirmBody(activation_code='test_activation_code')
        response = client.post(f'{PREFIX}/auth/email-confirmation', json=email_confirm_body.dict())
        assert response.status_code == 200

    def test_valid_activation(self):
        response = client.get(f'{PREFIX}/users/{Store.user["id"]}',
                              headers={'Authorization': Store.access_token})
        assert response.status_code == 200
        user = response.json().get('user')
        assert user['is_verified']

    def test_valid_whoiam(self):
        response = client.get(f'{PREFIX}/auth/me',
                              headers={'Authorization': Store.access_token})
        assert response.status_code == 200
        assert User.validate(response.json())

    def test_valid_login(self):
        login_body = AuthLoginBody(email='test@datatensor.io',
                                   password='TestPassword123$%')
        response = client.post(f'{PREFIX}/auth/login', json=login_body.dict())
        assert response.status_code == 200
        assert AuthResponse.validate(response.json())

    def test_valid_unregister(self):
        response = client.post(f'{PREFIX}/auth/unregister',
                               headers={'Authorization': Store.access_token})
        assert response.status_code == 200
