import { API_URL } from "../config/api";
import { useMemo, useState } from "react"
import {
  Activity,
  Anchor,
  ArrowRight,
  Brain,
  CheckCircle2,
  Clock3,
  Fuel,
  Gauge,
  MapPin,
  Ship,
  Sparkles,
  Target,
  Weight,
} from "lucide-react"

function VesselOptimization() {
  const [form, setForm] = useState({
    vessel: "MV Ocean Pioneer",
    loadPort: "Paradip",
    dischargePort: "Visakhapatnam",
    cargo: "50000",
    speed: "13.5",
    draft: "14.2",
  })

  const [optimized, setOptimized] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState(null)

  // =====================================================
  // UPDATE FORM
  // =====================================================

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))

    setOptimized(false)
    setResult(null)
    setError("")
  }

  // =====================================================
  // OPTIMIZE VESSEL
  // =====================================================

  const handleOptimize = async (event) => {
    event.preventDefault()

    setError("")
    setLoading(true)
    setOptimized(false)

    try {
      const response = await fetch(
        `${API_URL}/vessel-optimization/optimize`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            vessel: form.vessel,
            load_port: form.loadPort,
            discharge_port: form.dischargePort,
            cargo: Number(form.cargo),
            speed: Number(form.speed),
            draft: Number(form.draft),
          }),
        }
      )

      if (!response.ok) {
        let message = "Unable to optimize vessel."

        try {
          const errorData = await response.json()

          if (errorData?.detail) {
            if (Array.isArray(errorData.detail)) {
              message = errorData.detail
                .map((item) => item.msg)
                .join(", ")
            } else {
              message = errorData.detail
            }
          }
        } catch {
          // Keep default error message.
        }

        throw new Error(message)
      }

      const data = await response.json()

      setResult(data)
      setOptimized(true)
    } catch (err) {
      console.error("Vessel optimization error:", err)

      setError(
        err.message ||
          "Unable to connect to the vessel optimization API."
      )
    } finally {
      setLoading(false)
    }
  }

  // =====================================================
  // RESULT
  // =====================================================

  const currentResult = useMemo(() => {
    if (!result?.result) {
      return {
        speed: Number(form.speed) || 0,
        fuel: "—",
        eta: "—",
        cost: null,
        efficiency: 0,
      }
    }

    return {
      speed: result.result.recommended_speed,
      fuel: result.result.fuel_per_day,
      eta: result.result.eta,
      cost: result.result.operating_cost,
      efficiency: result.result.efficiency_score,
    }
  }, [result, form.speed])

  // =====================================================
  // COMPARISON
  // =====================================================

  const comparison = result?.comparison

  const savings = comparison?.daily_saving ?? null

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="mx-auto max-w-7xl space-y-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div>

        <div className="mb-2 flex items-center gap-2">

          <span className="h-2 w-2 rounded-full bg-cyan-400" />

          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Plate 12 — Vessel Optimization
          </span>

        </div>

        <h1 className="text-3xl font-bold tracking-tight text-white">
          Vessel Optimization
        </h1>

        <p className="mt-2 max-w-3xl text-sm text-slate-400">
          Evaluate vessel operating conditions and identify
          a more efficient speed, fuel, cost, and voyage
          profile.
        </p>

      </div>

      {/* =====================================================
          CONFIGURATION
      ===================================================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        <form
          onSubmit={handleOptimize}
          className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 xl:col-span-2"
        >

          <div className="flex items-start gap-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10">

              <Ship
                size={20}
                className="text-cyan-400"
              />

            </div>

            <div>

              <p className="text-sm font-semibold text-white">
                Optimization Parameters
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Configure the vessel and voyage before
                running the optimization.
              </p>

            </div>

          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">

            {/* Vessel */}

            <div>

              <label className="mb-2 block text-xs text-slate-500">
                Vessel
              </label>

              <select
                value={form.vessel}
                onChange={(event) =>
                  updateField(
                    "vessel",
                    event.target.value
                  )
                }
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-500/50"
              >

                <option>
                  MV Ocean Pioneer
                </option>

                <option>
                  MV Eastern Star
                </option>

                <option>
                  MV Blue Horizon
                </option>

                <option>
                  MV Atlantic Trader
                </option>

              </select>

            </div>

            {/* Cargo */}

            <div>

              <label className="mb-2 block text-xs text-slate-500">
                Cargo Quantity
              </label>

              <div className="relative">

                <Weight
                  size={16}
                  className="absolute left-3 top-3 text-slate-600"
                />

                <input
                  value={form.cargo}
                  onChange={(event) =>
                    updateField(
                      "cargo",
                      event.target.value
                    )
                  }
                  type="number"
                  min="1"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-3 text-sm text-white outline-none focus:border-cyan-500/50"
                />

              </div>

              <p className="mt-1 text-[10px] text-slate-700">
                Tonnes
              </p>

            </div>

            {/* Load Port */}

            <div>

              <label className="mb-2 block text-xs text-slate-500">
                Load Port
              </label>

              <div className="relative">

                <MapPin
                  size={16}
                  className="absolute left-3 top-3 text-slate-600"
                />

                <input
                  value={form.loadPort}
                  onChange={(event) =>
                    updateField(
                      "loadPort",
                      event.target.value
                    )
                  }
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-3 text-sm text-white outline-none focus:border-cyan-500/50"
                />

              </div>

            </div>

            {/* Discharge Port */}

            <div>

              <label className="mb-2 block text-xs text-slate-500">
                Discharge Port
              </label>

              <div className="relative">

                <MapPin
                  size={16}
                  className="absolute left-3 top-3 text-slate-600"
                />

                <input
                  value={form.dischargePort}
                  onChange={(event) =>
                    updateField(
                      "dischargePort",
                      event.target.value
                    )
                  }
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-3 text-sm text-white outline-none focus:border-cyan-500/50"
                />

              </div>

            </div>

            {/* Speed */}

            <div>

              <label className="mb-2 block text-xs text-slate-500">
                Current Speed
              </label>

              <div className="relative">

                <Gauge
                  size={16}
                  className="absolute left-3 top-3 text-slate-600"
                />

                <input
                  value={form.speed}
                  onChange={(event) =>
                    updateField(
                      "speed",
                      event.target.value
                    )
                  }
                  type="number"
                  step="0.1"
                  min="0.1"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-10 text-sm text-white outline-none focus:border-cyan-500/50"
                />

                <span className="absolute right-3 top-3 text-[10px] text-slate-600">
                  kn
                </span>

              </div>

            </div>

            {/* Draft */}

            <div>

              <label className="mb-2 block text-xs text-slate-500">
                Draft
              </label>

              <input
                value={form.draft}
                onChange={(event) =>
                  updateField(
                    "draft",
                    event.target.value
                  )
                }
                type="number"
                step="0.1"
                min="0.1"
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-500/50"
              />

              <p className="mt-1 text-[10px] text-slate-700">
                metres
              </p>

            </div>

          </div>

          {/* Error */}

          {error && (
            <div className="mt-5 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3">

              <p className="text-xs text-red-400">
                {error}
              </p>

            </div>
          )}

          {/* Optimize */}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-[10px] text-slate-600">
              Results are supplied by the vessel optimization
              backend API.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-5 py-2.5 text-xs font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >

              <Sparkles
                size={15}
                className={
                  loading
                    ? "animate-pulse"
                    : ""
                }
              />

              {loading
                ? "Optimizing..."
                : "Optimize Voyage"}

            </button>

          </div>

        </form>

        {/* =================================================
            EFFICIENCY SCORE
        ================================================= */}

        <div className="rounded-xl border border-cyan-500/20 bg-slate-900/60 p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs uppercase tracking-wider text-slate-500">
                Efficiency Score
              </p>

              <p className="mt-2 text-5xl font-bold text-emerald-400">
                {currentResult.efficiency}
              </p>

            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400/10">

              <Activity
                size={22}
                className="text-emerald-400"
              />

            </div>

          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">

            <div
              className="h-full rounded-full bg-emerald-400 transition-all duration-500"
              style={{
                width: `${Math.min(
                  Math.max(
                    currentResult.efficiency,
                    0
                  ),
                  100
                )}%`,
              }}
            />

          </div>

          <p className="mt-5 text-xs leading-5 text-slate-500">

            {optimized
              ? "The backend optimizer has generated an improved operating profile."
              : "Run the optimization to generate an improved operating profile."}

          </p>

        </div>

      </div>

      {/* =====================================================
          RESULT CARDS
      ===================================================== */}

      <div>

        <div className="mb-4">

          <p className="text-xs uppercase tracking-[0.15em] text-slate-600">
            Operating Profile
          </p>

          <h2 className="mt-1 text-lg font-bold text-white">
            {optimized
              ? "Optimized Voyage"
              : "Current Voyage Profile"}
          </h2>

        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* Speed */}

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">

            <div className="flex items-center gap-2">

              <Gauge
                size={17}
                className="text-cyan-400"
              />

              <p className="text-xs text-slate-500">
                Recommended Speed
              </p>

            </div>

            <p className="mt-3 text-2xl font-bold text-white">
              {currentResult.speed}

              <span className="ml-1 text-xs font-normal text-slate-600">
                kn
              </span>

            </p>

          </div>

          {/* Fuel */}

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">

            <div className="flex items-center gap-2">

              <Fuel
                size={17}
                className="text-cyan-400"
              />

              <p className="text-xs text-slate-500">
                Fuel / Day
              </p>

            </div>

            <p className="mt-3 text-2xl font-bold text-white">

              {currentResult.fuel}

              <span className="ml-1 text-xs font-normal text-slate-600">
                t/day
              </span>

            </p>

          </div>

          {/* ETA */}

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">

            <div className="flex items-center gap-2">

              <Clock3
                size={17}
                className="text-cyan-400"
              />

              <p className="text-xs text-slate-500">
                Estimated ETA
              </p>

            </div>

            <p className="mt-3 text-2xl font-bold text-white">
              {currentResult.eta}
            </p>

          </div>

          {/* Cost */}

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">

            <div className="flex items-center gap-2">

              <Target
                size={17}
                className="text-cyan-400"
              />

              <p className="text-xs text-slate-500">
                Operating Cost
              </p>

            </div>

            <p className="mt-3 text-2xl font-bold text-white">

              {currentResult.cost !== null
                ? `$${Number(
                    currentResult.cost
                  ).toLocaleString()}`
                : "—"}

            </p>

          </div>

        </div>

      </div>

      {/* =====================================================
          OPTIMIZATION SUMMARY
      ===================================================== */}

      {optimized && comparison && (

        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6">

          <div className="flex items-start gap-3">

            <CheckCircle2
              size={20}
              className="mt-0.5 text-emerald-400"
            />

            <div>

              <p className="text-sm font-semibold text-emerald-400">
                Optimization completed
              </p>

              <p className="mt-1 text-xs text-slate-500">
                The backend optimization service identified
                a lower-cost operating profile for the selected
                vessel and voyage.
              </p>

            </div>

          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">

            <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">

              <p className="text-[10px] uppercase tracking-wider text-slate-600">
                Daily Cost Reduction
              </p>

              <p className="mt-2 text-lg font-bold text-emerald-400">

                {savings !== null
                  ? `$${Number(
                      savings
                    ).toLocaleString()}`
                  : "—"}

              </p>

            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">

              <p className="text-[10px] uppercase tracking-wider text-slate-600">
                Fuel Reduction
              </p>

              <p className="mt-2 text-lg font-bold text-emerald-400">

                {comparison.fuel_reduction_percent ?? "—"}%

              </p>

            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">

              <p className="text-[10px] uppercase tracking-wider text-slate-600">
                Efficiency Improvement
              </p>

              <p className="mt-2 text-lg font-bold text-cyan-400">

                +
                {comparison.efficiency_improvement ?? "—"}
                {" "}points

              </p>

            </div>

          </div>

        </div>

      )}

      {/* =====================================================
          ROUTE
      ===================================================== */}

      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">

        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <div>

            <p className="text-[10px] uppercase tracking-wider text-slate-600">
              Active Voyage
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-3">

              <span className="text-sm font-semibold text-white">
                {form.loadPort}
              </span>

              <ArrowRight
                size={16}
                className="text-cyan-400"
              />

              <span className="text-sm font-semibold text-white">
                {form.dischargePort}
              </span>

            </div>

          </div>

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950">

              <Anchor
                size={17}
                className="text-cyan-400"
              />

            </div>

            <div>

              <p className="text-xs font-semibold text-white">
                {form.vessel}
              </p>

              <p className="text-[10px] text-slate-600">
                Optimization target
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          BACKEND INTEGRATION
      ===================================================== */}

      <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/30 p-6">

        <div className="flex items-start gap-4">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10">

            <Brain
              size={20}
              className="text-cyan-400"
            />

          </div>

          <div>

            <p className="text-sm font-semibold text-slate-300">
              Optimization API
            </p>

            <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-600">
              Vessel and voyage parameters are sent to the
              FastAPI optimization endpoint. The returned
              recommended speed, fuel consumption, ETA,
              operating cost, and efficiency score are
              displayed directly in this page.
            </p>

          </div>

        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">

          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">

            <p className="text-[10px] uppercase tracking-wider text-slate-600">
              Backend Endpoint
            </p>

            <p className="mt-2 text-sm font-semibold text-cyan-400">
              /vessel-optimization/optimize
            </p>

          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">

            <p className="text-[10px] uppercase tracking-wider text-slate-600">
              Optimization Model
            </p>

            <p className="mt-2 text-sm font-semibold text-amber-400">
              Demo Logic
            </p>

          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">

            <p className="text-[10px] uppercase tracking-wider text-slate-600">
              API Status
            </p>

            <p
              className={`mt-2 text-sm font-semibold ${
                optimized
                  ? "text-emerald-400"
                  : "text-slate-400"
              }`}
            >
              {optimized
                ? "Response Received"
                : "Ready"}
            </p>

          </div>

        </div>

      </div>

    </div>
  )
}

export default VesselOptimization