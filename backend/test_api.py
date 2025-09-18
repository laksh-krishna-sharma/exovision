"""
Example usage of the Exoplanet Prediction API

This script demonstrates how to use the prediction endpoints.
"""

import json
import requests
from typing import Dict, Any

# Base URL for your API
BASE_URL = "http://localhost:8000"

# Example exoplanet data based on your training features
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

def make_prediction(data: Dict[str, Any]) -> Dict[str, Any]:
    """Make a prediction request"""
    response = requests.post(f"{BASE_URL}/predictions/predict", json=data)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error: {response.status_code} - {response.text}")
        return {}

def get_predictions() -> Dict[str, Any]:
    """Get prediction history"""
    response = requests.get(f"{BASE_URL}/predictions/")
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error: {response.status_code} - {response.text}")
        return {}

def delete_prediction(prediction_id: str) -> Dict[str, Any]:
    """Delete a specific prediction"""
    response = requests.delete(f"{BASE_URL}/predictions/{prediction_id}")
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error: {response.status_code} - {response.text}")
        return {}

if __name__ == "__main__":
    print("ExoVision API Test Script")
    print("=" * 50)
    
    # Test making a prediction
    print("\n1. Making a prediction...")
    prediction_result = make_prediction(example_data)
    if prediction_result:
        print(f"Prediction: {prediction_result['prediction']}")
        print(f"Confidence: {prediction_result['confidence']:.4f}")
        print(f"Prediction ID: {prediction_result['prediction_id']}")
        
        # Test getting predictions
        print("\n2. Getting prediction history...")
        history = get_predictions()
        if history:
            print(f"Total predictions: {history['total']}")
            for pred in history['predictions'][:5]:  # Show first 5
                print(f"  - ID: {pred['prediction_id'][:8]}... Prediction: {pred['prediction']} Confidence: {pred['confidence']:.4f}")
        
        # Test deleting a prediction
        if prediction_result.get('prediction_id'):
            print(f"\n3. Deleting prediction {prediction_result['prediction_id'][:8]}...")
            delete_result = delete_prediction(prediction_result['prediction_id'])
            if delete_result:
                print(f"Delete result: {delete_result['message']}")
    
    print("\nTest completed!")