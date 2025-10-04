from typing import Optional, List, TYPE_CHECKING
from datetime import datetime
from pydantic import BaseModel, Field
from sqlmodel import Relationship
from sqlmodel import SQLModel, Field as SQLField

if TYPE_CHECKING:
    from app.models.user import User


class TessPredictionRequest(BaseModel):
    """Model for TESS exoplanet prediction request"""

    pl_orbper: float = Field(..., description="Orbital Period [days]")
    pl_trandurh: float = Field(..., description="Transit Duration [hours]")
    pl_trandep: float = Field(..., description="Transit Depth [%]")
    pl_rade: float = Field(..., description="Planet Radius [Earth radii]")
    pl_insol: float = Field(..., description="Insolation Flux [Earth flux]")
    pl_eqt: float = Field(..., description="Equilibrium Temperature [K]")
    st_teff: float = Field(..., description="Stellar Effective Temperature [K]")
    st_logg: float = Field(..., description="Stellar Surface Gravity [log10(cm/s**2)]")
    st_rad: float = Field(..., description="Stellar Radius [Solar radii]")


class TessPredictionResponse(BaseModel):
    """Model for TESS exoplanet prediction response"""

    prediction: str = Field(
        ...,
        description="Predicted disposition class (PC: Confirmed Planet, FP: False Positive, APC: Ambiguous Planet Candidate)",
    )
    confidence: float = Field(..., description="Prediction confidence (0-1)")
    prediction_id: str = Field(..., description="Unique ID for this prediction")
    timestamp: datetime = Field(
        default_factory=datetime.now, description="Prediction timestamp"
    )


class TessPredictionRecord(SQLModel, table=True):
    """Database model for storing TESS prediction records"""

    __tablename__ = "tess_predictions"

    id: Optional[int] = SQLField(default=None, primary_key=True, index=True)
    prediction_id: str = SQLField(unique=True, index=True, nullable=False)
    user_id: Optional[int] = SQLField(default=None, foreign_key="users.id")
    prediction: str = SQLField(nullable=False)  # PC, FP, APC
    confidence: float = SQLField(nullable=False)
    input_data: str = SQLField(nullable=False)  # JSON string of input features
    created_at: datetime = SQLField(default_factory=datetime.now, nullable=False)

    # Relationship to User
    user: Optional["User"] = Relationship(back_populates="tess_predictions")


class TessPredictionListResponse(BaseModel):
    """Model for listing TESS predictions"""

    predictions: List[TessPredictionResponse]
    total: int
    page: int
    size: int
