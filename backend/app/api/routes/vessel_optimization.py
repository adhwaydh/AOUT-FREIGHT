from fastapi import APIRouter
from pydantic import BaseModel, Field

router = APIRouter(
    prefix="/vessel-optimization",
    tags=["Vessel Optimization"],
)


class VesselOptimizationRequest(BaseModel):
    vessel: str
    load_port: str
    discharge_port: str
    cargo: float = Field(gt=0)
    speed: float = Field(gt=0)
    draft: float = Field(gt=0)


@router.post("/optimize")
def optimize_vessel(request: VesselOptimizationRequest):
    """
    Temporary optimization endpoint.

    Replace this logic with the actual optimization model
    when the ML component is connected.
    """

    return {
        "request": request.model_dump(),

        "result": {
            "recommended_speed": 12.8,
            "fuel_per_day": 28.4,
            "eta": "2d 18h",
            "operating_cost": 16200,
            "efficiency_score": 94,
        },

        "comparison": {
            "baseline_cost": 18600,
            "optimized_cost": 16200,
            "daily_saving": 2400,
            "fuel_reduction_percent": 13.4,
            "efficiency_improvement": 12,
        },

        "status": "demo",
    }