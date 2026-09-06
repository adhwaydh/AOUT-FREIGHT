from fastapi import APIRouter

from app.schemas.route import RouteRequest, RouteResponse

from app.api.routes.chartering import (
    router as chartering_router,
)

from app.api.routes.vessel_optimization import (
    router as vessel_optimization_router,
)

from app.api.routes.vessel_comparison import (
    router as vessel_comparison_router,
)


# =========================================================
# MAIN ROUTER
# =========================================================

router = APIRouter(
    prefix="/api/routes",
    tags=["Routes"],
)


# =========================================================
# ROUTE INTELLIGENCE
# =========================================================

@router.post(
    "/analyze",
    response_model=RouteResponse,
)
def analyze_route(
    request: RouteRequest,
):

    # =====================================================
    # TEMPORARY DEMO DATA
    # =====================================================
    #
    # Replace these values later with:
    # - routing API
    # - weather API
    # - port data
    # - vessel traffic data
    # - ML risk model
    #
    # The frontend does not need to change.
    # =====================================================

    return {

        "origin": request.origin,

        "destination": request.destination,

        "distance_nm": 1650,

        "transit_days": 4.2,

        "route_status": "Normal",

        "weather_risk": "Low",

        "congestion": "Moderate",

        "port_risk": "Low",

        "market_risk": "Moderate",

        "recommendation": "Route currently suitable",

        "recommendation_detail": (
            "Current route conditions appear "
            "suitable for normal vessel operations."
        ),

        "weather": {

            "condition": "Partly Cloudy",

            "wind": "14 knots",

            "wave_height": "1.8 m",

            "visibility": "Good",

        },

    }


# =========================================================
# NEW MODULE ROUTERS
# =========================================================
#
# These are kept separate from the existing Route
# Intelligence endpoint above.
#
# Existing:
#     /api/routes/analyze
#
# New:
#     /chartering/recommend
#     /vessel-optimization/optimize
#     /vessel-comparison/available
#     /vessel-comparison/compare
#
# =========================================================

router.include_router(
    chartering_router,
)

router.include_router(
    vessel_optimization_router,
)

router.include_router(
    vessel_comparison_router,
)
