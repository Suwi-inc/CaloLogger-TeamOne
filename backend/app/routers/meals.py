from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app import schemas
from app.crud import create_user_meal, get_user_meals, delete_user_meal
from app.security import JWTBearer, get_user_id
from app.utils.db import get_db

router = APIRouter(
    tags=["Meals"],
    dependencies=[Depends(JWTBearer())],
)


@router.get("/meals", response_model=list[schemas.Meal])
async def get_meals(
    request: Request,
    db: Session = Depends(get_db),
):
    user_id = get_user_id(request)
    return get_user_meals(db, user_id)


@router.post("/meals", response_model=schemas.Meal)
async def create_meal(
    request: Request,
    meal: schemas.MealCreate,
    db: Session = Depends(get_db),
):
    user_id = get_user_id(request)
    nutritions = schemas.MealNutritions()

    meal_data = create_user_meal(db, meal, user_id)
    full_meal = schemas.Meal(**meal_data.__dict__, nutritions=nutritions)
    return full_meal


@router.delete("/meals/{meal_id}", response_model=schemas.Meal)
async def delete_meal(
    request: Request,
    meal_id: int,
    db: Session = Depends(get_db),
):
    user_id = get_user_id(request)
    meal = delete_user_meal(db, user_id, meal_id)

    if meal is None:
        raise HTTPException(
            status_code=404,
            detail="Meal not found",
        )

    return meal
