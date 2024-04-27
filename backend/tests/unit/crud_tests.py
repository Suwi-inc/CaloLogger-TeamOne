import pytest
from fastapi import HTTPException
from app import crud
from app.database import SessionLocal
from datetime import timedelta


# Fixture to create a temporary database session for testing
@pytest.fixture(scope="module")
def db():
    db = SessionLocal()
    yield db
    db.close()


# Test create_access_token function
def test_create_access_token():
    data = {"sub": "user_id"}
    token = crud.create_access_token(data)
    assert isinstance(token, str)


# Test verify_access_token function with valid token
def test_verify_access_token_valid_token():
    data = {"sub": "user_id"}
    token = crud.create_access_token(data)
    decoded_token = crud.verify_access_token(token)
    assert decoded_token["sub"] == "user_id"


# Test verify_access_token function with expired token
def test_verify_access_token_expired_token():
    data = {"sub": "user_id"}
    # Set expiration time to past
    expired_token = crud.create_access_token(
        data,
        expires_delta=timedelta(seconds=-1),
    )
    with pytest.raises(HTTPException):
        crud.verify_access_token(expired_token)
