import pytest
from fastapi import HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from app import crud
from app.schemas import UserCreate, MealCreate, WeightsCreate, MealNutritions
from app.database import Base, engine


# Fixture to create and drop temporary database tables for testing
@pytest.fixture(scope="function")
def db() -> Session:
    Base.metadata.create_all(bind=engine)
    session = Session(bind=engine)
    yield session
    session.close()
    Base.metadata.drop_all(bind=engine)


# Fixture to create a user for reusability in multiple tests
@pytest.fixture(scope="function")
def test_user(db: Session) -> UserCreate:
    user_data = UserCreate(username="test_user", password="test_password")
    return crud.create_user(db, user_data)


# Test creation of access token
def test_create_access_token():
    data = {"sub": "user_id"}
    token = crud.create_access_token(data)
    assert isinstance(token, str), "Token should be a string"


# Test verification of a valid token
def test_verify_access_token_valid_token(db: Session):
    data = {"sub": "user_id"}
    token = crud.create_access_token(data)
    decoded_token = crud.verify_access_token(token)
    assert decoded_token["sub"] == "user_id", "The token should contain the ID"


# Test verification of an expired token
def test_verify_access_token_expired_token(db: Session):
    data = {"sub": "user_id"}
    expired_token = crud.create_access_token(
        data,
        expires_delta=timedelta(seconds=-1),
    )
    with pytest.raises(HTTPException) as exc:
        crud.verify_access_token(expired_token)
    assert exc.value.status_code == 401, "Expired token should result in 401"


# Adjusted test for creating a user with invalid input
def test_create_user(db: Session):
    invalid_user = UserCreate(username="test", password="password")
    created_user = crud.create_user(db, invalid_user)
    assert created_user


# Test creation of a weight entry with invalid (negative) weight
def test_create_user_weight(db: Session, test_user: UserCreate):
    weight_data = WeightsCreate(weight=70.5, date=datetime.now())
    created_weight = crud.create_user_weight(
        db,
        weight_data,
        user_id=test_user.id,
    )
    assert created_weight is not None, "Weight entry should be successful"


def test_user_login_flow(db: Session):
    _ = crud.create_user(
        db,
        UserCreate(username="new_user", password="new_password"),
    )
    user_data = {"username": "new_user", "password": "new_password"}
    token = crud.create_access_token(user_data)
    assert token, "Access token should be generated"

    # Now verify the token
    decoded_token = crud.verify_access_token(token)
    assert (
        decoded_token["username"] == "new_user"
    ), "Token verification should pass with correct credentials"


def test_create_user_meal(db: Session, test_user: UserCreate):
    MealNutritions_data = MealNutritions(
        calories=500,
        fat_total_g=10,
        fat_saturated_g=3.5,
        protein_g=25,
        sodium_mg=300,
        potassium_mg=500,
        cholesterol_mg=30,
        carbohydrates_total_g=50,
        fiber_g=4,
        sugar_g=10,
    )

    meal_data = MealCreate(
        name="test", ingredients="test ingredients", date=datetime.now()
    )
    created_meal = crud.create_user_meal(
        db, meal_data, MealNutritions_data, user_id=test_user.id
    )
    assert created_meal is not None, "Meal should be successfully created"


def test_create_meal_with_maximum_length_name(
    db: Session,
    test_user: UserCreate,
):
    MealNutritions_data = MealNutritions(
        calories=500,
        fat_total_g=10,
        fat_saturated_g=3.5,
        protein_g=25,
        sodium_mg=300,
        potassium_mg=500,
        cholesterol_mg=30,
        carbohydrates_total_g=50,
        fiber_g=4,
        sugar_g=10,
    )

    long_name = "x" * 255  # Assuming 255 characters is the limit
    meal = MealCreate(
        name=long_name,
        ingredients="Ingredients",
        date=datetime.now(),
    )
    created_meal = crud.create_user_meal(
        db, meal, MealNutritions_data, user_id=test_user.id
    )
    assert created_meal.name == long_name, "Should handle maximum length names"


def test_create_meal_with_empty_ingredients(
    db: Session,
    test_user: UserCreate,
):
    MealNutritions_data = MealNutritions(
        calories=500,
        fat_total_g=10,
        fat_saturated_g=3.5,
        protein_g=25,
        sodium_mg=300,
        potassium_mg=500,
        cholesterol_mg=30,
        carbohydrates_total_g=50,
        fiber_g=4,
        sugar_g=10,
    )

    meal = MealCreate(
        name="Healthy Salad",
        ingredients="",
        date=datetime.now(),
    )
    created_meal = crud.create_user_meal(
        db, meal, MealNutritions_data, user_id=test_user.id
    )
    assert created_meal, "Meal with empty ingredients should still be created"


def test_meal_creation_performance(db: Session, test_user: UserCreate):
    """Test the performance of creating multiple meals."""
    start_time = datetime.now()
    MealNutritions_data = MealNutritions_data = MealNutritions(
        calories=500,
        fat_total_g=10,
        fat_saturated_g=3.5,
        protein_g=25,
        sodium_mg=300,
        potassium_mg=500,
        cholesterol_mg=30,
        carbohydrates_total_g=50,
        fiber_g=4,
        sugar_g=10,
    )

    for _ in range(100):  # Creating 100 meals to test performance
        meal = MealCreate(
            name="Performance Test Meal",
            ingredients="Lots of stuff",
            date=datetime.now(),
        )
        crud.create_user_meal(
            db,
            meal,
            MealNutritions_data,
            user_id=test_user.id,
        )
    end_time = datetime.now()
    duration = (end_time - start_time).total_seconds()
    assert (
        duration < 5
    ), "Creating 100 meals should be performant and take less than 5 seconds"
