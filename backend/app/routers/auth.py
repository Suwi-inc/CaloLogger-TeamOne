from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import schemas
import app.crud as crud
from app.utils.db import get_db


router = APIRouter(
    tags=["Authentication"],
)


@router.post("/signup", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """
    ## Create a new user
    Creates a new user and returns it.
    """
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Username already registered",
        )
    return crud.create_user(db=db, user=user)


@router.post("/login", response_model=schemas.Token)
def login(
    user: schemas.UserCreate,
    db: Session = Depends(get_db),
):
    """
    ## Login a user
    Logs in a user and returns a token.
    """
    user_auth = crud.authenticate_user(db, user.username, user.password)
    if not user_auth:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = crud.create_access_token(
        data={
            "user_id": user_auth.id,
            "username": user_auth.username,
        }
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
    }
