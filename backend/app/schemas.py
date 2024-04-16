from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


# User Schemas
class UserBase(BaseModel):
    username: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int
    meals: List["Meal"] = []

    class Config:
        orm_mode = True


# Meal Schemas
class MealBase(BaseModel):
    description: str
    calories: float
    date: datetime


class MealCreate(MealBase):
    pass


class Meal(MealBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True


# Token and Authentication Schemas
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


# Weight Schemas (if you decide to add weight tracking)
class WeightBase(BaseModel):
    weight: float
    date: datetime


class WeightCreate(WeightBase):
    pass


class Weight(WeightBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True


# Include this to handle List type fields correctly
User.update_forward_refs()
