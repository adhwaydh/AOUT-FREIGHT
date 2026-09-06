import {
  Search,
  Bell,
  ChevronDown,
} from "lucide-react";

function Header() {
  return (
    <header className="flex items-center justify-between border-b border-slate-800 bg-[#020b14]/80 px-6 py-5 backdrop-blur-xl">

      <div>
        <p className="text-xs text-slate-500">
          Transportation & Logistics
        </p>

        <h2 className="mt-1 text-xl font-semibold">
          Good morning, Analyst 👋
        </h2>
      </div>


      <div className="flex items-center gap-4">

        {/* Search */}
        <div className="hidden items-center gap-3 rounded-lg border border-slate-700 bg-slate-900/70 px-4 py-2.5 md:flex">

          <Search size={17} className="text-slate-500" />

          <input
            type="text"
            placeholder="Search anything..."
            className="w-48 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
          />

        </div>


        {/* Notification */}
        <button className="relative rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white">
          <Bell size={20} />

          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[9px] font-bold text-slate-950">
            3
          </span>
        </button>


        {/* Profile */}
        <div className="flex items-center gap-3 border-l border-slate-800 pl-4">

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500/10 font-semibold text-cyan-400">
            A
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-medium">
              Analyst
            </p>

            <p className="text-[10px] text-slate-500">
              Premium
            </p>
          </div>

          <ChevronDown size={15} className="text-slate-500" />

        </div>

      </div>

    </header>
  );
}

export default Header;