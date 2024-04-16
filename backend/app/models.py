from datetime import datetime, UTC

from sqlalchemy import Column, Float, ForeignKey, Integer, String, DateTime
from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    meals = relationship("Meal", back_populates="owner")


class Meal(Base):
    __tablename__ = "meals"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(String, index=True)
    calories = Column(Float)
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(DateTime, default=datetime.now(UTC))

    owner = relationship("User", back_populates="meals")

