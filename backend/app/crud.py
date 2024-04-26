import os
from datetime import datetime, timedelta, timezone
from typing import List, Optional

import jwt
from dotenv import load_dotenv
from fastapi import HTTPException
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from . import models, schemas

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY", "default_secret_key")
UTC = timezone.utc
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Authentication and Token Management
def create_access_token(
    data: dict,
    expires_delta: Optional[timedelta] = None,
) -> str:
    """Generate JWT access token with optional expiry duration."""
    to_encode = data.copy()
    expire = datetime.now(UTC) + (
        expires_delta if expires_delta else timedelta(minutes=60)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")


def verify_access_token(token: str) -> dict:
    """Decode and verify the JWT token."""
    try:
        decoded_jwt = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        if decoded_jwt.get("exp") < datetime.now(UTC).timestamp():
            raise HTTPException(status_code=401, detail="Token has expired")
        return decoded_jwt
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


# User Management
def authenticate_user(
    db: Session, username: str, password: str
) -> Optional[models.User]:
    """Authenticate user by username and password."""
    user = get_user_by_username(db, username)
    if user and pwd_context.verify(password, user.hashed_password):
        return user
    return None


def get_user_by_username(db: Session, username: str) -> Optional[models.User]:
    """Fetch user by username."""
    return (
        db.query(
            models.User,
        )
        .filter(
            models.User.username == username,
        )
        .first()
    )


def create_user(db: Session, user: schemas.UserCreate) -> models.User:
    """Create new user with hashed password."""
    hashed_password = pwd_context.hash(user.password)
    db_user = models.User(
        username=user.username,
        hashed_password=hashed_password,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# Meal Management
def get_user_meals(
    db: Session, user_id: int, skip: int = 0, limit: int = 100
) -> List[models.Meal]:
    """Retrieve meals of a specific user."""
    return (
        db.query(models.Meal)
        .filter(models.Meal.user_id == user_id)
        .offset(skip)
        .limit(limit)
        .all()
    )


def create_user_meal(
    db: Session, meal: schemas.MealCreate, user_id: int
) -> models.Meal:
    """Create a meal record for a user."""
    db_meal = models.Meal(**meal.dict(), user_id=user_id)
    db.add(db_meal)
    db.commit()
    db.refresh(db_meal)
    return db_meal


def delete_user_meal(
    db: Session,
    user_id: int,
    meal_id: int,
) -> Optional[models.Meal]:
    """Delete a user's meal by meal_id."""
    db_meal = (
        db.query(models.Meal)
        .filter(models.Meal.id == meal_id, models.Meal.user_id == user_id)
        .first()
    )
    if db_meal:
        db.delete(db_meal)
        db.commit()
        return db_meal
    return None


# Weight Management
def create_user_weight(
    db: Session, weight: schemas.WeightsCreate, user_id: int
) -> models.Weights:
    """Create a weight record for a user."""
    db_weight = models.Weights(**weight.model_dump(), user_id=user_id)
    db.add(db_weight)
    db.commit()
    db.refresh(db_weight)
    return db_weight


def get_user_weights(
    db: Session,
    user_id: int,
    skip: int = 0,
    limit: int = 100,
) -> List[models.Weights]:
    """Retrieve weights of a specific user."""
    return (
        db.query(models.Weights)
        .filter(models.Weights.user_id == user_id)
        .offset(skip)
        .limit(limit)
        .all()
    )


def delete_user_weight(
    db: Session, user_id: int, weight_id: int
) -> Optional[models.Weights]:
    """Delete a user's weight by weight_id."""
    db_weight = (
        db.query(models.Weights)
        .filter(
            models.Weights.id == weight_id,
            models.Weights.user_id == user_id,
        )
        .first()
    )
    if db_weight:
        db.delete(db_weight)
        db.commit()
        return db_weight
    return None
