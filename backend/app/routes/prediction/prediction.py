"""Main prediction router combining all prediction services"""

import importlib.util
import sys
import os
from fastapi import APIRouter

# Import TESS router
from app.routes.prediction import tess

# Handle k2(keppler).py import with special characters
spec = importlib.util.spec_from_file_location(
    "k2_keppler_routes", os.path.join(os.path.dirname(__file__), "k2(keppler).py")
)
if spec is None or spec.loader is None:
    raise ImportError("Failed to load k2(keppler).py routes module")
k2_keppler_routes = importlib.util.module_from_spec(spec)
sys.modules["k2_keppler_routes"] = k2_keppler_routes
spec.loader.exec_module(k2_keppler_routes)

router = APIRouter()

# Include K2 Keppler prediction routes
router.include_router(k2_keppler_routes.router)

# Include TESS prediction routes
router.include_router(tess.router)
