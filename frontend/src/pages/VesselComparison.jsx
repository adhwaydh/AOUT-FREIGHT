import { useEffect, useMemo, useState } from "react"
import {
  Activity,
  Anchor,
  Award,
  Brain,
  CheckCircle2,
  Clock3,
  Fuel,
  Gauge,
  Ship,
  TrendingDown,
  TrendingUp,
} from "lucide-react"

const API_BASE_URL = "http://127.0.0.1:8000"

function VesselComparison() {
  const [vessels, setVessels] = useState([])
  const [selectedIds, setSelectedIds] = useState([])

  const [loading, setLoading] = useState(true)
  const [comparing, setComparing] = useState(false)

  const [error, setError] = useState("")
  const [comparisonResult, setComparisonResult] = useState(null)

  /*
  ============================================================
  LOAD VESSELS FROM BACKEND
  ============================================================
  */

  useEffect(() => {
    const loadVessels = async () => {
      try {
        setLoading(true)
        setError("")

        const response = await fetch(
          `${API_BASE_URL}/api/vessel-comparison/available`
        )

        if (!response.ok) {
          throw new Error(
            `Server returned ${response.status}`
          )
        }

        const data = await response.json()

        const availableVessels = data.vessels || []

        setVessels(availableVessels)

        /*
          Automatically select the first 3 vessels.
        */

        setSelectedIds(
          availableVessels
            .slice(0, 3)
            .map((vessel) => vessel.id)
        )
      } catch (err) {
        console.error(
          "Failed to load vessels:",
          err
        )

        setError(
          "Unable to connect to the vessel comparison API."
        )
      } finally {
        setLoading(false)
      }
    }

    loadVessels()
  }, [])

  /*
  ============================================================
  SELECTED VESSELS
  ============================================================
  */

  const selectedVessels = useMemo(() => {
    return vessels.filter((vessel) =>
      selectedIds.includes(vessel.id)
    )
  }, [vessels, selectedIds])

  /*
  ============================================================
  BEST VESSEL
  ============================================================
  */

  const localBestVessel = useMemo(() => {
    if (selectedVessels.length === 0) {
      return null
    }

    return selectedVessels.reduce(
      (best, vessel) =>
        vessel.suitability > best.suitability
          ? vessel
          : best
    )
  }, [selectedVessels])

  /*
    Prefer backend best_match after comparison.
    Before comparison, use local calculation.
  */

  const bestVessel =
    comparisonResult?.best_match ||
    localBestVessel

  /*
  ============================================================
  TOGGLE VESSEL
  ============================================================
  */

  const toggleVessel = (id) => {
    setSelectedIds((current) => {
      if (current.includes(id)) {
        return current.filter(
          (vesselId) => vesselId !== id
        )
      }

      if (current.length >= 4) {
        return current
      }

      return [...current, id]
    })

    /*
      Clear previous backend comparison
      when selection changes.
    */

    setComparisonResult(null)
  }

  /*
  ============================================================
  COMPARE VESSELS WITH BACKEND
  ============================================================
  */

  const handleCompare = async () => {
    if (selectedIds.length === 0) {
      setError(
        "Select at least one vessel before comparing."
      )

      return
    }

    try {
      setComparing(true)
      setError("")

      const response = await fetch(
        `${API_BASE_URL}/api/vessel-comparison/compare`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            vessel_ids: selectedIds,
          }),
        }
      )

      if (!response.ok) {
        throw new Error(
          `Server returned ${response.status}`
        )
      }

      const data = await response.json()

      setComparisonResult(data)
    } catch (err) {
      console.error(
        "Vessel comparison failed:",
        err
      )

      setError(
        "Unable to compare vessels. Check that the FastAPI backend is running."
      )

      setComparisonResult(null)
    } finally {
      setComparing(false)
    }
  }

  /*
  ============================================================
  BEST VALUE HELPER
  ============================================================
  */

  const getBestClass = (
    value,
    values,
    lowerIsBetter = false
  ) => {
    if (!values.length) {
      return "text-slate-300"
    }

    const best = lowerIsBetter
      ? Math.min(...values)
      : Math.max(...values)

    return value === best
      ? "text-emerald-400"
      : "text-slate-300"
  }

  /*
  ============================================================
  LOADING STATE
  ============================================================
  */

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl">

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-10 text-center">

          <Ship
            size={30}
            className="mx-auto animate-pulse text-cyan-400"
          />

          <p className="mt-4 text-sm font-semibold text-white">
            Loading vessel data
          </p>

          <p className="mt-2 text-xs text-slate-500">
            Connecting to the vessel comparison API...
          </p>

        </div>

      </div>
    )
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
            Plate 13 — Vessel Comparison
          </span>

        </div>

        <h1 className="text-3xl font-bold tracking-tight text-white">
          Vessel Comparison
        </h1>

        <p className="mt-2 max-w-3xl text-sm text-slate-400">
          Compare candidate vessels across capacity,
          operating performance, cost, risk, and voyage
          suitability.
        </p>

      </div>


      {/* =====================================================
          API ERROR
      ===================================================== */}

      {error && (

        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">

          <div className="flex items-start gap-3">

            <Activity
              size={19}
              className="mt-0.5 shrink-0 text-red-400"
            />

            <div>

              <p className="text-sm font-semibold text-red-400">
                API Connection Problem
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                {error}
              </p>

            </div>

          </div>

        </div>

      )}


      {/* =====================================================
          VESSEL SELECTOR
      ===================================================== */}

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div className="flex items-start gap-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10">

              <Ship
                size={20}
                className="text-cyan-400"
              />

            </div>

            <div>

              <p className="text-sm font-semibold text-white">
                Select Vessels
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Select up to four vessels for comparison.
              </p>

            </div>

          </div>


          <div className="text-xs text-slate-600">
            {selectedVessels.length} / 4 selected
          </div>

        </div>


        {vessels.length === 0 ? (

          <div className="mt-6 rounded-lg border border-slate-800 bg-slate-950/40 p-8 text-center">

            <Ship
              size={28}
              className="mx-auto text-slate-700"
            />

            <p className="mt-3 text-sm text-slate-500">
              No vessels are currently available.
            </p>

          </div>

        ) : (

          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">

            {vessels.map((vessel) => {

              const selected =
                selectedIds.includes(vessel.id)

              const limitReached =
                selectedIds.length >= 4 &&
                !selected

              return (

                <button
                  key={vessel.id}
                  type="button"
                  disabled={limitReached}
                  onClick={() =>
                    toggleVessel(vessel.id)
                  }
                  className={`rounded-xl border p-4 text-left transition ${
                    selected
                      ? "border-cyan-500/40 bg-cyan-500/5"
                      : "border-slate-800 bg-slate-950/30 hover:border-slate-700"
                  } ${
                    limitReached
                      ? "cursor-not-allowed opacity-40"
                      : ""
                  }`}
                >

                  <div className="flex items-start justify-between">

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900">

                        <Ship
                          size={17}
                          className={
                            selected
                              ? "text-cyan-400"
                              : "text-slate-600"
                          }
                        />

                      </div>

                      <div>

                        <p className="text-xs font-semibold text-white">
                          {vessel.name}
                        </p>

                        <p className="mt-1 text-[10px] text-slate-600">
                          {vessel.type}
                        </p>

                      </div>

                    </div>


                    {selected && (

                      <CheckCircle2
                        size={17}
                        className="text-cyan-400"
                      />

                    )}

                  </div>


                  <div className="mt-4 flex justify-between">

                    <span className="text-[10px] text-slate-600">
                      {Number(vessel.dwt).toLocaleString()} DWT
                    </span>

                    <span
                      className={
                        vessel.availability ===
                        "Available"
                          ? "text-[10px] text-emerald-400"
                          : "text-[10px] text-amber-400"
                      }
                    >
                      {vessel.availability}
                    </span>

                  </div>

                </button>

              )
            })}

          </div>

        )}


        {/* Compare button */}

        <div className="mt-6 flex flex-col gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-[10px] text-slate-600">
            Comparison results are calculated by the backend API.
          </p>

          <button
            type="button"
            onClick={handleCompare}
            disabled={
              comparing ||
              selectedIds.length === 0
            }
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-5 py-2.5 text-xs font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          >

            {comparing ? (
              <>
                <Activity
                  size={15}
                  className="animate-pulse"
                />

                Comparing...
              </>
            ) : (
              <>
                <TrendingUp size={15} />

                Compare Vessels
              </>
            )}

          </button>

        </div>

      </div>


      {/* =====================================================
          BEST MATCH
      ===================================================== */}

      {bestVessel && (

        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6">

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10">

                <Award
                  size={21}
                  className="text-emerald-400"
                />

              </div>

              <div>

                <p className="text-[10px] uppercase tracking-[0.15em] text-emerald-400">
                  {comparisonResult
                    ? "Backend Best Match"
                    : "Current Best Match"}
                </p>

                <h2 className="mt-1 text-xl font-bold text-white">
                  {bestVessel.name}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {bestVessel.type} ·{" "}
                  {Number(
                    bestVessel.dwt
                  ).toLocaleString()}{" "}
                  DWT
                </p>

              </div>

            </div>


            <div className="flex items-center gap-6">

              <div>

                <p className="text-[10px] uppercase tracking-wider text-slate-600">
                  Suitability
                </p>

                <p className="mt-1 text-3xl font-bold text-emerald-400">
                  {bestVessel.suitability}
                </p>

              </div>


              <button
                type="button"
                onClick={handleCompare}
                disabled={comparing}
                className="rounded-lg bg-emerald-400 px-4 py-2.5 text-xs font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {comparing
                  ? "Comparing..."
                  : "Compare Results"}
              </button>

            </div>

          </div>

        </div>

      )}


      {/* =====================================================
          COMPARISON TABLE
      ===================================================== */}

      <div className="rounded-xl border border-slate-800 bg-slate-900/50">

        <div className="border-b border-slate-800 p-5">

          <p className="text-xs uppercase tracking-[0.15em] text-slate-600">
            Performance Matrix
          </p>

          <h2 className="mt-1 text-lg font-bold text-white">
            Side-by-Side Comparison
          </h2>

        </div>


        {selectedVessels.length === 0 ? (

          <div className="p-10 text-center">

            <Ship
              size={28}
              className="mx-auto text-slate-700"
            />

            <p className="mt-3 text-sm text-slate-500">
              Select at least one vessel to compare.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[800px]">

              <thead>

                <tr className="border-b border-slate-800">

                  <th className="w-44 px-5 py-4 text-left text-[10px] uppercase tracking-wider text-slate-600">
                    Metric
                  </th>

                  {selectedVessels.map(
                    (vessel) => (

                      <th
                        key={vessel.id}
                        className="px-5 py-4 text-left"
                      >

                        <p className="text-xs font-semibold text-white">
                          {vessel.name}
                        </p>

                        <p className="mt-1 text-[10px] text-slate-600">
                          {vessel.type}
                        </p>

                      </th>

                    )
                  )}

                </tr>

              </thead>


              <tbody>

                {/* DWT */}

                <tr className="border-b border-slate-800/70">

                  <td className="px-5 py-4 text-xs text-slate-500">
                    Cargo Capacity
                  </td>

                  {selectedVessels.map(
                    (vessel) => (

                      <td
                        key={vessel.id}
                        className={`px-5 py-4 text-sm font-semibold ${getBestClass(
                          vessel.dwt,
                          selectedVessels.map(
                            (v) => v.dwt
                          )
                        )}`}
                      >
                        {Number(
                          vessel.dwt
                        ).toLocaleString()}{" "}
                        DWT
                      </td>

                    )
                  )}

                </tr>


                {/* Draft */}

                <tr className="border-b border-slate-800/70">

                  <td className="px-5 py-4 text-xs text-slate-500">
                    Draft
                  </td>

                  {selectedVessels.map(
                    (vessel) => (

                      <td
                        key={vessel.id}
                        className="px-5 py-4 text-sm text-slate-300"
                      >
                        {vessel.draft} m
                      </td>

                    )
                  )}

                </tr>


                {/* Beam */}

                <tr className="border-b border-slate-800/70">

                  <td className="px-5 py-4 text-xs text-slate-500">
                    Beam
                  </td>

                  {selectedVessels.map(
                    (vessel) => (

                      <td
                        key={vessel.id}
                        className="px-5 py-4 text-sm text-slate-300"
                      >
                        {vessel.beam} m
                      </td>

                    )
                  )}

                </tr>


                {/* Speed */}

                <tr className="border-b border-slate-800/70">

                  <td className="px-5 py-4 text-xs text-slate-500">
                    Speed
                  </td>

                  {selectedVessels.map(
                    (vessel) => (

                      <td
                        key={vessel.id}
                        className={`px-5 py-4 text-sm font-semibold ${getBestClass(
                          vessel.speed,
                          selectedVessels.map(
                            (v) => v.speed
                          )
                        )}`}
                      >

                        <div className="flex items-center gap-2">

                          <Gauge size={14} />

                          {vessel.speed} kn

                        </div>

                      </td>

                    )
                  )}

                </tr>


                {/* Fuel */}

                <tr className="border-b border-slate-800/70">

                  <td className="px-5 py-4 text-xs text-slate-500">
                    Fuel Consumption
                  </td>

                  {selectedVessels.map(
                    (vessel) => (

                      <td
                        key={vessel.id}
                        className={`px-5 py-4 text-sm font-semibold ${getBestClass(
                          vessel.fuel,
                          selectedVessels.map(
                            (v) => v.fuel
                          ),
                          true
                        )}`}
                      >

                        <div className="flex items-center gap-2">

                          <Fuel size={14} />

                          {vessel.fuel} t/day

                        </div>

                      </td>

                    )
                  )}

                </tr>


                {/* Cost */}

                <tr className="border-b border-slate-800/70">

                  <td className="px-5 py-4 text-xs text-slate-500">
                    Operating Cost
                  </td>

                  {selectedVessels.map(
                    (vessel) => (

                      <td
                        key={vessel.id}
                        className={`px-5 py-4 text-sm font-semibold ${getBestClass(
                          vessel.cost,
                          selectedVessels.map(
                            (v) => v.cost
                          ),
                          true
                        )}`}
                      >
                        $
                        {Number(
                          vessel.cost
                        ).toLocaleString()}
                        /day
                      </td>

                    )
                  )}

                </tr>


                {/* ETA */}

                <tr className="border-b border-slate-800/70">

                  <td className="px-5 py-4 text-xs text-slate-500">
                    Estimated ETA
                  </td>

                  {selectedVessels.map(
                    (vessel) => (

                      <td
                        key={vessel.id}
                        className="px-5 py-4 text-sm text-slate-300"
                      >

                        <div className="flex items-center gap-2">

                          <Clock3 size={14} />

                          {vessel.eta}

                        </div>

                      </td>

                    )
                  )}

                </tr>


                {/* Risk */}

                <tr className="border-b border-slate-800/70">

                  <td className="px-5 py-4 text-xs text-slate-500">
                    Risk Score
                  </td>

                  {selectedVessels.map(
                    (vessel) => (

                      <td
                        key={vessel.id}
                        className={`px-5 py-4 text-sm font-semibold ${getBestClass(
                          vessel.risk,
                          selectedVessels.map(
                            (v) => v.risk
                          ),
                          true
                        )}`}
                      >
                        {vessel.risk}
                      </td>

                    )
                  )}

                </tr>


                {/* Suitability */}

                <tr>

                  <td className="px-5 py-4 text-xs font-semibold text-slate-400">
                    Suitability
                  </td>

                  {selectedVessels.map(
                    (vessel) => (

                      <td
                        key={vessel.id}
                        className={`px-5 py-4 text-lg font-bold ${getBestClass(
                          vessel.suitability,
                          selectedVessels.map(
                            (v) => v.suitability
                          )
                        )}`}
                      >
                        {vessel.suitability}
                      </td>

                    )
                  )}

                </tr>

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* =====================================================
          BACKEND COMPARISON RESULT
      ===================================================== */}

      {comparisonResult?.best_match && (

        <div className="rounded-xl border border-cyan-500/20 bg-slate-900/70 p-6">

          <div className="flex items-start gap-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10">

              <Activity
                size={20}
                className="text-cyan-400"
              />

            </div>

            <div>

              <p className="text-xs uppercase tracking-[0.15em] text-cyan-400">
                Backend Comparison Result
              </p>

              <h2 className="mt-1 text-xl font-bold text-white">
                {comparisonResult.best_match.name} is the strongest current candidate
              </h2>

              <p className="mt-2 max-w-3xl text-xs leading-5 text-slate-500">
                The backend selected this vessel based on
                the current suitability score returned by
                the vessel comparison service.
              </p>

            </div>

          </div>


          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">

            {/* Cost */}

            <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">

              <div className="flex items-center gap-2">

                <TrendingDown
                  size={15}
                  className="text-emerald-400"
                />

                <p className="text-[10px] uppercase tracking-wider text-slate-600">
                  Operating Cost
                </p>

              </div>

              <p className="mt-2 text-lg font-bold text-white">
                $
                {Number(
                  comparisonResult.best_match.cost
                ).toLocaleString()}
                /day
              </p>

            </div>


            {/* Fuel */}

            <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">

              <div className="flex items-center gap-2">

                <Fuel
                  size={15}
                  className="text-cyan-400"
                />

                <p className="text-[10px] uppercase tracking-wider text-slate-600">
                  Fuel Consumption
                </p>

              </div>

              <p className="mt-2 text-lg font-bold text-white">
                {comparisonResult.best_match.fuel}{" "}
                t/day
              </p>

            </div>


            {/* Suitability */}

            <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">

              <div className="flex items-center gap-2">

                <TrendingUp
                  size={15}
                  className="text-emerald-400"
                />

                <p className="text-[10px] uppercase tracking-wider text-slate-600">
                  Suitability
                </p>

              </div>

              <p className="mt-2 text-lg font-bold text-emerald-400">
                {comparisonResult.best_match.suitability}
                /100
              </p>

            </div>

          </div>

        </div>

      )}


      {/* =====================================================
          AI / DATABASE INTEGRATION
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
              AI Vessel Comparison
            </p>

            <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-600">
              Vessel information is now retrieved from the
              FastAPI backend. Later, the backend can replace
              demonstration data with the vessel database and
              ML ranking model without requiring changes to
              this page.
            </p>

          </div>

        </div>


        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">

          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">

            <p className="text-[10px] uppercase tracking-wider text-slate-600">
              Vessel Database
            </p>

            <p className="mt-2 text-sm font-semibold text-amber-400">
              Backend Ready
            </p>

          </div>


          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">

            <p className="text-[10px] uppercase tracking-wider text-slate-600">
              ML Ranking
            </p>

            <p className="mt-2 text-sm font-semibold text-amber-400">
              Awaiting Model
            </p>

          </div>


          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">

            <p className="text-[10px] uppercase tracking-wider text-slate-600">
              Comparison API
            </p>

            <p className="mt-2 text-sm font-semibold text-emerald-400">
              Connected
            </p>

          </div>

        </div>

      </div>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div className="flex items-center gap-2 px-1 pb-4">

        <Anchor
          size={13}
          className="text-slate-700"
        />

        <p className="text-[10px] text-slate-700">
          Vessel values are supplied by the AOUT-FREIGHT
          backend API.
        </p>

      </div>

    </div>
  )
}

export default VesselComparison