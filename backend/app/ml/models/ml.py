from datetime import datetime

from sqlalchemy import (
    Boolean,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)

from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


# =========================================================
# ML MODEL REGISTRY
# =========================================================

class MLModel(Base):
    __tablename__ = "ml_models"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    model_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    model_version: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    model_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    lookback_days: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    forecast_horizon: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    artifact_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )


# =========================================================
# ML PREDICTIONS
# =========================================================

class MLPrediction(Base):
    __tablename__ = "ml_predictions"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id"),
        nullable=True,
    )

    model_id: Mapped[int | None] = mapped_column(
        ForeignKey("ml_models.id"),
        nullable=True,
    )

    prediction_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    route: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    latest_actual_rate: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    predicted_rate: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    horizon: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    prediction_date: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )


# =========================================================
# ML FORECAST RUN
# =========================================================

class MLForecast(Base):
    __tablename__ = "ml_forecasts"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id"),
        nullable=True,
    )

    model_id: Mapped[int | None] = mapped_column(
        ForeignKey("ml_models.id"),
        nullable=True,
    )

    route: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    model_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    model_version: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    lookback_days: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    forecast_horizon: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    latest_actual_rate: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    latest_date: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(50),
        default="generated",
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    error_message: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )