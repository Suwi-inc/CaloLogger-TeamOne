import pytest
from fastapi import HTTPException
import requests_mock
from app.utils.ninja_calls import get_recipes, get_nutritions, fetch_api_data


def test_fetch_api_data_success():
    with requests_mock.Mocker() as m:
        m.get(
            "https://api.calorieninjas.com/v1/recipe?query=pasta",
            json={"data": "test"},
            status_code=200,
        )
        assert fetch_api_data("recipe", "pasta") == {"data": "test"}


def test_fetch_api_data_failure():
    with requests_mock.Mocker() as m:
        m.get(
            "https://api.calorieninjas.com/v1/recipe?query=pasta",
            status_code=404,
        )
        with pytest.raises(HTTPException):
            fetch_api_data("recipe", "pasta")


def test_get_recipes():
    with requests_mock.Mocker() as m:
        m.get(
            "https://api.calorieninjas.com/v1/recipe?query=pizza",
            json={"items": []},
            status_code=200,
        )
        assert get_recipes("pizza") == {"items": []}


def test_get_nutritions_total_computation():
    # Mock data for simplicity
    mocked_data = {
        "items": [
            {
                "calories": 100,
                "fat_total_g": 1.0,
                "fat_saturated_g": 0.5,
                "protein_g": 5,
                "sodium_mg": 100,
                "potassium_mg": 150,
                "cholesterol_mg": 5,
                "carbohydrates_total_g": 20,
                "fiber_g": 2,
                "sugar_g": 5,
            },
            {
                "calories": 200,
                "fat_total_g": 2.0,
                "fat_saturated_g": 1.0,
                "protein_g": 10,
                "sodium_mg": 200,
                "potassium_mg": 300,
                "cholesterol_mg": 10,
                "carbohydrates_total_g": 40,
                "fiber_g": 4,
                "sugar_g": 10,
            },
        ]
    }
    with requests_mock.Mocker() as m:
        m.get(
            "https://api.calorieninjas.com/v1/nutrition?query=burrito",
            json=mocked_data,
            status_code=200,
        )
        nutrition = get_nutritions("burrito")
        assert nutrition.calories == 300  # Assert totals are computed correctly
