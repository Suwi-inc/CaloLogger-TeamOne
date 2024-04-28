from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Request
from loguru import logger

from app import schemas
from app.crud import get_user_weights, create_user_weight, delete_user_weight
from app.security import JWTBearer, get_user_id

router = APIRouter(
    prefix="/weights",
    tags=["Weights"],
    dependencies=[Depends(JWTBearer())],
)


@router.get(
    "",
    response_model=list[schemas.Weights],
)
async def get_weights(request: Request) -> list[schemas.Weights]:
    """
    ## Get all weight entries
    Retrieve all weight entries for the authenticated user.
    """
    user_id = get_user_id(request)
    weights = await get_user_weights(user_id)
    return weights


@router.post(
    "",
    response_model=schemas.Weights,
)
async def create_weight(
    request: Request,
    weight: schemas.WeightsCreate,
):
    """
    ## Create a new weight entry
    Create a new weight entry for the authenticated user.
    """
    user_id = get_user_id(request)
    response = await create_user_weight(
        weight,
        user_id,
    )
    logger.info(
        f"User_id: {user_id} created weight with id: {response.id}",
    )
    return response


@router.delete(
    "/{weight_id}",
    response_model=schemas.Weights,
)
async def delete_weight(request: Request, weight_id: UUID) -> schemas.Weights:
    """
    ## Delete a weight entry by its ID
    Delete a weight entry by its ID for the authenticated user.
    """
    user_id = get_user_id(request)
    weight = await delete_user_weight(user_id, weight_id)
    if weight is None:
        logger.error(
            f"User_id: {user_id} tried to delete weight with id: {weight_id}, \
                but weight not found",
        )
        raise HTTPException(status_code=404, detail="Weight not found")
    logger.info(
        f"User_id: {user_id} deleted weight with id: {weight_id}",
    )
    return weight
