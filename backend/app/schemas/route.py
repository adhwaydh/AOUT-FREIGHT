from pydantic import BaseModel


class RouteRequest(BaseModel):

    origin: str

    destination: str


class RouteWeather(BaseModel):

    condition: str

    wind: str

    wave_height: str

    visibility: str


class RouteResponse(BaseModel):

    origin: str

    destination: str

    distance_nm: float

    transit_days: float

    route_status: str

    weather_risk: str

    congestion: str

    port_risk: str

    market_risk: str

    recommendation: str

    recommendation_detail: str

    weather: RouteWeather