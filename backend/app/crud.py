from datetime import datetime, timedelta, UTC
import os
from typing import Optional

from fastapi import HTTPException
import jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from dotenv import load_dotenv

from . import models, schemas

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY", "default_secret_key")


# User-related CRUD operations
def get_user(
    db: Session,
    user_id: int,
):
    return (
        db.query(models.User)
        .filter(
            models.User.id == user_id,
        )
        .first()
    )


def get_users(
    db: Session,
    skip: int = 0,
    limit: int = 100,
):
    return (
        db.query(
            models.User,
        )
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_user_by_username(
    db: Session,
    username: str,
):
    return (
        db.query(models.User)
        .filter(
            models.User.username == username,
        )
        .first()
    )


def create_user(
    db: Session,
    user: schemas.UserCreate,
):
    hashed_password = pwd_context.hash(user.password)
    db_user = models.User(
        username=user.username,
        hashed_password=hashed_password,
    )
    db.add(
        db_user,
    )
    db.commit()
    db.refresh(
        db_user,
    )
    return db_user


def authenticate_user(
    db: Session,
    username: str,
    password: str,
):
    user = get_user_by_username(db, username)
    if user and pwd_context.verify(password, user.hashed_password):
        return user
    return None


def create_access_token(
    data: dict,
    expires_delta: Optional[timedelta] = None,
):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(UTC) + expires_delta
    else:
        expire = datetime.now(UTC) + timedelta(minutes=60)

    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")


def verify_access_token(
    token: str,
):
    print(token)

    try:
        decoded_jwt = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except Exception as e:
        print(f"Error decoding JWT: {e}")
        raise HTTPException(
            status_code=401,
            detail="Invalid token",
        )
    print(f"Decoded JWT: {decoded_jwt}")
    if decoded_jwt:
        # check if expired
        if decoded_jwt.get("exp") < datetime.now(UTC).timestamp():
            raise HTTPException(
                status_code=401,
                detail="Token has expired",
            )
        else:
            return decoded_jwt

    raise HTTPException(
        status_code=401,
        detail="Token has expired",
    )


# Meal-related CRUD operations
def get_user_meals(
    db: Session,
    user_id: int,
    skip: int = 0,
    limit: int = 100,
):
    return (
        db.query(
            models.Meal,
        )
        .filter(
            models.Meal.user_id == user_id,
        )
        .offset(
            skip,
        )
        .limit(
            limit,
        )
        .all()
    )


def create_meal(
    db: Session,
    meal: schemas.MealCreate,
    user_id: int,
):
    db_meal = models.Meal(
        **meal.model_dump(),
        user_id=user_id,
    )
    db.add(
        db_meal,
    )
    db.commit()
    db.refresh(
        db_meal,
    )
    return db_meal


def delete_meal(
    db: Session,
    meal_id: int,
):
    db_meal = (
        db.query(
            models.Meal,
        )
        .filter(
            models.Meal.id == meal_id,
        )
        .first()
    )
    if db_meal:
        db.delete(db_meal)
        db.commit()
    return db_meal


def get_user_weights(
    db: Session,
    user_id: int,
    skip: int = 0,
    limit: int = 100,
):
    return (
        db.query(models.Weights)
        .filter(
            models.Weights.user_id == user_id,
        )
        .offset(
            skip,
        )
        .limit(
            limit,
        )
        .all()
    )


def create_weight(
    db: Session,
    weight: schemas.WeightsCreate,
    user_id: int,
):
    db_weight = models.Weights(
        **weight.dict(),
        user_id=user_id,
    )
    db.add(
        db_weight,
    )
    db.commit()
    db.refresh(
        db_weight,
    )
    return db_weight


def delete_weight(
    db: Session,
    weight_id: int,
):
    db_weight = (
        db.query(
            models.Weights,
        )
        .filter(
            models.Weights.id == weight_id,
        )
        .first()
    )
    if db_weight:
        db.delete(
            db_weight,
        )
        db.commit()
    return db_weight
