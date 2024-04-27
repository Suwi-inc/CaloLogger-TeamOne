from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import app.crud as crud
import app.models as models
import app.schemas as schemas
from app.database import engine
from app.utils.db import get_db
from app.routers import meals, weights
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


@app.post("/signup", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """
    ## Create a new user
    Creates a new user and returns it.
    """
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Username already registered",
        )
    return crud.create_user(db=db, user=user)


@app.post("/login", response_model=schemas.Token)
def login(
    user: schemas.UserCreate,
    db: Session = Depends(get_db),
):
    """
    ## Login a user
    Logs in a user and returns a token.
    """
    user_auth = crud.authenticate_user(db, user.username, user.password)
    if not user_auth:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = crud.create_access_token(
        data={
            "user_id": user_auth.id,
            "username": user_auth.username,
        }
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


@app.get("/logs")
async def get_logs():
    """
    ## Get logs
    Returns a list of logs.
    """
    with open("logs/app.log") as f:
        logs = f.readlines()
    return {"logs": logs}


app.include_router(meals.router)
app.include_router(weights.router)
