from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.tess import (
    TessPredictionRequest,
    TessPredictionResponse,
    TessPredictionListResponse,
)
from app.services.prediction.tess import tess_prediction_service
from app.utilities.db import get_db
from app.utilities.logger import logger as get_logger

router = APIRouter(prefix="/tess/predictions", tags=["TESS Predictions"])

log = get_logger(__name__)


@router.post("/predict", response_model=TessPredictionResponse)
async def make_tess_prediction(
    request: TessPredictionRequest,
    db: AsyncSession = Depends(get_db),
    user_id: Optional[int] = None,  # In a real app, this would come from JWT token
) -> TessPredictionResponse:
    """
    Make a TESS exoplanet prediction using the trained XGBoost model.

    This endpoint accepts TESS telescope data and returns a prediction
    about the disposition of the candidate:
    - PC: Confirmed Planet
    - FP: False Positive
    - APC: Ambiguous Planet Candidate
    """
    try:
        log.info(f"Making TESS prediction request for user_id: {user_id}")
        prediction = await tess_prediction_service.predict(request, db, user_id)
        return prediction
    except FileNotFoundError as e:
        log.error(f"Model file not found: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="TESS prediction model is not available",
        )
    except ImportError as e:
        log.error(f"Missing dependencies: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="TESS prediction service dependencies are not installed",
        )
    except ValueError as e:  # Handle user not found
        log.error(f"User validation failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        log.error(f"TESS Prediction failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="TESS prediction failed due to an internal error",
        )


@router.get("/", response_model=TessPredictionListResponse)
async def get_tess_predictions(
    db: AsyncSession = Depends(get_db),
    user_id: Optional[int] = None,  # In a real app, this would come from JWT token
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(
        100, ge=1, le=1000, description="Maximum number of records to return"
    ),
) -> TessPredictionListResponse:
    """
    Get TESS prediction history.

    Returns a paginated list of previous TESS predictions made by the user
    (or all predictions if user_id is None and user has admin privileges).
    """
    try:
        log.info(
            f"Getting TESS predictions for user_id: {user_id}, skip: {skip}, limit: {limit}"
        )
        predictions = await tess_prediction_service.get_predictions(
            db, user_id, skip, limit
        )

        return TessPredictionListResponse(
            predictions=predictions,
            total=len(
                predictions
            ),  # In a real app, you'd want to count total separately
            page=skip // limit + 1,
            size=len(predictions),
        )
    except Exception as e:
        log.error(f"Failed to get TESS predictions: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve TESS predictions",
        )


@router.get("/{prediction_id}", response_model=TessPredictionResponse)
async def get_tess_prediction_by_id(
    prediction_id: str,
    db: AsyncSession = Depends(get_db),
    user_id: Optional[int] = None,  # In a real app, this would come from JWT token
) -> TessPredictionResponse:
    """
    Get a specific TESS prediction by ID.
    """
    try:
        predictions = await tess_prediction_service.get_predictions(db, user_id)

        for prediction in predictions:
            if prediction.prediction_id == prediction_id:
                return prediction

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="TESS prediction not found"
        )
    except HTTPException:
        raise
    except Exception as e:
        log.error(f"Failed to get TESS prediction {prediction_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve TESS prediction",
        )


@router.delete("/{prediction_id}")
async def delete_tess_prediction(
    prediction_id: str,
    db: AsyncSession = Depends(get_db),
    user_id: Optional[int] = None,  # In a real app, this would come from JWT token
) -> Dict[str, Any]:
    """
    Delete a specific TESS prediction by ID.

    Users can only delete their own predictions unless they have admin privileges.
    """
    try:
        log.info(f"Deleting TESS prediction {prediction_id} for user_id: {user_id}")
        success = await tess_prediction_service.delete_prediction(
            db, prediction_id, user_id
        )

        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="TESS prediction not found or you don't have permission to delete it",
            )

        return {
            "message": "TESS prediction deleted successfully",
            "prediction_id": prediction_id,
        }

    except HTTPException:
        raise
    except Exception as e:
        log.error(f"Failed to delete TESS prediction {prediction_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete TESS prediction",
        )


@router.get("/health", tags=["Health"])
async def tess_service_health() -> Dict[str, Any]:
    """
    Check if the TESS prediction service is available.
    """
    try:
        model_path = tess_prediction_service.model_path
        return {
            "status": "healthy",
            "service": "TESS Prediction Service",
            "model_path": model_path,
            "model_loaded": tess_prediction_service.model is not None,
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Service unhealthy: {str(e)}",
        )
