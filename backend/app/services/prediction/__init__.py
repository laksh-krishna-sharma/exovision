"""Prediction services initialization"""

import importlib.util
import os
import sys

# Import TESS prediction service at top
from app.services.prediction.tess import tess_prediction_service

# Handle k2(keppler).py import with special characters
spec = importlib.util.spec_from_file_location(
    "k2_keppler", os.path.join(os.path.dirname(__file__), "k2(keppler).py")
)
if spec is None or spec.loader is None:
    raise ImportError("Failed to load k2(keppler).py service module")
k2_keppler = importlib.util.module_from_spec(spec)
sys.modules["k2_keppler"] = k2_keppler
spec.loader.exec_module(k2_keppler)

# Import prediction service from k2_keppler module
prediction_service = k2_keppler.prediction_service

__all__ = ["prediction_service", "tess_prediction_service"]
