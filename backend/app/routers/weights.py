from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app import schemas
from app.crud import get_user_weights, delete_user_weight
from app.security import JWTBearer, get_user_id
from app.utils.db import get_db

router = APIRouter(
    tags=["Weights"],
    dependencies=[Depends(JWTBearer())],
)


@router.get("/weights", response_model=list[schemas.Weights])
async def get_weights(
    request: Request,
    db: Session = Depends(get_db),
):
    user_id = get_user_id(request)
    return get_user_weights(db, user_id)


@router.delete("/weights/{weight_id}", response_model=schemas.Weights)
async def delete_weight(
    request: Request,
    weight_id: int,
    db: Session = Depends(get_db),
):
    user_id = get_user_id(request)
    weight = delete_user_weight(db, user_id, weight_id)

    if weight is None:
        raise HTTPException(
            status_code=404,
            detail="Weight not found",
        )
    return weight
