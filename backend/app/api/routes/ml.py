from datetime import datetime

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.database import engine
from app.ml.models.ml import (
    MLModel,
    MLPrediction,
    MLForecast,
)

from functools import lru_cache


@lru_cache(maxsize=1)
def get_transx_service():
    """Load the TransX singleton only when an ML endpoint needs it."""
    from app.ml.transx_prediction_service import transx_service

    return transx_service

router = APIRouter(
    prefix="/api/ml",
    tags=["Machine Learning"],
)


# =========================================================
# REQUEST SCHEMA
# =========================================================

class MLForecastRequest(BaseModel):

    # ---------------- Cargo ----------------

    cargo_type: str = Field(...)

    cargo_quantity: float = Field(
        gt=0,
        description="Metric tonnes",
    )

    required_delivery_date: str

    # ---------------- Route ----------------

    loading_country: str
    loading_port: str

    discharge_country: str
    discharge_port: str

    distance_nm: float = Field(
        gt=0,
        description="Estimated voyage distance",
    )

    # ---------------- Charter ----------------

    contract_type: str = Field(
        pattern="^(Spot|Short-term|Medium-term)$"
    )

    contract_duration: str

    number_of_voyages: int = Field(
        ge=1,
    )

    laycan_window: str


# =========================================================
# MODEL STATUS
# =========================================================

@router.get("/status")
def ml_status():

    return {
        "status": "online",
        "model": "TransX",
        "model_version": "production",
        "available_routes": (
            get_transx_service().get_available_routes()
        ),
    }


# =========================================================
# SAVE FORECAST TO DATABASE
# =========================================================

def save_forecast_to_database(result: dict):

    with Session(engine) as db:

        try:

            ml_model = (
                db.query(MLModel)
                .filter(
                    MLModel.model_name == "TransX",
                    MLModel.model_version == "production",
                )
                .first()
            )

            if ml_model is None:

                ml_model = MLModel(
                    model_name="TransX",
                    model_version="production",
                    model_type="Transformer + XGBoost",
                    lookback_days=result["lookback_days"],
                    forecast_horizon=result["forecast_horizon"],
                    artifact_name="transx_production_pipeline.pkl",
                    is_active=True,
                )

                db.add(ml_model)
                db.flush()

            latest_date = datetime.strptime(
                result["latest_date"],
                "%Y-%m-%d",
            )

            forecast_record = MLForecast(
                model_id=ml_model.id,
                route=result["route"],
                model_name=result["model"],
                model_version=result["model_version"],
                lookback_days=result["lookback_days"],
                forecast_horizon=result["forecast_horizon"],
                latest_actual_rate=result["latest_actual_rate"],
                latest_date=latest_date,
                status="generated",
            )

            db.add(forecast_record)
            db.flush()

            for item in result["forecast"]:

                prediction = MLPrediction(
                    model_id=ml_model.id,
                    prediction_type="freight_rate",
                    route=result["route"],
                    latest_actual_rate=result["latest_actual_rate"],
                    predicted_rate=item["predicted_rate"],
                    horizon=int(item["horizon"].replace("t+", "")),
                    prediction_date=datetime.strptime(
                        item["date"],
                        "%Y-%m-%d",
                    ),
                )

                db.add(prediction)

            db.commit()

            return {
                "forecast_id": forecast_record.id,
                "model_id": ml_model.id,
                "predictions_saved": len(result["forecast"]),
            }

        except Exception:

            db.rollback()
            raise


# =========================================================
# ML FORECAST
# =========================================================

@router.post("/forecast")
def generate_ml_forecast(request: MLForecastRequest):

    try:

        # --------------------------------------------------
        # Select benchmark route automatically
        # --------------------------------------------------

        transx_service = get_transx_service()

        benchmark = transx_service.select_benchmark_route(
            request.cargo_quantity
        )

        route = benchmark["benchmark_route"]

        # --------------------------------------------------
        # Run TransX
        # --------------------------------------------------

        result = transx_service.predict(
            route=route,

            cargo_quantity=request.cargo_quantity,
            distance_nm=request.distance_nm,

            contract_type=request.contract_type,
            num_voyages=request.number_of_voyages,

            cargo_type=request.cargo_type,
            delivery_date=request.required_delivery_date,

            loading_country=request.loading_country,
            loading_port=request.loading_port,

            discharge_country=request.discharge_country,
            discharge_port=request.discharge_port,

            contract_duration=request.contract_duration,
            laycan_window=request.laycan_window,
        )

        # --------------------------------------------------
        # Save to PostgreSQL
        # --------------------------------------------------

        db_result = save_forecast_to_database(result)

        result["database"] = {
            "saved": True,
            "forecast_id": db_result["forecast_id"],
            "model_id": db_result["model_id"],
            "predictions_saved": db_result["predictions_saved"],
        }

        return result

    except ValueError as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=f"Forecast failed: {str(exc)}",
        )