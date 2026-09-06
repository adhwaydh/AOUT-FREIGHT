import {
  Ship,
  Navigation,
  Clock3,
  Route,
  Radio,
} from "lucide-react";

function RouteTracker() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#061724]">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">

        <div>
          <div className="flex items-center gap-2">

            <h2 className="font-semibold">
              Live Route Tracker
            </h2>

            <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-1 text-[9px] text-green-400">

              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />

              LIVE

            </span>

          </div>

          <p className="mt-1 text-xs text-slate-500">
            Vessel movement and route status
          </p>
        </div>


        <Radio
          size={17}
          className="text-cyan-400"
        />

      </div>


      {/* Map */}
      <div className="relative h-72 overflow-hidden bg-[#03121f]">

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,211,238,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,.08) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />


        {/* Ocean glow */}
        <div className="absolute left-1/3 top-1/4 h-40 w-40 rounded-full bg-cyan-500/5 blur-3xl" />


        {/* Route */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 800 400"
          preserveAspectRatio="none"
        >

          <path
            d="M120 300 C250 250, 340 310, 450 190 S620 110, 700 80"
            fill="none"
            stroke="#22d3ee"
            strokeWidth="7"
            opacity="0.06"
          />

          <path
            d="M120 300 C250 250, 340 310, 450 190 S620 110, 700 80"
            fill="none"
            stroke="#22d3ee"
            strokeWidth="2"
            strokeDasharray="7 8"
          />

        </svg>


        {/* Origin */}
        <div className="absolute left-[12%] top-[70%]">

          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan-400/50 bg-cyan-500/10">

            <Navigation
              size={14}
              className="text-cyan-400"
            />

          </div>

          <p className="mt-2 text-[9px] font-semibold text-cyan-400">
            SINGAPORE
          </p>

        </div>


        {/* Destination */}
        <div className="absolute right-[8%] top-[17%]">

          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-400 bg-cyan-400/10 shadow-[0_0_20px_rgba(34,211,238,.25)]">

            <div className="h-2.5 w-2.5 rounded-full bg-cyan-400" />

          </div>

          <p className="mt-2 text-[9px] font-semibold text-white">
            VISAKHAPATNAM
          </p>

        </div>


        {/* Ship */}
        <div className="ship-marker">

          <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-500/10 shadow-[0_0_25px_rgba(34,211,238,.4)]">

            <div className="absolute inset-0 animate-ping rounded-full bg-cyan-400/5" />

            <Ship
              size={25}
              className="relative z-10 text-white"
            />

          </div>

        </div>


        {/* Route label */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-slate-700 bg-slate-950/80 px-3 py-1.5 backdrop-blur">

          <p className="text-[9px] text-slate-400">
            SINGAPORE → VISAKHAPATNAM
          </p>

        </div>

      </div>


      {/* Data */}
      <div className="grid grid-cols-2 divide-x divide-y divide-slate-800 md:grid-cols-4 md:divide-y-0">

        <div className="p-4">

          <div className="flex items-center gap-2 text-slate-500">
            <Ship size={13} />
            <span className="text-[9px]">VESSEL</span>
          </div>

          <p className="mt-2 text-xs font-semibold">
            Oceanic Star
          </p>

        </div>


        <div className="p-4">

          <div className="flex items-center gap-2 text-slate-500">
            <Navigation size={13} />
            <span className="text-[9px]">SPEED</span>
          </div>

          <p className="mt-2 text-xs font-semibold">
            13.8 kn
          </p>

        </div>


        <div className="p-4">

          <div className="flex items-center gap-2 text-slate-500">
            <Clock3 size={13} />
            <span className="text-[9px]">ETA</span>
          </div>

          <p className="mt-2 text-xs font-semibold">
            4 days
          </p>

        </div>


        <div className="p-4">

          <div className="flex items-center gap-2 text-slate-500">
            <Route size={13} />
            <span className="text-[9px]">DISTANCE</span>
          </div>

          <p className="mt-2 text-xs font-semibold">
            2,834 NM
          </p>

        </div>

      </div>

    </div>
  );
}

export default RouteTracker;