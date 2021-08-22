from uuid import uuid4

from fastapi.testclient import TestClient

import errors
from app import app, PREFIX
from authentication.models import AuthLoginBody
from routers.users.models import User, UsersResponse, UserResponse, UserUpdateProfileBody, UserUpdatePasswordBody

client = TestClient(app)


class TestUsers:

    def test_invalid_get_users(self):
        response = client.get(f'{PREFIX}/users/',
                              headers={'Authorization': Store.access_token})
        assert response.status_code == 403
        assert response.json().get('message') == errors.USER_NOT_ADMIN

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
        assert response.json().get('message') == errors.USER_NOT_FOUND

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

    def test_valid_patch_user(self):
        assert Store.user['name'] == 'Jack Sparrow'
        assert Store.user['city'] is None
        assert Store.user['country'] is None
        assert Store.user['is_public'] is True
        assert Store.user['phone'] is None

        body = UserUpdateProfileBody(city='Bordeaux',
                                     country='France',
                                     is_public=False,
                                     name='Paul',
                                     phone='0603210047')
        response = client.patch(f'{PREFIX}/users/me',
                                headers={'Authorization': Store.access_token},
                                json=body.dict())
        assert response.status_code == 200

        response = client.get(f'{PREFIX}/auth/me',
                              headers={'Authorization': Store.access_token})
        assert response.status_code == 200
        assert User.validate(response.json())
        Store.user = response.json()
        assert Store.user['city'] == 'Bordeaux'
        assert Store.user['country'] == 'France'
        assert Store.user['is_public'] is False
        assert Store.user['name'] == 'Paul'
        assert Store.user['phone'] == '0603210047'

    def test_invalid_patch_user_password(self):
        body = UserUpdatePasswordBody(password='WrongPassword',
                                      new_password='NewPassword')
        response = client.patch(f'{PREFIX}/users/me/password',
                                headers={'Authorization': Store.access_token},
                                json=body.dict())
        assert response.status_code == 401
        assert response.json().get('message') == errors.INVALID_PASSWORD

    def test_valid_patch_user_password(self):
        login_body = AuthLoginBody(email='user@datatensor.io',
                                   password='TestPassword123$%')
        response = client.post(f'{PREFIX}/auth/login', json=login_body.dict())
        assert response.status_code == 200

        body = UserUpdatePasswordBody(password='TestPassword123$%',
                                      new_password='NewPassword123$%')
        response = client.patch(f'{PREFIX}/users/me/password',
                                headers={'Authorization': Store.access_token},
                                json=body.dict())
        assert response.status_code == 200

        login_body = AuthLoginBody(email='user@datatensor.io',
                                   password='NewPassword123$%')
        response = client.post(f'{PREFIX}/auth/login', json=login_body.dict())
        assert response.status_code == 200

    # TODO : test delete users

    def test_invalid_delete_user(self):
        response = client.delete(f'{PREFIX}/users/{Store.user["id"]}',
                                 headers={'Authorization': Store.access_token})
        assert response.status_code == 403
        assert response.json().get('message') == errors.USER_NOT_ADMIN

        response = client.delete(f'{PREFIX}/users/{Store.admin_user["id"]}',
                                 headers={'Authorization': Store.admin_access_token})
        assert response.status_code == 403
        assert response.json().get('message') == errors.USER_IS_ADMIN

        response = client.delete(f'{PREFIX}/users/{str(uuid4())}',
                                 headers={'Authorization': Store.admin_access_token})
        assert response.status_code == 404
        assert response.json().get('message') == errors.USER_NOT_FOUND

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
