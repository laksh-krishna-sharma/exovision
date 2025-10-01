import os
import json
import uuid
from typing import List, Optional, Any
import numpy as np
import pandas as pd
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from sqlalchemy import desc
from app.models.user import User

from joblib import load  # for sklearn models

from app.models.prediction import (
    PredictionRequest,
    PredictionResponse,
    PredictionRecord,
)
from app.utilities.logger import logger as get_logger

log = get_logger(__name__)


def find_model_file() -> str:
    """Find the Random Forest model file in various possible locations"""
    possible_paths = [
        os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../models/rf_model.joblib"),
        os.path.join(os.getcwd(), "models/rf_model.joblib"),
        "/app/models/rf_model.joblib",  # Docker path
        os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../../models/rf_model.joblib"),
        "/home/mrzoro/Desktop/Hackathon/exovision/backend/models/rf_model.joblib",
    ]

    for path in possible_paths:
        abs_path = os.path.abspath(path)
        if os.path.exists(abs_path):
            return abs_path

    raise FileNotFoundError(
        f"Model file 'rf_model.joblib' not found in any expected locations: {possible_paths}"
    )


class PredictionService:
    def __init__(self) -> None:
        self.model = None
        self.model_path = find_model_file()
        # Features expected by the RF model (keep same as trained)
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
        """Load the trained Random Forest model"""
        if self.model is None:
            log.info(f"Loading RF model from: {self.model_path}")
            if not os.path.exists(self.model_path):
                raise FileNotFoundError(f"RF model not found at {self.model_path}")
            try:
                self.model = load(self.model_path)
                log.info(f"RF model loaded successfully from {self.model_path}")
            except Exception as e:
                log.error(f"Failed to load RF model: {str(e)}")
                raise
        return self.model

    def preprocess_input(self, data: PredictionRequest) -> np.ndarray:
        """Preprocess input for RF prediction"""
        input_dict = data.model_dump()
        df = pd.DataFrame([input_dict])
        df = df[self.feature_columns]
        return df.values.astype(np.float32)

    async def predict(
        self, data: PredictionRequest, db: AsyncSession, user_id: Optional[int] = None
    ) -> PredictionResponse:
        """Make a prediction using Random Forest"""
        try:
            model = self.load_model()
            input_data = self.preprocess_input(data)

            prediction_proba = model.predict_proba(input_data)[:, 1]  # probability of class 1
            confidence = float(prediction_proba[0])
            prediction = 1 if confidence > 0.5 else 0

            prediction_id = str(uuid.uuid4())

            if user_id:
                user_query = select(User).where(User.id == user_id)
                user_result = await db.execute(user_query)
                user = user_result.scalar_one_or_none()
                if not user:
                    raise ValueError(f"User with ID {user_id} does not exist")

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
                f"RF Prediction: ID={prediction_id}, Result={prediction}, Confidence={confidence}"
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
            query = query.offset(skip).limit(limit).order_by(desc(PredictionRecord.created_at))

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
        """Delete a prediction"""
        try:
            query = select(PredictionRecord).where(PredictionRecord.prediction_id == prediction_id)
            if user_id:
                query = query.where(PredictionRecord.user_id == user_id)
            result = await db.execute(query)
            prediction = result.scalar_one_or_none()

            if prediction:
                await db.delete(prediction)
                await db.commit()
                log.info(f"Deleted prediction ID={prediction_id}")
                return True
            return False

        except Exception as e:
            log.error(f"Failed to delete prediction: {str(e)}")
            raise


# Global instance
prediction_service = PredictionService()
