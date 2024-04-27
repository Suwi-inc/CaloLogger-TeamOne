import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime

from app.database import Base
from app.utils.db import get_db
from app.main import app

# Setup test database
DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)
Base.metadata.create_all(bind=engine)  # Ensure your tables are created


@pytest.fixture(scope="function")
def db():
    db = TestingSessionLocal()
    yield db
    db.rollback()


@pytest.fixture(scope="function")
def client():
    # Dependency override for the database session
    def override_get_db():
        try:
            db = TestingSessionLocal()
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c


# Helper functions for authentication
def authenticate_user(client, username, password):
    return client.post(
        "/login",
        json={"username": username, "password": password},
    )


# Tests for Auth Router
def test_signup_with_exisiting_user(client):
    response = client.post(
        "/signup", json={"username": "testuser", "password": "testpass123"}
    )
    assert response.status_code == 400


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
def test_get_meals(client, db):
    # Assuming the user is authenticated and has meals
    token_response = authenticate_user(client, "testuser", "testpass123")
    token = token_response.json()["access_token"]
    response = client.get(
        "/meals",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_create_meal(client, db):
    token_response = authenticate_user(client, "testuser", "testpass123")
    token = token_response.json()["access_token"]
    meal_data = {
        "name": "Salad",
        "ingredients": "Lettuce, Tomato",
        "date": datetime.now().isoformat(),
    }
    response = client.post(
        "/meals", json=meal_data, headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Salad"


# Tests for Weight Router
def test_get_weights(client, db):
    token_response = authenticate_user(client, "testuser", "testpass123")
    token = token_response.json()["access_token"]
    response = client.get(
        "/weights",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_create_weight(client, db):
    token_response = authenticate_user(client, "testuser", "testpass123")
    token = token_response.json()["access_token"]
    weight_data = {"weight": 70.5, "date": datetime.now().isoformat()}
    response = client.post(
        "/weights",
        json=weight_data,
        headers={
            "Authorization": f"Bearer {token}",
        },
    )
    assert response.status_code == 200
    assert response.json()["weight"] == 70.5
