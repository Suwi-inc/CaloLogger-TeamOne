from datetime import UTC, datetime
from typing import Dict
from uuid import UUID, uuid4

from sqlmodel import SQLModel, Relationship, Field
from sqlalchemy import Column, JSON

# from app.database import Base


class User(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    username: str
    hashed_password: str

    meals: list["Meal"] = Relationship(back_populates="user")
    weights: list["Weights"] = Relationship(back_populates="user")


class Meal(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    name: str
    ingredients: str
    nutritions: Dict = Field(default_factory=dict, sa_column=Column(JSON))
    date: datetime = Field(default=datetime.now(UTC))
    user_id: UUID = Field(foreign_key="user.id")
    user: "User" = Relationship(back_populates="meals")

    class ConfigDict:
        arbitrary_types_allowed = True


class Weights(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    weight: float
    date: datetime = Field(default=datetime.now(UTC))
    user_id: UUID = Field(foreign_key="user.id")
    user: "User" = Relationship(back_populates="weights")
