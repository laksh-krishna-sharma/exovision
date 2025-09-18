from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field
from sqlmodel import SQLModel, Field as SQLField


class PredictionRequest(BaseModel):
    """Model for exoplanet prediction request"""
    koi_fpflag_nt: float = Field(..., description="Not Transit-Like Flag")
    koi_fpflag_ss: float = Field(..., description="Stellar Eclipse Flag")
    koi_fpflag_co: float = Field(..., description="Centroid Offset Flag")
    koi_fpflag_ec: float = Field(..., description="Ephemeris Match Indicates Contamination Flag")
    koi_period: float = Field(..., description="Orbital Period [days]")
    koi_period_err1: float = Field(..., description="Orbital Period Upper Uncertainty [days]")
    koi_period_err2: float = Field(..., description="Orbital Period Lower Uncertainty [days]")
    koi_time0bk: float = Field(..., description="Transit Epoch [BKJD]")
    koi_time0bk_err1: float = Field(..., description="Transit Epoch Upper Uncertainty [BKJD]")
    koi_time0bk_err2: float = Field(..., description="Transit Epoch Lower Uncertainty [BKJD]")
    koi_impact: float = Field(..., description="Impact Parameter")
    koi_impact_err1: float = Field(..., description="Impact Parameter Upper Uncertainty")
    koi_impact_err2: float = Field(..., description="Impact Parameter Lower Uncertainty")
    koi_duration: float = Field(..., description="Transit Duration [hrs]")
    koi_duration_err1: float = Field(..., description="Transit Duration Upper Uncertainty [hrs]")
    koi_duration_err2: float = Field(..., description="Transit Duration Lower Uncertainty [hrs]")
    koi_depth: float = Field(..., description="Transit Depth [ppm]")
    koi_depth_err1: float = Field(..., description="Transit Depth Upper Uncertainty [ppm]")
    koi_depth_err2: float = Field(..., description="Transit Depth Lower Uncertainty [ppm]")
    koi_prad: float = Field(..., description="Planetary Radius [Earth radii]")
    koi_prad_err1: float = Field(..., description="Planetary Radius Upper Uncertainty [Earth radii]")
    koi_prad_err2: float = Field(..., description="Planetary Radius Lower Uncertainty [Earth radii]")
    koi_teq: float = Field(..., description="Equilibrium Temperature [K]")
    koi_teq_err1: float = Field(..., description="Equilibrium Temperature Upper Uncertainty [K]")
    koi_teq_err2: float = Field(..., description="Equilibrium Temperature Lower Uncertainty [K]")
    koi_insol: float = Field(..., description="Insolation Flux [Earth flux]")
    koi_insol_err1: float = Field(..., description="Insolation Flux Upper Uncertainty [Earth flux]")
    koi_insol_err2: float = Field(..., description="Insolation Flux Lower Uncertainty [Earth flux]")
    koi_model_snr: float = Field(..., description="Transit Signal-to-Noise")
    koi_tce_plnt_num: float = Field(..., description="TCE Planet Number")
    koi_steff: float = Field(..., description="Stellar Effective Temperature [K]")
    koi_steff_err1: float = Field(..., description="Stellar Effective Temperature Upper Uncertainty [K]")
    koi_steff_err2: float = Field(..., description="Stellar Effective Temperature Lower Uncertainty [K]")
    koi_slogg: float = Field(..., description="Stellar Surface Gravity [log10(cm/s**2)]")
    koi_slogg_err1: float = Field(..., description="Stellar Surface Gravity Upper Uncertainty [log10(cm/s**2)]")
    koi_slogg_err2: float = Field(..., description="Stellar Surface Gravity Lower Uncertainty [log10(cm/s**2)]")
    koi_srad: float = Field(..., description="Stellar Radius [Solar radii]")
    koi_srad_err1: float = Field(..., description="Stellar Radius Upper Uncertainty [Solar radii]")
    koi_srad_err2: float = Field(..., description="Stellar Radius Lower Uncertainty [Solar radii]")
    ra: float = Field(..., description="RA [decimal degrees]")
    dec: float = Field(..., description="Dec [decimal degrees]")
    koi_kepmag: float = Field(..., description="Kepler-band [mag]")


class PredictionResponse(BaseModel):
    """Model for exoplanet prediction response"""
    prediction: int = Field(..., description="Predicted class (0: No exoplanet, 1: Exoplanet)")
    confidence: float = Field(..., description="Prediction confidence (0-1)")
    prediction_id: str = Field(..., description="Unique ID for this prediction")
    timestamp: datetime = Field(default_factory=datetime.now, description="Prediction timestamp")


class PredictionRecord(SQLModel, table=True):
    """Database model for storing prediction records"""
    __tablename__ = "predictions"
    
    id: Optional[int] = SQLField(default=None, primary_key=True, index=True)
    prediction_id: str = SQLField(unique=True, index=True, nullable=False)
    user_id: Optional[int] = SQLField(default=None, foreign_key="user.id")
    prediction: int = SQLField(nullable=False)
    confidence: float = SQLField(nullable=False)
    input_data: str = SQLField(nullable=False)  # JSON string of input features
    created_at: datetime = SQLField(default_factory=datetime.now, nullable=False)


class PredictionListResponse(BaseModel):
    """Model for listing predictions"""
    predictions: List[PredictionResponse]
    total: int
    page: int
    size: int