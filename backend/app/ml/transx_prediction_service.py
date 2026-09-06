from pathlib import Path
import sys

import joblib
import numpy as np
import pandas as pd
import torch

from app.ml.transx_architecture import (
    PositionalEncoding,
    LightweightTransXEncoder,
)


# ============================================================
# Compatibility for the existing TransX pickle
# ============================================================

main_module = sys.modules["__main__"]

main_module.PositionalEncoding = PositionalEncoding
main_module.LightweightTransXEncoder = LightweightTransXEncoder


# ============================================================
# Paths
# ============================================================

BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = (
    BASE_DIR
    / "models"
    / "transx_production_pipeline.pkl"
)

DATA_PATH = (
    BASE_DIR
    / "data"
    / "P3A82_C10_182_combined_master_dataset.csv"
)


# ============================================================
# Commercial assumptions
#
# These match the current CLI calculation logic.
# ============================================================

VESSEL_CONFIG = {
    "P3A82": {
        "vessel_class": "Panamax (82,000 DWT)",
        "sea_fuel_burn_mt_per_day": 28.0,
        "port_fuel_burn_mt_per_day": 3.5,
    },
    "C10_182": {
        "vessel_class": "Capesize (180,000 DWT)",
        "sea_fuel_burn_mt_per_day": 45.0,
        "port_fuel_burn_mt_per_day": 5.0,
    },
}

SPEED_KNOTS = 12.0
PORT_DAYS = 4.0


# ============================================================
# TransX Prediction Service
# ============================================================

class TransXPredictionService:

    def __init__(self):
        self.model = None
        self.data = None

        self._load_model()
        self._load_data()

    # --------------------------------------------------------
    # Load trained production model
    # --------------------------------------------------------

    def _load_model(self):

        if not MODEL_PATH.exists():
            raise FileNotFoundError(
                f"TransX model not found:\n{MODEL_PATH}"
            )

        print("Loading TransX production model...")

        self.model = joblib.load(MODEL_PATH)

        print("TransX production model loaded.")

        if not isinstance(self.model, dict):
            raise TypeError(
                "Unexpected TransX model format. "
                "Expected a dictionary."
            )

    # --------------------------------------------------------
    # Load combined historical dataset
    # --------------------------------------------------------

    def _load_data(self):

        if not DATA_PATH.exists():
            raise FileNotFoundError(
                f"TransX dataset not found:\n{DATA_PATH}"
            )

        print("Loading TransX historical dataset...")

        self.data = pd.read_csv(DATA_PATH)

        if "Date" not in self.data.columns:
            raise ValueError(
                "Dataset does not contain a 'Date' column."
            )

        if "Route" not in self.data.columns:
            raise ValueError(
                "Dataset does not contain a 'Route' column."
            )

        if "Freight_Rate" not in self.data.columns:
            raise ValueError(
                "Dataset does not contain a "
                "'Freight_Rate' column."
            )

        if "VLSFO_Singapore" not in self.data.columns:
            raise ValueError(
                "Dataset does not contain a "
                "'VLSFO_Singapore' column."
            )

        self.data["Date"] = pd.to_datetime(
            self.data["Date"]
        )

        print(
            f"TransX dataset loaded: "
            f"{len(self.data)} rows"
        )

    # --------------------------------------------------------
    # Available routes
    # --------------------------------------------------------

    def get_available_routes(self):

        return list(self.model.keys())

    # ========================================================
    # Business route selection
    # ========================================================

    def select_benchmark_route(
        self,
        cargo_quantity: float,
    ):
        """
        Select the trained TransX benchmark route.

        Current business rule, matching cli_predict.py:

            <= 100,000 MT -> P3A82 / Panamax
            >  100,000 MT -> C10_182 / Capesize
        """

        cargo_quantity = float(cargo_quantity)

        if cargo_quantity <= 0:
            raise ValueError(
                "Cargo quantity must be greater than 0."
            )

        if cargo_quantity <= 100000:

            route = "P3A82"

        else:

            route = "C10_182"

        if route not in self.model:
            raise ValueError(
                f"Selected route '{route}' is not "
                f"available in the TransX model. "
                f"Available routes: "
                f"{self.get_available_routes()}"
            )

        config = VESSEL_CONFIG[route]

        return {
            "benchmark_route": route,
            "vessel_class": config["vessel_class"],
            "sea_fuel_burn_mt_per_day": (
                config["sea_fuel_burn_mt_per_day"]
            ),
            "port_fuel_burn_mt_per_day": (
                config["port_fuel_burn_mt_per_day"]
            ),
        }

    # ========================================================
    # Generate TransX forecast
    # ========================================================

    def predict(
        self,
        route: str,
        cargo_quantity: float,
        distance_nm: float,
        contract_type: str = "spot",
        num_voyages: int = 1,
        cargo_type: str | None = None,
        delivery_date: str | None = None,
        loading_country: str | None = None,
        loading_port: str | None = None,
        discharge_country: str | None = None,
        discharge_port: str | None = None,
        contract_duration: str | None = None,
        laycan_window: str | None = None,
    ):
        """
        Run the production TransX model and calculate
        commercial voyage economics.

        The trained TransX model itself continues to use
        the latest 30 historical rows for the selected route.

        Business inputs are used by the commercial layer
        and route selection layer.
        """

        # ----------------------------------------------------
        # Validate inputs
        # ----------------------------------------------------

        route = route.strip()

        cargo_quantity = float(cargo_quantity)
        distance_nm = float(distance_nm)
        num_voyages = int(num_voyages)

        contract_type = (
            contract_type.strip().lower()
        )

        if cargo_quantity <= 0:
            raise ValueError(
                "Cargo quantity must be greater than 0."
            )

        if distance_nm <= 0:
            raise ValueError(
                "Voyage distance must be greater than 0."
            )

        if num_voyages <= 0:
            raise ValueError(
                "Number of voyages must be at least 1."
            )

        allowed_contract_types = {
            "spot",
            "short-term",
            "short term",
            "medium-term",
            "medium term",
        }

        if contract_type not in allowed_contract_types:
            raise ValueError(
                "Contract type must be one of: "
                "Spot, Short-term, Medium-term."
            )

        if route not in self.model:
            raise ValueError(
                f"Unsupported route '{route}'. "
                f"Available routes: "
                f"{self.get_available_routes()}"
            )

        # ----------------------------------------------------
        # Get route-specific historical data
        # ----------------------------------------------------

        sub = (
            self.data[
                self.data["Route"] == route
            ]
            .sort_values("Date")
            .reset_index(drop=True)
        )

        if len(sub) < 30:
            raise ValueError(
                f"Route '{route}' has only "
                f"{len(sub)} rows. "
                f"At least 30 rows are required."
            )

        # ----------------------------------------------------
        # Get saved model components
        # ----------------------------------------------------

        route_model = self.model[route]

        feature_cols = route_model[
            "feature_cols"
        ]

        # ----------------------------------------------------
        # Check required model features
        # ----------------------------------------------------

        missing_columns = [
            column
            for column in feature_cols
            if column not in sub.columns
        ]

        if missing_columns:
            raise ValueError(
                "Dataset is missing required model "
                f"features: {missing_columns}"
            )

        # ----------------------------------------------------
        # Fill missing feature values
        # ----------------------------------------------------

        sub[feature_cols] = (
            sub[feature_cols]
            .ffill()
            .bfill()
        )

        # ----------------------------------------------------
        # Latest 30-day window
        # ----------------------------------------------------

        last_30_days_df = (
            sub.iloc[-30:].copy()
        )

        last_date = (
            last_30_days_df["Date"].max()
        )

        # ----------------------------------------------------
        # Prepare Transformer input
        # ----------------------------------------------------

        x_raw = (
            last_30_days_df[feature_cols]
            .values
            .astype(np.float32)
            .reshape(
                1,
                30,
                len(feature_cols),
            )
        )

        # ----------------------------------------------------
        # Normalize input
        # ----------------------------------------------------

        scaler_x = route_model["scaler_x"]

        x_norm = (
            scaler_x
            .transform(
                x_raw.reshape(
                    -1,
                    len(feature_cols),
                )
            )
            .reshape(
                1,
                30,
                len(feature_cols),
            )
        )

        # ----------------------------------------------------
        # Transformer encoding
        # ----------------------------------------------------

        transformer = route_model[
            "transformer"
        ]

        transformer.eval()

        with torch.no_grad():

            _, latent = transformer(
                torch.tensor(
                    x_norm,
                    dtype=torch.float32,
                )
            )

        # ----------------------------------------------------
        # XGBoost input
        #
        # [Transformer latent 32]
        # +
        # [latest normalized feature vector]
        # ----------------------------------------------------

        latent_numpy = latent.numpy()

        latest_features = (
            x_norm[:, -1, :]
        )

        x_xgb = np.hstack(
            [
                latent_numpy,
                latest_features,
            ]
        )

        # ----------------------------------------------------
        # Seven XGBoost predictions
        # ----------------------------------------------------

        boosters = route_model[
            "boosters"
        ]

        preds_norm = np.array(
            [
                booster.predict(
                    x_xgb
                )[0]
                for booster in boosters
            ]
        )

        # ----------------------------------------------------
        # Convert predictions back to USD/day
        # ----------------------------------------------------

        scaler_y = route_model[
            "scaler_y"
        ]

        preds_usd = (
            scaler_y
            .inverse_transform(
                preds_norm.reshape(
                    -1,
                    1,
                )
            )
            .ravel()
        )

        # ----------------------------------------------------
        # Generate future business dates
        # ----------------------------------------------------

        future_dates = pd.date_range(
            start=(
                last_date
                + pd.Timedelta(days=1)
            ),
            periods=10,
            freq="B",
        )[:7]

        # ----------------------------------------------------
        # Build 7-day forward curve
        # ----------------------------------------------------

        forecast = []

        for index in range(7):

            forecast.append(
                {
                    "horizon": (
                        f"t+{index + 1}"
                    ),
                    "date": (
                        future_dates[index]
                        .strftime(
                            "%Y-%m-%d"
                        )
                    ),
                    "predicted_rate": round(
                        float(
                            preds_usd[index]
                        ),
                        2,
                    ),
                }
            )

        # ----------------------------------------------------
        # Latest actual freight rate
        # ----------------------------------------------------

        latest_actual = float(
            sub["Freight_Rate"].iloc[-1]
        )

        # ====================================================
        # COMMERCIAL CALCULATIONS
        # ====================================================

        vessel_config = VESSEL_CONFIG[
            route
        ]

        vessel_class = vessel_config[
            "vessel_class"
        ]

        sea_fuel_burn = vessel_config[
            "sea_fuel_burn_mt_per_day"
        ]

        port_fuel_burn = vessel_config[
            "port_fuel_burn_mt_per_day"
        ]

        # ----------------------------------------------------
        # Voyage duration
        #
        # Same calculation as cli_predict.py:
        #
        # sea_days = distance / (speed * 24)
        # port_days = 4
        # ----------------------------------------------------

        sea_days = round(
            distance_nm
            / (SPEED_KNOTS * 24.0),
            1,
        )

        port_days = PORT_DAYS

        total_voyage_days = round(
            sea_days + port_days,
            1,
        )

        # ----------------------------------------------------
        # Predicted daily hire
        #
        # Spot:
        #   average first 3 forecast days
        #
        # Non-spot:
        #   average all 7 forecast days
        # ----------------------------------------------------

        if contract_type == "spot":

            predicted_hire_per_day = float(
                np.mean(
                    preds_usd[:3]
                )
            )

        else:

            predicted_hire_per_day = float(
                np.mean(
                    preds_usd
                )
            )

        predicted_hire_per_day = round(
            predicted_hire_per_day,
            2,
        )

        # ----------------------------------------------------
        # Current VLSFO price
        # ----------------------------------------------------

        vlsfo_price = float(
            sub[
                "VLSFO_Singapore"
            ].iloc[-1]
        )

        vlsfo_price = round(
            vlsfo_price,
            2,
        )

        # ----------------------------------------------------
        # Charter hire cost
        # ----------------------------------------------------

        charter_hire_cost = round(
            predicted_hire_per_day
            * total_voyage_days,
            2,
        )

        # ----------------------------------------------------
        # Bunker fuel consumption
        #
        # Sea fuel:
        #     sea_days * sea fuel burn
        #
        # Port fuel:
        #     port_days * port fuel burn
        # ----------------------------------------------------

        sea_fuel_mt = round(
            sea_days
            * sea_fuel_burn,
            2,
        )

        port_fuel_mt = round(
            port_days
            * port_fuel_burn,
            2,
        )

        bunker_fuel_mt = round(
            sea_fuel_mt
            + port_fuel_mt,
            2,
        )

        # ----------------------------------------------------
        # Bunker cost
        # ----------------------------------------------------

        bunker_cost = round(
            bunker_fuel_mt
            * vlsfo_price,
            2,
        )

        # ----------------------------------------------------
        # Single voyage cost
        # ----------------------------------------------------

        single_voyage_cost = round(
            charter_hire_cost
            + bunker_cost,
            2,
        )

        # ----------------------------------------------------
        # Freight cost per metric tonne
        # ----------------------------------------------------

        estimated_freight_per_mt = round(
            single_voyage_cost
            / cargo_quantity,
            2,
        )

        # ----------------------------------------------------
        # Total contract value
        # ----------------------------------------------------

        total_contract_value = round(
            single_voyage_cost
            * num_voyages,
            2,
        )

        # ====================================================
        # RESPONSE
        # ====================================================

        return {
            # ------------------------------------------------
            # Model information
            # ------------------------------------------------

            "route": route,
            "benchmark_route": route,
            "model": "TransX",
            "model_version": "production",

            "lookback_days": 30,
            "forecast_horizon": 7,

            # ------------------------------------------------
            # User business inputs
            # ------------------------------------------------

            "cargo_type": cargo_type,
            "cargo_quantity_mt": round(
                cargo_quantity,
                2,
            ),

            "delivery_date": (
                delivery_date
            ),

            "loading_country": (
                loading_country
            ),

            "loading_port": (
                loading_port
            ),

            "discharge_country": (
                discharge_country
            ),

            "discharge_port": (
                discharge_port
            ),

            "contract_type": contract_type,

            "contract_duration": (
                contract_duration
            ),

            "num_voyages": num_voyages,

            "laycan_window": (
                laycan_window
            ),

            "distance_nm": round(
                distance_nm,
                1,
            ),

            # ------------------------------------------------
            # Vessel information
            # ------------------------------------------------

            "vessel_class": vessel_class,

            # ------------------------------------------------
            # Latest market information
            # ------------------------------------------------

            "latest_date": (
                last_date.strftime(
                    "%Y-%m-%d"
                )
            ),

            "latest_actual_rate": round(
                latest_actual,
                2,
            ),

            "vlsfo_price": vlsfo_price,

            # ------------------------------------------------
            # Voyage economics
            # ------------------------------------------------

            "speed_knots": SPEED_KNOTS,

            "sea_days": sea_days,

            "port_days": port_days,

            "total_voyage_days": (
                total_voyage_days
            ),

            "sea_fuel_burn_mt_per_day": (
                sea_fuel_burn
            ),

            "port_fuel_burn_mt_per_day": (
                port_fuel_burn
            ),

            "sea_fuel_mt": sea_fuel_mt,

            "port_fuel_mt": port_fuel_mt,

            "bunker_fuel_mt": (
                bunker_fuel_mt
            ),

            # ------------------------------------------------
            # Commercial result
            # ------------------------------------------------

            "predicted_hire_per_day": (
                predicted_hire_per_day
            ),

            "charter_hire_cost": (
                charter_hire_cost
            ),

            "bunker_cost": bunker_cost,

            "estimated_freight_per_mt": (
                estimated_freight_per_mt
            ),

            "single_voyage_cost": (
                single_voyage_cost
            ),

            "total_contract_value": (
                total_contract_value
            ),

            # ------------------------------------------------
            # Seven-day forward curve
            # ------------------------------------------------

            "forecast": forecast,
        }


# ============================================================
# Singleton service
# ============================================================

transx_service = TransXPredictionService()