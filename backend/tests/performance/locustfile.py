import requests
import os
import datetime

from locust import HttpUser, task
from dotenv import load_dotenv

load_dotenv(override=True)

USERNAME = os.getenv("USERNAME")
PASSWORD = os.getenv("PASSWORD")


class CaloLoggerUser(HttpUser):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        requests.post(
            f"{self.client.base_url}/signup",
            json={"username": USERNAME, "password": PASSWORD},
        )
        login_response = requests.post(
            f"{self.client.base_url}/login",
            json={"username": USERNAME, "password": PASSWORD},
        )

        access_token = login_response.json()["access_token"]

        self.client.headers.update({"Authorization": f"Bearer {access_token}"})

    @task
    def get_meals_task(self):
        self.client.get("/meals", name="Get Meals")

    @task
    def search_recipes_task(self):
        self.client.get(
            "/meals/search?query=carbonara",
            name="Search Recipes",
        )

    @task
    def post_meal_task(self):
        self.client.post(
            "/meals",
            name="Create Meal",
            json={
                "name": "American Pasta Carbonara",
                "ingredients": (
                    "8 oz Dry spinach fettucine|2 tb Olive oil|"
                    "2 oz Finely-chopped bacon|1 Garlic clove; minced|"
                    "2 lg Eggs; lightly beaten|1/2 c Grated sharp white "
                    "cheddar cheese|Salt; to taste|Freshly-ground black "
                    "pepper; to taste"
                ),
                "date": datetime.datetime.now().isoformat(),
            },
        )

    @task
    def get_weights_task(self):
        self.client.get("/weights", name="Get Weights")

    @task
    def post_weight_task(self):
        self.client.post(
            "/weights",
            name="Create Weight",
            json={
                "weight": 65,
                "date": datetime.datetime.now().isoformat(),
            },
        )
        pass
