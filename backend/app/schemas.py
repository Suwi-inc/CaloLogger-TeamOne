from datetime import datetime
from typing import Optional

from pydantic import BaseModel


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
    id: int

    class Config:
        from_attributes = True


# Meal Schemas
class MealNutritions(BaseModel):
    calories: float = 0
    fat_total_g: float = 0
    fat_saturated_g: float = 0
    protein_g: float = 0
    sodium_mg: float = 0
    potassium_mg: float = 0
    cholesterol_mg: float = 0
    carbohydrates_total_g: float = 0
    fiber_g: float = 0
    sugar_g: float = 0

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
    id: int
    user_id: int

    class Config:
        from_attributes = True


# # Include this to handle List type fields correctly
# User.model_rebuild()
# Meal.model_rebuild()
# Weights.model_rebuild()
