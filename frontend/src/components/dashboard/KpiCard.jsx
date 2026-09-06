import {
  ArrowDown,
  ArrowUp,
} from "lucide-react";

function KpiCard({
  title,
  value,
  unit,
  change,
  positive = true,
  icon: Icon,
  subtitle,
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-800 bg-[#061724] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-950/20">

      {/* Decorative glow */}
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-cyan-400/5 blur-2xl transition group-hover:bg-cyan-400/10" />

      {/* Top */}
      <div className="relative flex items-start justify-between">

        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">
            {title}
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/80">
          <Icon
            size={17}
            className="text-cyan-400"
          />
        </div>

      </div>


      {/* Value */}
      <div className="relative mt-5 flex items-end gap-2">

        <h3 className="text-2xl font-bold tracking-tight text-white">
          {value}
        </h3>

        {unit && (
          <span className="mb-1 text-[10px] text-slate-500">
            {unit}
          </span>
        )}

      </div>


      {/* Change */}
      <div className="relative mt-3 flex items-center gap-2">

        <span
          className={`flex items-center gap-1 text-[10px] font-semibold ${
            positive
              ? "text-green-400"
              : "text-red-400"
          }`}
        >

          {positive ? (
            <ArrowUp size={11} />
          ) : (
            <ArrowDown size={11} />
          )}

          {change}

        </span>

        <span className="text-[10px] text-slate-600">
          vs yesterday
        </span>

      </div>


      {/* Subtitle */}
      {subtitle && (
        <p className="relative mt-3 text-[10px] text-slate-600">
          {subtitle}
        </p>
      )}

    </div>
  );
}

export default KpiCard;