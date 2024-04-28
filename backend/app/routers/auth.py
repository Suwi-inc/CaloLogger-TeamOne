from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from loguru import logger

from app import schemas
import app.crud as crud
from app.utils.db import get_db


router = APIRouter(
    tags=["Authentication"],
)


@router.post("/signup", response_model=schemas.User)
async def create_user(user: schemas.UserCreate):
    """
    ## Create a new user
    Creates a new user and returns it.
    """
    db_user = await crud.get_user_by_username(user.username)
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Username already registered",
        )
    response = await crud.create_user(user)
    logger.info(f"User {user.username} created")
    return response


@router.post("/login", response_model=schemas.Token)
async def login(
    user: schemas.UserCreate,
    db: Session = Depends(get_db),
):
    """
    ## Login a user
    Logs in a user and returns a token.
    """
    user_auth = await crud.authenticate_user(user.username, user.password)
    if not user_auth:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = crud.create_access_token(
        data={
            "user_id": str(user_auth.id),
            "username": user_auth.username,
        }
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
    }
