from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    prefix="/api/vessel-comparison",
    tags=["Vessel Comparison"],
)


# =========================================================
# REQUEST MODEL
# =========================================================

class VesselComparisonRequest(BaseModel):
    vessel_ids: list[str] = Field(
        min_length=1,
        max_length=4,
    )


# =========================================================
# DEMO VESSEL DATA
# =========================================================
#
# Temporary data.
#
# Later this can come from PostgreSQL:
#
# PostgreSQL
#      ↓
# Vessel repository
#      ↓
# Vessel comparison service
#      ↓
# ML ranking
#      ↓
# API response
#
# =========================================================

VESSELS = [

    {
        "id": "ocean-pioneer",
        "name": "MV Ocean Pioneer",
        "type": "Panamax",
        "dwt": 82000,
        "draft": 14.2,
        "beam": 32.2,
        "speed": 13.5,
        "fuel": 32.8,
        "cost": 18600,
        "eta": "2d 14h",
        "risk": 24,
        "suitability": 92,
        "availability": "Available",
    },

    {
        "id": "eastern-star",
        "name": "MV Eastern Star",
        "type": "Panamax",
        "dwt": 76500,
        "draft": 13.8,
        "beam": 31.5,
        "speed": 13.2,
        "fuel": 31.4,
        "cost": 17900,
        "eta": "2d 17h",
        "risk": 29,
        "suitability": 87,
        "availability": "Available",
    },

    {
        "id": "blue-horizon",
        "name": "MV Blue Horizon",
        "type": "Supramax",
        "dwt": 58000,
        "draft": 12.4,
        "beam": 28.5,
        "speed": 12.8,
        "fuel": 28.7,
        "cost": 16700,
        "eta": "2d 20h",
        "risk": 31,
        "suitability": 79,
        "availability": "Available",
    },

    {
        "id": "atlantic-trader",
        "name": "MV Atlantic Trader",
        "type": "Capesize",
        "dwt": 105000,
        "draft": 16.1,
        "beam": 34.8,
        "speed": 14.1,
        "fuel": 42.6,
        "cost": 22100,
        "eta": "2d 10h",
        "risk": 38,
        "suitability": 74,
        "availability": "Review",
    },
]


# =========================================================
# GET ALL AVAILABLE VESSELS
# =========================================================

@router.get("/available")
def available_vessels():
    """
    Return vessels currently available for comparison.

    Temporary implementation.

    Later:
        PostgreSQL -> vessel database
    """

    available = [
        vessel
        for vessel in VESSELS
        if vessel["availability"] in [
            "Available",
            "Review",
        ]
    ]

    return {
        "vessels": available,
        "count": len(available),
        "status": "demo",
    }


# =========================================================
# GET SINGLE VESSEL
# =========================================================

@router.get("/{vessel_id}")
def get_vessel(vessel_id: str):
    """
    Return one vessel by ID.
    """

    vessel = next(
        (
            vessel
            for vessel in VESSELS
            if vessel["id"] == vessel_id
        ),
        None,
    )

    if vessel is None:
        raise HTTPException(
            status_code=404,
            detail=f"Vessel '{vessel_id}' not found.",
        )

    return {
        "vessel": vessel,
        "status": "demo",
    }


# =========================================================
# COMPARE VESSELS
# =========================================================

@router.post("/compare")
def compare_vessels(
    request: VesselComparisonRequest,
):
    """
    Compare up to four selected vessels.

    Temporary ranking uses suitability score.

    Later this can be replaced with:
        - ML ranking
        - route suitability
        - fuel prediction
        - cost prediction
        - risk prediction
        - vessel availability
        - cargo compatibility
    """

    selected = [
        vessel
        for vessel in VESSELS
        if vessel["id"] in request.vessel_ids
    ]

    # -----------------------------------------------------
    # INVALID VESSEL IDS
    # -----------------------------------------------------

    if not selected:
        raise HTTPException(
            status_code=404,
            detail="No valid vessels were found.",
        )

    # -----------------------------------------------------
    # BEST MATCH
    # -----------------------------------------------------

    best = max(
        selected,
        key=lambda vessel: vessel["suitability"],
    )

    # -----------------------------------------------------
    # RANKING
    # -----------------------------------------------------

    ranked = sorted(
        selected,
        key=lambda vessel: vessel["suitability"],
        reverse=True,
    )

    # -----------------------------------------------------
    # RESPONSE
    # -----------------------------------------------------

    return {
        "vessels": ranked,

        "best_match": best,

        "comparison": {
            "vessel_count": len(ranked),

            "lowest_cost": min(
                vessel["cost"]
                for vessel in ranked
            ),

            "lowest_fuel": min(
                vessel["fuel"]
                for vessel in ranked
            ),

            "lowest_risk": min(
                vessel["risk"]
                for vessel in ranked
            ),

            "highest_suitability": max(
                vessel["suitability"]
                for vessel in ranked
            ),
        },

        "status": "demo",
    }