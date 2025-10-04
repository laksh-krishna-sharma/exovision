"""Models package initialization"""

import importlib.util
import os
import sys

# Import models at top
from app.models.tess import (
    TessPredictionListResponse,
    TessPredictionRecord,
    TessPredictionRequest,
    TessPredictionResponse,
)
from app.models.user import User

# Handle k2(keppler).py import with special characters
spec = importlib.util.spec_from_file_location(
    "k2_keppler_models", os.path.join(os.path.dirname(__file__), "k2(keppler).py")
)
if spec is None or spec.loader is None:
    raise ImportError("Failed to load k2(keppler).py module")
k2_keppler_models = importlib.util.module_from_spec(spec)
sys.modules["k2_keppler_models"] = k2_keppler_models
spec.loader.exec_module(k2_keppler_models)

# Create a 'prediction' module alias for backward compatibility
# This allows 'from app.models.prediction import ...' to work
prediction = k2_keppler_models
sys.modules["app.models.prediction"] = prediction

# Export K2 Keppler models under 'prediction' namespace for backward compatibility
PredictionRequest = k2_keppler_models.PredictionRequest
PredictionResponse = k2_keppler_models.PredictionResponse
PredictionRecord = k2_keppler_models.PredictionRecord
PredictionListResponse = k2_keppler_models.PredictionListResponse

__all__ = [
    # K2 Keppler (aliased as Prediction for backward compatibility)
    "PredictionRequest",
    "PredictionResponse",
    "PredictionRecord",
    "PredictionListResponse",
    # TESS
    "TessPredictionRequest",
    "TessPredictionResponse",
    "TessPredictionRecord",
    "TessPredictionListResponse",
    # User
    "User",
    # Module alias
    "prediction",
]
