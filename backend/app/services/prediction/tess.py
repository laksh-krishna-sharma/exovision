import os
import json
import uuid
from typing import Any, List, Optional, cast
import numpy as np
import numpy.typing as npt
import pandas as pd
from sqlalchemy import desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from app.models.user import User

import pickle  # for loading .pkl files

from app.models.tess import (
    TessPredictionRequest,
    TessPredictionResponse,
    TessPredictionRecord,
)
from app.utilities.logger import logger as get_logger

log = get_logger(__name__)


def find_model_file() -> str:
    """Find the TESS XGBoost model file in various possible locations"""
    possible_paths = [
        os.path.join(
            os.path.dirname(os.path.abspath(__file__)),
            "../../models/tess_xgb_improved_model.pkl",
        ),
        os.path.join(os.getcwd(), "models/tess_xgb_improved_model.pkl"),
        "/app/models/tess_xgb_improved_model.pkl",  # Docker path
        os.path.join(
            os.path.dirname(os.path.abspath(__file__)),
            "../../../models/tess_xgb_improved_model.pkl",
        ),
        "/home/mrzoro/Desktop/Hackathon/exovision/backend/models/tess_xgb_improved_model.pkl",
    ]

    for path in possible_paths:
        abs_path = os.path.abspath(path)
        if os.path.exists(abs_path):
            return abs_path

    raise FileNotFoundError(
        f"Model file 'tess_xgb_improved_model.pkl' not found in any expected locations: {possible_paths}"
    )


class TessPredictionService:
    def __init__(self) -> None:
        """Initialize the TESS prediction service and load the model."""
        self.model_path = find_model_file()
        self.model = self.load_model()

        # Base feature columns (9 features - before log transforms)
        self.feature_columns = [
            "pl_orbper",
            "pl_trandurh",
            "pl_trandep",
            "pl_rade",
            "pl_insol",
            "pl_eqt",
            "st_teff",
            "st_logg",
            "st_rad",
        ]

        # Class labels mapping for TESS predictions (6 classes in alphabetical order by sklearn LabelEncoder)
        # The LabelEncoder sorts classes alphabetically: APC, CP, FA, FP, KP, PC
        self.class_labels = {
            0: "APC",  # Ambiguous Planet Candidate
            1: "CP",  # Confirmed Planet
            2: "FA",  # False Alarm
            3: "FP",  # False Positive
            4: "KP",  # Known Planet
            5: "PC",  # Planet Candidate
        }

    def load_model(self) -> Any:
        """Load the trained XGBoost model"""
        log.info(f"Loading TESS XGBoost model from: {self.model_path}")
        if not os.path.exists(self.model_path):
            raise FileNotFoundError(
                f"TESS XGBoost model not found at {self.model_path}"
            )
        try:
            # Try loading with different pickle protocols
            with open(self.model_path, "rb") as f:
                try:
                    model = pickle.load(f)
                except Exception as e:
                    # If pickle fails, try joblib
                    log.warning(f"Pickle loading failed ({e}), trying joblib...")
                    from joblib import load

                    f.seek(0)  # Reset file pointer
                    model = load(f)

            log.info(f"TESS XGBoost model loaded successfully from {self.model_path}")
            return model
        except Exception as e:
            log.error(f"Failed to load TESS XGBoost model: {str(e)}")
            raise

    def preprocess_input(self, data: TessPredictionRequest) -> npt.NDArray[np.float32]:
        """Preprocess input for XGBoost prediction"""
        import numpy as np

        input_dict = data.model_dump()
        df = pd.DataFrame([input_dict])

        # Ensure columns are in the correct order (base features)
        df = df[self.feature_columns]

        # Add log-transformed features as expected by the model
        df["pl_orbper_log"] = np.log(df["pl_orbper"] + 1)
        df["pl_trandep_log"] = np.log(df["pl_trandep"] + 1)

        # Reorder to match model's expected feature order
        final_columns = [
            "pl_orbper",
            "pl_trandurh",
            "pl_trandep",
            "pl_rade",
            "pl_insol",
            "pl_eqt",
            "st_teff",
            "st_logg",
            "st_rad",
            "pl_orbper_log",
            "pl_trandep_log",
        ]
        df = df[final_columns]

        return df.values.astype(np.float32)

    async def predict(
        self,
        data: TessPredictionRequest,
        db: AsyncSession,
        user_id: Optional[int] = None,
    ) -> TessPredictionResponse:
        """Make a prediction using TESS XGBoost model"""
        try:
            model = self.load_model()
            input_data = self.preprocess_input(data)

            # Get prediction probabilities
            prediction_proba = model.predict_proba(input_data)[0]
            # Get the class with highest probability
            predicted_class_idx = int(np.argmax(prediction_proba))
            confidence = float(prediction_proba[predicted_class_idx])

            # Map index to class label
            prediction_label = self.class_labels.get(predicted_class_idx, "UNKNOWN")

            prediction_id = str(uuid.uuid4())

            # Validate user if user_id is provided
            if user_id:
                user_query = select(User).where(User.id == user_id)
                user_result = await db.execute(user_query)
                user = user_result.scalar_one_or_none()
                if not user:
                    raise ValueError(f"User with ID {user_id} does not exist")

            # Create prediction record
            prediction_record = TessPredictionRecord(
                prediction_id=prediction_id,
                user_id=user_id,
                prediction=prediction_label,
                confidence=confidence,
                input_data=json.dumps(data.model_dump()),
            )

            db.add(prediction_record)
            await db.commit()
            await db.refresh(prediction_record)

            log.info(
                f"TESS XGBoost Prediction: ID={prediction_id}, Result={prediction_label}, Confidence={confidence}"
            )

            return TessPredictionResponse(
                prediction=prediction_label,
                confidence=confidence,
                prediction_id=prediction_id,
                timestamp=prediction_record.created_at,
            )

        except Exception as e:
            log.error(f"TESS Prediction failed: {str(e)}")
            raise

    async def get_predictions(
        self,
        db: AsyncSession,
        user_id: Optional[int] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[TessPredictionResponse]:
        """Get TESS prediction history"""
        try:
            query = select(TessPredictionRecord)
            if user_id:
                query = query.where(TessPredictionRecord.user_id == user_id)
            query = (
                query.offset(skip)
                .limit(limit)
                .order_by(desc(cast(Any, TessPredictionRecord.created_at)))
            )

            result = await db.execute(query)
            predictions = result.scalars().all()

            return [
                TessPredictionResponse(
                    prediction=pred.prediction,
                    confidence=pred.confidence,
                    prediction_id=pred.prediction_id,
                    timestamp=pred.created_at,
                )
                for pred in predictions
            ]
        except Exception as e:
            log.error(f"Failed to get TESS predictions: {str(e)}")
            raise

    async def delete_prediction(
        self, db: AsyncSession, prediction_id: str, user_id: Optional[int] = None
    ) -> bool:
        """Delete a TESS prediction"""
        try:
            query = select(TessPredictionRecord).where(
                TessPredictionRecord.prediction_id == prediction_id
            )
            if user_id:
                query = query.where(TessPredictionRecord.user_id == user_id)
            result = await db.execute(query)
            prediction = result.scalar_one_or_none()

            if prediction:
                await db.delete(prediction)
                await db.commit()
                log.info(f"Deleted TESS prediction ID={prediction_id}")
                return True
            return False

        except Exception as e:
            log.error(f"Failed to delete TESS prediction: {str(e)}")
            raise


# Global instance
tess_prediction_service = TessPredictionService()
