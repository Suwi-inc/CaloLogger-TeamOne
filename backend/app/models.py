from datetime import UTC, datetime

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String
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
    name = Column(String, index=True)
    ingredients = Column(String, index=True)
    date = Column(DateTime, default=datetime.now(UTC))

    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="meals")
    nutritions = relationship("Nutritions", back_populates="meal")


class Nutritions(Base):
    __tablename__ = "nutritions"

    id = Column(Integer, primary_key=True, index=True)
    calories = Column(Float)
    serving_size_g = Column(Float)
    fat_total_g = Column(Float)
    fat_saturated_g = Column(Float)
    protein_g = Column(Float)
    sodium_mg = Column(Float)
    potassium_mg = Column(Float)
    cholesterol_mg = Column(Float)
    carbohydrates_total_g = Column(Float)
    fiber_g = Column(Float)
    sugar_g = Column(Float)

    meal_id = Column(Integer, ForeignKey("meals.id"))
    meal = relationship("Meal", back_populates="nutritions")


class Weights(Base):
    __tablename__ = "weights"

    id = Column(Integer, primary_key=True, index=True)
    weight = Column(Float)
    date = Column(DateTime, default=datetime.now(UTC))

    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User")
