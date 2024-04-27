from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from loguru import logger

from app import schemas
from app.crud import get_user_weights, create_user_weight, delete_user_weight
from app.security import JWTBearer, get_user_id
from app.utils.db import get_db

router = APIRouter(
    prefix="/weights",
    tags=["Weights"],
    dependencies=[Depends(JWTBearer())],
)


@router.get(
    "/",
    response_model=list[schemas.Weights],
)
async def get_weights(
    request: Request, db: Session = Depends(get_db)
) -> list[schemas.Weights]:
    """
    ## Get all weight entries
    Retrieve all weight entries for the authenticated user.
    """
    user_id = get_user_id(request)
    weights = get_user_weights(db, user_id)
    return weights


@router.post(
    "/",
    response_model=schemas.Weights,
)
async def create_weight(
    request: Request,
    weight: schemas.WeightsCreate,
    db: Session = Depends(get_db),
):
    """
    ## Create a new weight entry
    Create a new weight entry for the authenticated user.
    """
    user_id = get_user_id(request)
    logger.info(
        f"User_id: {user_id} created weight with id: {weight.id}",
    )
    return create_user_weight(
        db,
        weight,
        user_id,
    )


@router.delete(
    "/{weight_id}",
    response_model=schemas.Weights,
)
async def delete_weight(
    request: Request, weight_id: int, db: Session = Depends(get_db)
) -> schemas.Weights:
    """
    ## Delete a weight entry by its ID
    Delete a weight entry by its ID for the authenticated user.
    """
    user_id = get_user_id(request)
    weight = delete_user_weight(db, user_id, weight_id)
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
