import requests
import os
from fastapi import HTTPException
from app.schemas import MealNutritions, MealResponse
from loguru import logger
from dotenv import load_dotenv


load_dotenv()

API_KEY = os.getenv("API_KEY", "default_api_key")


def get_recipes(
    query: str,
) -> list[MealResponse]:
    api_url = "https://api.calorieninjas.com/v1/recipe?query="
    response = requests.get(
        api_url + query,
        headers={
            "origin": "https://calorieninjas.com",
        },
    )
    if response.status_code != requests.codes.ok:
        logger.error(f"Error: {response.status_code} {response.text}")
        raise HTTPException(status_code=404, detail="No recipe found")

    return response.json()


def get_nutritions(
    query: str,
) -> MealNutritions:

    api_url = "https://api.calorieninjas.com/v1/nutrition?query="

    response = requests.get(
        api_url + query,
        headers={
            "origin": "https://calorieninjas.com",
        },
    )

    if response.status_code != requests.codes.ok:
        logger.error(f"Error: {response.status_code} {response.text}")
        raise HTTPException(status_code=404, detail="No nutrition found")

    response_json = response.json()
    nutrition_list = response_json["items"]

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
