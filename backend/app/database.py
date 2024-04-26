import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

os.makedirs("db", exist_ok=True)
SQLALCHEMY_DATABASE_URL = "sqlite:///./db/test.db"  # SQLite database file
# SQLALCHEMY_DATABASE_URL = "sqlite+aiosqlite:///./test.db"  # Use for async

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
