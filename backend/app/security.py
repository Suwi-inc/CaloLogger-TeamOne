import bcrypt
from fastapi import HTTPException, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from fastapi.security.utils import get_authorization_scheme_param

from app.crud import verify_access_token


class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        """
        Initializes the bearer instance with or
        without automatic error handling.
        """
        super().__init__(auto_error=auto_error)

    async def __call__(self, request: Request) -> str:
        """
        Authenticate and validate the JWT token from
        the HTTP Authorization header.
        Raises HTTPException for any authentication failure.
        """
        credentials: HTTPAuthorizationCredentials = None
        credentials = await super().__call__(request)
        if not credentials or credentials.scheme.lower() != "bearer":
            raise HTTPException(
                status_code=403, detail="Invalid authentication scheme."
            )
        if not self.verify_jwt(credentials.credentials):
            raise HTTPException(
                status_code=403, detail="Invalid token or expired token."
            )
        return credentials.credentials

    def verify_jwt(self, jwt: str) -> bool:
        """
        Validates the JWT token and ensures it is active and valid.
        Returns True if valid, otherwise False.
        """
        try:
            payload = verify_access_token(jwt)
            return True if payload else False
        except HTTPException as e:
            # Optionally log the error here if needed
            raise HTTPException(status_code=e.status_code, detail=e.detail)


def get_user_id(request: Request) -> int:
    """
    Extracts and returns the user ID from the JWT token in the request headers.
    """
    authorization: str = request.headers.get("Authorization", "")
    scheme, param = get_authorization_scheme_param(authorization)
    if not authorization or scheme.lower() != "bearer":
        raise HTTPException(
            status_code=403,
            detail="Invalid authorization header.",
        )
    user = verify_access_token(param)
    return user["user_id"]


# Hash a password using bcrypt
def hash_password(password):
    pwd_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password=pwd_bytes, salt=salt)
    return hashed_password


# Check if the provided password matches the stored password (hashed)
def verify_password(plain_password, hashed_password):
    password_byte_enc = plain_password.encode("utf-8")
    return bcrypt.checkpw(
        password=password_byte_enc,
        hashed_password=hashed_password,
    )
