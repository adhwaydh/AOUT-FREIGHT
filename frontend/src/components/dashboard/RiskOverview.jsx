import {
  ShieldAlert,
  CloudLightning,
  Globe2,
  TrendingDown,
  ArrowRight,
} from "lucide-react";


function RiskOverview({ data = [] }) {

  const risks = Array.isArray(data) ? data : [];


  // =========================================
  // RISK CONFIGURATION
  // =========================================

  const getRiskConfig = (level) => {

    switch (level?.toLowerCase()) {

      case "high":
        return {
          color: "text-red-400",
          bg: "bg-red-500/10",
          border: "border-red-500/20",
          width: "w-[85%]",
          bar: "bg-red-400",
        };

      case "moderate":
        return {
          color: "text-yellow-400",
          bg: "bg-yellow-500/10",
          border: "border-yellow-500/20",
          width: "w-[60%]",
          bar: "bg-yellow-400",
        };

      case "low":
        return {
          color: "text-green-400",
          bg: "bg-green-500/10",
          border: "border-green-500/20",
          width: "w-[30%]",
          bar: "bg-green-400",
        };

      default:
        return {
          color: "text-slate-400",
          bg: "bg-slate-500/10",
          border: "border-slate-500/20",
          width: "w-[40%]",
          bar: "bg-slate-400",
        };
    }
  };


  // =========================================
  // RISK ICON
  // =========================================

  const getRiskIcon = (title) => {

    const name = title?.toLowerCase() || "";

    if (name.includes("weather")) {
      return CloudLightning;
    }

    if (name.includes("geopolitical")) {
      return Globe2;
    }

    if (name.includes("market")) {
      return TrendingDown;
    }

    return ShieldAlert;
  };


  // =========================================
  // OVERALL RISK
  // =========================================

  const highRisks = risks.filter(
    (risk) => risk.level?.toLowerCase() === "high"
  ).length;

  const moderateRisks = risks.filter(
    (risk) => risk.level?.toLowerCase() === "moderate"
  ).length;


  let overallRisk = "Low";

  if (highRisks > 0) {
    overallRisk = "High";
  } else if (moderateRisks > 0) {
    overallRisk = "Moderate";
  }


  const overallConfig = getRiskConfig(overallRisk);


  return (
    <div className="rounded-xl border border-slate-800 bg-[#061724] p-5">

      {/* =========================================
          HEADER
          ========================================= */}

      <div className="flex items-start justify-between">

        <div>

          <div className="flex items-center gap-2">

            <h2 className="font-semibold text-white">
              Risk Overview
            </h2>

            <span className="rounded-full bg-cyan-500/10 px-2 py-1 text-[8px] font-medium text-cyan-400">
              LIVE
            </span>

          </div>

          <p className="mt-1 text-xs text-slate-500">
            Current operational and market risks
          </p>

        </div>


        <ShieldAlert
          size={19}
          className="text-cyan-400"
        />

      </div>


      {/* =========================================
          OVERALL RISK
          ========================================= */}

      <div className="mt-5 rounded-lg border border-slate-800 bg-slate-900/50 p-4">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-[9px] uppercase tracking-wider text-slate-600">
              Overall Risk
            </p>

            <p
              className={`mt-1 text-xl font-bold ${overallConfig.color}`}
            >
              {overallRisk}
            </p>

          </div>


          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${overallConfig.bg}`}
          >

            <ShieldAlert
              size={19}
              className={overallConfig.color}
            />

          </div>

        </div>


        {/* Overall risk bar */}

        <div className="mt-4">

          <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">

            <div
              className={`h-full rounded-full ${overallConfig.width} ${overallConfig.bar} transition-all duration-700`}
            />

          </div>

        </div>

      </div>


      {/* =========================================
          RISK LIST
          ========================================= */}

      <div className="mt-4 space-y-3">

        {risks.length > 0 ? (

          risks.map((risk, index) => {

            const config = getRiskConfig(risk.level);

            const Icon = getRiskIcon(risk.title);

            return (
              <div
                key={`${risk.title}-${index}`}
                className={`rounded-lg border ${config.border} bg-slate-900/40 p-3.5 transition hover:bg-slate-900/70`}
              >

                <div className="flex items-center justify-between">

                  <div className="flex min-w-0 items-center gap-3">

                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${config.bg}`}
                    >

                      <Icon
                        size={14}
                        className={config.color}
                      />

                    </div>


                    <div className="min-w-0">

                      <p className="truncate text-xs font-medium text-white">
                        {risk.title}
                      </p>

                      <p className="mt-1 truncate text-[9px] text-slate-600">
                        {risk.description}
                      </p>

                    </div>

                  </div>


                  <span
                    className={`shrink-0 rounded-full px-2 py-1 text-[8px] font-medium ${config.bg} ${config.color}`}
                  >
                    {risk.level}
                  </span>

                </div>


                {/* Risk indicator */}

                <div className="mt-3 h-1 overflow-hidden rounded-full bg-slate-800">

                  <div
                    className={`h-full rounded-full ${config.width} ${config.bar}`}
                  />

                </div>

              </div>
            );
          })

        ) : (

          /* =========================================
             EMPTY STATE
             ========================================= */

          <div className="rounded-lg border border-dashed border-slate-800 p-6 text-center">

            <ShieldAlert
              size={22}
              className="mx-auto text-slate-700"
            />

            <p className="mt-3 text-xs text-slate-500">
              No risk data available
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

        View Risk Intelligence

        <ArrowRight size={12} />

      </button>


      {/* API STATUS */}

      <div className="mt-4 flex items-center justify-center gap-2">

        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />

        <span className="text-[8px] text-slate-600">
          Risk data from AOUT-FREIGHT API
        </span>

      </div>

    </div>
  );
}


export default RiskOverview;