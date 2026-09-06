from pathlib import Path
import sys

import joblib

from app.ml.transx_architecture import (
    PositionalEncoding,
    LightweightTransXEncoder,
)


# ------------------------------------------------------------------
# Compatibility for the existing TransX pickle
# ------------------------------------------------------------------
#
# The original training script saved the Transformer classes from
# __main__. Therefore the pickle expects these names to exist in
# __main__ when it is loaded.
#
# We expose the same classes here before loading the model.
# ------------------------------------------------------------------

main_module = sys.modules["__main__"]

main_module.PositionalEncoding = PositionalEncoding
main_module.LightweightTransXEncoder = LightweightTransXEncoder


# ------------------------------------------------------------------
# Model path
# ------------------------------------------------------------------

MODEL_PATH = (
    Path(__file__).resolve().parent
    / "app"
    / "ml"
    / "models"
    / "transx_production_pipeline.pkl"
)


print("Model path:")
print(MODEL_PATH)


# ------------------------------------------------------------------
# Verify model exists
# ------------------------------------------------------------------

if not MODEL_PATH.exists():
    raise FileNotFoundError(
        f"Model file not found:\n{MODEL_PATH}"
    )


print("\nLoading TransX model...")


# ------------------------------------------------------------------
# Load model
# ------------------------------------------------------------------

model = joblib.load(MODEL_PATH)


print("\n========================================")
print("TransX model loaded successfully!")
print("========================================")


print("\nModel type:")
print(type(model))


# ------------------------------------------------------------------
# Inspect model bundle
# ------------------------------------------------------------------

if isinstance(model, dict):

    print("\nRoutes found:")

    for route, route_model in model.items():

        print(f"\nRoute: {route}")

        if isinstance(route_model, dict):

            print("Components:")

            for key, value in route_model.items():

                print(
                    f"  {key}: {type(value)}"
                )

        else:

            print(
                f"  Type: {type(route_model)}"
            )