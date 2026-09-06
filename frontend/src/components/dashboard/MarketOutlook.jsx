import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


function MarketOutlook({ data = [] }) {

  // =========================================
  // SAFETY CHECK
  // =========================================

  const chartData = Array.isArray(data) ? data : [];


  return (
    <div className="rounded-xl border border-slate-800 bg-[#061724] p-5">

      {/* =========================================
          HEADER
          ========================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <div className="flex items-center gap-2">

            <h2 className="font-semibold text-white">
              Market Outlook
            </h2>

            <span className="rounded-full bg-cyan-500/10 px-2 py-1 text-[8px] font-medium text-cyan-400">
              LIVE DATA
            </span>

          </div>


          <p className="mt-1 text-xs text-slate-500">
            Freight rate movement across vessel classes
          </p>

        </div>


        {/* Period selector */}

        <select
          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-300 outline-none transition focus:border-cyan-400"
          defaultValue="30"
        >
          <option value="30">
            30 Days
          </option>

          <option value="60">
            60 Days
          </option>

          <option value="90">
            90 Days
          </option>
        </select>

      </div>


      {/* =========================================
          CHART
          ========================================= */}

      <div className="mt-6 h-64">

        {chartData.length > 0 ? (

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                right: 5,
                left: -20,
                bottom: 0,
              }}
            >

              {/* =====================================
                  GRADIENT
                  ===================================== */}

              <defs>

                <linearGradient
                  id="capesizeFill"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >

                  <stop
                    offset="0%"
                    stopColor="#22d3ee"
                    stopOpacity={0.2}
                  />

                  <stop
                    offset="100%"
                    stopColor="#22d3ee"
                    stopOpacity={0}
                  />

                </linearGradient>

              </defs>


              {/* =====================================
                  GRID
                  ===================================== */}

              <CartesianGrid
                stroke="#132735"
                strokeDasharray="3 3"
                vertical={false}
              />


              {/* =====================================
                  X AXIS
                  ===================================== */}

              <XAxis
                dataKey="day"
                tick={{
                  fill: "#64748b",
                  fontSize: 10,
                }}
                axisLine={false}
                tickLine={false}
              />


              {/* =====================================
                  Y AXIS
                  ===================================== */}

              <YAxis
                tick={{
                  fill: "#64748b",
                  fontSize: 10,
                }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) =>
                  `$${Math.round(value / 1000)}k`
                }
              />


              {/* =====================================
                  TOOLTIP
                  ===================================== */}

              <Tooltip
                contentStyle={{
                  background: "#061724",
                  border: "1px solid #1e3343",
                  borderRadius: "8px",
                  fontSize: "11px",
                }}
                labelStyle={{
                  color: "#94a3b8",
                }}
                itemStyle={{
                  color: "#e2e8f0",
                }}
                formatter={(value) =>
                  `$${Number(value).toLocaleString()}`
                }
              />


              {/* =====================================
                  CAPESIZE
                  ===================================== */}

              <Area
                type="monotone"
                dataKey="capesize"
                name="Capesize"
                stroke="#22d3ee"
                strokeWidth={2}
                fill="url(#capesizeFill)"
                activeDot={{
                  r: 4,
                }}
              />


              {/* =====================================
                  PANAMAX
                  ===================================== */}

              <Area
                type="monotone"
                dataKey="panamax"
                name="Panamax"
                stroke="#60a5fa"
                strokeWidth={2}
                fill="transparent"
                activeDot={{
                  r: 4,
                }}
              />


              {/* =====================================
                  SUPRAMAX
                  ===================================== */}

              <Area
                type="monotone"
                dataKey="supramax"
                name="Supramax"
                stroke="#f59e0b"
                strokeWidth={2}
                fill="transparent"
                activeDot={{
                  r: 4,
                }}
              />

            </AreaChart>

          </ResponsiveContainer>

        ) : (

          /* =========================================
             EMPTY STATE
             ========================================= */

          <div className="flex h-full items-center justify-center">

            <div className="text-center">

              <div className="mx-auto h-8 w-8 rounded-full border border-slate-700 bg-slate-900" />

              <p className="mt-3 text-xs text-slate-500">
                Market data unavailable
              </p>

              <p className="mt-1 text-[10px] text-slate-600">
                Waiting for backend data
              </p>

            </div>

          </div>

        )}

      </div>


      {/* =========================================
          LEGEND
          ========================================= */}

      <div className="mt-4 flex flex-wrap items-center gap-5 text-[10px]">

        <div className="flex items-center gap-2">

          <span className="h-2 w-2 rounded-full bg-cyan-400" />

          <span className="text-slate-400">
            Capesize
          </span>

        </div>


        <div className="flex items-center gap-2">

          <span className="h-2 w-2 rounded-full bg-blue-400" />

          <span className="text-slate-400">
            Panamax
          </span>

        </div>


        <div className="flex items-center gap-2">

          <span className="h-2 w-2 rounded-full bg-yellow-400" />

          <span className="text-slate-400">
            Supramax
          </span>

        </div>

      </div>


      {/* =========================================
          DATA STATUS
          ========================================= */}

      <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-4">

        <div className="flex items-center gap-2">

          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />

          <span className="text-[9px] text-slate-600">
            Connected to AOUT-FREIGHT API
          </span>

        </div>


        <span className="text-[9px] text-slate-600">
          {chartData.length} data points
        </span>

      </div>

    </div>
  );
}


export default MarketOutlook;