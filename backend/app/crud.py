import json
import os
from datetime import datetime, timedelta, timezone
from typing import List, Optional
from uuid import UUID

import jwt
from dotenv import load_dotenv
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app import models, schemas
from app.utils.security import hash_password, verify_password
from app.database import engine

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
async def authenticate_user(
    username: str,
    password: str,
) -> Optional[models.User]:
    # Retrieve user object by username
    user = await get_user_by_username(username)
    # Check password validity against hashed password in the database
    if user and verify_password(password, user.hashed_password):
        return user
    return None


# Function to fetch a user from the database by username
async def get_user_by_username(
    username: str,
) -> Optional[models.User]:
    # Directly query the database for a single user by username
    async with AsyncSession(engine) as session:
        q = select(models.User).where(models.User.username == username)
        result = await session.execute(q)
        user = result.scalars().first()
        return user


# Function to register a new user with encrypted password
async def create_user(user: schemas.UserCreate) -> models.User:
    # Encrypt user's plaintext password for secure storage
    hashed_password = hash_password(user.password)
    # Create new user model instance
    db_user = models.User(
        username=user.username,
        hashed_password=hashed_password,
    )
    async with AsyncSession(engine) as session:
        # Add user to database
        session.add(db_user)
        await session.commit()
        await session.refresh(db_user)
        return db_user


# Function to retrieve paginated list of meal entries for a specific user
async def get_user_meals(
    user_id: UUID, skip: int = 0, limit: int = 100
) -> List[models.Meal]:
    async with AsyncSession(engine) as session:
        q = select(models.Meal).where(models.Meal.user_id == user_id)
        result = await session.execute(q)
        meals = result.scalars().all()
        return meals


# Function to add a new meal record for a user
async def create_user_meal(
    meal: schemas.MealCreate,
    nutritions: schemas.MealNutritions,
    user_id: str,
) -> models.Meal:

    # Construct new meal instance from provided data and user association
    db_meal = models.Meal(
        **meal.model_dump(),
        user_id=user_id,
        nutritions=json.loads(nutritions.model_dump_json()),
    )
    async with AsyncSession(engine) as session:
        # Add meal to database
        session.add(db_meal)
        await session.commit()
        await session.refresh(db_meal)
        return db_meal


# Function to delete a specific meal for a user by meal and user IDs
async def delete_user_meal(
    user_id: UUID,
    meal_id: UUID,
) -> Optional[models.Meal]:
    async with AsyncSession(engine) as session:
        # Find meal by ID and user ID
        q = select(models.Meal).where(
            models.Meal.id == meal_id,
            models.Meal.user_id == user_id,
        )
        result = await session.execute(q)
        db_meal = result.scalars().first()
        # Delete meal if found
        if db_meal:
            await session.delete(db_meal)
            await session.commit()

        return db_meal


# Function to add a new weight entry for a user
async def create_user_weight(
    weight: schemas.WeightsCreate,
    user_id: UUID,
) -> models.Weights:
    # Create weight record linked to user with given ID
    async with AsyncSession(engine) as session:
        db_weight = models.Weights(
            **weight.model_dump(),
            user_id=user_id,
        )
        # Add weight to database
        session.add(db_weight)
        await session.commit()
        await session.refresh(db_weight)
        return db_weight


# Function to fetch paginated weight entries for a specific user
async def get_user_weights(
    user_id: UUID,
    skip: int = 0,
    limit: int = 100,
) -> List[models.Weights]:
    # Query for weights linked to a user ID with pagination settings
    async with AsyncSession(engine) as session:
        q = select(models.Weights).where(models.Weights.user_id == user_id)
        result = await session.execute(q)
        weights = result.scalars().all()
        return weights


# Function to remove a specific weight entry for a user by weight and user IDs
async def delete_user_weight(
    user_id: UUID,
    weight_id: UUID,
) -> Optional[models.Weights]:
    # Locate specific weight entry by IDs
    async with AsyncSession(engine) as session:
        q = select(models.Weights).where(
            models.Weights.id == weight_id,
            models.Weights.user_id == user_id,
        )
        result = await session.execute(q)
        db_weight = result.scalars().first()
        # Delete weight if found
        if db_weight:
            await session.delete(db_weight)
            await session.commit()
        return db_weight
