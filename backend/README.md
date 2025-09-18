# ExoVision API - Exoplanet Prediction Service

This FastAPI application provides AI-powered exoplanet detection using a trained Neural Network model on Kepler space telescope data.

## Features

- **POST /predictions/predict** - Make exoplanet predictions using Kepler telescope data
- **GET /predictions/** - Retrieve prediction history with pagination
- **GET /predictions/{prediction_id}** - Get a specific prediction by ID
- **DELETE /predictions/{prediction_id}** - Delete a specific prediction
- **DELETE /predictions/** - Delete all predictions (with confirmation)

## Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Environment Setup

Make sure you have the required model files in the `models/` directory:
- `kepler_ann.keras` - Trained Keras model for exoplanet detection

### 3. Start the Server

```bash
# Using the startup script
python start_server.py

# Or directly with uvicorn
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at:
- Main API: http://localhost:8000
- Interactive docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Usage

### Making a Prediction

Send a POST request to `/predictions/predict` with Kepler telescope data:

```python
import requests

data = {
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

response = requests.post("http://localhost:8000/predictions/predict", json=data)
result = response.json()

print(f"Prediction: {result['prediction']}")  # 0 = No exoplanet, 1 = Exoplanet
print(f"Confidence: {result['confidence']}")  # 0.0 to 1.0
print(f"Prediction ID: {result['prediction_id']}")
```

### Response Format

```json
{
    "prediction": 1,
    "confidence": 0.8534,
    "prediction_id": "123e4567-e89b-12d3-a456-426614174000",
    "timestamp": "2025-09-15T10:30:00"
}
```

### Getting Prediction History

```python
# Get all predictions
response = requests.get("http://localhost:8000/predictions/")

# Get with pagination
response = requests.get("http://localhost:8000/predictions/?skip=0&limit=10")
```

### Deleting Predictions

```python
# Delete a specific prediction
prediction_id = "123e4567-e89b-12d3-a456-426614174000"
response = requests.delete(f"http://localhost:8000/predictions/{prediction_id}")

# Delete all predictions (requires confirmation)
response = requests.delete("http://localhost:8000/predictions/?confirm=true")
```

## Model Information

The API uses a trained Artificial Neural Network (ANN) model that was trained on the Kepler exoplanet dataset. The model takes 41 features from Kepler space telescope observations and predicts whether the data indicates the presence of an exoplanet.

### Input Features

The model expects the following 41 normalized features:
- Flag features (koi_fpflag_*)
- Orbital parameters (period, time, impact, duration)
- Transit depth and planetary radius
- Stellar parameters (temperature, gravity, radius)
- Coordinates and magnitude

### Output

- **prediction**: 0 (no exoplanet) or 1 (exoplanet detected)
- **confidence**: Model confidence score (0.0 to 1.0)

## Testing

Run the test script to verify the API is working:

```bash
python test_api.py
```

## Database

The API stores prediction results in a PostgreSQL database with the following schema:

- **predictions** table:
  - id (primary key)
  - prediction_id (unique identifier)
  - user_id (optional, for multi-user support)
  - prediction (0 or 1)
  - confidence (float)
  - input_data (JSON string of input features)
  - created_at (timestamp)

## Authentication

The current implementation includes optional user_id parameters for future authentication integration. In a production environment, you would:

1. Implement JWT token authentication
2. Extract user_id from the token
3. Restrict access to user's own predictions

## Error Handling

The API handles various error conditions:
- Model file not found (503 Service Unavailable)
- Missing dependencies (503 Service Unavailable)
- Invalid input data (422 Unprocessable Entity)
- Prediction not found (404 Not Found)
- Internal errors (500 Internal Server Error)

## Project Structure

```
backend/
├── app/
│   ├── main.py                 # FastAPI application
│   ├── config.py              # Configuration settings
│   ├── models/
│   │   ├── user.py            # User model
│   │   └── prediction.py      # Prediction models
│   ├── routes/
│   │   ├── auth/              # Authentication routes
│   │   └── prediction/        # Prediction routes
│   ├── services/
│   │   └── prediction.py      # Prediction service logic
│   └── utilities/
│       ├── db.py              # Database utilities
│       ├── jwt.py             # JWT utilities
│       └── logger.py          # Logging utilities
├── models/
│   └── kepler_ann.keras       # Trained model file
├── requirements.txt           # Python dependencies
├── start_server.py           # Server startup script
└── test_api.py              # API test script
```