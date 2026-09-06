from fastapi import APIRouter


router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"],
)


@router.get("")
def get_dashboard():

    return {
        "status": "success",

        "updated": "Just now",

        "kpis": {
            "bdi_index": {
                "value": 1742,
                "change": 2.34,
                "trend": "up",
            },

            "average_spot_rate": {
                "value": 24560,
                "unit": "USD/day",
                "change": 5.12,
                "trend": "up",
            },

            "active_vessels": {
                "value": 2015,
                "change": 1.28,
                "trend": "down",
            },

            "port_congestion": {
                "value": "Moderate",
                "ports": 3,
            },

            "market_sentiment": {
                "value": "Bullish",
                "change": "Strong",
                "trend": "up",
            },
        },

        "market_outlook": [
            {
                "day": "01",
                "capesize": 21500,
                "panamax": 16400,
                "supramax": 13200,
            },
            {
                "day": "05",
                "capesize": 22100,
                "panamax": 16800,
                "supramax": 13400,
            },
            {
                "day": "10",
                "capesize": 21800,
                "panamax": 17100,
                "supramax": 13800,
            },
            {
                "day": "15",
                "capesize": 23200,
                "panamax": 17600,
                "supramax": 14200,
            },
            {
                "day": "20",
                "capesize": 23900,
                "panamax": 18200,
                "supramax": 14500,
            },
            {
                "day": "25",
                "capesize": 24700,
                "panamax": 18800,
                "supramax": 15100,
            },
            {
                "day": "30",
                "capesize": 25800,
                "panamax": 19400,
                "supramax": 15600,
            },
        ],

        "vessels": [
            {
                "name": "Oceanic Star",
                "type": "Capesize",
                "capacity": "180,000 DWT",
                "speed": 13.8,
                "status": "Available",
            },
            {
                "name": "Global Harmony",
                "type": "Panamax",
                "capacity": "81,000 DWT",
                "speed": 12.9,
                "status": "Available",
            },
            {
                "name": "Blue Pacific",
                "type": "Supramax",
                "capacity": "58,000 DWT",
                "speed": 13.2,
                "status": "In Transit",
            },
        ],

        "ports": [
            {
                "name": "Singapore",
                "status": "Low",
                "waiting_hours": 8,
                "vessels": 142,
            },
            {
                "name": "Visakhapatnam",
                "status": "Moderate",
                "waiting_hours": 21,
                "vessels": 87,
            },
            {
                "name": "Paradip",
                "status": "Low",
                "waiting_hours": 11,
                "vessels": 64,
            },
        ],

        "risks": [
            {
                "title": "Geopolitical Risk",
                "description": "Red Sea tension",
                "level": "High",
            },
            {
                "title": "Weather Risk",
                "description": "Cyclone activity",
                "level": "Moderate",
            },
            {
                "title": "Market Volatility",
                "description": "Low short-term volatility",
                "level": "Low",
            },
        ],
        "activity": [
            {
              "type": "forecast",
              "title": "Freight forecast updated",
              "description": "Singapore → Visakhapatnam",
              "time": "8 min ago",
            },  
            {
              "type": "vessel",
              "title": "Vessel Oceanic Star tracked",
              "description": "Position updated",
              "time": "19 min ago",
            },
            {
              "type": "warning",
              "title": "Port congestion increased",
              "description": "Visakhapatnam",
              "time": "42 min ago",
             },
            {
              "type": "success",
              "title": "Analysis completed",
              "description": "Iron Ore • Capesize",
              "time": "1 hr ago",
             },
        ],

        "route": {
            "vessel": "Oceanic Star",
            "origin": "Singapore",
            "destination": "Visakhapatnam",
            "speed": 13.8,
            "eta_days": 4,
            "distance_nm": 2834,
        },

        "forecast": {
            "current_rate": 24560,
            "predicted_rate": 27300,
            "change_percent": 11.2,
            "confidence": 84,
            "trend": "Increasing",
        },
        "recommendation": {
            "decision": "CHARTER NOW",
            "confidence": 84,
            "current_rate": 24560,
            "forecast_rate": 27300,
            "expected_change": 11.2,
            "summary": "Freight rates are expected to strengthen over the next 7 days.",
            "reasons": [
                "Increasing freight demand",
                "Limited vessel availability",
                "Moderate port congestion",
                "Positive short-term market outlook",
        ],
        "model_status": "integration_pending",
},
    }