from fastapi.testclient import TestClient

import errors
from app import app, PREFIX
from authentication.models import AuthLoginBody, AuthRegisterBody, AuthEmailConfirmBody, AuthResponse, \
    OAuthAuthorizationResponse
from config import Settings
from routers.users.models import User
from tests.init_db import init_db

client = TestClient(app)

Config = Settings(environment='tests')

Config.db.client.drop_database(Config.DB_NAME)
init_db(Config.db)


class TestOAuthWorkflow:

    def test_oauth_authorization_github(self):
        response = client.get(f'{PREFIX}/oauth/authorization/github')
        assert response.status_code == 200
        data = response.json()
        assert OAuthAuthorizationResponse.validate(data)
        assert data['authorization_url'].startswith('https://github.com/login/oauth/authorize')

    def test_oauth_authorization_google(self):
        response = client.get(f'{PREFIX}/oauth/authorization/google')
        assert response.status_code == 200
        data = response.json()
        assert OAuthAuthorizationResponse.validate(data)
        assert data['authorization_url'].startswith('https://accounts.google.com/o/oauth2/v2/auth')

    def test_oauth_authorization_stackoverflow(self):
        response = client.get(f'{PREFIX}/oauth/authorization/stackoverflow')
        assert response.status_code == 200
        data = response.json()
        assert OAuthAuthorizationResponse.validate(data)
        assert data['authorization_url'].startswith('https://stackoverflow.com/oauth')


class TestJWTAuthWorkflow:

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

    def test_valid_unregister(self):
        response = client.post(f'{PREFIX}/auth/unregister',
                               headers={'Authorization': Store.access_token})
        assert response.status_code == 200

    def test_invalid_unregister(self):
        response = client.post(f'{PREFIX}/auth/unregister',
                               headers={'Authorization': Store.access_token})
        assert response.status_code == 401

    def test_valid_login(self):
        login_body = AuthLoginBody(email='user@datatensor.io',
                                   password='TestPassword123$%')
        response = client.post(f'{PREFIX}/auth/login', json=login_body.dict())
        assert response.status_code == 200
        assert AuthResponse.validate(response.json())

        access_token = response.json().get('accessToken')
        user = response.json().get('user')
        assert user['is_verified']
        assert not user['is_admin']

        Store.access_token = access_token
        Store.user = user

        login_body = AuthLoginBody(email='unverified@datatensor.io',
                                   password='TestPassword123$%')
        response = client.post(f'{PREFIX}/auth/login', json=login_body.dict())
        assert response.status_code == 200
        assert AuthResponse.validate(response.json())

        unverified_access_token = response.json().get('accessToken')
        unverified_user = response.json().get('user')
        assert not unverified_user['is_verified']

        Store.unverified_access_token = unverified_access_token
        Store.unverified_user = unverified_user

    def test_invalid_login(self):
        login_body = AuthLoginBody(email='wrong@datatensor.io',
                                   password='TestPassword123$%')
        response = client.post(f'{PREFIX}/auth/login', json=login_body.dict())
        assert response.status_code == 401
        assert response.json().get('message') == errors.INVALID_CREDENTIALS

        login_body = AuthLoginBody(email='admin@datatensor.io',
                                   password='WrongPassword123$%')
        response = client.post(f'{PREFIX}/auth/login', json=login_body.dict())
        assert response.status_code == 401
        assert response.json().get('message') == errors.INVALID_CREDENTIALS

    def test_valid_admin_login(self):
        login_body = AuthLoginBody(email='admin@datatensor.io',
                                   password='TestPassword123$%')
        response = client.post(f'{PREFIX}/auth/login', json=login_body.dict())
        assert response.status_code == 200
        assert AuthResponse.validate(response.json())

        admin_access_token = response.json().get('accessToken')
        admin_user = response.json().get('user')
        assert admin_user['is_verified']
        assert admin_user['is_admin']

        Store.admin_access_token = admin_access_token
        Store.admin_user = admin_user
