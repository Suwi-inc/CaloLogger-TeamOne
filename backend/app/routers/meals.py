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
    request: Request, db: Session = Depends(get_db)
) -> list[schemas.Meal]:
    """
    Retrieve all meals for the authenticated user.
    """
    user_id = get_user_id(request)
    meals = get_user_meals(db, user_id)
    return meals


@router.post("/meals", response_model=schemas.Meal)
async def create_meal(
    request: Request, meal: schemas.MealCreate, db: Session = Depends(get_db)
) -> schemas.Meal:
    """
    Create a new meal for the authenticated user.
    """
    user_id = get_user_id(request)
    meal_data = create_user_meal(db, meal, user_id)
    nutritions = (
        schemas.MealNutritions()
    )  # Assuming this needs to be populated or calculated somewhere
    return schemas.Meal(**meal_data.__dict__, nutritions=nutritions)


@router.delete("/meals/{meal_id}", response_model=schemas.Meal)
async def delete_meal(
    request: Request, meal_id: int, db: Session = Depends(get_db)
) -> schemas.Meal:
    """
    Delete a meal by its ID for the authenticated user.
    Raises a 404 error if the meal is not found.
    """
    user_id = get_user_id(request)
    meal = delete_user_meal(db, user_id, meal_id)
    if meal is None:
        raise HTTPException(status_code=404, detail="Meal not found")
    return meal
