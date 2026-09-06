import { useEffect, useState } from "react"

const API_URL = "http://127.0.0.1:8000"

function Ports() {
  const [selectedPort, setSelectedPort] = useState(null)
  const [ports, setPorts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // =====================================================
  // LOAD PORT DATA FROM FASTAPI
  // =====================================================

  const loadPorts = async () => {
    try {
      setLoading(true)
      setError("")

      const response = await fetch(
        `${API_URL}/api/ports`
      )

      if (!response.ok) {
        throw new Error("Unable to load port data")
      }

      const data = await response.json()

      setPorts(data.ports || [])
    } catch (err) {
      console.error("Port API error:", err)

      setError(
        "Unable to connect to the port service."
      )

      // Temporary fallback data
      // Remove this later when the real database/API
      // is connected.
      setPorts([
        {
          id: "PARADIP",
          name: "Paradip",
          country: "India",
          draft: "18.5 m",
          loa: "300 m",
          beam: "45 m",
          handling: "75,000 t/day",
          congestion: "Moderate",
          wait: "1–2 days",
          vessels: "Supramax · Panamax",
          status: "Operational",
        },
        {
          id: "VISAKHAPATNAM",
          name: "Visakhapatnam",
          country: "India",
          draft: "18.0 m",
          loa: "300 m",
          beam: "45 m",
          handling: "70,000 t/day",
          congestion: "Low",
          wait: "< 1 day",
          vessels: "Supramax · Panamax",
          status: "Operational",
        },
        {
          id: "GANGAVARAM",
          name: "Gangavaram",
          country: "India",
          draft: "18.5 m",
          loa: "300 m",
          beam: "48 m",
          handling: "80,000 t/day",
          congestion: "Low",
          wait: "< 1 day",
          vessels: "Panamax · Capesize",
          status: "Operational",
        },
        {
          id: "HALDIA",
          name: "Haldia",
          country: "India",
          draft: "10.5 m",
          loa: "230 m",
          beam: "36 m",
          handling: "45,000 t/day",
          congestion: "High",
          wait: "2–3 days",
          vessels: "Handysize · Supramax",
          status: "Operational",
        },
        {
          id: "DHAMRA",
          name: "Dhamra",
          country: "India",
          draft: "18.5 m",
          loa: "300 m",
          beam: "45 m",
          handling: "70,000 t/day",
          congestion: "Moderate",
          wait: "1–2 days",
          vessels: "Panamax · Capesize",
          status: "Operational",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadPorts()
  }, [])

  // =====================================================
  // CONGESTION STYLE
  // =====================================================

  const getCongestionStyle = (congestion) => {
    if (congestion === "Low") {
      return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
    }

    if (congestion === "High") {
      return "text-red-400 bg-red-400/10 border-red-400/20"
    }

    return "text-amber-400 bg-amber-400/10 border-amber-400/20"
  }

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />

            <p className="text-sm text-slate-400">
              Loading port intelligence...
            </p>
          </div>
        </div>
      </div>
    )
  }

  // =====================================================
  // MAIN PAGE
  // =====================================================

  return (
    <div className="mx-auto max-w-7xl space-y-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <div>
        <div className="mb-2 flex items-center gap-2">

          <span className="h-2 w-2 rounded-full bg-cyan-400" />

          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Plate 08 — Port Intelligence
          </span>

        </div>

        <h1 className="text-3xl font-bold tracking-tight text-white">
          Can the vessel operate efficiently here?
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Indian East Coast discharge ports. Select a port
          for operational and vessel compatibility details.
        </p>
      </div>


      {/* =================================================
          API STATUS
      ================================================= */}

      {error && (
        <div className="flex items-center justify-between rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">

          <div>
            <p className="text-xs font-semibold text-amber-400">
              Demonstration data
            </p>

            <p className="mt-1 text-xs text-slate-500">
              The backend port service is unavailable.
              Temporary port data is being displayed.
            </p>
          </div>

          <button
            type="button"
            onClick={loadPorts}
            className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-400 transition hover:border-cyan-500/40 hover:text-cyan-400"
          >
            Retry
          </button>

        </div>
      )}


      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

        {/* Monitored */}

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">

          <p className="text-xs uppercase tracking-wider text-slate-500">
            Monitored Ports
          </p>

          <p className="mt-2 text-3xl font-bold text-white">
            {ports.length}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Indian East Coast
          </p>

        </div>


        {/* Operational */}

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">

          <p className="text-xs uppercase tracking-wider text-slate-500">
            Operational
          </p>

          <p className="mt-2 text-3xl font-bold text-emerald-400">
            {
              ports.filter(
                (port) =>
                  port.status === "Operational"
              ).length
            }
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Ports currently operational
          </p>

        </div>


        {/* Attention */}

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">

          <p className="text-xs uppercase tracking-wider text-slate-500">
            Attention
          </p>

          <p className="mt-2 text-3xl font-bold text-amber-400">
            {
              ports.filter(
                (port) =>
                  port.congestion !== "Low"
              ).length
            }
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Ports with congestion
          </p>

        </div>

      </div>


      {/* =================================================
          PORT CARDS
      ================================================= */}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

        {ports.map((port) => (

          <button
            key={port.id || port.name}
            type="button"
            onClick={() =>
              setSelectedPort(port)
            }
            className="group rounded-xl border border-slate-800 bg-slate-900/50 p-5 text-left transition hover:border-cyan-500/40 hover:bg-slate-900"
          >

            <div className="flex items-start justify-between">

              <div>

                <h2 className="text-lg font-semibold text-white">
                  {port.name}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {port.country}
                </p>

              </div>

              <span
                className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${getCongestionStyle(
                  port.congestion
                )}`}
              >
                {port.congestion}
              </span>

            </div>


            {/* Metrics */}

            <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">

              <div>

                <p className="text-[10px] uppercase tracking-wider text-slate-600">
                  Max Draft
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-300">
                  {port.draft}
                </p>

              </div>


              <div>

                <p className="text-[10px] uppercase tracking-wider text-slate-600">
                  Max LOA
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-300">
                  {port.loa}
                </p>

              </div>


              <div>

                <p className="text-[10px] uppercase tracking-wider text-slate-600">
                  Handling
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-300">
                  {port.handling}
                </p>

              </div>


              <div>

                <p className="text-[10px] uppercase tracking-wider text-slate-600">
                  Avg. Wait
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-300">
                  {port.wait}
                </p>

              </div>

            </div>


            {/* Bottom information */}

            <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-4">

              <span className="text-xs text-slate-500">
                Compatible: {port.vessels}
              </span>

              <span className="text-xs font-medium text-cyan-400 opacity-70 transition group-hover:opacity-100">
                View details →
              </span>

            </div>

          </button>

        ))}

      </div>


      {/* =================================================
          SELECTED PORT
      ================================================= */}

      {selectedPort && (

        <div className="rounded-xl border border-cyan-500/20 bg-slate-900/70 p-6">

          {/* Header */}

          <div className="flex items-start justify-between">

            <div>

              <p className="text-xs uppercase tracking-[0.15em] text-cyan-400">
                Port Detail
              </p>

              <h2 className="mt-1 text-2xl font-bold text-white">
                {selectedPort.name}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {selectedPort.country}
              </p>

            </div>


            <button
              type="button"
              onClick={() =>
                setSelectedPort(null)
              }
              className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-400 transition hover:border-slate-600 hover:text-white"
            >
              Close
            </button>

          </div>


          {/* Main specifications */}

          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">

            <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">

              <p className="text-[10px] uppercase tracking-wider text-slate-600">
                Max Draft
              </p>

              <p className="mt-2 text-lg font-semibold text-white">
                {selectedPort.draft}
              </p>

            </div>


            <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">

              <p className="text-[10px] uppercase tracking-wider text-slate-600">
                Max LOA
              </p>

              <p className="mt-2 text-lg font-semibold text-white">
                {selectedPort.loa}
              </p>

            </div>


            <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">

              <p className="text-[10px] uppercase tracking-wider text-slate-600">
                Max Beam
              </p>

              <p className="mt-2 text-lg font-semibold text-white">
                {selectedPort.beam}
              </p>

            </div>


            <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">

              <p className="text-[10px] uppercase tracking-wider text-slate-600">
                Avg. Wait
              </p>

              <p className="mt-2 text-lg font-semibold text-white">
                {selectedPort.wait}
              </p>

            </div>

          </div>


          {/* Additional information */}

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">

            <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">

              <p className="text-xs text-slate-500">
                Handling Capacity
              </p>

              <p className="mt-2 text-sm font-semibold text-white">
                {selectedPort.handling}
              </p>

            </div>


            <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">

              <p className="text-xs text-slate-500">
                Congestion
              </p>

              <p
                className={`mt-2 text-sm font-semibold ${
                  selectedPort.congestion === "Low"
                    ? "text-emerald-400"
                    : selectedPort.congestion === "High"
                    ? "text-red-400"
                    : "text-amber-400"
                }`}
              >
                {selectedPort.congestion}
              </p>

            </div>


            <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">

              <p className="text-xs text-slate-500">
                Compatible Vessels
              </p>

              <p className="mt-2 text-sm font-semibold text-white">
                {selectedPort.vessels}
              </p>

            </div>

          </div>


          {/* Future integration */}

          <div className="mt-6 rounded-lg border border-dashed border-slate-700 bg-slate-950/30 p-4">

            <p className="text-xs font-semibold text-slate-400">
              Live Data Integration
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-600">
              Reserved for live port traffic, weather,
              congestion, database information, and
              AI-generated operational recommendations.
            </p>

          </div>

        </div>

      )}

    </div>
  )
}

export default Ports