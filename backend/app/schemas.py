from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class HealthCheck(BaseModel):
    """Response model to validate and return when performing a health check."""

    status: str = "OK"


# Token and Authentication Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

    class Config:
        from_attributes = True


class TokenData(BaseModel):
    username: Optional[str] = None


# User Schemas
class UserBase(BaseModel):
    username: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: UUID

    class Config:
        from_attributes = True


# Meal Schemas
class MealNutritions(BaseModel):
    calories: float
    fat_total_g: float
    fat_saturated_g: float
    protein_g: float
    sodium_mg: float
    potassium_mg: float
    cholesterol_mg: float
    carbohydrates_total_g: float
    fiber_g: float
    sugar_g: float

    class Config:
        from_attributes = True


class MealBase(BaseModel):
    name: str
    ingredients: str
    date: datetime


class MealCreate(MealBase):
    pass


class Meal(MealBase):
    id: UUID
    user_id: UUID
    nutritions: MealNutritions

    class Config:
        from_attributes = True


class Recipe(BaseModel):
    title: str
    ingredients: str

    class Config:
        from_attributes = True


# Weights Schemas (if you decide to add weight tracking)
class WeightsBase(BaseModel):
    weight: float
    date: datetime


class WeightsCreate(WeightsBase):
    pass


class Weights(WeightsBase):
    id: UUID
    user_id: UUID

    class Config:
        from_attributes = True
