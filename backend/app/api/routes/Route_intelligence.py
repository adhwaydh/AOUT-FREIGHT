from fastapi import APIRouter
from pydantic import BaseModel, Field


router = APIRouter(
    prefix="/api/routes",
    tags=["Route Intelligence"],
)


# =========================================================
# REQUEST MODELS
# =========================================================


class RouteRequest(BaseModel):
    origin: str = Field(min_length=1)
    destination: str = Field(min_length=1)


class RiskRequest(BaseModel):
    origin: str = Field(min_length=1)
    destination: str = Field(min_length=1)
    vessel: str = Field(min_length=1)
    cargo: str = Field(min_length=1)
    cargo_quantity: float = Field(gt=0)


# =========================================================
# RISK LEVEL HELPER
# =========================================================


def get_risk_level(score: int) -> str:
    """
    Convert a numerical risk score into a risk level.

    0 - 25   -> Low
    26 - 50  -> Moderate
    51 - 75  -> High
    76 - 100 -> Critical
    """

    if score <= 25:
        return "Low"

    if score <= 50:
        return "Moderate"

    if score <= 75:
        return "High"

    return "Critical"


# =========================================================
# ROUTE INTELLIGENCE
# =========================================================


@router.post("/analyze")
def analyze_route(request: RouteRequest):
    """
    Analyze a proposed route.

    Current implementation uses demonstration values.

    Future sources:
        - Routing API
        - Weather API
        - Port database
        - AIS / vessel traffic
        - Market data
        - ML risk model
    """

    origin = request.origin.strip()
    destination = request.destination.strip()

    return {
        "origin": origin,
        "destination": destination,

        # -------------------------------------------------
        # ROUTE INFORMATION
        # -------------------------------------------------

        "distance_nm": 1650,

        "transit_days": 4.2,

        "route_status": "Normal",

        # -------------------------------------------------
        # ROUTE RISK SUMMARY
        # -------------------------------------------------

        "weather_risk": "Low",

        "congestion": "Moderate",

        "port_risk": "Low",

        "market_risk": "Moderate",

        # -------------------------------------------------
        # RECOMMENDATION
        # -------------------------------------------------

        "recommendation": "Route currently suitable",

        "recommendation_detail": (
            "Current route conditions appear suitable "
            "for normal vessel operations."
        ),

        # -------------------------------------------------
        # WEATHER
        # -------------------------------------------------

        "weather": {
            "condition": "Partly Cloudy",
            "wind": "14 knots",
            "wave_height": "1.8 m",
            "visibility": "Good",
        },

        "status": "demo",
    }


# =========================================================
# RISK INTELLIGENCE
# =========================================================


@router.post("/risk")
def analyze_risk(request: RiskRequest):
    """
    Analyze operational risks for a proposed voyage.

    Current implementation uses a temporary rule-based
    demonstration model.

    Later this function can be replaced with:
        - PostgreSQL data
        - Weather APIs
        - Port congestion APIs
        - Vessel database
        - AIS data
        - Freight market data
        - ML prediction model
    """

    # =====================================================
    # DEMO RISK SCORES
    # =====================================================

    weather_score = 22

    port_score = 31

    vessel_score = 18

    route_score = 24

    market_score = 35

    # =====================================================
    # OVERALL RISK
    # =====================================================

    scores = [
        weather_score,
        port_score,
        vessel_score,
        route_score,
        market_score,
    ]

    overall_score = round(
        sum(scores) / len(scores)
    )

    overall_level = get_risk_level(
        overall_score
    )

    # =====================================================
    # RISK CATEGORY DETAILS
    # =====================================================

    weather_level = get_risk_level(
        weather_score
    )

    port_level = get_risk_level(
        port_score
    )

    vessel_level = get_risk_level(
        vessel_score
    )

    route_level = get_risk_level(
        route_score
    )

    market_level = get_risk_level(
        market_score
    )

    # =====================================================
    # RESPONSE
    # =====================================================

    return {

        # =================================================
        # REQUEST
        # =================================================

        "request": {
            "origin": request.origin.strip(),

            "destination": request.destination.strip(),

            "vessel": request.vessel.strip(),

            "cargo": request.cargo.strip(),

            "cargo_quantity": request.cargo_quantity,
        },

        # =================================================
        # OVERALL RISK
        # =================================================

        "overall": {

            "score": overall_score,

            "level": overall_level,

        },

        # =================================================
        # RISK CATEGORIES
        # =================================================

        "risk_categories": {

            # ---------------------------------------------
            # WEATHER
            # ---------------------------------------------

            "weather": {

                "score": weather_score,

                "level": weather_level,

                "status": "Stable",

                "detail": (
                    "Weather conditions are currently "
                    "favorable for the proposed voyage."
                ),

                "description": (
                    "Weather conditions currently show "
                    "limited operational disruption."
                ),

                "factors": [
                    "Moderate wind conditions",
                    "No major storm signal",
                    "Visibility currently acceptable",
                ],
            },

            # ---------------------------------------------
            # PORT
            # ---------------------------------------------

            "port": {

                "score": port_score,

                "level": port_level,

                "status": "Monitor",

                "detail": (
                    "Moderate port congestion may cause "
                    "minor operational delays."
                ),

                "description": (
                    "Port congestion and waiting time may "
                    "affect turnaround performance."
                ),

                "factors": [
                    "Port congestion",
                    "Expected waiting time",
                    "Vessel compatibility",
                ],
            },

            # ---------------------------------------------
            # VESSEL
            # ---------------------------------------------

            "vessel": {

                "score": vessel_score,

                "level": vessel_level,

                "status": "Stable",

                "detail": (
                    "Selected vessel characteristics are "
                    "within acceptable operating limits."
                ),

                "description": (
                    "Current vessel characteristics show "
                    "relatively limited operational exposure."
                ),

                "factors": [
                    "Vessel suitability",
                    "Cargo capacity",
                    "Vessel operating characteristics",
                ],
            },

            # ---------------------------------------------
            # ROUTE
            # ---------------------------------------------

            "route": {

                "score": route_score,

                "level": route_level,

                "status": "Stable",

                "detail": (
                    "The proposed route currently shows "
                    "no major operational concerns."
                ),

                "description": (
                    "The selected route has some operational "
                    "exposure that should be monitored."
                ),

                "factors": [
                    "Transit distance",
                    "Potential weather exposure",
                    "Route congestion",
                ],
            },

            # ---------------------------------------------
            # MARKET
            # ---------------------------------------------

            "market": {

                "score": market_score,

                "level": market_level,

                "status": "Monitor",

                "detail": (
                    "Freight and market conditions show "
                    "moderate uncertainty."
                ),

                "description": (
                    "Freight market conditions indicate "
                    "some uncertainty in expected rates."
                ),

                "factors": [
                    "Freight rate movement",
                    "Demand conditions",
                    "Market volatility",
                ],
            },
        },

        # =================================================
        # WEATHER DETAILS
        # =================================================

        "weather": {

            "condition": "Partly Cloudy",

            "wind": "14 knots",

            "wave_height": "1.8 m",

            "visibility": "Good",
        },

        # =================================================
        # RECOMMENDATION
        # =================================================

        "recommendation": {

            "title": "Proceed with Monitoring",

            "detail": (
                "The proposed voyage can proceed under "
                "normal operating conditions. Port and "
                "market conditions should be monitored "
                "before final charter confirmation."
            ),
        },

        # =================================================
        # SYSTEM STATUS
        # =================================================

        "status": "demo",
    }