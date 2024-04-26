from typing import List

import app.crud as crud
import app.models as models
import app.schemas as schemas
from app.database import SessionLocal, engine
from app.security import JWTBearer, get_user_id
from fastapi import Depends, FastAPI, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

models.Base.metadata.create_all(bind=engine)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app = FastAPI()


# Dependency for database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


@app.post("/token", response_model=schemas.Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    user = crud.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = crud.create_access_token(
        data={
            "user_id": user.id,
            "username": user.username,
        }
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Username already registered",
        )
    return crud.create_user(db=db, user=user)


@app.get("/users/", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users


@app.get("/meals/", response_model=List[schemas.Meal])
def read_meals(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    meals = crud.get_meals(db, skip=skip, limit=limit)
    return meals


@app.post(
    "/meals/",
    response_model=schemas.Meal,
    dependencies=[Depends(JWTBearer())],
)
def create_meal(
    meal: schemas.MealCreate,
    request: Request,
    db: Session = Depends(get_db),
):
    user_id = get_user_id(request)
    return crud.create_meal(db, meal, user_id)
