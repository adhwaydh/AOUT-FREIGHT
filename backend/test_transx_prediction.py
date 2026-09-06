from app.ml.transx_prediction_service import (
    transx_service,
)


print()
print("=" * 60)
print("TRANSX PREDICTION TEST")
print("=" * 60)

print()

print("Available routes:")

for route in transx_service.get_available_routes():
    print(f"  - {route}")

print()

# Test P3A82
print("Running P3A82 forecast...")

result = transx_service.predict(
    "P3A82"
)

print()

print("=" * 60)
print("P3A82 FORECAST")
print("=" * 60)

print(
    f"Latest actual rate: "
    f"${result['latest_actual_rate']:,.2f}"
)

print(
    f"Latest date: "
    f"{result['latest_date']}"
)

print()

for item in result["forecast"]:

    print(
        f"{item['horizon']} "
        f"({item['date']}): "
        f"${item['predicted_rate']:,.2f}"
    )

print()

print("=" * 60)
print("P3A82 PREDICTION SUCCESSFUL")
print("=" * 60)