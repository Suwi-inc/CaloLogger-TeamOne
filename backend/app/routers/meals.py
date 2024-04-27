from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from loguru import logger

from app import schemas
from app.crud import create_user_meal, get_user_meals, delete_user_meal
from app.security import JWTBearer, get_user_id
from app.utils.db import get_db
from app.utils.ninja_calls import get_nutritions, get_recipes

router = APIRouter(
    prefix="/meals",
    tags=["Meals"],
    dependencies=[Depends(JWTBearer())],
)


@router.get(
    "/",
    response_model=list[schemas.Meal],
)
async def get_meals(
    request: Request, db: Session = Depends(get_db)
) -> list[schemas.Meal]:
    """
    ## Get all meals
    Retrieve all meals for the authenticated user.
    """
    user_id = get_user_id(request)
    meals = get_user_meals(db, user_id)
    return meals


@router.post(
    "/",
    response_model=schemas.Meal,
)
async def create_meal(
    request: Request, meal: schemas.MealCreate, db: Session = Depends(get_db)
) -> schemas.Meal:
    """
    ## Create a new meal
    Create a new meal for the authenticated user.
    """
    user_id = get_user_id(request)
    meal_data = create_user_meal(db, meal, user_id)
    nutritions = get_nutritions(meal_data.ingredients)
    logger.info(
        f"User_id: {user_id} created meal with id: {meal_data.id}",
    )
    return schemas.Meal(**meal_data.__dict__, nutritions=nutritions)


@router.delete(
    "/{meal_id}",
    response_model=schemas.Meal,
)
async def delete_meal(
    request: Request, meal_id: int, db: Session = Depends(get_db)
) -> schemas.Meal:
    """
    ## Delete a meal
    Delete a meal by its ID for the authenticated user.
    """
    user_id = get_user_id(request)
    meal = delete_user_meal(db, user_id, meal_id)
    if meal is None:
        logger.error(
            f"User_id: {user_id} tried to delete meal with id: {meal_id}, \
                but meal not found",
        )
        raise HTTPException(status_code=404, detail="Meal not found")
    logger.info(
        f"User_id: {user_id} deleted meal with id: {meal_id}",
    )
    return meal


@router.get(
    "/search",
    response_model=list[schemas.Recipe],
)
async def search_meals(
    query: str,
) -> list[schemas.Recipe]:
    """
    ## Search for meals
    Search for meals by name for the authenticated user.
    """
    return get_recipes(query)
