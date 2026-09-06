from app.schemas.forecast import ForecastRequest


def generate_forecast(request: ForecastRequest):

    # =========================================
    # TEMPORARY DEMO VALUES
    # =========================================
    #
    # These values are placeholders.
    # Your ML teammate can replace this section
    # with the actual forecasting model later.
    # =========================================

    current_rate = 24560
    predicted_rate = 27300

    change_percent = (
        (predicted_rate - current_rate)
        / current_rate
    ) * 100


    # =========================================
    # DEMO FORECAST CURVE
    # =========================================

    forecast_curve = [
        {
            "day": 0,
            "label": "Today",
            "rate": 24560,
        },
        {
            "day": 7,
            "label": "7 Days",
            "rate": 25150,
        },
        {
            "day": 14,
            "label": "14 Days",
            "rate": 25880,
        },
        {
            "day": 21,
            "label": "21 Days",
            "rate": 26520,
        },
        {
            "day": 30,
            "label": "30 Days",
            "rate": 27300,
        },
    ]


    return {

        "origin": request.origin,

        "destination": request.destination,

        "commodity": request.commodity,

        "vessel_type": request.vessel_type,

        "cargo_quantity": request.cargo_quantity,

        "period": request.period,

        "current_rate": current_rate,

        "predicted_rate": predicted_rate,

        "change_percent": round(
            change_percent,
            2,
        ),

        "confidence": 84,

        "trend": "Increasing",

        "recommendation": "CHARTER NOW",

        "message": (
            "Demo forecast generated successfully. "
            "ML integration is pending."
        ),

        # =====================================
        # FUTURE ML OUTPUT
        # =====================================

        "forecast_curve": forecast_curve,
        "trend": "Increasing",

         "risk_level": "Moderate",

         "market_factors": [
          {
             "name": "Market Demand",
             "status": "Strong",
             "impact": "Positive",
          },
          {
             "name": "Port Congestion",
             "status": "Moderate",
              "impact": "Neutral",
          },
          {
             "name": "Fuel Costs",
             "status": "Stable",
             "impact": "Neutral",
        },
      ],

      "ai_insight": (
           "Freight rates are expected to strengthen over "
           "the selected forecast period. Current market "
           "conditions indicate a favorable chartering window."
        ),
    }