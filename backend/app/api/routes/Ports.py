from fastapi import APIRouter, HTTPException


router = APIRouter(
    prefix="/api/ports",
    tags=["Ports"],
)


# =====================================================
# TEMPORARY PORT DATA
# =====================================================
#
# This is demo data for the frontend.
#
# Later this can be replaced by:
# - PostgreSQL
# - live port APIs
# - weather APIs
# - vessel traffic APIs
# - ML risk analysis
#
# The frontend API structure can remain the same.
# =====================================================

PORTS = [
    {
        "id": "PARADIP",
        "name": "Paradip",
        "country": "India",

        "draft": "18.5 m",
        "loa": "300 m",
        "beam": "45 m",

        "handling": "75,000 t/day",

        "congestion": "Moderate",
        "wait": "1–2 days",

        "vessels": "Supramax · Panamax",

        "status": "Operational",
    },

    {
        "id": "VISAKHAPATNAM",
        "name": "Visakhapatnam",
        "country": "India",

        "draft": "18.0 m",
        "loa": "300 m",
        "beam": "45 m",

        "handling": "70,000 t/day",

        "congestion": "Low",
        "wait": "< 1 day",

        "vessels": "Supramax · Panamax",

        "status": "Operational",
    },

    {
        "id": "GANGAVARAM",
        "name": "Gangavaram",
        "country": "India",

        "draft": "18.5 m",
        "loa": "300 m",
        "beam": "48 m",

        "handling": "80,000 t/day",

        "congestion": "Low",
        "wait": "< 1 day",

        "vessels": "Panamax · Capesize",

        "status": "Operational",
    },

    {
        "id": "HALDIA",
        "name": "Haldia",
        "country": "India",

        "draft": "10.5 m",
        "loa": "230 m",
        "beam": "36 m",

        "handling": "45,000 t/day",

        "congestion": "High",
        "wait": "2–3 days",

        "vessels": "Handysize · Supramax",

        "status": "Operational",
    },

    {
        "id": "DHAMRA",
        "name": "Dhamra",
        "country": "India",

        "draft": "18.5 m",
        "loa": "300 m",
        "beam": "45 m",

        "handling": "70,000 t/day",

        "congestion": "Moderate",
        "wait": "1–2 days",

        "vessels": "Panamax · Capesize",

        "status": "Operational",
    },
]


# =====================================================
# GET ALL PORTS
# =====================================================

@router.get("")
def get_ports():

    return {
        "count": len(PORTS),
        "ports": PORTS,
    }


# =====================================================
# GET SINGLE PORT
# =====================================================

@router.get("/{port_id}")
def get_port(port_id: str):

    port_id = port_id.upper()

    for port in PORTS:

        if port["id"] == port_id:

            return port

    raise HTTPException(
        status_code=404,
        detail="Port not found",
    )