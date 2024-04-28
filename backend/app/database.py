import os
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

os.makedirs("db", exist_ok=True)
SQLALCHEMY_DATABASE_URL = "sqlite+aiosqlite:///./db/test.sqlite"
engine = create_async_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = async_sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)
