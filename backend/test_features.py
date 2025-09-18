#!/usr/bin/env python3

# Test the feature selection
from app.services.prediction import prediction_service
import json

# Load example data from test file
example_data = {
    "koi_fpflag_nt": 0.0,
    "koi_fpflag_ss": 0.0, 
    "koi_fpflag_co": 0.0,
    "koi_fpflag_ec": 0.0,
    "koi_period": 3.52474659,
    "koi_period_err1": 0.00000582,
    "koi_period_err2": -0.00000582,
    "koi_time0bk": 134.51415,
    "koi_time0bk_err1": 0.00041,
    "koi_time0bk_err2": -0.00041,
    "koi_impact": 0.586,
    "koi_impact_err1": 0.115,
    "koi_impact_err2": -0.115,
    "koi_duration": 2.8092,
    "koi_duration_err1": 0.0094,
    "koi_duration_err2": -0.0094,
    "koi_depth": 2793.0,
    "koi_depth_err1": 29.0,
    "koi_depth_err2": -29.0,
    "koi_prad": 1.96,
    "koi_prad_err1": 0.11,
    "koi_prad_err2": -0.11,
    "koi_teq": 1294,
    "koi_teq_err1": 19,
    "koi_teq_err2": -19,
    "koi_insol": 183.6,
    "koi_insol_err1": 5.4,
    "koi_insol_err2": -5.4,
    "koi_model_snr": 96.2,
    "koi_tce_plnt_num": 1,
    "koi_steff": 5455,
    "koi_steff_err1": 81,
    "koi_steff_err2": -81,
    "koi_slogg": 4.467,
    "koi_slogg_err1": 0.064,
    "koi_slogg_err2": -0.064,
    "koi_srad": 0.927,
    "koi_srad_err1": 0.105,
    "koi_srad_err2": -0.105,
    "ra": 291.93423,
    "dec": 48.141651,
    "koi_kepmag": 15.347
}

print("Testing feature selection...")
print(f"Total features in example data: {len(example_data)}")
print(f"Feature columns in service: {len(prediction_service.feature_columns)}")
print(f"Feature columns: {prediction_service.feature_columns}")

# Test preprocessing
from app.models.prediction import PredictionRequest

# Create request object
request = PredictionRequest(**example_data)
print(f"Created PredictionRequest successfully")

# Test preprocessing
try:
    processed = prediction_service.preprocess_input(request)
    print(f"Processed input shape: {processed.shape}")
    print(f"Expected shape: (1, 20)")
    print(f"Shape matches: {processed.shape == (1, 20)}")
except Exception as e:
    print(f"Error in preprocessing: {e}")