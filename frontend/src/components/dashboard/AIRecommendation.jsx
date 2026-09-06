import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";


function AIRecommendation({ data = null }) {

  // =========================================
  // SAFE DEFAULT
  // =========================================

  const recommendation = data || {
    decision: "ANALYSIS PENDING",
    confidence: 0,
    current_rate: 0,
    forecast_rate: 0,
    expected_change: 0,
    summary: "Waiting for recommendation data.",
    reasons: [],
    model_status: "integration_pending",
  };


  // =========================================
  // DECISION STYLE
  // =========================================

  const getDecisionStyle = (decision) => {

    const value = decision?.toLowerCase() || "";

    if (value.includes("charter")) {
      return {
        text: "text-green-400",
        bg: "bg-green-500/10",
        border: "border-green-500/20",
      };
    }

    if (value.includes("wait")) {
      return {
        text: "text-yellow-400",
        bg: "bg-yellow-500/10",
        border: "border-yellow-500/20",
      };
    }

    if (value.includes("avoid")) {
      return {
        text: "text-red-400",
        bg: "bg-red-500/10",
        border: "border-red-500/20",
      };
    }

    return {
      text: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
    };
  };


  const decisionStyle = getDecisionStyle(
    recommendation.decision
  );


  // =========================================
  // FORMAT RATES
  // =========================================

  const formatRate = (value) => {

    if (
      value === null ||
      value === undefined ||
      value === 0
    ) {
      return "—";
    }

    return `$${Number(value).toLocaleString()}`;
  };


  return (
    <div className="relative overflow-hidden rounded-xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-cyan-500/5 to-transparent p-6">

      {/* =========================================
          BACKGROUND GLOW
          ========================================= */}

      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="absolute -bottom-20 left-1/3 h-40 w-40 rounded-full bg-cyan-400/5 blur-3xl" />


      {/* =========================================
          CONTENT
          ========================================= */}

      <div className="relative">


        {/* Header */}

        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

          <div className="flex items-start gap-4">

            {/* AI icon */}

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-500/10">

              <Sparkles
                size={22}
                className="text-cyan-400"
              />

            </div>


            <div>

              <div className="flex flex-wrap items-center gap-2">

                <p className="text-sm font-semibold text-white">
                  AI Chartering Recommendation
                </p>


                <span className="rounded-full bg-cyan-500/10 px-2 py-1 text-[8px] font-medium text-cyan-400">
                  MODEL READY
                </span>

              </div>


              <p className="mt-1 text-[10px] text-slate-600">
                Decision support for freight chartering
              </p>

            </div>

          </div>


          {/* Integration status */}

          <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2">

            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />

            <span className="text-[9px] text-slate-500">

              {recommendation.model_status ===
              "integration_pending"
                ? "AI integration pending"
                : "AI model connected"}

            </span>

          </div>

        </div>


        {/* =========================================
            MAIN RECOMMENDATION
            ========================================= */}

        <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[1fr_auto]">


          {/* Decision */}

          <div
            className={`rounded-xl border ${decisionStyle.border} ${decisionStyle.bg} p-5`}
          >

            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

              <div>

                <p className="text-[9px] uppercase tracking-[0.18em] text-slate-500">
                  Recommended Action
                </p>


                <div className="mt-2 flex items-center gap-3">

                  <CheckCircle2
                    size={25}
                    className={decisionStyle.text}
                  />

                  <h2
                    className={`text-2xl font-bold tracking-tight ${decisionStyle.text}`}
                  >
                    {recommendation.decision}
                  </h2>

                </div>


                <p className="mt-3 max-w-xl text-xs leading-5 text-slate-400">
                  {recommendation.summary}
                </p>

              </div>


              {/* Confidence */}

              <div className="min-w-[150px]">

                <div className="flex items-center justify-between">

                  <p className="text-[9px] uppercase tracking-wider text-slate-600">
                    Confidence
                  </p>

                  <p className="text-sm font-bold text-cyan-400">
                    {recommendation.confidence}%
                  </p>

                </div>


                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">

                  <div
                    className="h-full rounded-full bg-cyan-400 transition-all duration-700"
                    style={{
                      width: `${Math.min(
                        Math.max(
                          Number(
                            recommendation.confidence
                          ) || 0,
                          0
                        ),
                        100
                      )}%`,
                    }}
                  />

                </div>

              </div>

            </div>

          </div>


          {/* Rates */}

          <div className="grid grid-cols-2 gap-3 xl:w-[300px]">

            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">

              <p className="text-[8px] uppercase tracking-wider text-slate-600">
                Current Rate
              </p>

              <p className="mt-2 text-lg font-bold text-white">
                {formatRate(
                  recommendation.current_rate
                )}
              </p>

              <p className="mt-1 text-[9px] text-slate-600">
                per day
              </p>

            </div>


            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">

              <p className="text-[8px] uppercase tracking-wider text-slate-600">
                Forecast Rate
              </p>

              <p className="mt-2 text-lg font-bold text-cyan-400">
                {formatRate(
                  recommendation.forecast_rate
                )}
              </p>

              <p className="mt-1 flex items-center gap-1 text-[9px] text-green-400">

                <TrendingUp size={10} />

                +{recommendation.expected_change}%

              </p>

            </div>

          </div>

        </div>


        {/* =========================================
            REASONS
            ========================================= */}

        {recommendation.reasons?.length > 0 && (

          <div className="mt-5">

            <p className="text-[9px] uppercase tracking-[0.15em] text-slate-600">
              Recommendation Factors
            </p>


            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">

              {recommendation.reasons.map(
                (reason, index) => (

                  <div
                    key={index}
                    className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/30 px-3 py-2.5"
                  >

                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-[8px] font-bold text-cyan-400">
                      {index + 1}
                    </span>

                    <span className="text-[10px] text-slate-400">
                      {reason}
                    </span>

                  </div>

                )
              )}

            </div>

          </div>

        )}


        {/* =========================================
            FOOTER
            ========================================= */}

        <div className="mt-6 flex flex-col gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-2">

            <ShieldCheck
              size={14}
              className="text-slate-600"
            />

            <p className="text-[9px] text-slate-600">
              Recommendation is decision-support only
            </p>

          </div>


          <button className="flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-5 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-cyan-400">

            View Full Analysis

            <ArrowRight size={14} />

          </button>

        </div>

      </div>

    </div>
  );
}


export default AIRecommendation;