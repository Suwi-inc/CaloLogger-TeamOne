from datetime import datetime
from typing import Optional

from pydantic import BaseModel


# User Schemas
class UserBase(BaseModel):
    username: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int

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
    id: int
    user_id: int
    nutritions: MealNutritions

    class Config:
        from_attributes = True


# Token and Authentication Schemas
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


# Weights Schemas (if you decide to add weight tracking)
class WeightsBase(BaseModel):
    weight: float
    date: datetime


class WeightsCreate(WeightsBase):
    pass


class Weights(WeightsBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True


# # Include this to handle List type fields correctly
# User.model_rebuild()
# Meal.model_rebuild()
# Weights.model_rebuild()
