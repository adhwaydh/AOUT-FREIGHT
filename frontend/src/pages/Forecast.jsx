import { useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  Brain,
  Calculator,
  CheckCircle2,
  Clock3,
  Fuel,
  RefreshCw,
  Ship,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000";

function formatMoney(value) {
  if (value === null || value === undefined) {
    return "—";
  }

  return Number(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatNumber(value) {
  if (value === null || value === undefined) {
    return "—";
  }

  return Number(value).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
}

function formatDate(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getDifference(current, previous) {
  if (
    current === null ||
    current === undefined ||
    previous === null ||
    previous === undefined
  ) {
    return 0;
  }

  return Number(current) - Number(previous);
}

function getPercentageChange(current, previous) {
  if (!previous || Number(previous) === 0) {
    return 0;
  }

  return (
    ((Number(current) - Number(previous)) /
      Number(previous)) *
    100
  );
}

function Forecast() {
  // =========================================================
  // FORM STATE
  // =========================================================

  const [cargoType, setCargoType] =
    useState("Bauxite");

  const [cargoQuantity, setCargoQuantity] =
    useState("70000");

  const [requiredDeliveryDate, setRequiredDeliveryDate] =
    useState("2026-09-20");

  const [loadingCountry, setLoadingCountry] =
    useState("Indonesia");

  const [loadingPort, setLoadingPort] =
    useState("Bintan");

  const [dischargeCountry, setDischargeCountry] =
    useState("China");

  const [dischargePort, setDischargePort] =
    useState("Fancheng");

  const [distanceNm, setDistanceNm] =
    useState("1500");

  const [contractType, setContractType] =
    useState("Spot");

  const [contractDuration, setContractDuration] =
    useState("1 month");

  const [numberOfVoyages, setNumberOfVoyages] =
    useState("1");

  const [laycanWindow, setLaycanWindow] =
    useState("2026-09-12 to 2026-09-16");

  // =========================================================
  // API STATE
  // =========================================================

  const [loading, setLoading] =
    useState(false);

  const [generated, setGenerated] =
    useState(false);

  const [error, setError] =
    useState("");

  const [forecast, setForecast] =
    useState(null);

  // =========================================================
  // GENERATE FORECAST
  // =========================================================

  const generateForecast = async () => {
    setLoading(true);
    setGenerated(false);
    setError("");
    setForecast(null);

    try {
      const response = await fetch(
        `${API_URL}/api/ml/forecast`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            cargo_type: cargoType,
            cargo_quantity: Number(cargoQuantity),

            required_delivery_date:
              requiredDeliveryDate,

            loading_country:
              loadingCountry,

            loading_port:
              loadingPort,

            discharge_country:
              dischargeCountry,

            discharge_port:
              dischargePort,

            distance_nm: Number(distanceNm),

            contract_type:
              contractType,

            contract_duration:
              contractDuration,

            number_of_voyages:
              Number(numberOfVoyages),

            laycan_window:
              laycanWindow,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "TransX ML response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            "Failed to generate freight forecast."
        );
      }

      setForecast(data);
      setGenerated(true);

    } catch (err) {
      console.error(
        "TransX forecast error:",
        err
      );

      setForecast(null);

      setError(
        err.message ||
          "Unable to connect to the AOUT-FREIGHT ML backend."
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // RESET
  // =========================================================

  const resetForecast = () => {
    setCargoType("Bauxite");
    setCargoQuantity("70000");
    setRequiredDeliveryDate("2026-09-20");

    setLoadingCountry("Indonesia");
    setLoadingPort("Bintan");

    setDischargeCountry("China");
    setDischargePort("Fancheng");

    setDistanceNm("1500");

    setContractType("Spot");
    setContractDuration("1 month");
    setNumberOfVoyages("1");
    setLaycanWindow(
      "2026-09-12 to 2026-09-16"
    );

    setForecast(null);
    setGenerated(false);
    setError("");
  };

  // =========================================================
  // FORECAST VALUES
  // =========================================================

  const forecastValues = useMemo(() => {
    if (
      !forecast ||
      !Array.isArray(forecast.forecast)
    ) {
      return [];
    }

    return forecast.forecast.map(
      (item) => ({
        ...item,
        predicted_rate:
          Number(item.predicted_rate),
      })
    );
  }, [forecast]);

  const firstPrediction =
    forecastValues.length > 0
      ? forecastValues[0].predicted_rate
      : null;

  const lastPrediction =
    forecastValues.length > 0
      ? forecastValues[
          forecastValues.length - 1
        ].predicted_rate
      : null;

  const lowestPrediction =
    forecastValues.length > 0
      ? Math.min(
          ...forecastValues.map(
            (item) =>
              item.predicted_rate
          )
        )
      : null;

  const highestPrediction =
    forecastValues.length > 0
      ? Math.max(
          ...forecastValues.map(
            (item) =>
              item.predicted_rate
          )
        )
      : null;

  const overallChangePercent =
    forecast &&
    forecast.latest_actual_rate
      ? getPercentageChange(
          lastPrediction,
          forecast.latest_actual_rate
        )
      : 0;

  const trendIsUp =
    overallChangePercent >= 0;

  // =========================================================
  // CHART
  // =========================================================

  const chartPoints = useMemo(() => {
    if (
      !forecast ||
      !forecastValues.length
    ) {
      return "";
    }

    const values = [
      Number(
        forecast.latest_actual_rate
      ),
      ...forecastValues.map(
        (item) =>
          item.predicted_rate
      ),
    ];

    const minValue =
      Math.min(...values);

    const maxValue =
      Math.max(...values);

    const range =
      maxValue - minValue || 1;

    const width = 800;
    const height = 250;

    const horizontalPadding = 20;
    const verticalPadding = 25;

    return values
      .map((value, index) => {
        const x =
          horizontalPadding +
          (index /
            (values.length - 1)) *
            (width -
              horizontalPadding * 2);

        const normalized =
          (value - minValue) /
          range;

        const y =
          height -
          verticalPadding -
          normalized *
            (height -
              verticalPadding * 2);

        return `${x},${y}`;
      })
      .join(" ");
  }, [
    forecast,
    forecastValues,
  ]);

  // =========================================================
  // AI RECOMMENDATION
  // =========================================================

  const recommendation =
    overallChangePercent > 5
      ? "CHARTER NOW"
      : overallChangePercent < -5
      ? "WAIT"
      : "MONITOR";

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="space-y-8">

      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}

      <div>
        <div className="flex items-center gap-3">

          <Brain
            size={26}
            className="text-cyan-400"
          />

          <div>

            <p className="text-xs uppercase tracking-widest text-cyan-400">
              AI-Powered Prediction
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              Freight Rate Forecast
            </h1>

          </div>
        </div>

        <p className="mt-2 max-w-3xl text-sm text-slate-500">
          Analyze cargo, route and charter
          requirements and generate real
          seven-day freight rate predictions
          using the AOUT-FREIGHT TransX
          production model.
        </p>
      </div>


      {/* ===================================================== */}
      {/* CONFIGURATION */}
      {/* ===================================================== */}

      <div className="rounded-xl border border-slate-800 bg-[#061724] p-6">

        <div className="flex items-center justify-between">

          <div>
            <h2 className="text-lg font-semibold">
              Forecast Configuration
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Enter your cargo, route and
              charter requirement.
            </p>
          </div>

          <div className="hidden items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/5 px-3 py-2 text-xs text-green-400 md:flex">
            <Activity size={14} />
            TRANSX LIVE
          </div>

        </div>


        {/* ================================================= */}
        {/* CARGO */}
        {/* ================================================= */}

        <div className="mt-8">

          <div className="mb-4 flex items-center gap-2">
            <Ship
              size={17}
              className="text-cyan-400"
            />

            <h3 className="text-sm font-semibold text-cyan-400">
              Cargo Details
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

            <InputField
              label="Cargo Type"
              value={cargoType}
              onChange={setCargoType}
              placeholder="e.g. Coking Coal"
            />

            <InputField
              label="Cargo Quantity"
              value={cargoQuantity}
              onChange={setCargoQuantity}
              type="number"
              suffix="MT"
              placeholder="75000"
            />

            <InputField
              label="Required Delivery Date"
              value={requiredDeliveryDate}
              onChange={setRequiredDeliveryDate}
              type="date"
            />

          </div>
        </div>


        {/* ================================================= */}
        {/* ROUTE */}
        {/* ================================================= */}

        <div className="mt-8">

          <div className="mb-4 flex items-center gap-2">
            <Activity
              size={17}
              className="text-cyan-400"
            />

            <h3 className="text-sm font-semibold text-cyan-400">
              Route Details
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">

            <InputField
              label="Loading Country"
              value={loadingCountry}
              onChange={setLoadingCountry}
              placeholder="Australia"
            />

            <InputField
              label="Loading Port"
              value={loadingPort}
              onChange={setLoadingPort}
              placeholder="Hay Point"
            />

            <InputField
              label="Discharge Country"
              value={dischargeCountry}
              onChange={setDischargeCountry}
              placeholder="India"
            />

            <InputField
              label="Discharge Port"
              value={dischargePort}
              onChange={setDischargePort}
              placeholder="Paradip"
            />

            <InputField
              label="Voyage Distance"
              value={distanceNm}
              onChange={setDistanceNm}
              type="number"
              suffix="NM"
              placeholder="4500"
            />

          </div>
        </div>


        {/* ================================================= */}
        {/* CHARTER */}
        {/* ================================================= */}

        <div className="mt-8">

          <div className="mb-4 flex items-center gap-2">
            <Calculator
              size={17}
              className="text-cyan-400"
            />

            <h3 className="text-sm font-semibold text-cyan-400">
              Charter Requirement
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

            <div>
              <label className="text-xs font-medium text-slate-400">
                Contract Type
              </label>

              <select
                value={contractType}
                onChange={(e) =>
                  setContractType(
                    e.target.value
                  )
                }
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
              >
                <option value="Spot">
                  Spot
                </option>

                <option value="Short-term">
                  Short-term
                </option>

                <option value="Medium-term">
                  Medium-term
                </option>
              </select>
            </div>

            <InputField
              label="Contract Duration"
              value={contractDuration}
              onChange={setContractDuration}
              placeholder="e.g. 6 months"
            />

            <InputField
              label="Number of Voyages"
              value={numberOfVoyages}
              onChange={setNumberOfVoyages}
              type="number"
              placeholder="6"
            />

            <InputField
              label="Laycan / Loading Window"
              value={laycanWindow}
              onChange={setLaycanWindow}
              placeholder="1–10 October 2026"
            />

          </div>
        </div>


        {/* ================================================= */}
        {/* ROUTE SUMMARY + BUTTON */}
        {/* ================================================= */}

        <div className="mt-7 flex flex-col gap-4 rounded-lg border border-slate-800 bg-slate-900/60 p-4 md:flex-row md:items-center md:justify-between">

          <div>

            <p className="text-[10px] uppercase tracking-widest text-slate-600">
              Analysis Requirement
            </p>

            <p className="mt-1 text-sm font-semibold">

              {loadingPort}

              <span className="mx-2 text-cyan-400">
                →
              </span>

              {dischargePort}

            </p>

            <p className="mt-1 text-xs text-slate-500">

              {cargoType}

              {" • "}

              {formatNumber(
                cargoQuantity
              )} MT

              {" • "}

              {contractType}

              {" • "}

              {numberOfVoyages} voyage
              {Number(numberOfVoyages) === 1
                ? ""
                : "s"}

            </p>

          </div>


          <div className="flex gap-3">

            <button
              onClick={resetForecast}
              type="button"
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-400 transition hover:border-slate-600 hover:text-white"
            >
              Reset
            </button>

            <button
              onClick={generateForecast}
              disabled={loading}
              type="button"
              className="flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >

              {loading ? (
                <>
                  <RefreshCw
                    size={16}
                    className="animate-spin"
                  />

                  Running TransX...
                </>
              ) : (
                <>
                  <Brain size={16} />

                  Generate Forecast
                </>
              )}

            </button>

          </div>

        </div>


        {/* ================================================= */}
        {/* ERROR */}
        {/* ================================================= */}

        {error && (
          <div className="mt-4 flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/5 p-4">

            <AlertCircle
              size={20}
              className="mt-0.5 text-red-400"
            />

            <div>

              <p className="text-sm font-medium text-red-400">
                ML Forecast Error
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {error}
              </p>

            </div>

          </div>
        )}


        {/* ================================================= */}
        {/* SUCCESS */}
        {/* ================================================= */}

        {generated &&
          !error &&
          forecast && (
            <div className="mt-4 flex items-start gap-3 rounded-lg border border-green-500/20 bg-green-500/5 p-4">

              <CheckCircle2
                size={20}
                className="mt-0.5 text-green-400"
              />

              <div>

                <p className="text-sm font-medium text-green-400">
                  Forecast generated successfully
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  TransX generated{" "}
                  {forecast.forecast?.length || 0}{" "}
                  predictions and the
                  result was stored in
                  PostgreSQL.
                </p>

              </div>

            </div>
          )}

      </div>


      {/* ===================================================== */}
      {/* RESULTS */}
      {/* ===================================================== */}

      {forecast && (
        <>

          {/* ================================================= */}
          {/* MARKET CARDS */}
          {/* ================================================= */}

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-4">

            {/* Current Rate */}

            <div className="rounded-xl border border-slate-800 bg-[#061724] p-6">

              <p className="text-xs text-slate-500">
                CURRENT FREIGHT RATE
              </p>

              <div className="mt-4 flex items-end gap-2">

                <h2 className="text-3xl font-bold">
                  $
                  {formatMoney(
                    forecast.latest_actual_rate
                  )}
                </h2>

              </div>

              <p className="mt-3 text-xs text-slate-600">
                Latest actual rate
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {formatDate(
                  forecast.latest_date
                )}
              </p>

            </div>


            {/* Day 1 */}

            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-6">

              <p className="text-xs text-slate-500">
                DAY 1 PREDICTION
              </p>

              <div className="mt-4 flex items-end gap-2">

                <h2 className="text-3xl font-bold text-cyan-400">
                  $
                  {formatMoney(
                    firstPrediction
                  )}
                </h2>

              </div>

              <p className="mt-3 text-xs text-slate-500">
                {formatDate(
                  forecastValues[0]?.date
                )}
              </p>

            </div>


            {/* Final */}

            <div className="rounded-xl border border-slate-800 bg-[#061724] p-6">

              <p className="text-xs text-slate-500">
                FINAL FORECAST
              </p>

              <div className="mt-4 flex items-end gap-2">

                <h2 className="text-3xl font-bold text-white">
                  $
                  {formatMoney(
                    lastPrediction
                  )}
                </h2>

              </div>

              <p className="mt-3 text-xs text-slate-500">
                {formatDate(
                  forecastValues[
                    forecastValues.length - 1
                  ]?.date
                )}
              </p>

            </div>


            {/* Change */}

            <div className="rounded-xl border border-slate-800 bg-[#061724] p-6">

              <p className="text-xs text-slate-500">
                7-DAY CHANGE
              </p>

              <div className="mt-4 flex items-center gap-3">

                {trendIsUp ? (
                  <TrendingUp
                    size={28}
                    className="text-green-400"
                  />
                ) : (
                  <TrendingDown
                    size={28}
                    className="text-amber-400"
                  />
                )}

                <h2
                  className={`text-3xl font-bold ${
                    trendIsUp
                      ? "text-green-400"
                      : "text-amber-400"
                  }`}
                >
                  {trendIsUp
                    ? "+"
                    : ""}
                  {overallChangePercent.toFixed(
                    2
                  )}
                  %
                </h2>

              </div>

              <p className="mt-3 text-xs text-slate-600">
                Compared with latest actual rate
              </p>

            </div>

          </div>


          {/* ================================================= */}
          {/* COMMERCIAL RESULT CARDS */}
          {/* ================================================= */}

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">

            <CommercialCard
              title="ESTIMATED FREIGHT / TON"
              value={`$${formatMoney(
                forecast.estimated_freight_per_mt
              )}`}
              suffix="/ MT"
              icon={<TrendingUp size={22} />}
              highlight
            />

            <CommercialCard
              title="SINGLE VOYAGE COST"
              value={`$${formatMoney(
                forecast.single_voyage_cost
              )}`}
              icon={<Ship size={22} />}
            />

            <CommercialCard
              title="TOTAL CONTRACT VALUE"
              value={`$${formatMoney(
                forecast.total_contract_value
              )}`}
              icon={<Calculator size={22} />}
            />

          </div>


          {/* ================================================= */}
          {/* CHART + RECOMMENDATION */}
          {/* ================================================= */}

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">

            {/* Chart */}

            <div className="rounded-xl border border-slate-800 bg-[#061724] p-6 xl:col-span-2">

              <div className="flex items-start justify-between">

                <div>

                  <h2 className="font-semibold">
                    TransX Freight Rate Projection
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">

                    Route:{" "}

                    <span className="text-cyan-400">
                      {forecast.benchmark_route}
                    </span>

                    {" • "}

                    {forecast.loading_port}
                    {" → "}
                    {forecast.discharge_port}

                  </p>

                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs ${
                    trendIsUp
                      ? "bg-green-500/10 text-green-400"
                      : "bg-amber-500/10 text-amber-400"
                  }`}
                >
                  {trendIsUp
                    ? "Increasing"
                    : "Decreasing"}
                </span>

              </div>


              {/* Chart */}

              <div className="relative mt-8 h-64">

                <div className="absolute inset-0 flex flex-col justify-between">

                  {[1, 2, 3, 4, 5].map(
                    (line) => (
                      <div
                        key={line}
                        className="border-t border-slate-800"
                      />
                    )
                  )}

                </div>

                <svg
                  className="absolute inset-0 h-full w-full"
                  viewBox="0 0 800 250"
                  preserveAspectRatio="none"
                >

                  <defs>

                    <linearGradient
                      id="forecastGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >

                      <stop
                        offset="0%"
                        stopColor="#22d3ee"
                        stopOpacity="0.25"
                      />

                      <stop
                        offset="100%"
                        stopColor="#22d3ee"
                        stopOpacity="0"
                      />

                    </linearGradient>

                  </defs>


                  {chartPoints && (
                    <polygon
                      points={`${chartPoints} 780,250 20,250`}
                      fill="url(#forecastGradient)"
                    />
                  )}


                  {chartPoints && (
                    <polyline
                      points={chartPoints}
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="4"
                    />
                  )}

                  {/* Animated forecast point */}

                  {forecastValues.map(
                    (item, index) => {

                      const allValues = [
                        Number(
                          forecast.latest_actual_rate
                        ),
                        ...forecastValues.map(
                          (entry) =>
                            Number(
                              entry.predicted_rate
                            )
                        ),
                      ];

                      const minValue =
                        Math.min(
                          ...allValues
                        );

                      const maxValue =
                        Math.max(
                          ...allValues
                        );

                      const range =
                        maxValue -
                          minValue ||
                        1;

                      const x =
                        20 +
                        ((index + 1) /
                          (allValues.length - 1)) *
                          760;

                      const normalized =
                        (Number(
                          item.predicted_rate
                        ) -
                          minValue) /
                        range;

                      const y =
                        225 -
                        normalized *
                          200;

                      return (
                        <circle
                          key={item.horizon}
                          cx={x}
                          cy={y}
                          r="5"
                          fill="#22d3ee"
                          className="animate-pulse"
                        />
                      );
                    }
                  )}

                </svg>

              </div>


              <div className="mt-4 flex justify-between text-[10px] text-slate-600">

                <span>
                  Actual
                </span>

                {forecastValues.map(
                  (item) => (
                    <span
                      key={item.horizon}
                    >
                      {item.horizon}
                    </span>
                  )
                )}

              </div>

            </div>


            {/* Recommendation */}

            <div className="rounded-xl border border-cyan-500/20 bg-gradient-to-b from-cyan-500/10 to-[#061724] p-6">

              <p className="text-xs uppercase tracking-widest text-cyan-400">
                AI Recommendation
              </p>

              <h2 className="mt-4 text-3xl font-bold text-white">
                {recommendation}
              </h2>

              <p className="mt-4 text-sm leading-6 text-slate-400">
                The TransX production model
                forecasts the selected freight
                benchmark over the next seven
                business days.
              </p>


              <div className="mt-6 rounded-lg border border-slate-800 bg-slate-950/50 p-4">

                <p className="text-xs text-slate-500">
                  EXPECTED CHANGE
                </p>

                <p
                  className={`mt-2 text-2xl font-bold ${
                    trendIsUp
                      ? "text-green-400"
                      : "text-amber-400"
                  }`}
                >
                  {trendIsUp
                    ? "+"
                    : ""}
                  {overallChangePercent.toFixed(
                    2
                  )}
                  %
                </p>

              </div>


              <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950/50 p-4">

                <p className="text-xs text-slate-500">
                  7-DAY RANGE
                </p>

                <p className="mt-2 text-lg font-semibold text-white">

                  $
                  {formatMoney(
                    lowestPrediction
                  )}

                  {" — "}

                  $
                  {formatMoney(
                    highestPrediction
                  )}

                </p>

              </div>

            </div>

          </div>


          {/* ================================================= */}
          {/* VOYAGE ECONOMICS */}
          {/* ================================================= */}

          <div className="rounded-xl border border-slate-800 bg-[#061724] p-6">

            <div className="flex items-center gap-3">

              <Calculator
                size={21}
                className="text-cyan-400"
              />

              <div>

                <h2 className="font-semibold">
                  Voyage Economics
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Commercial calculation based on
                  the TransX forward curve and
                  voyage requirements.
                </p>

              </div>

            </div>


            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <EconomicsCard
                label="Predicted Hire / Day"
                value={`$${formatMoney(
                  forecast.predicted_hire_per_day
                )}`}
              />

              <EconomicsCard
                label="Charter Hire Cost"
                value={`$${formatMoney(
                  forecast.charter_hire_cost
                )}`}
              />

              <EconomicsCard
                label="Bunker Cost"
                value={`$${formatMoney(
                  forecast.bunker_cost
                )}`}
                icon={<Fuel size={15} />}
              />

              <EconomicsCard
                label="Bunker Fuel"
                value={`${formatNumber(
                  forecast.bunker_fuel_mt
                )} MT`}
              />

            </div>


            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <EconomicsCard
                label="Sea Days"
                value={forecast.sea_days}
              />

              <EconomicsCard
                label="Port Days"
                value={forecast.port_days}
              />

              <EconomicsCard
                label="Total Voyage Days"
                value={
                  forecast.total_voyage_days
                }
                icon={<Clock3 size={15} />}
              />

              <EconomicsCard
                label="VLSFO Price"
                value={`$${formatMoney(
                  forecast.vlsfo_price
                )}`}
              />

            </div>

          </div>


          {/* ================================================= */}
          {/* VOYAGE SUMMARY */}
          {/* ================================================= */}

          <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-6">

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">

              <Summary
                label="Cargo"
                value={`${formatNumber(
                  forecast.cargo_quantity_mt
                )} MT ${forecast.cargo_type}`}
              />

              <Summary
                label="Benchmark Route"
                value={
                  forecast.benchmark_route
                }
              />

              <Summary
                label="Vessel Class"
                value={
                  forecast.vessel_class
                }
              />

              <Summary
                label="Voyage"
                value={`${forecast.loading_port} → ${forecast.discharge_port}`}
              />

              <Summary
                label="Distance"
                value={`${formatNumber(
                  forecast.distance_nm
                )} NM`}
              />

              <Summary
                label="Contract"
                value={
                  forecast.contract_type
                }
              />

              <Summary
                label="Voyages"
                value={
                  forecast.num_voyages
                }
              />

              <Summary
                label="Laycan"
                value={
                  forecast.laycan_window
                }
              />

            </div>

          </div>


          {/* ================================================= */}
          {/* SEVEN DAY FORECAST TABLE */}
          {/* ================================================= */}

          <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#061724]">

            <div className="border-b border-slate-800 p-6">

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="font-semibold">
                    Seven-Day TransX Forecast
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Real predictions returned by
                    the production ML pipeline.
                  </p>

                </div>

                <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-3 py-2">

                  <p className="text-[10px] uppercase tracking-widest text-slate-500">
                    MODEL
                  </p>

                  <p className="text-xs font-semibold text-cyan-400">
                    {forecast.model ||
                      "TransX"}
                  </p>

                </div>

              </div>

            </div>


            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="border-b border-slate-800 bg-slate-900/60">

                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Horizon
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Date
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                      Predicted Rate
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                      Change
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {forecastValues.map(
                    (item, index) => {

                      const previousRate =
                        index === 0
                          ? Number(
                              forecast.latest_actual_rate
                            )
                          : Number(
                              forecastValues[
                                index - 1
                              ].predicted_rate
                            );

                      const difference =
                        getDifference(
                          item.predicted_rate,
                          previousRate
                        );

                      const differencePercent =
                        previousRate
                          ? (difference /
                              previousRate) *
                            100
                          : 0;

                      return (
                        <tr
                          key={`${item.horizon}-${item.date}`}
                          className="border-b border-slate-800 transition hover:bg-slate-900/60"
                        >

                          <td className="px-6 py-4">

                            <span className="rounded-md bg-cyan-500/10 px-2 py-1 text-xs font-semibold text-cyan-400">
                              {item.horizon}
                            </span>

                          </td>


                          <td className="px-6 py-4 text-sm text-slate-300">
                            {formatDate(
                              item.date
                            )}
                          </td>


                          <td className="px-6 py-4 text-right">

                            <span className="text-sm font-semibold text-white">
                              $
                              {formatMoney(
                                item.predicted_rate
                              )}
                            </span>

                          </td>


                          <td className="px-6 py-4 text-right">

                            <span
                              className={`text-xs ${
                                difference >= 0
                                  ? "text-green-400"
                                  : "text-amber-400"
                              }`}
                            >
                              {difference >= 0
                                ? "+"
                                : ""}
                              {differencePercent.toFixed(
                                2
                              )}
                              %
                            </span>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          </div>


          {/* ================================================= */}
          {/* MODEL INFORMATION */}
          {/* ================================================= */}

          <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-6">

            <div className="flex items-start gap-4">

              <div className="rounded-lg bg-cyan-500/10 p-3">

                <Brain
                  size={22}
                  className="text-cyan-400"
                />

              </div>

              <div>

                <h2 className="font-semibold text-white">
                  TransX Production Model
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-400">

                  This forecast is generated
                  by your trained TransX
                  production pipeline. The
                  selected benchmark is{" "}
                  <span className="text-cyan-400">
                    {forecast.benchmark_route}
                  </span>{" "}
                  and the vessel class is{" "}
                  <span className="text-cyan-400">
                    {forecast.vessel_class}
                  </span>
                  .

                </p>

                <div className="mt-4 flex flex-wrap gap-2">

                  <span className="rounded-md border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-400">
                    TransX
                  </span>

                  <span className="rounded-md border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-400">
                    Production
                  </span>

                  <span className="rounded-md border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-400">
                    7-Day Forecast
                  </span>

                  <span className="rounded-md border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-400">
                    PostgreSQL
                  </span>

                  <span className="rounded-md border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-400">
                    Voyage Economics
                  </span>

                </div>

              </div>

            </div>

          </div>

        </>

      )}

    </div>
  );
}


/* ========================================================= */
/* INPUT FIELD */
/* ========================================================= */

function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  suffix,
}) {
  return (
    <div>

      <label className="text-xs font-medium text-slate-400">
        {label}
      </label>

      <div className="relative">

        <input
          type={type}
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          placeholder={placeholder}
          className={`mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400 ${
            suffix ? "pr-14" : ""
          }`}
        />

        {suffix && (
          <span className="absolute right-4 top-1/2 mt-1 -translate-y-1/2 text-xs font-semibold text-slate-500">
            {suffix}
          </span>
        )}

      </div>

    </div>
  );
}


/* ========================================================= */
/* COMMERCIAL CARD */
/* ========================================================= */

function CommercialCard({
  title,
  value,
  suffix,
  icon,
  highlight = false,
}) {
  return (
    <div
      className={`rounded-xl border p-6 transition ${
        highlight
          ? "border-cyan-500/30 bg-cyan-500/10"
          : "border-slate-800 bg-[#061724]"
      }`}
    >

      <div className="flex items-center justify-between">

        <p className="text-xs font-medium tracking-wider text-slate-500">
          {title}
        </p>

        <div
          className={
            highlight
              ? "text-cyan-400"
              : "text-slate-500"
          }
        >
          {icon}
        </div>

      </div>

      <div className="mt-4 flex items-baseline gap-2">

        <h2
          className={`text-3xl font-bold ${
            highlight
              ? "text-cyan-400"
              : "text-white"
          }`}
        >
          {value}
        </h2>

        {suffix && (
          <span className="text-sm text-slate-500">
            {suffix}
          </span>
        )}

      </div>

    </div>
  );
}


/* ========================================================= */
/* ECONOMICS CARD */
/* ========================================================= */

function EconomicsCard({
  label,
  value,
  icon,
}) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">

      <div className="flex items-center gap-2">

        <p className="text-[10px] uppercase tracking-widest text-slate-500">
          {label}
        </p>

        {icon && (
          <span className="text-cyan-400">
            {icon}
          </span>
        )}

      </div>

      <p className="mt-2 text-lg font-semibold text-white">
        {value}
      </p>

    </div>
  );
}


/* ========================================================= */
/* SUMMARY */
/* ========================================================= */

function Summary({
  label,
  value,
}) {
  return (
    <div>

      <p className="text-[10px] uppercase tracking-widest text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-200">
        {value || "—"}
      </p>

    </div>
  );
}


export default Forecast;