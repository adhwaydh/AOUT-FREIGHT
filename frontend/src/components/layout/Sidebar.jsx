import {
  LayoutDashboard,
  PlusCircle,
  Ship,
  BarChart3,
  Anchor,
  GitCompare,
  AlertTriangle,
  FileText,
  Brain,
} from "lucide-react";

import { NavLink } from "react-router-dom";

// =========================================================
// SIDEBAR NAVIGATION
// =========================================================

const navigation = [
  {
    title: "MAIN",

    items: [
      {
        name: "Dashboard",

        // IMPORTANT:
        // Dashboard is a protected application page.
        // It must NOT point to "/".
        path: "/dashboard",

        icon: LayoutDashboard,
      },
    ],
  },

  {
    title: "ANALYTICS",

    items: [
      {
        name: "New Analysis",
        path: "/analysis",
        icon: PlusCircle,
      },

      {
        name: "Chartering",
        path: "/chartering",
        icon: Brain,
      },

      {
        name: "Freight Forecast",
        path: "/forecast",
        icon: BarChart3,
      },

      {
        name: "Vessel Optimization",
        path: "/vessels",
        icon: Ship,
      },

      {
        name: "Vessel Comparison",
        path: "/vessel-comparison",
        icon: GitCompare,
      },
    ],
  },

  {
    title: "INTELLIGENCE",

    items: [
      {
        name: "Port Intelligence",
        path: "/ports",
        icon: Anchor,
      },

      {
        name: "Risk Intelligence",
        path: "/risk",
        icon: AlertTriangle,
      },

      {
        name: "Reports",
        path: "/reports",
        icon: FileText,
      },
    ],
  },
];

// =========================================================
// SIDEBAR
// =========================================================

function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-slate-800 bg-[#03111d] lg:flex lg:flex-col">

      {/* ===================================================
          LOGO
      =================================================== */}

      <div className="flex h-24 shrink-0 items-center border-b border-slate-800 px-6">

        <div className="mr-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10">

          <Ship
            className="text-cyan-400"
            size={25}
          />

        </div>

        <div className="min-w-0">

          <h1 className="text-xl font-bold tracking-tight text-white">
            AOUT<span className="text-cyan-400">FREIGHT</span>
          </h1>

          <p className="text-[10px] uppercase tracking-widest text-slate-500">
            Chartering Intelligence
          </p>

        </div>

      </div>

      {/* ===================================================
          NAVIGATION
      =================================================== */}

      <nav className="min-h-0 flex-1 overflow-y-auto px-4 py-6">

        {navigation.map((section) => (

          <div
            key={section.title}
            className="mb-7 last:mb-4"
          >

            {/* SECTION TITLE */}

            <p className="mb-3 px-3 text-[10px] font-semibold tracking-[0.2em] text-slate-500">
              {section.title}
            </p>

            {/* NAV ITEMS */}

            <div className="space-y-1">

              {section.items.map((item) => {

                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}

                    /*
                     * "end" is important for Dashboard.
                     *
                     * It prevents "/" style matching problems
                     * and makes the active state exact.
                     */
                    end={item.path === "/dashboard"}

                    className={({ isActive }) =>
                      `group flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition ${
                        isActive
                          ? "bg-cyan-500/10 text-cyan-400"
                          : "text-slate-400 hover:bg-slate-800/70 hover:text-white"
                      }`
                    }
                  >

                    <Icon
                      size={18}
                      className="shrink-0"
                    />

                    <span className="truncate">
                      {item.name}
                    </span>

                  </NavLink>
                );

              })}

            </div>

          </div>

        ))}

      </nav>

      {/* ===================================================
          SYSTEM STATUS
      =================================================== */}

      <div className="shrink-0 border-t border-slate-800 bg-[#03111d] p-4">

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">

          <div className="flex items-center gap-2">

            <span className="h-2 w-2 rounded-full bg-green-400" />

            <span className="text-xs font-medium text-white">
              System Status
            </span>

          </div>

          <p className="mt-2 text-xs text-slate-500">
            All systems operational
          </p>

          <div className="mt-4 h-1 overflow-hidden rounded-full bg-slate-800">

            <div className="h-full w-[86%] rounded-full bg-cyan-500" />

          </div>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;