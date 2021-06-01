import unittest
from fastapi.testclient import TestClient

from api.app import app, PREFIX


client = TestClient(app)


class TestStringMethods(unittest.TestCase):

    def test_oauth_authorizations(self):
        response = client.get(f'{PREFIX}/oauth/authorization/github')
        assert response.status_code == 200, response.text
        data = response.json()
        assert data['authorization_url'].startswith('https://github.com/login/oauth/authorize')

        response = client.get(f'{PREFIX}/oauth/authorization/google')
        assert response.status_code == 200, response.text
        data = response.json()
        assert data['authorization_url'].startswith('https://accounts.google.com/o/oauth2/v2/auth')

        response = client.get(f'{PREFIX}/oauth/authorization/stackoverflow')
        assert response.status_code == 200, response.text
        data = response.json()
        assert data['authorization_url'].startswith('https://stackoverflow.com/oauth')
