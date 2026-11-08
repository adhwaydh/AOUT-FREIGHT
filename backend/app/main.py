import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.models import User
from app.ml.models.ml import (
    MLModel,
    MLPrediction,
    MLForecast,
)

from app.routers.auth import router as auth_router


# =========================================================
# ROUTE IMPORTS
# =========================================================

from app.api.routes.Route_intelligence import (
    router as Route_intelligence_router
)

from app.api.routes.forecast import (
    router as forecast_router
)

from app.api.routes.dashboard import (
    router as dashboard_router
)

from app.api.routes.Ports import (
    router as Ports_router
)

from app.api.routes.chartering import (
    router as chartering_router
)

from app.api.routes.vessel_optimization import (
    router as vessel_optimization_router
)

from app.api.routes.vessel_comparison import (
    router as vessel_comparison_router
)
from app.api.routes.ml import (
    router as ml_router
)
# =========================================================
# DATABASE
# =========================================================

Base.metadata.create_all(
    bind=engine
)

# =========================================================
# APPLICATION
# =========================================================

app = FastAPI(
    title="AOUT-FREIGHT API",
    description="Intelligent Freight Forecast and Chartering Platform",
    version="1.0.0",
)


# =========================================================
# CORS
# =========================================================

# Read allowed browser origins from the deployment environment.
# Set CORS_ORIGINS in Vercel to a comma-separated list, for example:
# https://aout-freight.vercel.app,http://localhost:5173
cors_origins = [
    origin.strip().rstrip("/")
    for origin in os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,https://aout-freight.vercel.app",
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    # Allow Vercel preview deployments for this frontend project.
    # Keep this scoped to the aout-freight project and its Vercel team.
    allow_origin_regex=r"https://aout-freight-[a-z0-9-]+-aout1\\.vercel\\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# API ROUTES
# =========================================================

app.include_router(
    Route_intelligence_router
)

app.include_router(
    forecast_router
)

app.include_router(
    dashboard_router
)

app.include_router(
    Ports_router
)

app.include_router(
    chartering_router
)

app.include_router(
    vessel_optimization_router
)

app.include_router(
    vessel_comparison_router
)
app.include_router(
    vessel_comparison_router
)
app.include_router(ml_router)
app.include_router(auth_router)


# =========================================================
# ROOT
# =========================================================

@app.get("/")
def root():

    return {
        "message": "AOUT-FREIGHT API is running",
        "status": "online",
    }


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/api/health")
def health_check():

    return {
        "status": "healthy",
        "service": "AOUT-FREIGHT backend",
    }