import {
  LogIn,
  UserPlus,
  Ship,
  ArrowRight,
} from "lucide-react"

import { useNavigate } from "react-router-dom"

function Landing() {
  const navigate = useNavigate()

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020b12] text-white">

      {/* =====================================================
          BACKGROUND IMAGE
      ===================================================== */}

      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/download (10).jpeg')",
        }}
      />

      {/* =====================================================
          DARK OVERLAY
      ===================================================== */}

      <div className="absolute inset-0 bg-slate-950/55" />

      {/* =====================================================
          GRADIENT OVERLAY
      ===================================================== */}

      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/30 to-slate-950/85" />


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="relative z-10 flex min-h-screen flex-col">

        {/* ===================================================
            TOP BRAND
        =================================================== */}

        <header className="flex items-center justify-between px-6 py-6 md:px-10">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 backdrop-blur">

              <Ship
                size={21}
                className="text-cyan-400"
              />

            </div>

            <div>

              <p className="text-sm font-bold tracking-wide text-white">
                AOUT-FREIGHT
              </p>

              <p className="text-[8px] uppercase tracking-[0.2em] text-cyan-400">
                Freight Intelligence
              </p>

            </div>

          </div>


          <div className="hidden items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-slate-400 md:flex">

            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

            Intelligence Platform

          </div>

        </header>


        {/* ===================================================
            CENTER CONTENT
        =================================================== */}

        <main className="flex flex-1 items-center justify-center px-5 py-12">

          <div className="w-full max-w-3xl text-center">

            {/* SHIP ICON */}

            <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-2xl border border-cyan-400/30 bg-slate-950/40 shadow-[0_0_50px_rgba(34,211,238,0.15)] backdrop-blur">

              <Ship
                size={40}
                strokeWidth={1.5}
                className="text-cyan-400"
              />

            </div>


            {/* BRAND */}

            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-400">
              AOUT-FREIGHT
            </p>


            {/* TITLE */}

            <h1 className="mt-4 text-4xl font-black tracking-tight text-white drop-shadow-2xl sm:text-5xl md:text-6xl">

              Intelligent Freight
              <span className="block text-cyan-400">
                Intelligence Platform
              </span>

            </h1>


            {/* DIVIDER */}

            <div className="mx-auto mt-6 flex items-center justify-center gap-2">

              <span className="h-px w-12 bg-cyan-400/40" />

              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />

              <span className="h-px w-12 bg-cyan-400/40" />

            </div>


            {/* DESCRIPTION */}

            <p className="mx-auto mt-6 max-w-2xl text-sm leading-6 text-slate-300 drop-shadow-lg md:text-base">

              Advanced analytics, market insights,
              route intelligence, and AI-powered
              decision support for smarter freight
              operations.

            </p>


            {/* =================================================
                BUTTONS
            ================================================= */}

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">

              {/* LOGIN */}

              <button
                type="button"
                onClick={() =>
                  navigate("/login")
                }
                className="group flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-400 px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.2)] transition hover:bg-cyan-300 hover:shadow-[0_0_40px_rgba(34,211,238,0.3)] sm:w-auto"
              >

                <LogIn size={16} />

                Login

                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />

              </button>


              {/* REGISTER */}

              <button
                type="button"
                onClick={() =>
                  navigate("/register")
                }
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-400/60 bg-slate-950/30 px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-cyan-300 backdrop-blur transition hover:bg-cyan-400/10 hover:text-cyan-200 sm:w-auto"
              >

                <UserPlus size={16} />

                Register

              </button>

            </div>


            {/* SMALL STATUS */}

            <div className="mt-8 flex items-center justify-center gap-2">

              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

              <span className="text-[9px] uppercase tracking-[0.18em] text-slate-400">
                Secure freight intelligence environment
              </span>

            </div>

          </div>

        </main>


        {/* ===================================================
            FOOTER
        =================================================== */}

        <footer className="px-6 pb-7 text-center">

          <p className="text-[10px] text-slate-400">
            © 2025 AOUT-FREIGHT. All rights reserved.
          </p>

          <div className="mt-2 flex items-center justify-center gap-3 text-[9px] uppercase tracking-wider text-cyan-400/70">

            <span>
              Intelligence
            </span>

            <span>•</span>

            <span>
              Insights
            </span>

            <span>•</span>

            <span>
              Innovation
            </span>

          </div>

        </footer>

      </div>

    </div>
  )
}

export default Landing