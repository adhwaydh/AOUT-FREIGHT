from pydantic import BaseModel, Field


# =========================================================
# FORECAST REQUEST
# =========================================================

class ForecastRequest(BaseModel):
    origin: str = Field(min_length=1)
    destination: str = Field(min_length=1)
    commodity: str = Field(min_length=1)

    # These are not currently entered on the Forecast page.
    # Defaults prevent FastAPI from returning 422.
    vessel_type: str = "Panamax"
    cargo_quantity: float = Field(default=50000, gt=0)

    period: str = Field(min_length=1)


# =========================================================
# FORECAST POINT
# =========================================================

class ForecastPoint(BaseModel):
    day: int
    label: str
    rate: float


# =========================================================
# FORECAST RESPONSE
# =========================================================

class ForecastResponse(BaseModel):

    origin: str

    destination: str

    commodity: str

    vessel_type: str

    cargo_quantity: float

    period: str

    current_rate: float

    predicted_rate: float

    change_percent: float

    confidence: float

    trend: str

    recommendation: str

    message: str

    risk_level: str

    market_factors: list[dict]

    ai_insight: str

    forecast_curve: list[ForecastPoint]