from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.prediction import PredictionRequest, PredictionResponse, PredictionListResponse
from app.services.prediction import prediction_service
from app.utilities.db import get_db
from app.utilities.logger import logger as get_logger

router = APIRouter(prefix="/predictions", tags=["predictions"])

log = get_logger(__name__)


@router.post("/predict", response_model=PredictionResponse)
async def make_prediction(
    request: PredictionRequest,
    db: AsyncSession = Depends(get_db),
    user_id: Optional[int] = None  # In a real app, this would come from JWT token
) -> PredictionResponse:
    """
    Make an exoplanet prediction using the trained ANN model.
    
    This endpoint accepts Kepler telescope data and returns a prediction
    about whether the data indicates the presence of an exoplanet.
    """
    try:
        log.info(f"Making prediction request for user_id: {user_id}")
        prediction = await prediction_service.predict(request, db, user_id)
        return prediction
    except FileNotFoundError as e:
        log.error(f"Model file not found: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Prediction model is not available"
        )
    except ImportError as e:
        log.error(f"Missing dependencies: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Prediction service dependencies are not installed"
        )
    except Exception as e:
        log.error(f"Prediction failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Prediction failed due to an internal error"
        )


@router.get("/", response_model=PredictionListResponse)
async def get_predictions(
    db: AsyncSession = Depends(get_db),
    user_id: Optional[int] = None,  # In a real app, this would come from JWT token
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of records to return")
) -> PredictionListResponse:
    """
    Get prediction history.
    
    Returns a paginated list of previous predictions made by the user
    (or all predictions if user_id is None and user has admin privileges).
    """
    try:
        log.info(f"Getting predictions for user_id: {user_id}, skip: {skip}, limit: {limit}")
        predictions = await prediction_service.get_predictions(db, user_id, skip, limit)
        
        return PredictionListResponse(
            predictions=predictions,
            total=len(predictions),  # In a real app, you'd want to count total separately
            page=skip // limit + 1,
            size=len(predictions)
        )
    except Exception as e:
        log.error(f"Failed to get predictions: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve predictions"
        )


@router.get("/{prediction_id}", response_model=PredictionResponse)
async def get_prediction_by_id(
    prediction_id: str,
    db: AsyncSession = Depends(get_db),
    user_id: Optional[int] = None  # In a real app, this would come from JWT token
) -> PredictionResponse:
    """
    Get a specific prediction by ID.
    """
    try:
        predictions = await prediction_service.get_predictions(db, user_id)
        
        for prediction in predictions:
            if prediction.prediction_id == prediction_id:
                return prediction
        
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prediction not found"
        )
    except HTTPException:
        raise
    except Exception as e:
        log.error(f"Failed to get prediction {prediction_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve prediction"
        )


@router.delete("/{prediction_id}")
async def delete_prediction(
    prediction_id: str,
    db: AsyncSession = Depends(get_db),
    user_id: Optional[int] = None  # In a real app, this would come from JWT token
) -> dict:
    """
    Delete a specific prediction by ID.
    
    Users can only delete their own predictions unless they have admin privileges.
    """
    try:
        log.info(f"Deleting prediction {prediction_id} for user_id: {user_id}")
        success = await prediction_service.delete_prediction(db, prediction_id, user_id)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Prediction not found or you don't have permission to delete it"
            )
        
        return {"message": "Prediction deleted successfully", "prediction_id": prediction_id}
    except HTTPException:
        raise
    except Exception as e:
        log.error(f"Failed to delete prediction {prediction_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete prediction"
        )


@router.delete("/")
async def delete_all_predictions(
    db: AsyncSession = Depends(get_db),
    user_id: Optional[int] = None,  # In a real app, this would come from JWT token
    confirm: bool = Query(False, description="Set to true to confirm deletion of all predictions")
) -> dict:
    """
    Delete all predictions for the user.
    
    This is a destructive operation and requires confirmation.
    """
    if not confirm:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please set confirm=true to delete all predictions"
        )
    
    try:
        log.info(f"Deleting all predictions for user_id: {user_id}")
        
        # Get all predictions first
        predictions = await prediction_service.get_predictions(db, user_id, 0, 10000)
        
        # Delete each prediction
        deleted_count = 0
        for prediction in predictions:
            success = await prediction_service.delete_prediction(db, prediction.prediction_id, user_id)
            if success:
                deleted_count += 1
        
        return {
            "message": f"Successfully deleted {deleted_count} predictions",
            "deleted_count": deleted_count
        }
    except Exception as e:
        log.error(f"Failed to delete all predictions for user_id {user_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete predictions"
        )