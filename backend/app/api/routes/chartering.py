from fastapi import APIRouter
from pydantic import BaseModel, Field


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    prefix="/api/chartering",
    tags=["Chartering"],
)


# =========================================================
# REQUEST MODEL
# =========================================================

class CharteringRequest(BaseModel):
    cargo: str = Field(min_length=1)
    quantity: float = Field(gt=0)
    load_port: str = Field(min_length=1)
    discharge_port: str = Field(min_length=1)
    laycan: str = Field(min_length=1)
    vessel_type: str = Field(min_length=1)


# =========================================================
# DEMO VESSEL DATA
# =========================================================

VESSELS = [
    {
        "name": "MV Ocean Pioneer",
        "type": "Panamax",
        "dwt": "82,000 DWT",
        "draft": "14.2 m",
        "speed": "13.5 kn",
        "estimate": "$18,500/day",
        "score": 92,
        "reason": (
            "Strong cargo capacity and suitable draft "
            "for the selected route."
        ),
    },
    {
        "name": "MV Eastern Star",
        "type": "Panamax",
        "dwt": "76,500 DWT",
        "draft": "13.8 m",
        "speed": "13.2 kn",
        "estimate": "$17,900/day",
        "score": 87,
        "reason": (
            "Good commercial fit with competitive "
            "estimated operating cost."
        ),
    },
    {
        "name": "MV Blue Horizon",
        "type": "Supramax",
        "dwt": "58,000 DWT",
        "draft": "12.4 m",
        "speed": "12.8 kn",
        "estimate": "$16,700/day",
        "score": 79,
        "reason": (
            "Lower capacity but offers flexibility "
            "for the selected cargo."
        ),
    },
]


# =========================================================
# CHARTERING RECOMMENDATION
# =========================================================

@router.post("/recommend")
def recommend_charter(request: CharteringRequest):

    # -----------------------------------------------------
    # TEMPORARY DEMO LOGIC
    # -----------------------------------------------------
    #
    # Later replace with:
    #
    # database vessel lookup
    #       ↓
    # vessel filtering
    #       ↓
    # ML ranking
    #       ↓
    # freight/cost prediction
    #       ↓
    # recommendation
    #
    # -----------------------------------------------------

    # Filter by preferred vessel type first.
    matching_vessels = [
        vessel
        for vessel in VESSELS
        if vessel["type"].lower()
        == request.vessel_type.lower()
    ]

    # If no exact type exists, use all demo vessels.
    if not matching_vessels:
        matching_vessels = VESSELS

    # Sort by suitability.
    recommendations = sorted(
        matching_vessels,
        key=lambda vessel: vessel["score"],
        reverse=True,
    )

    # -----------------------------------------------------
    # RESPONSE
    # -----------------------------------------------------

    return {
        "request": {
            "cargo": request.cargo,
            "quantity": request.quantity,
            "load_port": request.load_port,
            "discharge_port": request.discharge_port,
            "laycan": request.laycan,
            "vessel_type": request.vessel_type,
        },

        "recommendations": recommendations,

        "best_match": (
            recommendations[0]
            if recommendations
            else None
        ),

        "status": "demo",
    }