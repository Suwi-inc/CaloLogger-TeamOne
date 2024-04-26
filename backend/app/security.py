from fastapi import HTTPException, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from fastapi.security.utils import get_authorization_scheme_param

from app.crud import verify_access_token


class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials = await super(
            JWTBearer, self
        ).__call__(request)
        if credentials:
            if not credentials.scheme == "Bearer":
                raise HTTPException(
                    status_code=403,
                    detail="Invalid authentication scheme.",
                )
            if not self.verify_jwt(credentials.credentials):
                raise HTTPException(
                    status_code=403,
                    detail="Invalid token or expired token.",
                )
            return credentials.credentials
        else:
            raise HTTPException(
                status_code=403,
                detail="Invalid authorization code.",
            )

    def verify_jwt(self, jwt: str) -> bool:
        isTokenValid: bool = False

        payload = verify_access_token(jwt)

        if payload:
            isTokenValid = True
        return isTokenValid


def get_user_id(request: Request):
    authorization = request.headers.get("authorization")
    _, jwt = get_authorization_scheme_param(authorization)
    user = verify_access_token(jwt)
    return user["user_id"]
