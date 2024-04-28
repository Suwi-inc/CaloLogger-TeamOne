import pytest
from unittest.mock import patch, MagicMock
from fastapi import Request, HTTPException
from app.security import JWTBearer
from app.utils.security import hash_password, verify_password


@pytest.mark.asyncio
async def test_jwt_bearer_no_credentials():
    jwt_bearer = JWTBearer(auto_error=False)
    with patch("fastapi.security.http.HTTPBearer.__call__", return_value=None):
        with pytest.raises(HTTPException):
            await jwt_bearer(Request(scope={"type": "http"}))


@pytest.mark.asyncio
async def test_jwt_bearer_invalid_scheme():
    jwt_bearer = JWTBearer()
    with patch(
        "fastapi.security.http.HTTPBearer.__call__",
        return_value=MagicMock(scheme="Basic", credentials="dummy_token"),
    ):
        with pytest.raises(HTTPException):
            await jwt_bearer(Request(scope={"type": "http"}))


@pytest.mark.asyncio
async def test_jwt_bearer_valid_token():
    jwt_bearer = JWTBearer()
    with patch(
        "fastapi.security.http.HTTPBearer.__call__",
        return_value=MagicMock(scheme="Bearer", credentials="valid_token"),
    ):
        with patch("app.security.JWTBearer.verify_jwt", return_value=True):
            assert (
                await jwt_bearer(
                    Request(scope={"type": "http"}),
                )
                == "valid_token"
            )


@pytest.mark.asyncio
async def test_jwt_bearer_invalid_token():
    jwt_bearer = JWTBearer()
    with patch(
        "fastapi.security.http.HTTPBearer.__call__",
        return_value=MagicMock(scheme="Bearer", credentials="invalid_token"),
    ):
        with patch("app.security.JWTBearer.verify_jwt", return_value=False):
            with pytest.raises(HTTPException):
                await jwt_bearer(Request(scope={"type": "http"}))


def test_hash_password():
    password = "testpassword"
    hashed_password = hash_password(password)
    assert hashed_password != password
    assert isinstance(hashed_password, bytes)


def test_verify_password():
    password = "securepassword"
    hashed_password = hash_password(password)
    assert verify_password(password, hashed_password) is True
    assert verify_password(password + "x", hashed_password) is False
