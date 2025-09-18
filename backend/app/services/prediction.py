import os
import json
import uuid
from typing import List, Optional, Any
import numpy as np
import pandas as pd
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from sqlalchemy import desc

try:
    import tensorflow as tf
    from tensorflow import keras
except ImportError:
    tf = None
    keras = None

from app.models.prediction import (
    PredictionRequest,
    PredictionResponse,
    PredictionRecord,
)
from app.utilities.logger import logger as get_logger

log = get_logger(__name__)


def find_model_file() -> str:
    """Find the model file in various possible locations"""
    possible_paths = [
        # Relative to current file
        os.path.join(
            os.path.dirname(os.path.abspath(__file__)), "../../models/kepler_ann.keras"
        ),
        # Relative to project root
        os.path.join(os.getcwd(), "models/kepler_ann.keras"),
        # Docker path
        "/app/models/kepler_ann.keras",
        # Alternative relative path
        os.path.join(
            os.path.dirname(os.path.abspath(__file__)),
            "../../../models/kepler_ann.keras",
        ),
        # Absolute path based on known structure
        "/home/mrzoro/Desktop/Hackathon/exovision/backend/models/kepler_ann.keras",
    ]

    for path in possible_paths:
        abs_path = os.path.abspath(path)
        if os.path.exists(abs_path):
            return abs_path

    raise FileNotFoundError(
        f"Model file 'kepler_ann.keras' not found in any of the expected locations: {possible_paths}"
    )


class PredictionService:
    def __init__(self) -> None:
        self.model = None
        self.model_path = find_model_file()
        # Use only 20 features to match the model's expected input shape
        # Selected key features without error terms to reduce dimensionality
        self.feature_columns = [
            "koi_fpflag_nt",
            "koi_fpflag_ss",
            "koi_fpflag_co",
            "koi_fpflag_ec",
            "koi_period",
            "koi_time0bk",
            "koi_impact",
            "koi_duration",
            "koi_depth",
            "koi_prad",
            "koi_teq",
            "koi_insol",
            "koi_model_snr",
            "koi_tce_plnt_num",
            "koi_steff",
            "koi_slogg",
            "koi_srad",
            "ra",
            "dec",
            "koi_kepmag",
        ]

    def load_model(self) -> Any:
        """Load the trained Keras model"""
        if self.model is None:
            if tf is None:
                raise ImportError(
                    "TensorFlow is not installed. Please install it to use predictions."
                )

            # Log the resolved path for debugging
            log.info(f"Attempting to load model from: {self.model_path}")
            log.info(f"Model path exists: {os.path.exists(self.model_path)}")

            if not os.path.exists(self.model_path):
                # Try alternative paths
                alternative_paths = [
                    os.path.join(os.getcwd(), "models/kepler_ann.keras"),
                    "/app/models/kepler_ann.keras",  # Docker path
                    os.path.join(
                        os.path.dirname(os.path.abspath(__file__)),
                        "../../../models/kepler_ann.keras",
                    ),
                ]

                for alt_path in alternative_paths:
                    log.info(f"Trying alternative path: {alt_path}")
                    if os.path.exists(alt_path):
                        self.model_path = alt_path
                        log.info(f"Found model at alternative path: {alt_path}")
                        break
                else:
                    raise FileNotFoundError(
                        f"Model file not found at {self.model_path} or any alternative paths"
                    )

            try:
                if keras is None:
                    raise ImportError("Keras is not available")
                self.model = keras.models.load_model(self.model_path)
                log.info(f"Model loaded successfully from {self.model_path}")
            except Exception as e:
                log.error(f"Failed to load model: {str(e)}")
                raise

        return self.model

    def preprocess_input(self, data: PredictionRequest) -> np.ndarray:
        """Preprocess input data for prediction"""
        # Convert PredictionRequest to dictionary
        input_dict = data.model_dump()

        # Create DataFrame with the expected feature order
        df = pd.DataFrame([input_dict])

        # Ensure all required features are present and in the correct order
        df = df[self.feature_columns]

        return df.values.astype(np.float32)

    async def predict(
        self, data: PredictionRequest, db: AsyncSession, user_id: Optional[int] = None
    ) -> PredictionResponse:
        """Make a prediction for exoplanet detection"""
        try:
            # Load model if not already loaded
            model = self.load_model()

            # Preprocess input
            input_data = self.preprocess_input(data)

            # Make prediction
            prediction_proba = model.predict(input_data)

            # Extract prediction and confidence
            confidence = float(prediction_proba[0][0])
            prediction = 1 if confidence > 0.5 else 0

            # Generate unique prediction ID
            prediction_id = str(uuid.uuid4())

            # Save prediction to database
            prediction_record = PredictionRecord(
                prediction_id=prediction_id,
                user_id=user_id,
                prediction=prediction,
                confidence=confidence,
                input_data=json.dumps(data.model_dump()),
            )

            db.add(prediction_record)
            await db.commit()
            await db.refresh(prediction_record)

            log.info(
                f"Prediction made: ID={prediction_id}, Result={prediction}, Confidence={confidence}"
            )

            return PredictionResponse(
                prediction=prediction,
                confidence=confidence,
                prediction_id=prediction_id,
                timestamp=prediction_record.created_at,
            )

        except Exception as e:
            log.error(f"Prediction failed: {str(e)}")
            raise

    async def get_predictions(
        self,
        db: AsyncSession,
        user_id: Optional[int] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[PredictionResponse]:
        """Get prediction history"""
        try:
            query = select(PredictionRecord)

            if user_id:
                query = query.where(PredictionRecord.user_id == user_id)

            query = (
                query.offset(skip)
                .limit(limit)
                .order_by(desc(PredictionRecord.created_at))
            )

            result = await db.execute(query)
            predictions = result.scalars().all()

            return [
                PredictionResponse(
                    prediction=pred.prediction,
                    confidence=pred.confidence,
                    prediction_id=pred.prediction_id,
                    timestamp=pred.created_at,
                )
                for pred in predictions
            ]

        except Exception as e:
            log.error(f"Failed to get predictions: {str(e)}")
            raise

    async def delete_prediction(
        self, db: AsyncSession, prediction_id: str, user_id: Optional[int] = None
    ) -> bool:
        """Delete a specific prediction"""
        try:
            query = select(PredictionRecord).where(
                PredictionRecord.prediction_id == prediction_id
            )

            if user_id:
                query = query.where(PredictionRecord.user_id == user_id)

            result = await db.execute(query)
            prediction = result.scalar_one_or_none()

            if prediction:
                await db.delete(prediction)
                await db.commit()
                log.info(f"Prediction deleted: ID={prediction_id}")
                return True

            return False

        except Exception as e:
            log.error(f"Failed to delete prediction: {str(e)}")
            raise


# Global instance
prediction_service = PredictionService()
