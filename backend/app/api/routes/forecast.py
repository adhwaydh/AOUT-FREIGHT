from fastapi import APIRouter

from app.schemas.forecast import (
    ForecastRequest,
    ForecastResponse,
)

from app.services.forecast_service import (
    generate_forecast,
)


router = APIRouter(
    prefix="/api/forecast",
    tags=["Forecast"],
)


@router.post(
    "",
    response_model=ForecastResponse,
)
def forecast(
    request: ForecastRequest,
):

    result = generate_forecast(request)

    return result