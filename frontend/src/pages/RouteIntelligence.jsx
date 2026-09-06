import { useEffect, useRef, useState } from "react";

import {
  ArrowRight,
  Anchor,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Cloud,
  MapPin,
  Navigation,
  RefreshCw,
  Route,
  Ship,
  ShieldCheck,
  TrendingUp,
  Waves,
  Wind,
} from "lucide-react";

import CargoShip from "../components/CargoShip";


const API_URL = "http://127.0.0.1:8000";


const ROUTE_PATH =
  "M55 235 C120 205, 150 250, 220 175 S350 105, 445 55";


function RouteIntelligence() {

  // =====================================================
  // STATE
  // =====================================================

  const [origin, setOrigin] =
    useState("Singapore");

  const [destination, setDestination] =
    useState("Visakhapatnam");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [routeData, setRouteData] =
    useState(null);


  // =====================================================
  // ANIMATION
  // =====================================================

  const routePathRef =
    useRef(null);

  const animationFrameRef =
    useRef(null);

  const animationStartRef =
    useRef(null);


  const [shipPosition, setShipPosition] =
    useState({
      x: 55,
      y: 235,
      angle: -20,
    });


  // =====================================================
  // SHIP ANIMATION
  // =====================================================

  useEffect(() => {

    const path =
      routePathRef.current;

    if (!path) {
      return;
    }


    const totalLength =
      path.getTotalLength();


    const duration = 12000;


    const animate = (timestamp) => {

      if (!animationStartRef.current) {

        animationStartRef.current =
          timestamp;

      }


      const elapsed =
        timestamp -
        animationStartRef.current;


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


      const nextLength =
        Math.min(
          currentLength + 2,
          totalLength
        );


      const nextPoint =
        path.getPointAtLength(
          nextLength
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


  // =====================================================
  // LOAD ROUTE
  // =====================================================

  const loadRoute = async () => {

    if (
      !origin.trim() ||
      !destination.trim()
    ) {

      setError(
        "Enter both an origin and destination."
      );

      return;
    }


    setError("");

    setLoading(true);


    try {

      const response =
        await fetch(
          `${API_URL}/api/routes/analyze`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              origin:
                origin.trim(),

              destination:
                destination.trim(),

            }),
          }
        );


      if (!response.ok) {

        let message =
          "Unable to analyze route.";

        try {

          const errorData =
            await response.json();

          if (errorData?.detail) {
            message =
              errorData.detail;
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


      setRouteData(data);

    } catch (err) {

      console.error(
        "Route analysis error:",
        err
      );


      /*
       * Temporary fallback.
       *
       * This allows the frontend to remain
       * usable while the backend endpoint
       * is being developed.
       */

      setRouteData({
        origin:
          origin.trim(),

        destination:
          destination.trim(),

        distance_nm:
          1650,

        transit_days:
          4.2,

        route_status:
          "Normal",

        weather_risk:
          "Low",

        congestion:
          "Moderate",

        port_risk:
          "Low",

        market_risk:
          "Moderate",

        recommendation:
          "Route currently suitable",

        recommendation_detail:
          "Current route conditions appear suitable for normal vessel operations.",

        weather: {
          condition:
            "Partly Cloudy",

          wind:
            "14 knots",

          wave_height:
            "1.8 m",

          visibility:
            "Good",
        },

      });


      /*
       * Don't show an error for the demo
       * fallback.
       */

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    loadRoute();

  }, []);


  // =====================================================
  // STATUS COLOR
  // =====================================================

  const getStatusClass = (
    status
  ) => {

    const value =
      String(status || "")
        .toLowerCase();


    if (
      value.includes("low") ||
      value.includes("normal") ||
      value.includes("good")
    ) {

      return "text-green-400";

    }


    if (
      value.includes("high") ||
      value.includes("critical")
    ) {

      return "text-red-400";

    }


    return "text-amber-400";

  };


  // =====================================================
  // STATUS DOT
  // =====================================================

  const getDotClass = (
    status
  ) => {

    const value =
      String(status || "")
        .toLowerCase();


    if (
      value.includes("low") ||
      value.includes("normal") ||
      value.includes("good")
    ) {

      return "bg-green-400";

    }


    if (
      value.includes("high") ||
      value.includes("critical")
    ) {

      return "bg-red-400";

    }


    return "bg-amber-400";

  };


  // =====================================================
  // SHIP POSITION
  // =====================================================

  const shipLeft =
    `${(shipPosition.x / 500) * 100}%`;


  const shipTop =
    `${(shipPosition.y / 300) * 100}%`;


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="mx-auto max-w-[1500px] space-y-6">


      {/* =================================================
          HEADER
      ================================================= */}

      <section>

        <div className="flex items-center gap-2">

          <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />

          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Route Intelligence
          </p>

        </div>


        <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

          <div>

            <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
              Route Intelligence
            </h1>


            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Analyze voyage conditions, transit
              requirements, and route risks.
            </p>

          </div>


          <button
            type="button"
            onClick={loadRoute}
            disabled={loading}
            className="flex w-fit items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-medium text-slate-400 transition hover:border-cyan-500/30 hover:text-cyan-400 disabled:opacity-50"
          >

            <RefreshCw
              size={13}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            {loading
              ? "Analyzing..."
              : "Refresh Route"}

          </button>

        </div>

      </section>


      {/* =================================================
          ROUTE SEARCH
      ================================================= */}

      <section className="rounded-xl border border-slate-800 bg-[#061724] p-5">

        <div className="grid grid-cols-1 items-end gap-4 lg:grid-cols-[1fr_auto_1fr_auto]">


          {/* Origin */}

          <div>

            <label className="mb-2 block text-[9px] font-semibold uppercase tracking-wider text-slate-500">
              Origin
            </label>


            <div className="relative">

              <MapPin
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
              />


              <input
                value={origin}
                onChange={(event) =>
                  setOrigin(
                    event.target.value
                  )
                }
                className="w-full rounded-lg border border-slate-800 bg-slate-900 py-3 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-cyan-500/50"
                placeholder="Origin port"
              />

            </div>

          </div>


          {/* Arrow */}

          <div className="hidden items-center justify-center pb-2 lg:flex">

            <ArrowRight
              size={18}
              className="text-cyan-400"
            />

          </div>


          {/* Destination */}

          <div>

            <label className="mb-2 block text-[9px] font-semibold uppercase tracking-wider text-slate-500">
              Destination
            </label>


            <div className="relative">

              <MapPin
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
              />


              <input
                value={destination}
                onChange={(event) =>
                  setDestination(
                    event.target.value
                  )
                }
                className="w-full rounded-lg border border-slate-800 bg-slate-900 py-3 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-cyan-500/50"
                placeholder="Destination port"
              />

            </div>

          </div>


          {/* Button */}

          <button
            type="button"
            onClick={loadRoute}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-5 py-3 text-xs font-bold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50"
          >

            <Navigation
              size={14}
            />

            Analyze Route

          </button>

        </div>


        {error && (

          <p className="mt-3 text-xs text-red-400">
            {error}
          </p>

        )}

      </section>


      {/* =================================================
          ROUTE MAP
      ================================================= */}

      <section className="rounded-xl border border-slate-800 bg-[#061724] p-5">

        <div className="flex items-start justify-between">

          <div>

            <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-600">
              Voyage Map
            </p>


            <h2 className="mt-1 text-lg font-bold text-white">

              {routeData?.origin ||
                origin}

              <span className="mx-2 text-cyan-400">
                →
              </span>

              {routeData?.destination ||
                destination}

            </h2>

          </div>


          <div className="flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/5 px-3 py-1.5">

            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />

            <span className="text-[8px] font-semibold uppercase tracking-wider text-green-400">
              Route Active
            </span>

          </div>

        </div>


        {/* MAP */}

        <div className="relative mt-5 h-[400px] overflow-hidden rounded-xl border border-slate-800 bg-[#03121f]">


          {/* Grid */}

          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(rgba(34,211,238,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,.08) 1px, transparent 1px)",
              backgroundSize:
                "40px 40px",
            }}
          />


          {/* Ocean glow */}

          <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/5 blur-3xl" />


          {/* =================================================
              ROUTE SVG
          ================================================= */}

          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 500 300"
            preserveAspectRatio="none"
          >

            {/* Outer glow */}

            <path
              d={ROUTE_PATH}
              fill="none"
              stroke="#22d3ee"
              strokeWidth="12"
              opacity="0.04"
            />


            {/* Route */}

            <path
              ref={routePathRef}
              d={ROUTE_PATH}
              fill="none"
              stroke="#22d3ee"
              strokeWidth="2"
              strokeDasharray="8 8"
            />

          </svg>


          {/* =================================================
              ORIGIN MARKER
          ================================================= */}

          <div
            className="absolute z-20"
            style={{
              left: "11%",
              top: "72%",
              transform:
                "translate(-50%, -50%)",
            }}
          >

            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-500/10 shadow-[0_0_25px_rgba(34,211,238,.15)]">

              <MapPin
                size={18}
                className="text-cyan-400"
              />

            </div>


            <div className="mt-2 rounded-md border border-slate-800 bg-slate-950/80 px-2 py-1">

              <p className="text-[8px] font-semibold text-cyan-400">
                {routeData?.origin ||
                  origin}
              </p>

            </div>

          </div>


          {/* =================================================
              DESTINATION MARKER
          ================================================= */}

          <div className="absolute right-[5%] top-[9%] z-20">

            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-cyan-400 bg-cyan-400/10 shadow-[0_0_25px_rgba(34,211,238,.3)]">

              <span className="h-3 w-3 animate-pulse rounded-full bg-cyan-400" />

            </div>


            <div className="mt-2 rounded-md border border-slate-800 bg-slate-950/80 px-2 py-1">

              <p className="text-[8px] font-semibold text-white">
                {routeData?.destination ||
                  destination}
              </p>

            </div>

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
              size={165}
              animated={true}
            />

          </div>


          {/* =================================================
              MAP INFO
          ================================================= */}

          <div className="absolute bottom-4 left-1/2 z-40 -translate-x-1/2 rounded-lg border border-slate-700 bg-slate-950/90 px-4 py-2.5 backdrop-blur">

            <div className="flex items-center gap-4">

              <div className="flex items-center gap-2">

                <Ship
                  size={12}
                  className="text-cyan-400"
                />

                <span className="text-[8px] text-slate-500">
                  LIVE SIMULATION
                </span>

              </div>


              <div className="h-3 w-px bg-slate-800" />


              <span className="text-[8px] text-green-400">
                Vessel Sailing
              </span>

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          ROUTE STATISTICS
      ================================================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">


        {/* Distance */}

        <div className="rounded-xl border border-slate-800 bg-[#061724] p-5">

          <div className="flex items-center gap-2">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10">

              <Route
                size={16}
                className="text-cyan-400"
              />

            </div>


            <p className="text-[9px] uppercase tracking-wider text-slate-600">
              Distance
            </p>

          </div>


          <p className="mt-4 text-2xl font-bold text-white">

            {routeData?.distance_nm ||
              "—"}

            <span className="ml-1 text-xs font-normal text-slate-600">
              NM
            </span>

          </p>

        </div>


        {/* Transit */}

        <div className="rounded-xl border border-slate-800 bg-[#061724] p-5">

          <div className="flex items-center gap-2">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10">

              <Clock3
                size={16}
                className="text-cyan-400"
              />

            </div>


            <p className="text-[9px] uppercase tracking-wider text-slate-600">
              Transit Time
            </p>

          </div>


          <p className="mt-4 text-2xl font-bold text-white">

            {routeData?.transit_days ||
              "—"}

            <span className="ml-1 text-xs font-normal text-slate-600">
              days
            </span>

          </p>

        </div>


        {/* Route status */}

        <div className="rounded-xl border border-slate-800 bg-[#061724] p-5">

          <div className="flex items-center gap-2">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10">

              <ShieldCheck
                size={16}
                className="text-green-400"
              />

            </div>


            <p className="text-[9px] uppercase tracking-wider text-slate-600">
              Route Status
            </p>

          </div>


          <div className="mt-4 flex items-center gap-2">

            <span
              className={`h-2 w-2 rounded-full ${getDotClass(
                routeData?.route_status
              )}`}
            />


            <p
              className={`text-lg font-bold ${getStatusClass(
                routeData?.route_status
              )}`}
            >
              {routeData?.route_status ||
                "—"}
            </p>

          </div>

        </div>


        {/* Recommendation */}

        <div className="rounded-xl border border-slate-800 bg-[#061724] p-5">

          <div className="flex items-center gap-2">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10">

              <CheckCircle2
                size={16}
                className="text-green-400"
              />

            </div>


            <p className="text-[9px] uppercase tracking-wider text-slate-600">
              Recommendation
            </p>

          </div>


          <p className="mt-4 text-sm font-bold text-green-400">

            {routeData?.recommendation ||
              "—"}

          </p>

        </div>

      </div>


      {/* =================================================
          CONDITIONS
      ================================================= */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">


        {/* =================================================
            ROUTE RISK
        ================================================= */}

        <section className="rounded-xl border border-slate-800 bg-[#061724] p-5">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-600">
                Route Conditions
              </p>


              <h2 className="mt-1 text-lg font-bold text-white">
                Risk Assessment
              </h2>

            </div>


            <AlertTriangle
              size={18}
              className="text-amber-400"
            />

          </div>


          <div className="mt-5 space-y-3">


            {/* Weather */}

            <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/40 p-4">

              <div className="flex items-center gap-3">

                <Cloud
                  size={15}
                  className="text-slate-600"
                />


                <div>

                  <p className="text-xs font-medium text-slate-300">
                    Weather
                  </p>

                  <p className="mt-1 text-[8px] text-slate-600">
                    Atmospheric conditions
                  </p>

                </div>

              </div>


              <div className="flex items-center gap-2">

                <span
                  className={`h-1.5 w-1.5 rounded-full ${getDotClass(
                    routeData?.weather_risk
                  )}`}
                />


                <span
                  className={`text-[9px] font-semibold ${getStatusClass(
                    routeData?.weather_risk
                  )}`}
                >
                  {routeData?.weather_risk ||
                    "—"}
                </span>

              </div>

            </div>


            {/* Congestion */}

            <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/40 p-4">

              <div className="flex items-center gap-3">

                <Anchor
                  size={15}
                  className="text-slate-600"
                />


                <div>

                  <p className="text-xs font-medium text-slate-300">
                    Congestion
                  </p>

                  <p className="mt-1 text-[8px] text-slate-600">
                    Route traffic
                  </p>

                </div>

              </div>


              <div className="flex items-center gap-2">

                <span
                  className={`h-1.5 w-1.5 rounded-full ${getDotClass(
                    routeData?.congestion
                  )}`}
                />


                <span
                  className={`text-[9px] font-semibold ${getStatusClass(
                    routeData?.congestion
                  )}`}
                >
                  {routeData?.congestion ||
                    "—"}
                </span>

              </div>

            </div>


            {/* Port */}

            <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/40 p-4">

              <div className="flex items-center gap-3">

                <MapPin
                  size={15}
                  className="text-slate-600"
                />


                <div>

                  <p className="text-xs font-medium text-slate-300">
                    Port Risk
                  </p>

                  <p className="mt-1 text-[8px] text-slate-600">
                    Port operational conditions
                  </p>

                </div>

              </div>


              <div className="flex items-center gap-2">

                <span
                  className={`h-1.5 w-1.5 rounded-full ${getDotClass(
                    routeData?.port_risk
                  )}`}
                />


                <span
                  className={`text-[9px] font-semibold ${getStatusClass(
                    routeData?.port_risk
                  )}`}
                >
                  {routeData?.port_risk ||
                    "—"}
                </span>

              </div>

            </div>


            {/* Market */}

            <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/40 p-4">

              <div className="flex items-center gap-3">

                <TrendingUp
                  size={15}
                  className="text-slate-600"
                />


                <div>

                  <p className="text-xs font-medium text-slate-300">
                    Market Risk
                  </p>

                  <p className="mt-1 text-[8px] text-slate-600">
                    Freight market volatility
                  </p>

                </div>

              </div>


              <div className="flex items-center gap-2">

                <span
                  className={`h-1.5 w-1.5 rounded-full ${getDotClass(
                    routeData?.market_risk
                  )}`}
                />


                <span
                  className={`text-[9px] font-semibold ${getStatusClass(
                    routeData?.market_risk
                  )}`}
                >
                  {routeData?.market_risk ||
                    "—"}
                </span>

              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            WEATHER
        ================================================= */}

        <section className="rounded-xl border border-slate-800 bg-[#061724] p-5">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-600">
                Environmental Conditions
              </p>


              <h2 className="mt-1 text-lg font-bold text-white">
                Route Weather
              </h2>

            </div>


            <Cloud
              size={18}
              className="text-cyan-400"
            />

          </div>


          <div className="mt-5 rounded-xl border border-slate-800 bg-slate-900/40 p-5">


            {/* Condition */}

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-500/10">

                <Cloud
                  size={25}
                  className="text-cyan-400"
                />

              </div>


              <div>

                <p className="text-lg font-bold text-white">

                  {routeData?.weather?.condition ||
                    "—"}

                </p>


                <p className="mt-1 text-[9px] text-slate-600">
                  Current route conditions
                </p>

              </div>

            </div>


            {/* Weather stats */}

            <div className="mt-6 grid grid-cols-3 gap-3">


              <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">

                <Wind
                  size={13}
                  className="text-slate-600"
                />


                <p className="mt-2 text-[8px] uppercase tracking-wider text-slate-600">
                  Wind
                </p>


                <p className="mt-1 text-xs font-semibold text-slate-300">

                  {routeData?.weather?.wind ||
                    "—"}

                </p>

              </div>


              <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">

                <Waves
                  size={13}
                  className="text-slate-600"
                />


                <p className="mt-2 text-[8px] uppercase tracking-wider text-slate-600">
                  Waves
                </p>


                <p className="mt-1 text-xs font-semibold text-slate-300">

                  {routeData?.weather?.wave_height ||
                    "—"}

                </p>

              </div>


              <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">

                <Navigation
                  size={13}
                  className="text-slate-600"
                />


                <p className="mt-2 text-[8px] uppercase tracking-wider text-slate-600">
                  Visibility
                </p>


                <p className="mt-1 text-xs font-semibold text-slate-300">

                  {routeData?.weather?.visibility ||
                    "—"}

                </p>

              </div>

            </div>

          </div>


          {/* Recommendation */}

          <div className="mt-4 rounded-lg border border-green-500/20 bg-green-500/5 p-4">

            <div className="flex items-start gap-3">

              <CheckCircle2
                size={16}
                className="mt-0.5 shrink-0 text-green-400"
              />


              <div>

                <p className="text-[9px] font-semibold uppercase tracking-wider text-green-400">
                  Route Recommendation
                </p>


                <p className="mt-2 text-xs font-medium text-slate-300">

                  {routeData?.recommendation_detail ||
                    "Route conditions are currently suitable."}

                </p>

              </div>

            </div>

          </div>

        </section>

      </div>


      {/* =================================================
          INTEGRATION NOTICE
      ================================================= */}

      <section className="rounded-xl border border-slate-800 bg-[#061724] p-5">

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div className="flex items-start gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10">

              <Route
                size={16}
                className="text-cyan-400"
              />

            </div>


            <div>

              <p className="text-xs font-medium text-slate-300">
                Route Intelligence Integration
              </p>


              <p className="mt-1 max-w-3xl text-[9px] leading-4 text-slate-600">
                Route conditions currently use demonstration
                data. Weather, vessel traffic, port congestion,
                and routing services can be connected through
                the backend later.
              </p>

            </div>

          </div>


          <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2">

            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />

            <span className="text-[9px] text-slate-500">
              API integration ready
            </span>

          </div>

        </div>

      </section>

    </div>

  );
}


export default RouteIntelligence;