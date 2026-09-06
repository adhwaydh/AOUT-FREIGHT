import {
  Anchor,
  Clock3,
  Ship,
  ArrowRight,
} from "lucide-react";


function PortCongestion({ data = [] }) {

  const ports = Array.isArray(data) ? data : [];


  const getStatusClasses = (status) => {

    switch (status?.toLowerCase()) {

      case "low":
        return "bg-green-500/10 text-green-400";

      case "moderate":
        return "bg-yellow-500/10 text-yellow-400";

      case "high":
        return "bg-red-500/10 text-red-400";

      default:
        return "bg-slate-500/10 text-slate-400";
    }
  };


  return (
    <div className="rounded-xl border border-slate-800 bg-[#061724] p-5">

      {/* =========================================
          HEADER
          ========================================= */}

      <div className="flex items-start justify-between">

        <div>

          <div className="flex items-center gap-2">

            <h2 className="font-semibold text-white">
              Port Intelligence
            </h2>

            <span className="rounded-full bg-cyan-500/10 px-2 py-1 text-[8px] font-medium text-cyan-400">
              LIVE
            </span>

          </div>

          <p className="mt-1 text-xs text-slate-500">
            Current congestion and vessel traffic
          </p>

        </div>


        <Anchor
          size={19}
          className="text-cyan-400"
        />

      </div>


      {/* =========================================
          PORT LIST
          ========================================= */}

      <div className="mt-5 space-y-3">

        {ports.length > 0 ? (

          ports.map((port, index) => (

            <div
              key={`${port.name}-${index}`}
              className="rounded-lg border border-slate-800 bg-slate-900/50 p-4 transition hover:border-cyan-500/20"
            >

              {/* Port name + status */}

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10">

                    <Anchor
                      size={15}
                      className="text-cyan-400"
                    />

                  </div>


                  <div>

                    <p className="text-xs font-semibold text-white">
                      {port.name}
                    </p>

                    <p className="mt-1 text-[9px] text-slate-600">
                      Port operations
                    </p>

                  </div>

                </div>


                {/* Status */}

                <span
                  className={`rounded-full px-2 py-1 text-[8px] font-medium ${getStatusClasses(
                    port.status
                  )}`}
                >
                  {port.status}
                </span>

              </div>


              {/* Port statistics */}

              <div className="mt-4 grid grid-cols-2 gap-3">


                {/* Waiting */}

                <div className="flex items-center gap-2">

                  <Clock3
                    size={13}
                    className="text-slate-600"
                  />

                  <div>

                    <p className="text-[8px] uppercase tracking-wider text-slate-600">
                      Waiting
                    </p>

                    <p className="mt-1 text-[11px] font-medium text-slate-300">
                      {port.waiting_hours} hrs
                    </p>

                  </div>

                </div>


                {/* Vessels */}

                <div className="flex items-center gap-2">

                  <Ship
                    size={13}
                    className="text-slate-600"
                  />

                  <div>

                    <p className="text-[8px] uppercase tracking-wider text-slate-600">
                      Vessels
                    </p>

                    <p className="mt-1 text-[11px] font-medium text-slate-300">
                      {port.vessels}
                    </p>

                  </div>

                </div>

              </div>


              {/* Congestion indicator */}

              <div className="mt-4">

                <div className="mb-2 flex justify-between">

                  <span className="text-[8px] uppercase tracking-wider text-slate-600">
                    Congestion Level
                  </span>

                  <span className="text-[8px] text-slate-500">
                    {port.status}
                  </span>

                </div>


                <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">

                  <div
                    className={`h-full rounded-full transition-all ${
                      port.status?.toLowerCase() === "low"
                        ? "w-[30%] bg-green-400"
                        : port.status?.toLowerCase() === "moderate"
                        ? "w-[60%] bg-yellow-400"
                        : port.status?.toLowerCase() === "high"
                        ? "w-[90%] bg-red-400"
                        : "w-[40%] bg-slate-500"
                    }`}
                  />

                </div>

              </div>

            </div>

          ))

        ) : (

          /* =========================================
             EMPTY STATE
             ========================================= */

          <div className="rounded-lg border border-dashed border-slate-800 p-6 text-center">

            <Anchor
              size={22}
              className="mx-auto text-slate-700"
            />

            <p className="mt-3 text-xs text-slate-500">
              No port data available
            </p>

            <p className="mt-1 text-[9px] text-slate-700">
              Waiting for backend data
            </p>

          </div>

        )}

      </div>


      {/* =========================================
          FOOTER
          ========================================= */}

      <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900 py-2.5 text-[10px] font-medium text-slate-400 transition hover:border-cyan-500/30 hover:text-cyan-400">

        View Port Intelligence

        <ArrowRight size={12} />

      </button>


      {/* API STATUS */}

      <div className="mt-4 flex items-center justify-center gap-2">

        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />

        <span className="text-[8px] text-slate-600">
          Port data from AOUT-FREIGHT API
        </span>

      </div>

    </div>
  );
}


export default PortCongestion;