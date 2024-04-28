import pytest
from fastapi import HTTPException
from app.utils.ninja_calls import get_recipes, get_nutritions, fetch_api_data


@pytest.mark.asyncio
async def test_fetch_api_data_success():
    response = await fetch_api_data("recipe", "pasta")
    assert response


@pytest.mark.asyncio
async def test_fetch_api_data_failure():
    with pytest.raises(HTTPException):
        await fetch_api_data("non existence", "pasta")


@pytest.mark.asyncio
async def test_get_recipes():
    assert await get_recipes("pizza")


@pytest.mark.asyncio
async def test_get_nutritions_total_computation():
    nutrition = await get_nutritions("burrito")
    assert nutrition.calories == 184.4  # Assert totals
