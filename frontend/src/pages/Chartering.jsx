import { API_URL } from "../config/api";
import { useMemo, useState } from "react"
import {
  Anchor,
  ArrowRight,
  Brain,
  CalendarDays,
  CheckCircle2,
  DollarSign,
  MapPin,
  Ship,
  Sparkles,
  Target,
  Weight,
} from "lucide-react"

function Chartering() {
  const [form, setForm] = useState({
    cargo: "Iron Ore",
    quantity: "50000",
    loadPort: "Paradip",
    dischargePort: "Visakhapatnam",
    laycan: "2026-09-15",
    vesselType: "Panamax",
  })

  const [recommendations, setRecommendations] = useState([])

  const [submitted, setSubmitted] = useState(false)

  const [loading, setLoading] = useState(false)

  const [error, setError] = useState("")

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))

    setSubmitted(false)
    setError("")
  }

  const bestRecommendation = useMemo(() => {
    if (recommendations.length === 0) {
      return null
    }

    return recommendations.reduce((best, current) =>
      current.score > best.score ? current : best
    )
  }, [recommendations])

  const handleAnalyze = async (event) => {
    event.preventDefault()

    setLoading(true)
    setSubmitted(false)
    setError("")

    try {
      const response = await fetch(
        `${API_URL}/api/chartering/recommend`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            cargo: form.cargo,
            quantity: Number(form.quantity),
            load_port: form.loadPort,
            discharge_port: form.dischargePort,
            laycan: form.laycan,
            vessel_type: form.vesselType,
          }),
        }
      )

      if (!response.ok) {
        const message = await response.text()

        throw new Error(
          message || "Chartering analysis failed."
        )
      }

      const data = await response.json()

      setRecommendations(
        data.recommendations || []
      )

      setSubmitted(true)
    } catch (err) {
      console.error("Chartering API error:", err)

      setError(
        "Unable to connect to the chartering backend. Make sure FastAPI is running on port 8000."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div>

        <div className="mb-2 flex items-center gap-2">

          <span className="h-2 w-2 rounded-full bg-cyan-400" />

          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Plate 11 — Chartering Intelligence
          </span>

        </div>

        <h1 className="text-3xl font-bold tracking-tight text-white">
          Chartering Recommendation
        </h1>

        <p className="mt-2 max-w-3xl text-sm text-slate-400">
          Define a cargo movement and review suitable
          vessel candidates for the proposed charter.
        </p>

      </div>


      {/* =====================================================
          INPUT + SUMMARY
      ===================================================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* FORM */}

        <form
          onSubmit={handleAnalyze}
          className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 xl:col-span-2"
        >

          <div className="flex items-start gap-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10">

              <Anchor
                size={20}
                className="text-cyan-400"
              />

            </div>

            <div>

              <p className="text-sm font-semibold text-white">
                Charter Requirements
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Enter the basic requirements for the
                proposed voyage.
              </p>

            </div>

          </div>


          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">

            {/* Cargo */}

            <div>

              <label className="mb-2 block text-xs text-slate-500">
                Cargo Type
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
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-cyan-500/50"
                  placeholder="e.g. Iron Ore"
                  required
                />

              </div>

            </div>


            {/* Quantity */}

            <div>

              <label className="mb-2 block text-xs text-slate-500">
                Cargo Quantity
              </label>

              <input
                value={form.quantity}
                onChange={(event) =>
                  updateField(
                    "quantity",
                    event.target.value
                  )
                }
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyan-500/50"
                placeholder="Quantity in tonnes"
                type="number"
                min="1"
                required
              />

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
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-3 text-sm text-white outline-none transition focus:border-cyan-500/50"
                  placeholder="Load port"
                  required
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
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-3 text-sm text-white outline-none transition focus:border-cyan-500/50"
                  placeholder="Discharge port"
                  required
                />

              </div>

            </div>


            {/* Laycan */}

            <div>

              <label className="mb-2 block text-xs text-slate-500">
                Laycan Start
              </label>

              <div className="relative">

                <CalendarDays
                  size={16}
                  className="absolute left-3 top-3 text-slate-600"
                />

                <input
                  value={form.laycan}
                  onChange={(event) =>
                    updateField(
                      "laycan",
                      event.target.value
                    )
                  }
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-3 text-sm text-white outline-none transition focus:border-cyan-500/50"
                  type="date"
                  required
                />

              </div>

            </div>


            {/* Vessel Type */}

            <div>

              <label className="mb-2 block text-xs text-slate-500">
                Preferred Vessel Type
              </label>

              <select
                value={form.vesselType}
                onChange={(event) =>
                  updateField(
                    "vesselType",
                    event.target.value
                  )
                }
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-500/50"
              >

                <option>Panamax</option>
                <option>Supramax</option>
                <option>Capesize</option>
                <option>Handysize</option>

              </select>

            </div>

          </div>


          {/* API status */}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-[10px] text-slate-600">

              {loading
                ? "Connecting to chartering recommendation engine..."
                : "Connected to FastAPI chartering endpoint."}

            </p>


            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-5 py-2.5 text-xs font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >

              <Sparkles size={15} />

              {loading
                ? "Analyzing..."
                : "Analyze Charter"}

            </button>

          </div>

        </form>


        {/* BEST MATCH */}

        <div className="rounded-xl border border-cyan-500/20 bg-slate-900/60 p-6">

          <div className="flex items-center gap-2">

            <Target
              size={18}
              className="text-cyan-400"
            />

            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-400">
              Best Current Match
            </p>

          </div>


          {!bestRecommendation ? (

            <div className="mt-8">

              <Ship
                size={28}
                className="text-slate-700"
              />

              <p className="mt-4 text-sm text-slate-500">
                Run a charter analysis to receive a
                vessel recommendation.
              </p>

            </div>

          ) : (

            <>

              <div className="mt-6">

                <p className="text-xs text-slate-500">
                  Recommended Vessel
                </p>

                <h2 className="mt-1 text-xl font-bold text-white">
                  {bestRecommendation.name}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {bestRecommendation.type} ·{" "}
                  {bestRecommendation.dwt}
                </p>

              </div>


              <div className="mt-6 flex items-end justify-between">

                <div>

                  <p className="text-[10px] uppercase tracking-wider text-slate-600">
                    Suitability
                  </p>

                  <p className="mt-1 text-4xl font-bold text-emerald-400">
                    {bestRecommendation.score}
                  </p>

                </div>

                <span className="text-xs text-slate-600">
                  / 100
                </span>

              </div>


              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">

                <div
                  className="h-full rounded-full bg-emerald-400"
                  style={{
                    width: `${bestRecommendation.score}%`,
                  }}
                />

              </div>


              <p className="mt-5 text-xs leading-5 text-slate-500">
                {bestRecommendation.reason}
              </p>

            </>

          )}

        </div>

      </div>


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (

        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">

          <p className="text-sm font-semibold text-red-400">
            Chartering API Error
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {error}
          </p>

        </div>

      )}


      {/* =====================================================
          SUCCESS
      ===================================================== */}

      {submitted && (

        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">

          <div className="flex items-start gap-3">

            <CheckCircle2
              size={19}
              className="mt-0.5 shrink-0 text-emerald-400"
            />

            <div>

              <p className="text-sm font-semibold text-emerald-400">
                Charter analysis completed
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                The backend returned{" "}
                {recommendations.length} vessel
                recommendation
                {recommendations.length === 1
                  ? ""
                  : "s"} for {form.cargo} from{" "}
                {form.loadPort} to{" "}
                {form.dischargePort}.
              </p>

            </div>

          </div>

        </div>

      )}


      {/* =====================================================
          VESSEL RECOMMENDATIONS
      ===================================================== */}

      <div>

        <div className="mb-4">

          <p className="text-xs uppercase tracking-[0.15em] text-slate-600">
            Candidate Vessels
          </p>

          <h2 className="mt-1 text-lg font-bold text-white">
            Recommended Charter Options
          </h2>

        </div>


        {recommendations.length === 0 ? (

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-8">

            <div className="flex items-center gap-4">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950">

                <Ship
                  size={19}
                  className="text-slate-700"
                />

              </div>

              <div>

                <p className="text-sm font-semibold text-slate-400">
                  No recommendations yet
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  Submit the charter requirements above
                  to request vessel recommendations.
                </p>

              </div>

            </div>

          </div>

        ) : (

          <div className="grid grid-cols-1 gap-4">

            {recommendations.map((vessel, index) => (

              <div
                key={`${vessel.name}-${index}`}
                className="rounded-xl border border-slate-800 bg-slate-900/50 p-5"
              >

                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                  {/* Vessel */}

                  <div className="flex items-start gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-800 bg-slate-950">

                      <Ship
                        size={20}
                        className="text-cyan-400"
                      />

                    </div>


                    <div>

                      <div className="flex flex-wrap items-center gap-2">

                        <h3 className="text-sm font-semibold text-white">
                          {vessel.name}
                        </h3>

                        {index === 0 && (

                          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-[9px] font-semibold text-emerald-400">
                            TOP MATCH
                          </span>

                        )}

                      </div>


                      <p className="mt-1 text-xs text-slate-500">
                        {vessel.type} · {vessel.dwt}
                      </p>


                      <p className="mt-2 max-w-xl text-xs leading-5 text-slate-600">
                        {vessel.reason}
                      </p>

                    </div>

                  </div>


                  {/* Metrics */}

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">

                    <div>

                      <p className="text-[9px] uppercase tracking-wider text-slate-600">
                        Draft
                      </p>

                      <p className="mt-1 text-xs font-semibold text-slate-300">
                        {vessel.draft}
                      </p>

                    </div>


                    <div>

                      <p className="text-[9px] uppercase tracking-wider text-slate-600">
                        Speed
                      </p>

                      <p className="mt-1 text-xs font-semibold text-slate-300">
                        {vessel.speed}
                      </p>

                    </div>


                    <div>

                      <p className="text-[9px] uppercase tracking-wider text-slate-600">
                        Est. Rate
                      </p>

                      <p className="mt-1 text-xs font-semibold text-slate-300">
                        {vessel.estimate}
                      </p>

                    </div>


                    <div>

                      <p className="text-[9px] uppercase tracking-wider text-slate-600">
                        Score
                      </p>

                      <p className="mt-1 text-xs font-semibold text-emerald-400">
                        {vessel.score}
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>


      {/* =====================================================
          AI INTEGRATION
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
              AI Chartering Recommendation
            </p>

            <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-600">
              The frontend is now connected to the
              FastAPI recommendation endpoint. The
              temporary backend values can later be
              replaced by the vessel database and ML
              recommendation model.
            </p>

          </div>

        </div>


        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">

          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">

            <p className="text-[10px] uppercase tracking-wider text-slate-600">
              ML Model
            </p>

            <p className="mt-2 text-sm font-semibold text-amber-400">
              Awaiting Integration
            </p>

          </div>


          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">

            <p className="text-[10px] uppercase tracking-wider text-slate-600">
              Vessel Database
            </p>

            <p className="mt-2 text-sm font-semibold text-slate-400">
              Integration Pending
            </p>

          </div>


          <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-4">

            <p className="text-[10px] uppercase tracking-wider text-slate-600">
              Recommendation API
            </p>

            <p className="mt-2 text-sm font-semibold text-cyan-400">
              Connected
            </p>

          </div>

        </div>

      </div>


      {/* =====================================================
          ROUTE SUMMARY
      ===================================================== */}

      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>

            <p className="text-[10px] uppercase tracking-wider text-slate-600">
              Proposed Movement
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


          <div className="flex items-center gap-2 text-xs text-slate-500">

            <DollarSign size={14} />

            <span>
              Commercial assessment{" "}
              {submitted ? "completed" : "ready"}
            </span>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Chartering