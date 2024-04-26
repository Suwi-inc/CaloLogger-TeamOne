import requests
from fastapi import HTTPException
from typing import List, Dict
from app.schemas import MealNutritions, Recipe
from loguru import logger

API_BASE_URL = "https://api.calorieninjas.com/v1/"
HEADERS = {"origin": "https://calorieninjas.com"}


def fetch_api_data(endpoint: str, query: str) -> Dict:
    """Helper function to fetch data from API and handle errors."""
    response = requests.get(
        f"{API_BASE_URL}{endpoint}?query={query}", headers=HEADERS, timeout=10
    )
    if response.status_code != requests.codes.ok:
        logger.error(f"Error: {response.status_code} {response.text}")
        raise HTTPException(status_code=404, detail="Resource not found")
    return response.json()


def get_recipes(query: str) -> List[Recipe]:
    """Fetch recipes based on a query."""
    data = fetch_api_data("recipe", query)
    return data


def get_nutritions(query: str) -> MealNutritions:
    """Fetch nutritional information based on a query and compute totals."""
    data = fetch_api_data("nutrition", query)
    nutrition_list = data["items"]

    # Calculate total nutritional values
    nutrition_totals = [
        sum(item[nutr] for item in nutrition_list)
        for nutr in [
            "calories",
            "fat_total_g",
            "fat_saturated_g",
            "protein_g",
            "sodium_mg",
            "potassium_mg",
            "cholesterol_mg",
            "carbohydrates_total_g",
            "fiber_g",
            "sugar_g",
        ]
    ]

    return MealNutritions(
        calories=nutrition_totals[0],
        fat_total_g=nutrition_totals[1],
        fat_saturated_g=nutrition_totals[2],
        protein_g=nutrition_totals[3],
        sodium_mg=nutrition_totals[4],
        potassium_mg=nutrition_totals[5],
        cholesterol_mg=nutrition_totals[6],
        carbohydrates_total_g=nutrition_totals[7],
        fiber_g=nutrition_totals[8],
        sugar_g=nutrition_totals[9],
    )
