from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel

import app.schemas as schemas
from app.database import engine
from app.routers import meals, weights, auth
from app.logger import setup_logger


@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_logger()
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)

    yield


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app = FastAPI(lifespan=lifespan)

# Configure CORS
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.head("/health")
def head_health() -> schemas.HealthCheck:
    """
    ## Perform a Health Check
    Returns a JSON response with the health status. Used by Uptime Robot
    """
    return schemas.HealthCheck(status="OK")


app.include_router(auth.router)
app.include_router(meals.router)
app.include_router(weights.router)
