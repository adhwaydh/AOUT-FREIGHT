from pydantic import BaseModel, Field
from typing import Optional


class CharteringRequest(BaseModel):
    origin: str = Field(..., description="Loading port")
    destination: str = Field(..., description="Discharge port")

    cargo_type: str = Field(
        default="Dry Bulk",
        description="Type of cargo"
    )

    cargo_quantity: float = Field(
        default=50000,
        description="Cargo quantity in metric tons"
    )

    laycan_start: Optional[str] = Field(
        default=None,
        description="Laycan start date"
    )

    laycan_end: Optional[str] = Field(
        default=None,
        description="Laycan end date"
    )

    vessel_type: Optional[str] = Field(
        default=None,
        description="Preferred vessel type"
    )

    max_age: Optional[int] = Field(
        default=None,
        description="Maximum vessel age"
    )


class VesselRecommendation(BaseModel):
    vessel_name: str
    vessel_type: str
    deadweight: int
    age: int

    freight_rate: float
    estimated_freight_cost: float

    compatibility_score: float
    risk_level: str

    recommendation: str


class CharteringResponse(BaseModel):
    origin: str
    destination: str

    cargo_type: str
    cargo_quantity: float

    recommended_vessel: VesselRecommendation

    market_condition: str
    market_rate: float

    estimated_transit_days: float

    recommendation: str
    recommendation_detail: str