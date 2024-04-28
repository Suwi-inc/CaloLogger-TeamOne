import json
import os
from datetime import datetime, timedelta, timezone
from typing import List, Optional

import jwt
from dotenv import load_dotenv
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app import models, schemas
from app.utils.security import hash_password, verify_password

load_dotenv()
JWT_SECRET_KEY = os.getenv(
    "JWT_SECRET_KEY",
    os.urandom(32).hex(),
)
UTC = timezone.utc


# Function to create an access token,
# optionally specifying when it should expire
# Uses HS256


def create_access_token(
    data: dict,
    expires_delta: Optional[timedelta] = None,
) -> str:
    # Copy user data to include additional fields
    #   without altering the original input
    to_encode = data.copy()
    # Set token expiration time either to specified
    #   duration or default to 60 minutes
    expire = datetime.now(UTC) + (
        expires_delta
        if expires_delta
        else timedelta(
            days=7,
        )
    )
    # Append expiration date to payload
    to_encode.update({"exp": expire})
    # Generate JWT using secret key and return it
    return jwt.encode(to_encode, JWT_SECRET_KEY, algorithm="HS256")


# Function to verify if an access token is valid and not expired
# Uses HS256
def verify_access_token(token: str) -> dict:
    try:
        # Decode the JWT to validate and extract data
        decoded_jwt = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
        # Check expiration explicitly to raise an error if token is expired
        if decoded_jwt.get("exp") < datetime.now(UTC).timestamp():
            raise HTTPException(status_code=401, detail="Token has expired")
        return decoded_jwt
    except jwt.ExpiredSignatureError:
        # Catch specifically expired token errors
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        # Catch other JWT related errors indicating invalid token
        raise HTTPException(status_code=401, detail="Invalid token")


# Function to authenticate a user by verifying provided username and password
# Uses Bcrypt
def authenticate_user(
    db: Session, username: str, password: str
) -> Optional[models.User]:
    # Retrieve user object by username
    user = get_user_by_username(db, username)
    # Check password validity against hashed password in the database
    if user and verify_password(password, user.hashed_password):
        return user
    return None


# Function to fetch a user from the database by username
def get_user_by_username(db: Session, username: str) -> Optional[models.User]:
    # Directly query the database for a single user by username
    return (
        db.query(models.User)
        .filter(
            models.User.username == username,
        )
        .first()
    )


# Function to register a new user with encrypted password
def create_user(db: Session, user: schemas.UserCreate) -> models.User:
    # Encrypt user's plaintext password for secure storage
    hashed_password = hash_password(user.password)
    # Create new user model instance
    db_user = models.User(
        username=user.username,
        hashed_password=hashed_password,
    )
    # Save new user to database
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# Function to retrieve paginated list of meal entries for a specific user
def get_user_meals(
    db: Session, user_id: int, skip: int = 0, limit: int = 100
) -> List[models.Meal]:
    # Query for meals based on user ID with pagination
    return (
        db.query(models.Meal)
        .filter(models.Meal.user_id == user_id)
        .offset(skip)
        .limit(limit)
        .all()
    )


# Function to add a new meal record for a user
def create_user_meal(
    db: Session,
    meal: schemas.MealCreate,
    nutritions: schemas.MealNutritions,
    user_id: int,
) -> models.Meal:

    # Construct new meal instance from provided data and user association
    db_meal = models.Meal(
        **meal.model_dump(),
        user_id=user_id,
        nutritions=json.loads(nutritions.model_dump_json()),
    )
    # Persist new meal record to database
    db.add(db_meal)
    db.commit()
    db.refresh(db_meal)
    return db_meal


# Function to delete a specific meal for a user by meal and user IDs
# It makes sure that only the respected user able to delete


def delete_user_meal(
    db: Session,
    user_id: int,
    meal_id: int,
) -> Optional[models.Meal]:
    # Find meal by ID and user ID
    db_meal = (
        db.query(models.Meal)
        .filter(
            models.Meal.id == meal_id,
            models.Meal.user_id == user_id,
        )
        .first()
    )
    # Remove meal from database if found
    if db_meal:
        db.delete(db_meal)
        db.commit()
        return db_meal
    return None


# Function to add a new weight entry for a user
def create_user_weight(
    db: Session, weight: schemas.WeightsCreate, user_id: int
) -> models.Weights:
    # Create weight record linked to user with given ID
    db_weight = models.Weights(**weight.model_dump(), user_id=user_id)
    # Save weight record to database
    db.add(db_weight)
    db.commit()
    db.refresh(db_weight)
    return db_weight


# Function to fetch paginated weight entries for a specific user
def get_user_weights(
    db: Session,
    user_id: int,
    skip: int = 0,
    limit: int = 100,
) -> List[models.Weights]:
    # Query for weights linked to a user ID with pagination settings
    return (
        db.query(models.Weights)
        .filter(models.Weights.user_id == user_id)
        .offset(skip)
        .limit(limit)
        .all()
    )


# Function to remove a specific weight entry for a user by weight and user IDs
# It makes sure that only the respected user able to delete
def delete_user_weight(
    db: Session, user_id: int, weight_id: int
) -> Optional[models.Weights]:
    # Locate specific weight entry by IDs
    db_weight = (
        db.query(models.Weights)
        .filter(
            models.Weights.id == weight_id,
            models.Weights.user_id == user_id,
        )
        .first()
    )
    # If found, delete the weight entry from the database
    if db_weight:
        db.delete(db_weight)
        db.commit()
        return db_weight
    return None
