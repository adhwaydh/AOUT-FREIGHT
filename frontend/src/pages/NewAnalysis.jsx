import { API_URL } from "../config/api";
import { useEffect, useRef, useState } from "react";

import {
  ArrowRight,
  Anchor,
  CalendarDays,
  Ship,
  Package,
  MapPin,
  Sparkles,
  Navigation,
  Clock3,
  Route,
  CheckCircle2,
  TrendingUp,
  RotateCcw,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import CargoShip from "../components/CargoShip";


/* =====================================================
   SVG ROUTE
===================================================== */

const ROUTE_PATH =
  "M70 230 C150 200, 180 240, 255 160 S380 95, 440 55";


/* =====================================================
   CHART FORMATTER
===================================================== */

const formatChartRate = (value) => {

  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return `$${Math.round(value / 1000)}k`;
};


/* =====================================================
   COMPONENT
===================================================== */

function NewAnalysis() {

  // ===================================================
  // FORM STATE
  // ===================================================

  const [form, setForm] = useState({
    origin: "",
    destination: "",
    commodity: "",
    vessel_type: "",
    cargo_quantity: "",
    period: "30 Days",
  });


  // ===================================================
  // PAGE STATE
  // ===================================================

  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState(null);

  const [error, setError] = useState("");


  // ===================================================
  // SHIP ANIMATION REFS
  // ===================================================

  const routePathRef = useRef(null);

  const animationFrameRef = useRef(null);

  const animationStartRef = useRef(null);


  // ===================================================
  // SHIP POSITION
  // ===================================================

  const [shipPosition, setShipPosition] = useState({
    x: 70,
    y: 230,
    angle: -20,
  });


  // ===================================================
  // SHIP ROUTE ANIMATION
  // ===================================================

  useEffect(() => {

    const path = routePathRef.current;

    if (!path) {
      return;
    }


    const totalLength =
      path.getTotalLength();


    const duration = 10000;


    const animate = (timestamp) => {

      if (!animationStartRef.current) {

        animationStartRef.current =
          timestamp;

      }


      const elapsed =
        timestamp -
        animationStartRef.current;


      /*
       * Travel from origin to destination,
       * then return continuously.
       */

      const cycle =
        (elapsed % (duration * 2)) /
        duration;


      const progress =
        cycle <= 1
          ? cycle
          : 2 - cycle;


      const currentLength =
        progress * totalLength;


      const point =
        path.getPointAtLength(
          currentLength
        );


      /*
       * Look slightly ahead to determine
       * the direction of the route.
       */

      const lookAheadLength =
        Math.min(
          currentLength + 2,
          totalLength
        );


      const nextPoint =
        path.getPointAtLength(
          lookAheadLength
        );


      const angle =
        Math.atan2(
          nextPoint.y - point.y,
          nextPoint.x - point.x
        ) *
        (180 / Math.PI);


      setShipPosition({
        x: point.x,
        y: point.y,
        angle,
      });


      animationFrameRef.current =
        requestAnimationFrame(
          animate
        );

    };


    animationFrameRef.current =
      requestAnimationFrame(
        animate
      );


    return () => {

      if (animationFrameRef.current) {

        cancelAnimationFrame(
          animationFrameRef.current
        );

      }

      animationStartRef.current =
        null;

    };

  }, []);


  // ===================================================
  // INPUT HANDLER
  // ===================================================

  const handleChange = (event) => {

    const {
      name,
      value,
    } = event.target;


    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

  };


  // ===================================================
  // RESET
  // ===================================================

  const resetAnalysis = () => {

    setResult(null);

    setError("");

  };


  // ===================================================
  // RUN ANALYSIS
  // ===================================================

  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");

    setResult(null);


    // -------------------------------------------------
    // VALIDATION
    // -------------------------------------------------

    if (
      !form.origin.trim() ||
      !form.destination.trim() ||
      !form.commodity ||
      !form.vessel_type ||
      !form.cargo_quantity
    ) {

      setError(
        "Please complete all required shipment fields."
      );

      return;

    }


    if (
      Number(form.cargo_quantity) <= 0
    ) {

      setError(
        "Cargo quantity must be greater than zero."
      );

      return;

    }


    // -------------------------------------------------
    // API REQUEST
    // -------------------------------------------------

    try {

      setLoading(true);


      const response = await fetch(
        `${API_URL}/api/forecast`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            origin:
              form.origin.trim(),

            destination:
              form.destination.trim(),

            commodity:
              form.commodity,

            vessel_type:
              form.vessel_type,

            cargo_quantity:
              Number(
                form.cargo_quantity
              ),

            period:
              form.period,

          }),
        }
      );


      if (!response.ok) {

        let message =
          "Analysis request failed.";


        try {

          const errorData =
            await response.json();


          if (
            errorData?.detail
          ) {

            message =
              Array.isArray(
                errorData.detail
              )
                ? errorData.detail
                    .map(
                      (item) =>
                        item.msg
                    )
                    .join(", ")
                : errorData.detail;

          }

        } catch {
          // Keep default error.
        }


        throw new Error(
          message
        );

      }


      const data =
        await response.json();


      console.log(
        "Forecast API response:",
        data
      );


      setResult(data);

    } catch (err) {

      console.error(
        "Forecast error:",
        err
      );


      setError(
        err.message ||
        "Unable to connect to the analysis service."
      );

    } finally {

      setLoading(false);

    }

  };


  // ===================================================
  // FORMAT NUMBER
  // ===================================================

  const formatNumber = (value) => {

    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {

      return "—";

    }


    return Number(
      value
    ).toLocaleString();

  };


  // ===================================================
  // FORMAT MONEY
  // ===================================================

  const formatMoney = (value) => {

    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {

      return "—";

    }


    return `$${Number(
      value
    ).toLocaleString()}`;

  };


  // ===================================================
  // SHIP POSITION
  // ===================================================

  const shipLeft =
    `${(shipPosition.x / 500) * 100}%`;


  const shipTop =
    `${(shipPosition.y / 300) * 100}%`;


  // ===================================================
  // RENDER
  // ===================================================

  return (

    <div className="mx-auto max-w-[1500px] space-y-6">


      {/* =================================================
          HEADER
      ================================================= */}

      <section>

        <div className="flex items-center gap-2">

          <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />

          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Freight Analysis
          </p>

        </div>


        <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">

          <div>

            <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
              New Freight Analysis
            </h1>


            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Configure a shipment scenario and
              generate freight market intelligence.
            </p>

          </div>


          {result && (

            <button
              type="button"
              onClick={resetAnalysis}
              className="flex w-fit items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-medium text-slate-400 transition hover:border-cyan-500/30 hover:text-cyan-400"
            >

              <RotateCcw
                size={13}
              />

              New Analysis

            </button>

          )}

        </div>

      </section>


      {/* =================================================
          MAIN GRID
      ================================================= */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_500px]">


        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-slate-800 bg-[#061724] p-6"
        >

          {/* FORM HEADER */}

          <div className="flex items-center gap-3 border-b border-slate-800 pb-5">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">

              <Anchor
                size={18}
                className="text-cyan-400"
              />

            </div>


            <div>

              <h2 className="font-semibold text-white">
                Shipment Parameters
              </h2>


              <p className="mt-1 text-[10px] text-slate-600">
                Enter the details for your freight scenario.
              </p>

            </div>

          </div>


          {/* =================================================
              ROUTE
          ================================================= */}

          <div className="mt-6">

            <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-600">
              Route
            </p>


            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">


              {/* ORIGIN */}

              <div>

                <label className="mb-2 block text-[9px] font-semibold uppercase tracking-wider text-slate-500">
                  Origin Port
                </label>


                <div className="relative">

                  <MapPin
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                  />


                  <input
                    name="origin"
                    value={form.origin}
                    onChange={handleChange}
                    placeholder="e.g. Singapore"
                    autoComplete="off"
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 py-3 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-cyan-500/50"
                  />

                </div>

              </div>


              {/* DESTINATION */}

              <div>

                <label className="mb-2 block text-[9px] font-semibold uppercase tracking-wider text-slate-500">
                  Destination Port
                </label>


                <div className="relative">

                  <MapPin
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                  />


                  <input
                    name="destination"
                    value={form.destination}
                    onChange={handleChange}
                    placeholder="e.g. Visakhapatnam"
                    autoComplete="off"
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 py-3 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-cyan-500/50"
                  />

                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              CARGO & VESSEL
          ================================================= */}

          <div className="mt-7">

            <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-600">
              Cargo & Vessel
            </p>


            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">


              {/* COMMODITY */}

              <div>

                <label className="mb-2 block text-[9px] font-semibold uppercase tracking-wider text-slate-500">
                  Commodity
                </label>


                <div className="relative">

                  <Package
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                  />


                  <select
                    name="commodity"
                    value={form.commodity}
                    onChange={handleChange}
                    className="w-full appearance-none rounded-lg border border-slate-800 bg-slate-900 py-3 pl-10 pr-3 text-sm text-white outline-none transition focus:border-cyan-500/50"
                  >

                    <option value="">
                      Select commodity
                    </option>

                    <option value="Iron Ore">
                      Iron Ore
                    </option>

                    <option value="Coal">
                      Coal
                    </option>

                    <option value="Grain">
                      Grain
                    </option>

                    <option value="Steel">
                      Steel
                    </option>

                  </select>

                </div>

              </div>


              {/* VESSEL TYPE */}

              <div>

                <label className="mb-2 block text-[9px] font-semibold uppercase tracking-wider text-slate-500">
                  Vessel Type
                </label>


                <div className="relative">

                  <Ship
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                  />


                  <select
                    name="vessel_type"
                    value={form.vessel_type}
                    onChange={handleChange}
                    className="w-full appearance-none rounded-lg border border-slate-800 bg-slate-900 py-3 pl-10 pr-3 text-sm text-white outline-none transition focus:border-cyan-500/50"
                  >

                    <option value="">
                      Select vessel type
                    </option>

                    <option value="Capesize">
                      Capesize
                    </option>

                    <option value="Panamax">
                      Panamax
                    </option>

                    <option value="Supramax">
                      Supramax
                    </option>

                    <option value="Handysize">
                      Handysize
                    </option>

                  </select>

                </div>

              </div>

            </div>


            {/* CARGO QUANTITY */}

            <div className="mt-5">

              <label className="mb-2 block text-[9px] font-semibold uppercase tracking-wider text-slate-500">
                Cargo Quantity
              </label>


              <div className="relative">

                <Package
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                />


                <input
                  name="cargo_quantity"
                  value={form.cargo_quantity}
                  onChange={handleChange}
                  type="number"
                  min="1"
                  step="1"
                  placeholder="e.g. 180000"
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 py-3 pl-10 pr-16 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-cyan-500/50"
                />


                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-slate-600">
                  DWT
                </span>

              </div>

            </div>

          </div>


          {/* =================================================
              FORECAST PERIOD
          ================================================= */}

          <div className="mt-7">

            <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-600">
              Forecast
            </p>


            <label className="mb-2 block text-[9px] font-semibold uppercase tracking-wider text-slate-500">
              Forecast Period
            </label>


            <div className="relative">

              <CalendarDays
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
              />


              <select
                name="period"
                value={form.period}
                onChange={handleChange}
                className="w-full appearance-none rounded-lg border border-slate-800 bg-slate-900 py-3 pl-10 pr-3 text-sm text-white outline-none transition focus:border-cyan-500/50"
              >

                <option value="7 Days">
                  7 Days
                </option>

                <option value="30 Days">
                  30 Days
                </option>

                <option value="60 Days">
                  60 Days
                </option>

                <option value="90 Days">
                  90 Days
                </option>

              </select>

            </div>

          </div>


          {/* =================================================
              ERROR
          ================================================= */}

          {error && (

            <div className="mt-5 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3">

              <p className="text-xs font-medium text-red-400">
                {error}
              </p>

            </div>

          )}


          {/* =================================================
              RUN BUTTON
          ================================================= */}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-500 px-5 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          >

            {loading ? (

              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />

                Running Analysis...

              </>

            ) : (

              <>
                <Sparkles
                  size={16}
                />

                Run Freight Analysis

                <ArrowRight
                  size={16}
                />

              </>

            )}

          </button>


          <p className="mt-3 text-center text-[9px] text-slate-700">
            Analysis results are decision-support information.
          </p>

        </form>


        {/* =================================================
            RIGHT PANEL
        ================================================= */}

        <div className="rounded-xl border border-slate-800 bg-[#061724] p-6">


          {!result ? (

            /* =================================================
               ROUTE PREVIEW
            ================================================= */

            <div>

              <div className="flex items-start justify-between">

                <div>

                  <h2 className="font-semibold text-white">
                    Live Route Preview
                  </h2>


                  <p className="mt-1 text-xs text-slate-500">
                    Vessel movement simulation
                  </p>

                </div>


                <Navigation
                  size={18}
                  className="text-cyan-400"
                />

              </div>


              {/* =================================================
                  MAP
              ================================================= */}

              <div className="relative mt-6 h-[320px] overflow-hidden rounded-xl border border-slate-800 bg-[#03121f]">


                {/* Grid */}

                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(34,211,238,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,.08) 1px, transparent 1px)",
                    backgroundSize:
                      "35px 35px",
                  }}
                />


                {/* Glow */}

                <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/5 blur-3xl" />


                {/* =================================================
                    SVG ROUTE
                ================================================= */}

                <svg
                  className="absolute inset-0 h-full w-full"
                  viewBox="0 0 500 300"
                  preserveAspectRatio="none"
                >

                  {/* Glow */}

                  <path
                    d={ROUTE_PATH}
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="10"
                    opacity="0.05"
                  />


                  {/* Route */}

                  <path
                    ref={routePathRef}
                    d={ROUTE_PATH}
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="2"
                    strokeDasharray="7 8"
                  />

                </svg>


                {/* =================================================
                    ORIGIN
                ================================================= */}

                <div
                  className="absolute z-20"
                  style={{
                    left: "14%",
                    top: "69%",
                    transform:
                      "translate(-50%, -50%)",
                  }}
                >

                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-500/10 shadow-[0_0_20px_rgba(34,211,238,.15)]">

                    <MapPin
                      size={15}
                      className="text-cyan-400"
                    />

                  </div>


                  <p className="mt-2 max-w-[100px] truncate text-center text-[9px] font-semibold text-cyan-400">
                    {form.origin ||
                      "ORIGIN"}
                  </p>

                </div>


                {/* =================================================
                    DESTINATION
                ================================================= */}

                <div className="absolute right-[6%] top-[10%] z-20">

                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-400 bg-cyan-400/10 shadow-[0_0_25px_rgba(34,211,238,.3)]">

                    <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-400" />

                  </div>


                  <p className="mt-2 max-w-[110px] truncate text-center text-[9px] font-semibold text-white">
                    {form.destination ||
                      "DESTINATION"}
                  </p>

                </div>


                {/* =================================================
                    MOVING SHIP
                ================================================= */}

                <div
                  className="pointer-events-none absolute z-30"
                  style={{
                    left:
                      shipLeft,

                    top:
                      shipTop,

                    transform: `
                      translate(-50%, -50%)
                      rotate(${shipPosition.angle}deg)
                    `,

                    transformOrigin:
                      "center center",

                    transition:
                      "left 0.08s linear, top 0.08s linear, transform 0.08s linear",
                  }}
                >

                  <CargoShip
                    size={145}
                    animated={true}
                  />

                </div>


                {/* =================================================
                    STATUS
                ================================================= */}

                <div className="absolute bottom-4 left-1/2 z-40 -translate-x-1/2 whitespace-nowrap rounded-full border border-slate-700 bg-slate-950/90 px-4 py-2 shadow-xl backdrop-blur">

                  <div className="flex items-center gap-2">

                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />

                    <span className="text-[9px] font-medium text-slate-400">

                      {form.vessel_type
                        ? `${form.vessel_type} • Sailing`
                        : "Vessel • Ready"}

                    </span>

                  </div>

                </div>

              </div>


              {/* =================================================
                  ROUTE INFORMATION
              ================================================= */}

              <div className="mt-4 grid grid-cols-3 gap-2">


                {/* Vessel */}

                <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">

                  <div className="flex items-center gap-1.5">

                    <Ship
                      size={11}
                      className="text-slate-600"
                    />

                    <span className="text-[8px] text-slate-600">
                      VESSEL
                    </span>

                  </div>


                  <p className="mt-2 truncate text-[10px] font-medium text-slate-300">
                    {form.vessel_type ||
                      "—"}
                  </p>

                </div>


                {/* Cargo */}

                <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">

                  <div className="flex items-center gap-1.5">

                    <Package
                      size={11}
                      className="text-slate-600"
                    />

                    <span className="text-[8px] text-slate-600">
                      CARGO
                    </span>

                  </div>


                  <p className="mt-2 truncate text-[10px] font-medium text-slate-300">

                    {form.cargo_quantity
                      ? `${formatNumber(
                          form.cargo_quantity
                        )} DWT`
                      : "—"}

                  </p>

                </div>


                {/* Period */}

                <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">

                  <div className="flex items-center gap-1.5">

                    <Clock3
                      size={11}
                      className="text-slate-600"
                    />

                    <span className="text-[8px] text-slate-600">
                      PERIOD
                    </span>

                  </div>


                  <p className="mt-2 truncate text-[10px] font-medium text-slate-300">
                    {form.period}
                  </p>

                </div>

              </div>


              {/* Status */}

              <div className="mt-5 flex items-center justify-center gap-2">

                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />

                <span className="text-[8px] text-slate-600">
                  Route simulation active
                </span>

              </div>

            </div>

          ) : (

            /* =================================================
               RESULT
            ================================================= */

            <div>


              {/* RESULT HEADER */}

              <div className="flex items-center gap-2">

                <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />

                <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-green-400">
                  Analysis Complete
                </p>

              </div>


              <div className="mt-3 flex items-start justify-between gap-3">

                <div>

                  <h2 className="text-xl font-bold text-white">
                    Freight Forecast
                  </h2>


                  <p className="mt-1 text-xs text-slate-600">

                    {result.origin}

                    <span className="mx-2 text-cyan-400">
                      →
                    </span>

                    {result.destination}

                  </p>

                </div>


                <CheckCircle2
                  size={22}
                  className="shrink-0 text-green-400"
                />

              </div>


              {/* =================================================
                  TAGS
              ================================================= */}

              <div className="mt-4 flex flex-wrap gap-2">

                <span className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5 text-[9px] text-slate-400">
                  {result.commodity}
                </span>


                <span className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5 text-[9px] text-slate-400">
                  {result.vessel_type}
                </span>


                <span className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5 text-[9px] text-slate-400">

                  {formatNumber(
                    result.cargo_quantity
                  )}

                  {" "}DWT

                </span>


                <span className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5 text-[9px] text-slate-400">
                  {result.period}
                </span>

              </div>


              {/* =================================================
                  FORECAST RATE
              ================================================= */}

              <div className="mt-6 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5">

                <p className="text-[9px] uppercase tracking-wider text-slate-600">
                  Predicted Freight Rate
                </p>


                <p className="mt-2 text-3xl font-bold text-cyan-400">

                  {formatMoney(
                    result.predicted_rate
                  )}

                </p>


                <p className="mt-1 text-[10px] text-slate-600">
                  per day
                </p>


                <div className="mt-4 flex items-center justify-between">

                  <span className="text-[9px] text-slate-600">
                    Expected Change
                  </span>


                  <span className="flex items-center gap-1 text-xs font-semibold text-green-400">

                    <TrendingUp
                      size={12}
                    />

                    +{result.change_percent}%

                  </span>

                </div>

              </div>


              {/* =================================================
                  FORECAST CHART
              ================================================= */}

              <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/40 p-4">

                <div className="flex items-start justify-between">

                  <div>

                    <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-600">
                      Freight Rate Forecast
                    </p>


                    <p className="mt-1 text-[10px] text-slate-500">
                      Expected rate movement
                    </p>

                  </div>


                  <div className="flex items-center gap-2">

                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />

                    <span className="text-[8px] text-slate-600">
                      FORECAST
                    </span>

                  </div>

                </div>


                {/* Chart */}

                <div className="mt-5 h-[230px] w-full">

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >

                    <AreaChart
                      data={
                        result.forecast_curve ||
                        []
                      }
                      margin={{
                        top: 10,
                        right: 5,
                        left: -15,
                        bottom: 0,
                      }}
                    >

                      <defs>

                        <linearGradient
                          id="forecastFill"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >

                          <stop
                            offset="0%"
                            stopColor="#22d3ee"
                            stopOpacity={0.22}
                          />

                          <stop
                            offset="100%"
                            stopColor="#22d3ee"
                            stopOpacity={0}
                          />

                        </linearGradient>

                      </defs>


                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#172b38"
                        vertical={false}
                      />


                      <XAxis
                        dataKey="label"
                        tick={{
                          fill: "#64748b",
                          fontSize: 9,
                        }}
                        axisLine={false}
                        tickLine={false}
                      />


                      <YAxis
                        tickFormatter={
                          formatChartRate
                        }
                        tick={{
                          fill: "#64748b",
                          fontSize: 9,
                        }}
                        axisLine={false}
                        tickLine={false}
                        width={42}
                        domain={[
                          "auto",
                          "auto",
                        ]}
                      />


                      <Tooltip
                        contentStyle={{
                          backgroundColor:
                            "#071923",
                          border:
                            "1px solid #1e3542",
                          borderRadius:
                            "8px",
                          fontSize:
                            "10px",
                        }}
                        labelStyle={{
                          color:
                            "#94a3b8",
                          marginBottom:
                            "4px",
                        }}
                        formatter={(
                          value
                        ) => [
                          `$${Number(
                            value
                          ).toLocaleString()}`,
                          "Freight Rate",
                        ]}
                      />


                      <Area
                        type="monotone"
                        dataKey="rate"
                        stroke="#22d3ee"
                        strokeWidth={2}
                        fill="url(#forecastFill)"
                        dot={{
                          r: 3,
                          fill: "#22d3ee",
                          strokeWidth: 0,
                        }}
                        activeDot={{
                          r: 5,
                        }}
                      />

                    </AreaChart>

                  </ResponsiveContainer>

                </div>


                {/* Chart Footer */}

                <div className="mt-2 flex items-center justify-between border-t border-slate-800 pt-3">

                  <span className="text-[8px] text-slate-700">
                    Current market
                  </span>


                  <span className="text-[8px] text-slate-700">
                    Forecast horizon:{" "}
                    {result.period}
                  </span>

                </div>

              </div>


              {/* =================================================
                  STATS
              ================================================= */}

              <div className="mt-4 grid grid-cols-2 gap-3">


                {/* Current rate */}

                <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">

                  <p className="text-[8px] uppercase tracking-wider text-slate-600">
                    Current Rate
                  </p>


                  <p className="mt-2 text-lg font-bold text-white">

                    {formatMoney(
                      result.current_rate
                    )}

                  </p>


                  <p className="mt-1 text-[9px] text-slate-600">
                    per day
                  </p>

                </div>


                {/* Confidence */}

                <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">

                  <p className="text-[8px] uppercase tracking-wider text-slate-600">
                    Confidence
                  </p>


                  <p className="mt-2 text-lg font-bold text-green-400">
                    {result.confidence}%
                  </p>


                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-800">

                    <div
                      className="h-full rounded-full bg-green-400"
                      style={{
                        width: `${Math.min(
                          Math.max(
                            Number(
                              result.confidence
                            ) || 0,
                            0
                          ),
                          100
                        )}%`,
                      }}
                    />

                  </div>

                </div>

              </div>


              {/* =================================================
                  RECOMMENDATION
              ================================================= */}

              <div className="mt-4 rounded-lg border border-green-500/20 bg-green-500/5 p-4">

                <p className="text-[8px] uppercase tracking-wider text-slate-600">
                  Recommendation
                </p>


                <p className="mt-2 text-sm font-bold text-green-400">
                  {result.recommendation}
                </p>


                <p className="mt-2 text-[9px] leading-4 text-slate-500">
                  {result.message}
                </p>

              </div>


              {/* =================================================
                  ANALYZED ROUTE
              ================================================= */}

              <div className="mt-4 rounded-lg border border-slate-800 bg-slate-900/40 p-4">

                <div className="flex items-center gap-2">

                  <Route
                    size={14}
                    className="text-cyan-400"
                  />

                  <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">
                    Analyzed Route
                  </p>

                </div>


                <div className="mt-4 flex items-center justify-between">

                  <div>

                    <p className="text-[8px] text-slate-600">
                      ORIGIN
                    </p>


                    <p className="mt-1 text-xs font-medium text-white">
                      {result.origin}
                    </p>

                  </div>


                  <ArrowRight
                    size={16}
                    className="text-cyan-400"
                  />


                  <div className="text-right">

                    <p className="text-[8px] text-slate-600">
                      DESTINATION
                    </p>


                    <p className="mt-1 text-xs font-medium text-white">
                      {result.destination}
                    </p>

                  </div>

                </div>

              </div>


              {/* =================================================
                  RUN AGAIN
              ================================================= */}

              <button
                type="button"
                onClick={resetAnalysis}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900 py-3 text-xs font-medium text-slate-400 transition hover:border-cyan-500/30 hover:text-cyan-400"
              >

                <RotateCcw
                  size={13}
                />

                Run Another Analysis

              </button>

            </div>

          )}

        </div>

      </div>


      {/* =================================================
          INTEGRATION FOOTER
      ================================================= */}

      <section className="rounded-xl border border-slate-800 bg-[#061724] p-5">

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div className="flex items-start gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10">

              <Sparkles
                size={16}
                className="text-cyan-400"
              />

            </div>


            <div>

              <p className="text-xs font-medium text-slate-300">
                Forecast Integration
              </p>


              <p className="mt-1 max-w-3xl text-[9px] leading-4 text-slate-600">
                The current analysis uses demonstration
                forecast data. The API structure is ready
                for your team's forecasting model to replace
                the temporary values later.
              </p>

            </div>

          </div>


          <div className="flex shrink-0 items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2">

            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />

            <span className="text-[9px] text-slate-500">
              ML integration ready
            </span>

          </div>

        </div>

      </section>

    </div>
  );
}


export default NewAnalysis;