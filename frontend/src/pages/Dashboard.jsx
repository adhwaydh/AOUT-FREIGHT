import { API_URL } from "../config/api";
import { useEffect, useState } from "react";

import {
  Activity,
  DollarSign,
  Ship,
  Anchor,
  TrendingUp,
} from "lucide-react";

import KpiCard from "../components/dashboard/KpiCard";
import MarketOutlook from "../components/dashboard/MarketOutlook";
import RouteTracker from "../components/dashboard/RouteTracker";
import VesselAvailability from "../components/dashboard/VesselAvailability";
import PortCongestion from "../components/dashboard/PortCongestion";
import RiskOverview from "../components/dashboard/RiskOverview";
import RecentActivity from "../components/dashboard/RecentActivity";
import AIRecommendation from "../components/dashboard/AIRecommendation";


function Dashboard() {

  // =========================================
  // DASHBOARD STATE
  // =========================================

  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");


  // =========================================
  // LOAD DASHBOARD DATA
  // =========================================

  const loadDashboard = async (isRefresh = false) => {

    try {

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");


      const response = await fetch(
        `${API_URL}/api/dashboard`
      );


      if (!response.ok) {
        throw new Error(
          `Dashboard request failed: ${response.status}`
        );
      }


      const data = await response.json();


      console.log("Dashboard API response:", data);


      setDashboard(data);

    } catch (err) {

      console.error("Dashboard error:", err);

      setError(
        "Unable to connect to the AOUT-FREIGHT backend."
      );

    } finally {

      setLoading(false);
      setRefreshing(false);

    }
  };


  // =========================================
  // LOAD DATA WHEN PAGE OPENS
  // =========================================

  useEffect(() => {

    loadDashboard();

  }, []);


  // =========================================
  // LOADING SCREEN
  // =========================================

  if (loading) {

    return (
      <div className="flex min-h-[70vh] items-center justify-center">

        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />

          <p className="mt-4 text-sm text-slate-400">
            Loading freight intelligence...
          </p>

          <p className="mt-1 text-[10px] text-slate-600">
            Connecting to AOUT-FREIGHT API
          </p>

        </div>

      </div>
    );
  }


  // =========================================
  // ERROR SCREEN
  // =========================================

  if (error || !dashboard) {

    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">

        <div className="w-full max-w-md rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-center">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">

            <Activity
              size={22}
              className="text-red-400"
            />

          </div>


          <h2 className="mt-4 text-lg font-semibold text-white">
            Backend Connection Error
          </h2>


          <p className="mt-2 text-xs leading-5 text-slate-500">
            {error ||
              "Dashboard data is currently unavailable."}
          </p>


          <button
            onClick={() => loadDashboard()}
            className="mt-5 rounded-lg bg-cyan-500 px-5 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-cyan-400"
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }


  // =========================================
  // API DATA
  // =========================================

  const kpis = dashboard.kpis;

  const route = dashboard.route;

  const forecast = dashboard.forecast;


  // =========================================
  // DASHBOARD
  // =========================================

  return (

    <div className="mx-auto max-w-[1800px] space-y-6">


      {/* =========================================
          PAGE HEADER
          ========================================= */}

      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

        <div>

          <div className="flex items-center gap-2">

            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />

            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-green-400">
              Market systems operational
            </p>

          </div>


          <h1 className="mt-2 text-2xl font-bold tracking-tight text-white md:text-3xl">
            Freight Intelligence Dashboard
          </h1>


          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Monitor freight markets, vessel movements, port
            conditions and chartering opportunities.
          </p>

        </div>


        {/* Header actions */}

        <div className="flex items-center gap-3">

          {/* Last updated */}

          <div className="rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-2">

            <p className="text-[9px] uppercase tracking-wider text-slate-600">
              Last Updated
            </p>

            <p className="mt-1 text-xs font-medium text-slate-300">
              {dashboard.updated || "Just now"}
            </p>

          </div>


          {/* Refresh */}

          <button
            onClick={() => loadDashboard(true)}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-4 py-2.5 text-xs font-semibold text-cyan-400 transition hover:bg-cyan-500/10 disabled:cursor-not-allowed disabled:opacity-50"
          >

            {refreshing && (
              <span className="h-3 w-3 animate-spin rounded-full border border-cyan-400/30 border-t-cyan-400" />
            )}

            {refreshing
              ? "Refreshing..."
              : "Refresh Data"}

          </button>

        </div>

      </section>


      {/* =========================================
          KPI ROW
          ========================================= */}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">


        {/* BDI */}

        <KpiCard
          title="BDI Index"
          value={kpis.bdi_index.value.toLocaleString()}
          change={`${kpis.bdi_index.change}%`}
          icon={Activity}
          positive={kpis.bdi_index.trend === "up"}
          subtitle="Dry bulk benchmark"
        />


        {/* Spot Rate */}

        <KpiCard
          title="Avg. Spot Rate"
          value={`$${kpis.average_spot_rate.value.toLocaleString()}`}
          unit="/day"
          change={`${kpis.average_spot_rate.change}%`}
          icon={DollarSign}
          positive={kpis.average_spot_rate.trend === "up"}
          subtitle="Capesize average"
        />


        {/* Vessels */}

        <KpiCard
          title="Active Vessels"
          value={kpis.active_vessels.value.toLocaleString()}
          change={`${kpis.active_vessels.change}%`}
          icon={Ship}
          positive={kpis.active_vessels.trend === "up"}
          subtitle="Tracked globally"
        />


        {/* Port Congestion */}

        <KpiCard
          title="Port Congestion"
          value={kpis.port_congestion.value}
          change={`${kpis.port_congestion.ports} ports`}
          icon={Anchor}
          positive={false}
          subtitle="Requires monitoring"
        />


        {/* Sentiment */}

        <KpiCard
          title="Market Sentiment"
          value={kpis.market_sentiment.value}
          change={kpis.market_sentiment.change}
          icon={TrendingUp}
          positive={kpis.market_sentiment.trend === "up"}
          subtitle="7-day outlook"
        />

      </section>


      {/* =========================================
          MARKET + ROUTE
          ========================================= */}

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">

        <MarketOutlook
          data={dashboard.market_outlook}
        />

        <RouteTracker 
         data={dashboard.route}
        />

      </section>


      {/* =========================================
          INTELLIGENCE CARDS
          ========================================= */}

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">

        <VesselAvailability
         data={dashboard.vessels}
        />

        <PortCongestion 
          data={dashboard.ports}
        />

        <RiskOverview 
          data={dashboard.risks}
        />

      </section>


      {/* =========================================
          ACTIVITY + FORECAST
          ========================================= */}

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">


        {/* Recent Activity */}

        <RecentActivity 
         data={dashboard.activity}
        />


        {/* Forecast Snapshot */}

        <div className="rounded-xl border border-slate-800 bg-[#061724] p-5">


          {/* Header */}

          <div className="flex items-start justify-between">

            <div>

              <h2 className="font-semibold text-white">
                Freight Forecast
              </h2>

              <p className="mt-1 text-xs text-slate-500">

                {route.origin}

                <span className="mx-2 text-cyan-400">
                  →
                </span>

                {route.destination}

              </p>

            </div>


            <span className="rounded-full bg-green-500/10 px-2 py-1 text-[9px] font-medium text-green-400">

              {forecast.trend?.toUpperCase()}

            </span>

          </div>


          {/* Rate cards */}

          <div className="mt-6 grid grid-cols-2 gap-4">


            {/* Current */}

            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">

              <p className="text-[9px] uppercase tracking-wider text-slate-600">
                Current Rate
              </p>

              <p className="mt-2 text-xl font-bold text-white">

                $
                {forecast.current_rate.toLocaleString()}

              </p>

              <p className="mt-1 text-[9px] text-slate-600">
                per day
              </p>

            </div>


            {/* Predicted */}

            <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-4">

              <p className="text-[9px] uppercase tracking-wider text-slate-600">
                Predicted
              </p>

              <p className="mt-2 text-xl font-bold text-cyan-400">

                $
                {forecast.predicted_rate.toLocaleString()}

              </p>

              <p className="mt-1 text-[9px] text-green-400">

                +{forecast.change_percent}%

              </p>

            </div>

          </div>


          {/* Forecast confidence */}

          <div className="mt-5">

            <div className="flex items-center justify-between">

              <p className="text-[9px] uppercase tracking-wider text-slate-600">
                Model Confidence
              </p>

              <p className="text-xs font-semibold text-cyan-400">
                {forecast.confidence}%
              </p>

            </div>


            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">

              <div
                className="h-full rounded-full bg-cyan-400 transition-all duration-700"
                style={{
                  width: `${forecast.confidence}%`,
                }}
              />

            </div>

          </div>


          {/* Mini chart */}

          <div className="mt-6 flex h-28 items-end gap-1">

            {[
              30,
              34,
              32,
              40,
              47,
              43,
              55,
              59,
              66,
              72,
              80,
              88,
            ].map((height, index) => (

              <div
                key={index}
                className="flex-1 rounded-t bg-cyan-500/50 transition hover:bg-cyan-400"
                style={{
                  height: `${height}%`,
                }}
              />

            ))}

          </div>


          {/* Open forecast */}

          <button className="mt-5 w-full rounded-lg border border-slate-700 bg-slate-900 py-3 text-xs font-medium text-slate-300 transition hover:border-cyan-500/30 hover:text-cyan-400">
            Open Full Forecast
          </button>

        </div>

      </section>


      {/* =========================================
          ROUTE STATUS
          ========================================= */}

      <section className="rounded-xl border border-slate-800 bg-[#061724] p-5">

        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">


          {/* Vessel */}

          <div className="flex items-center gap-4">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10">

              <Ship
                size={21}
                className="text-cyan-400"
              />

            </div>


            <div>

              <p className="text-[9px] uppercase tracking-wider text-slate-600">
                Active Route
              </p>

              <p className="mt-1 text-sm font-semibold">
                {route.vessel}
              </p>

            </div>

          </div>


          {/* Route */}

          <div className="flex items-center gap-3">

            <div className="text-right">

              <p className="text-[9px] text-slate-600">
                ORIGIN
              </p>

              <p className="mt-1 text-xs font-medium">
                {route.origin}
              </p>

            </div>


            <div className="flex items-center gap-2">

              <span className="h-px w-10 bg-cyan-500/30" />

              <Ship
                size={15}
                className="text-cyan-400"
              />

              <span className="h-px w-10 bg-cyan-500/30" />

            </div>


            <div>

              <p className="text-[9px] text-slate-600">
                DESTINATION
              </p>

              <p className="mt-1 text-xs font-medium">
                {route.destination}
              </p>

            </div>

          </div>


          {/* Route stats */}

          <div className="flex gap-6">

            <div>

              <p className="text-[9px] text-slate-600">
                SPEED
              </p>

              <p className="mt-1 text-xs font-semibold">
                {route.speed} kn
              </p>

            </div>


            <div>

              <p className="text-[9px] text-slate-600">
                ETA
              </p>

              <p className="mt-1 text-xs font-semibold">
                {route.eta_days} days
              </p>

            </div>


            <div>

              <p className="text-[9px] text-slate-600">
                DISTANCE
              </p>

              <p className="mt-1 text-xs font-semibold">
                {route.distance_nm.toLocaleString()} NM
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================
          AI RECOMMENDATION
          ========================================= */}

      <AIRecommendation 
       data={dashboard.recommendation}
      />

    </div>
  );
}


export default Dashboard;