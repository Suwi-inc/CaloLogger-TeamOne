import pytest
from fastapi.testclient import TestClient
from datetime import datetime

from app.main import app


@pytest.fixture(scope="function")
def client():
    with TestClient(app) as c:
        yield c


# Helper functions for authentication
def authenticate_user(client, username, password):
    return client.post(
        "/login",
        json={"username": username, "password": password},
    )


# Tests for Auth Router
def test_signup_first_time(client):
    response = client.post(
        "/signup", json={"username": "testuser", "password": "testpass123"}
    )
    assert response.status_code == 200


def test_login(client):
    # First create a user
    client.post(
        "/signup",
        json={"username": "testlogin", "password": "testpass123"},
    )
    response = authenticate_user(client, "testlogin", "testpass123")
    assert response.status_code == 200
    assert "access_token" in response.json()


# Tests for Meals Router
def test_get_meals(client):
    # Assuming the user is authenticated and has meals
    token_response = authenticate_user(client, "testuser", "testpass123")
    token = token_response.json()["access_token"]
    response = client.get(
        "/meals",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_create_meal(client):
    token_response = authenticate_user(client, "testuser", "testpass123")
    token = token_response.json()["access_token"]
    meal_data = {
        "name": "Salad",
        "ingredients": "Lettuce, Tomato",
        "nutritions": {},
        "date": datetime.now().isoformat(),
    }
    response = client.post(
        "/meals", json=meal_data, headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Salad"


# Tests for Weight Router
def test_get_weights(client):
    token_response = authenticate_user(client, "testuser", "testpass123")
    token = token_response.json()["access_token"]
    response = client.get(
        "/weights",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_create_weight(client):
    token_response = authenticate_user(client, "testuser", "testpass123")
    token = token_response.json()["access_token"]
    weight_data = {"weight": 70, "date": datetime.now().isoformat()}
    response = client.post(
        "/weights",
        json=weight_data,
        headers={
            "Authorization": f"Bearer {token}",
        },
    )
    assert response.status_code == 200
    assert response.json()["weight"] == 70
