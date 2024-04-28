from datetime import UTC, datetime

from sqlalchemy import (
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    JSON,
)
from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    meals = relationship("Meal", back_populates="user")


class Meal(Base):
    __tablename__ = "meals"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    ingredients = Column(String)
    nutritions = Column(JSON)
    date = Column(DateTime, default=datetime.now(UTC))

    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="meals")


class Weights(Base):
    __tablename__ = "weights"

    id = Column(Integer, primary_key=True, index=True)
    weight = Column(Float)
    date = Column(DateTime, default=datetime.now(UTC))

    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User")
