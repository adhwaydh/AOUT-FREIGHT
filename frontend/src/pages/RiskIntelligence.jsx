import { useMemo, useState } from "react"
import {
  AlertTriangle,
  Anchor,
  Activity,
  Brain,
  CheckCircle2,
  CloudRain,
  MapPin,
  Route,
  ShieldCheck,
  Ship,
  TrendingUp,
  RefreshCw,
  Search,
  Weight,
} from "lucide-react"

const API_URL = "http://127.0.0.1:8000"

function RiskIntelligence() {
  // =====================================================
  // FORM STATE
  // =====================================================

  const [form, setForm] = useState({
    origin: "Singapore",
    destination: "Visakhapatnam",
    vessel: "MV Ocean Pioneer",
    cargo: "Iron Ore",
    cargoQuantity: "50000",
  })

  // =====================================================
  // API STATE
  // =====================================================

  const [riskData, setRiskData] = useState(null)
  const [selectedRisk, setSelectedRisk] = useState(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // =====================================================
  // UPDATE FORM
  // =====================================================

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))

    setError("")
  }

  // =====================================================
  // ANALYZE RISK
  // =====================================================

  const analyzeRisk = async () => {
    if (
      !form.origin.trim() ||
      !form.destination.trim() ||
      !form.vessel.trim() ||
      !form.cargo.trim() ||
      !form.cargoQuantity
    ) {
      setError("Please complete all voyage details.")
      return
    }

    if (Number(form.cargoQuantity) <= 0) {
      setError("Cargo quantity must be greater than zero.")
      return
    }

    setLoading(true)
    setError("")
    setSelectedRisk(null)

    try {
      const response = await fetch(
        `${API_URL}/api/routes/risk`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            origin: form.origin.trim(),
            destination: form.destination.trim(),
            vessel: form.vessel.trim(),
            cargo: form.cargo.trim(),
            cargo_quantity: Number(form.cargoQuantity),
          }),
        }
      )

      if (!response.ok) {
        let message = "Unable to analyze voyage risk."

        try {
          const errorData = await response.json()

          if (errorData?.detail) {
            message = errorData.detail
          }
        } catch {
          // Keep default error.
        }

        throw new Error(message)
      }

      const data = await response.json()

      setRiskData(data)
    } catch (err) {
      console.error("Risk intelligence error:", err)

      setError(
        err.message ||
          "Unable to connect to the risk intelligence API."
      )

      setRiskData(null)
    } finally {
      setLoading(false)
    }
  }

  // =====================================================
  // INITIAL ANALYSIS
  // =====================================================

  // The page does not automatically call the API.
  // User can modify voyage information before analysis.

  // =====================================================
  // RISK CONFIGURATION
  // =====================================================

  const riskDefinitions = useMemo(() => {
    if (!riskData?.risk_categories) {
      return []
    }

    const categories = riskData.risk_categories

    return [
      {
        id: "weather",
        title: "Weather Risk",
        icon: CloudRain,
        data: categories.weather,
        description:
          categories.weather?.detail ||
          "Weather conditions affecting the proposed voyage.",
        factors: [
          "Weather conditions",
          "Wind conditions",
          "Wave conditions",
          "Visibility",
        ],
      },

      {
        id: "route",
        title: "Route Risk",
        icon: Route,
        data: categories.route,
        description:
          categories.route?.detail ||
          "Operational exposure associated with the selected route.",
        factors: [
          "Route distance",
          "Weather exposure",
          "Route conditions",
          "Transit requirements",
        ],
      },

      {
        id: "port",
        title: "Port Risk",
        icon: Anchor,
        data: categories.port,
        description:
          categories.port?.detail ||
          "Operational exposure associated with port conditions.",
        factors: [
          "Port congestion",
          "Expected waiting time",
          "Port operations",
          "Vessel compatibility",
        ],
      },

      {
        id: "market",
        title: "Market Risk",
        icon: TrendingUp,
        data: categories.market,
        description:
          categories.market?.detail ||
          "Market uncertainty affecting the voyage.",
        factors: [
          "Freight rate movement",
          "Demand conditions",
          "Market volatility",
          "Freight market exposure",
        ],
      },

      {
        id: "vessel",
        title: "Vessel Risk",
        icon: Ship,
        data: categories.vessel,
        description:
          categories.vessel?.detail ||
          "Operational exposure associated with the selected vessel.",
        factors: [
          "Vessel characteristics",
          "Vessel suitability",
          "Operating limits",
          "Cargo compatibility",
        ],
      },
    ]
  }, [riskData])

  // =====================================================
  // OVERALL RISK
  // =====================================================

  const overallScore =
    riskData?.overall?.score ?? null

  const overallLevel =
    riskData?.overall?.level ?? null

  // =====================================================
  // RISK COUNTS
  // =====================================================

  const riskCounts = useMemo(() => {
    return {
      low: riskDefinitions.filter(
        (risk) => risk.data?.level === "Low"
      ).length,

      moderate: riskDefinitions.filter(
        (risk) => risk.data?.level === "Moderate"
      ).length,

      high: riskDefinitions.filter(
        (risk) =>
          risk.data?.level === "High" ||
          risk.data?.level === "Critical"
      ).length,
    }
  }, [riskDefinitions])

  // =====================================================
  // LEVEL CLASS
  // =====================================================

  const getLevelClass = (level) => {
    const value = String(level || "").toLowerCase()

    if (
      value.includes("low") ||
      value.includes("stable")
    ) {
      return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
    }

    if (
      value.includes("high") ||
      value.includes("critical")
    ) {
      return "text-red-400 bg-red-400/10 border-red-400/20"
    }

    return "text-amber-400 bg-amber-400/10 border-amber-400/20"
  }

  // =====================================================
  // SCORE CLASS
  // =====================================================

  const getScoreClass = (score) => {
    if (score === null || score === undefined) {
      return "text-slate-500"
    }

    if (score <= 25) {
      return "text-emerald-400"
    }

    if (score <= 50) {
      return "text-amber-400"
    }

    if (score <= 75) {
      return "text-orange-400"
    }

    return "text-red-400"
  }

  // =====================================================
  // PROGRESS CLASS
  // =====================================================

  const getProgressClass = (score) => {
    if (score <= 25) {
      return "bg-emerald-400"
    }

    if (score <= 50) {
      return "bg-amber-400"
    }

    if (score <= 75) {
      return "bg-orange-400"
    }

    return "bg-red-400"
  }

  // =====================================================
  // SELECTED RISK
  // =====================================================

  const selectedRiskData = useMemo(() => {
    if (!selectedRisk) {
      return null
    }

    return riskDefinitions.find(
      (risk) => risk.id === selectedRisk
    )
  }, [selectedRisk, riskDefinitions])

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="mx-auto max-w-7xl space-y-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section>
        <div className="mb-2 flex items-center gap-2">

          <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />

          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Plate 10 — Risk Intelligence
          </span>

        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

          <div>

            <h1 className="text-3xl font-bold tracking-tight text-white">
              Operational Risk Intelligence
            </h1>

            <p className="mt-2 max-w-3xl text-sm text-slate-400">
              Analyze weather, route, port, vessel, and
              market risks for a proposed voyage.
            </p>

          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600">

            <span
              className={`h-2 w-2 rounded-full ${
                riskData
                  ? "bg-emerald-400"
                  : "bg-slate-600"
              }`}
            />

            {riskData
              ? "Risk analysis available"
              : "Awaiting analysis"}

          </div>

        </div>
      </section>


      {/* =====================================================
          VOYAGE INPUT
      ===================================================== */}

      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">

        <div className="flex items-start gap-4">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10">

            <ShieldCheck
              size={20}
              className="text-cyan-400"
            />

          </div>

          <div>

            <p className="text-sm font-semibold text-white">
              Voyage Risk Parameters
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Enter the voyage information used by the
              risk intelligence backend.
            </p>

          </div>

        </div>


        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

          {/* Origin */}

          <div>

            <label className="mb-2 block text-xs text-slate-500">
              Origin
            </label>

            <div className="relative">

              <MapPin
                size={15}
                className="absolute left-3 top-3 text-slate-600"
              />

              <input
                value={form.origin}
                onChange={(event) =>
                  updateField(
                    "origin",
                    event.target.value
                  )
                }
                placeholder="Origin port"
                className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-3 text-sm text-white outline-none transition focus:border-cyan-500/50"
              />

            </div>

          </div>


          {/* Destination */}

          <div>

            <label className="mb-2 block text-xs text-slate-500">
              Destination
            </label>

            <div className="relative">

              <MapPin
                size={15}
                className="absolute left-3 top-3 text-slate-600"
              />

              <input
                value={form.destination}
                onChange={(event) =>
                  updateField(
                    "destination",
                    event.target.value
                  )
                }
                placeholder="Destination port"
                className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-3 text-sm text-white outline-none transition focus:border-cyan-500/50"
              />

            </div>

          </div>


          {/* Vessel */}

          <div>

            <label className="mb-2 block text-xs text-slate-500">
              Vessel
            </label>

            <div className="relative">

              <Ship
                size={15}
                className="absolute left-3 top-3 text-slate-600"
              />

              <input
                value={form.vessel}
                onChange={(event) =>
                  updateField(
                    "vessel",
                    event.target.value
                  )
                }
                placeholder="Vessel name"
                className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-3 text-sm text-white outline-none transition focus:border-cyan-500/50"
              />

            </div>

          </div>


          {/* Cargo */}

          <div>

            <label className="mb-2 block text-xs text-slate-500">
              Cargo
            </label>

            <div className="relative">

              <Weight
                size={15}
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
                placeholder="Cargo type"
                className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-3 text-sm text-white outline-none transition focus:border-cyan-500/50"
              />

            </div>

          </div>


          {/* Cargo Quantity */}

          <div>

            <label className="mb-2 block text-xs text-slate-500">
              Cargo Quantity
            </label>

            <div className="relative">

              <Weight
                size={15}
                className="absolute left-3 top-3 text-slate-600"
              />

              <input
                value={form.cargoQuantity}
                onChange={(event) =>
                  updateField(
                    "cargoQuantity",
                    event.target.value
                  )
                }
                type="number"
                min="1"
                placeholder="Quantity"
                className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-3 text-sm text-white outline-none transition focus:border-cyan-500/50"
              />

            </div>

            <p className="mt-1 text-[10px] text-slate-700">
              Tonnes
            </p>

          </div>


          {/* Analyze Button */}

          <div className="flex items-end">

            <button
              type="button"
              onClick={analyzeRisk}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-500 px-5 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >

              {loading ? (
                <RefreshCw
                  size={15}
                  className="animate-spin"
                />
              ) : (
                <Search size={15} />
              )}

              {loading
                ? "Analyzing Risk..."
                : "Analyze Risk"}

            </button>

          </div>

        </div>


        {error && (

          <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/5 p-3">

            <p className="text-xs text-red-400">
              {error}
            </p>

          </div>

        )}

      </section>


      {/* =====================================================
          NO DATA STATE
      ===================================================== */}

      {!riskData && !loading && !error && (

        <section className="rounded-xl border border-dashed border-slate-700 bg-slate-950/30 p-10 text-center">

          <ShieldCheck
            size={32}
            className="mx-auto text-slate-700"
          />

          <p className="mt-4 text-sm font-semibold text-slate-400">
            Ready for Risk Analysis
          </p>

          <p className="mx-auto mt-2 max-w-lg text-xs leading-5 text-slate-600">
            Enter the voyage details above and run the
            analysis to retrieve risk intelligence from
            the FastAPI backend.
          </p>

        </section>

      )}


      {/* =====================================================
          OVERALL RISK
      ===================================================== */}

      {riskData && (

        <>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

            {/* Overall Score */}

            <div className="rounded-xl border border-cyan-500/20 bg-slate-900/60 p-6">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Overall Risk
                  </p>

                  <p
                    className={`mt-2 text-5xl font-bold ${getScoreClass(
                      overallScore
                    )}`}
                  >
                    {overallScore}
                  </p>

                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-400/10">

                  <ShieldCheck
                    size={28}
                    className="text-cyan-400"
                  />

                </div>

              </div>


              <div className="mt-5">

                <div className="mb-2 flex items-center justify-between">

                  <span className="text-xs text-slate-500">
                    Risk exposure
                  </span>

                  <span
                    className={`text-xs font-semibold ${getScoreClass(
                      overallScore
                    )}`}
                  >
                    {overallLevel}
                  </span>

                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-800">

                  <div
                    className={`h-full rounded-full transition-all ${getProgressClass(
                      overallScore
                    )}`}
                    style={{
                      width: `${overallScore}%`,
                    }}
                  />

                </div>

              </div>


              <p className="mt-5 text-xs leading-5 text-slate-500">
                Lower scores indicate lower operational
                exposure. Higher scores require additional
                review before voyage execution.
              </p>

            </div>


            {/* Risk Assessment */}

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 lg:col-span-2">

              <div className="flex items-start gap-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-400/10">

                  <AlertTriangle
                    size={20}
                    className="text-amber-400"
                  />

                </div>

                <div>

                  <p className="text-sm font-semibold text-white">
                    Risk Assessment
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Backend risk analysis for{" "}
                    <span className="text-slate-300">
                      {form.vessel}
                    </span>{" "}
                    sailing from{" "}
                    <span className="text-slate-300">
                      {form.origin}
                    </span>{" "}
                    to{" "}
                    <span className="text-slate-300">
                      {form.destination}
                    </span>.
                  </p>

                </div>

              </div>


              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">

                <div>

                  <p className="text-[10px] uppercase tracking-wider text-slate-600">
                    Risk Factors
                  </p>

                  <p className="mt-2 text-xl font-bold text-white">
                    {riskDefinitions.length}
                  </p>

                </div>


                <div>

                  <p className="text-[10px] uppercase tracking-wider text-slate-600">
                    Low Risk
                  </p>

                  <p className="mt-2 text-xl font-bold text-emerald-400">
                    {riskCounts.low}
                  </p>

                </div>


                <div>

                  <p className="text-[10px] uppercase tracking-wider text-slate-600">
                    Moderate
                  </p>

                  <p className="mt-2 text-xl font-bold text-amber-400">
                    {riskCounts.moderate}
                  </p>

                </div>


                <div>

                  <p className="text-[10px] uppercase tracking-wider text-slate-600">
                    High / Critical
                  </p>

                  <p className="mt-2 text-xl font-bold text-red-400">
                    {riskCounts.high}
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              RISK FACTORS
          ================================================= */}

          <section>

            <div className="mb-4">

              <p className="text-xs uppercase tracking-[0.15em] text-slate-600">
                Risk Factors
              </p>

              <h2 className="mt-1 text-lg font-bold text-white">
                Operational Risk Breakdown
              </h2>

            </div>


            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              {riskDefinitions.map((risk) => {

                const Icon = risk.icon
                const score = risk.data?.score ?? 0
                const level =
                  risk.data?.level || "Unknown"
                const status =
                  risk.data?.status || "Unknown"

                return (
                  <button
                    key={risk.id}
                    type="button"
                    onClick={() =>
                      setSelectedRisk(risk.id)
                    }
                    className="group rounded-xl border border-slate-800 bg-slate-900/50 p-5 text-left transition hover:border-cyan-500/30 hover:bg-slate-900"
                  >

                    <div className="flex items-start justify-between">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-slate-950">

                          <Icon
                            size={19}
                            className="text-cyan-400"
                          />

                        </div>

                        <div>

                          <h3 className="text-sm font-semibold text-white">
                            {risk.title}
                          </h3>

                          <p className="mt-1 text-[10px] text-slate-600">
                            {status}
                          </p>

                        </div>

                      </div>


                      <span
                        className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${getLevelClass(
                          level
                        )}`}
                      >
                        {level}
                      </span>

                    </div>


                    <div className="mt-5 flex items-end justify-between">

                      <div>

                        <p className="text-[10px] uppercase tracking-wider text-slate-600">
                          Risk Score
                        </p>

                        <p
                          className={`mt-1 text-3xl font-bold ${getScoreClass(
                            score
                          )}`}
                        >
                          {score}
                        </p>

                      </div>

                      <span className="text-xs text-cyan-400 opacity-60 transition group-hover:opacity-100">
                        View factors →
                      </span>

                    </div>


                    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-800">

                      <div
                        className={`h-full rounded-full ${getProgressClass(
                          score
                        )}`}
                        style={{
                          width: `${score}%`,
                        }}
                      />

                    </div>


                    <p className="mt-4 text-xs leading-5 text-slate-500">
                      {risk.description}
                    </p>

                  </button>
                )
              })}

            </div>

          </section>


          {/* =================================================
              SELECTED RISK
          ================================================= */}

          {selectedRiskData && (

            <section className="rounded-xl border border-cyan-500/20 bg-slate-900/70 p-6">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-xs uppercase tracking-[0.15em] text-cyan-400">
                    Risk Detail
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-white">
                    {selectedRiskData.title}
                  </h2>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedRisk(null)
                  }
                  className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-400 transition hover:border-slate-600 hover:text-white"
                >
                  Close
                </button>

              </div>


              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">

                <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">

                  <p className="text-[10px] uppercase tracking-wider text-slate-600">
                    Score
                  </p>

                  <p
                    className={`mt-2 text-2xl font-bold ${getScoreClass(
                      selectedRiskData.data?.score
                    )}`}
                  >
                    {selectedRiskData.data?.score}
                  </p>

                </div>


                <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">

                  <p className="text-[10px] uppercase tracking-wider text-slate-600">
                    Level
                  </p>

                  <p
                    className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getLevelClass(
                      selectedRiskData.data?.level
                    )}`}
                  >
                    {selectedRiskData.data?.level}
                  </p>

                </div>


                <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">

                  <p className="text-[10px] uppercase tracking-wider text-slate-600">
                    Status
                  </p>

                  <p className="mt-2 text-sm font-semibold text-cyan-400">
                    {selectedRiskData.data?.status ||
                      "Monitoring"}
                  </p>

                </div>

              </div>


              <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950/40 p-5">

                <p className="text-sm font-semibold text-slate-300">
                  Assessment
                </p>

                <p className="mt-3 text-xs leading-6 text-slate-500">
                  {selectedRiskData.data?.detail ||
                    selectedRiskData.description}
                </p>

              </div>


              <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950/40 p-5">

                <p className="text-sm font-semibold text-slate-300">
                  Contributing Factors
                </p>

                <div className="mt-4 space-y-3">

                  {selectedRiskData.factors.map(
                    (factor) => (

                      <div
                        key={factor}
                        className="flex items-center gap-3"
                      >

                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />

                        <span className="text-xs text-slate-500">
                          {factor}
                        </span>

                      </div>

                    )
                  )}

                </div>

              </div>

            </section>

          )}


          {/* =================================================
              WEATHER
          ================================================= */}

          {riskData.weather && (

            <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-xs uppercase tracking-[0.15em] text-slate-600">
                    Environmental Conditions
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-white">
                    Current Route Weather
                  </h2>

                </div>

                <CloudRain
                  size={20}
                  className="text-cyan-400"
                />

              </div>


              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-4">

                <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">

                  <p className="text-[10px] uppercase tracking-wider text-slate-600">
                    Condition
                  </p>

                  <p className="mt-2 text-sm font-semibold text-white">
                    {riskData.weather.condition}
                  </p>

                </div>


                <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">

                  <p className="text-[10px] uppercase tracking-wider text-slate-600">
                    Wind
                  </p>

                  <p className="mt-2 text-sm font-semibold text-slate-300">
                    {riskData.weather.wind}
                  </p>

                </div>


                <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">

                  <p className="text-[10px] uppercase tracking-wider text-slate-600">
                    Waves
                  </p>

                  <p className="mt-2 text-sm font-semibold text-slate-300">
                    {riskData.weather.wave_height}
                  </p>

                </div>


                <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">

                  <p className="text-[10px] uppercase tracking-wider text-slate-600">
                    Visibility
                  </p>

                  <p className="mt-2 text-sm font-semibold text-slate-300">
                    {riskData.weather.visibility}
                  </p>

                </div>

              </div>

            </section>

          )}


          {/* =================================================
              RECOMMENDATION
          ================================================= */}

          {riskData.recommendation && (

            <section className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6">

              <div className="flex items-start gap-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10">

                  <CheckCircle2
                    size={20}
                    className="text-emerald-400"
                  />

                </div>

                <div>

                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-400">
                    Risk Recommendation
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-white">
                    {riskData.recommendation.title}
                  </h2>

                  <p className="mt-2 max-w-4xl text-xs leading-6 text-slate-500">
                    {riskData.recommendation.detail}
                  </p>

                </div>

              </div>

            </section>

          )}


          {/* =================================================
              ANALYZED VOYAGE
          ================================================= */}

          <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div>

                <p className="text-[10px] uppercase tracking-wider text-slate-600">
                  Analyzed Voyage
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-3">

                  <span className="text-sm font-semibold text-white">
                    {riskData.request.origin}
                  </span>

                  <span className="text-cyan-400">
                    →
                  </span>

                  <span className="text-sm font-semibold text-white">
                    {riskData.request.destination}
                  </span>

                </div>

              </div>


              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950">

                  <Ship
                    size={16}
                    className="text-cyan-400"
                  />

                </div>

                <div>

                  <p className="text-xs font-semibold text-white">
                    {riskData.request.vessel}
                  </p>

                  <p className="text-[10px] text-slate-600">
                    {riskData.request.cargo} ·{" "}
                    {Number(
                      riskData.request.cargo_quantity
                    ).toLocaleString()}{" "}
                    tonnes
                  </p>

                </div>

              </div>

            </div>

          </section>


          {/* =================================================
              ML INTEGRATION
          ================================================= */}

          <section className="rounded-xl border border-dashed border-slate-700 bg-slate-950/30 p-6">

            <div className="flex items-start gap-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10">

                <Brain
                  size={20}
                  className="text-cyan-400"
                />

              </div>

              <div>

                <p className="text-sm font-semibold text-slate-300">
                  AI / ML Risk Integration
                </p>

                <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-600">
                  The frontend is now connected to the
                  backend risk endpoint. Your ML teammate
                  can replace the current demonstration
                  calculations with model predictions without
                  requiring changes to this page's API flow.
                </p>

              </div>

            </div>


            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">

              <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">

                <p className="text-[10px] uppercase tracking-wider text-slate-600">
                  Risk API
                </p>

                <p className="mt-2 text-sm font-semibold text-emerald-400">
                  Connected
                </p>

              </div>


              <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">

                <p className="text-[10px] uppercase tracking-wider text-slate-600">
                  ML Model
                </p>

                <p className="mt-2 text-sm font-semibold text-amber-400">
                  Backend Demo
                </p>

              </div>


              <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">

                <p className="text-[10px] uppercase tracking-wider text-slate-600">
                  Database
                </p>

                <p className="mt-2 text-sm font-semibold text-slate-400">
                  Future Integration
                </p>

              </div>

            </div>

          </section>


          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="flex items-center gap-2 px-1 pb-4">

            <Activity
              size={13}
              className="text-slate-700"
            />

            <p className="text-[10px] text-slate-700">
              Risk values are currently supplied by the
              FastAPI backend. Replace the backend demo
              calculations with the ML model when ready.
            </p>

          </div>

        </>
      )}

    </div>
  )
}

export default RiskIntelligence