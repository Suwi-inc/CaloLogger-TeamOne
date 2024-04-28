from fastapi import FastAPI
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware

import app.models as models
import app.schemas as schemas
from app.database import engine
from app.routers import meals, weights, auth
from app.logger import setup_logger

setup_logger()

models.Base.metadata.create_all(bind=engine)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app = FastAPI()

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
