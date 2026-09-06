import {
  Ship,
  Gauge,
  ArrowRight,
} from "lucide-react";


function VesselAvailability({ data = [] }) {

  const vessels = Array.isArray(data) ? data : [];


  return (
    <div className="rounded-xl border border-slate-800 bg-[#061724] p-5">

      {/* =========================================
          HEADER
          ========================================= */}

      <div className="flex items-start justify-between">

        <div>

          <div className="flex items-center gap-2">

            <h2 className="font-semibold text-white">
              Vessel Availability
            </h2>

            <span className="rounded-full bg-cyan-500/10 px-2 py-1 text-[8px] font-medium text-cyan-400">
              LIVE
            </span>

          </div>

          <p className="mt-1 text-xs text-slate-500">
            Current vessel availability
          </p>

        </div>


        <Ship
          size={19}
          className="text-cyan-400"
        />

      </div>


      {/* =========================================
          VESSEL LIST
          ========================================= */}

      <div className="mt-5 space-y-3">

        {vessels.length > 0 ? (

          vessels.map((vessel, index) => (

            <div
              key={`${vessel.name}-${index}`}
              className="rounded-lg border border-slate-800 bg-slate-900/50 p-4 transition hover:border-cyan-500/20"
            >

              {/* Vessel name + status */}

              <div className="flex items-center justify-between">

                <div className="flex min-w-0 items-center gap-3">

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10">

                    <Ship
                      size={15}
                      className="text-cyan-400"
                    />

                  </div>


                  <div className="min-w-0">

                    <p className="truncate text-xs font-semibold text-white">
                      {vessel.name}
                    </p>

                    <p className="mt-1 text-[9px] text-slate-600">
                      {vessel.type}
                    </p>

                  </div>

                </div>


                {/* Status */}

                <span
                  className={`shrink-0 rounded-full px-2 py-1 text-[8px] font-medium ${
                    vessel.status === "Available"
                      ? "bg-green-500/10 text-green-400"
                      : vessel.status === "In Transit"
                      ? "bg-cyan-500/10 text-cyan-400"
                      : "bg-yellow-500/10 text-yellow-400"
                  }`}
                >
                  {vessel.status}
                </span>

              </div>


              {/* Vessel details */}

              <div className="mt-4 grid grid-cols-2 gap-3">

                <div>

                  <p className="text-[8px] uppercase tracking-wider text-slate-600">
                    Capacity
                  </p>

                  <p className="mt-1 text-[11px] font-medium text-slate-300">
                    {vessel.capacity}
                  </p>

                </div>


                <div>

                  <div className="flex items-center gap-1">

                    <Gauge
                      size={10}
                      className="text-slate-600"
                    />

                    <p className="text-[8px] uppercase tracking-wider text-slate-600">
                      Speed
                    </p>

                  </div>

                  <p className="mt-1 text-[11px] font-medium text-slate-300">
                    {vessel.speed} kn
                  </p>

                </div>

              </div>

            </div>

          ))

        ) : (

          /* =========================================
             EMPTY STATE
             ========================================= */

          <div className="rounded-lg border border-dashed border-slate-800 p-6 text-center">

            <Ship
              size={22}
              className="mx-auto text-slate-700"
            />

            <p className="mt-3 text-xs text-slate-500">
              No vessel data available
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

        View All Vessels

        <ArrowRight size={12} />

      </button>


      {/* API STATUS */}

      <div className="mt-4 flex items-center justify-center gap-2">

        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />

        <span className="text-[8px] text-slate-600">
          Vessel data from AOUT-FREIGHT API
        </span>

      </div>

    </div>
  );
}


export default VesselAvailability;