from app.database import Base, engine
from app.ml.models.ml import (
    MLModel,
    MLPrediction,
    MLForecast,
)


print("Creating ML database tables...")

Base.metadata.create_all(
    bind=engine
)

print()
print("ML database tables created successfully!")
print()
print("Tables:")
print("  - ml_models")
print("  - ml_predictions")
print("  - ml_forecasts")