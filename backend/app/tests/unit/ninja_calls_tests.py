import pytest
from unittest.mock import patch, MagicMock
from app.schemas import MealNutritions, Recipe
from app.utils.ninja_calls import get_nutritions, get_recipes, fetch_api_data
from fastapi import HTTPException


@pytest.fixture
def mocked_requests_get():
    with patch("app.utils.requests.get") as mocked_get:
        yield mocked_get


def test_fetch_api_data_success(mocked_requests_get):
    mocked_response = MagicMock()
    mocked_response.status_code = 200
    mocked_response.json.return_value = {"items": []}
    mocked_requests_get.return_value = mocked_response

    endpoint = "recipe"
    query = "chicken"
    result = fetch_api_data(endpoint, query)

    assert result == {"items": []}
    mocked_requests_get.assert_called_once_with(
        f"https://api.calorieninjas.com/v1/{endpoint}?query={query}",
        headers={"origin": "https://calorieninjas.com"},
        timeout=10,
    )


def test_fetch_api_data_error(mocked_requests_get):
    mocked_response = MagicMock()
    mocked_response.status_code = 404
    mocked_response.text = "Not Found"
    mocked_requests_get.return_value = mocked_response

    endpoint = "recipe"
    query = "chicken"

    with pytest.raises(HTTPException):
        fetch_api_data(endpoint, query)


def test_get_recipes(mocked_requests_get):
    mocked_response = MagicMock()
    mocked_response.status_code = 200
    mocked_response.json.return_value = [{"recipe_name": "Chicken Curry"}]
    mocked_requests_get.return_value = mocked_response

    query = "chicken"
    recipes = get_recipes(query)

    assert len(recipes) == 1
    assert isinstance(recipes[0], Recipe)
    assert recipes[0].recipe_name == "Chicken Curry"


def test_get_nutritions(mocked_requests_get):
    mocked_response = MagicMock()
    mocked_response.status_code = 200
    mocked_response.json.return_value = {
        "items": [
            {
                "calories": 300,
                "fat_total_g": 10,
                "fat_saturated_g": 5,
                "protein_g": 30,
                "sodium_mg": 500,
                "potassium_mg": 700,
                "cholesterol_mg": 50,
                "carbohydrates_total_g": 20,
                "fiber_g": 5,
                "sugar_g": 2,
            },
            {
                "calories": 200,
                "fat_total_g": 5,
                "fat_saturated_g": 2,
                "protein_g": 20,
                "sodium_mg": 300,
                "potassium_mg": 500,
                "cholesterol_mg": 30,
                "carbohydrates_total_g": 15,
                "fiber_g": 3,
                "sugar_g": 1,
            },
        ]
    }
    mocked_requests_get.return_value = mocked_response

    query = "chicken"
    nutritions = get_nutritions(query)

    assert isinstance(nutritions, MealNutritions)
    assert nutritions.calories == 500
    assert nutritions.fat_total_g == 15
    assert nutritions.fat_saturated_g == 7
    assert nutritions.protein_g == 50
    assert nutritions.sodium_mg == 800
    assert nutritions.potassium_mg == 1200
    assert nutritions.cholesterol_mg == 80
    assert nutritions.carbohydrates_total_g == 35
    assert nutritions.fiber_g == 8
    assert nutritions.sugar_g == 3
