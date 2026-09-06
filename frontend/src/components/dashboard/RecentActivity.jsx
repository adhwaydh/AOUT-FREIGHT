import {
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Ship,
  Clock3,
} from "lucide-react";


function RecentActivity({ data = [] }) {

  const activities = Array.isArray(data) ? data : [];


  // =========================================
  // ICON
  // =========================================

  const getActivityIcon = (type) => {

    switch (type?.toLowerCase()) {

      case "forecast":
        return BarChart3;

      case "vessel":
        return Ship;

      case "warning":
        return AlertCircle;

      case "success":
        return CheckCircle2;

      default:
        return Clock3;
    }
  };


  // =========================================
  // STYLE
  // =========================================

  const getActivityStyle = (type) => {

    switch (type?.toLowerCase()) {

      case "forecast":
        return {
          background: "bg-cyan-500/10",
          text: "text-cyan-400",
        };

      case "vessel":
        return {
          background: "bg-blue-500/10",
          text: "text-blue-400",
        };

      case "warning":
        return {
          background: "bg-yellow-500/10",
          text: "text-yellow-400",
        };

      case "success":
        return {
          background: "bg-green-500/10",
          text: "text-green-400",
        };

      default:
        return {
          background: "bg-slate-500/10",
          text: "text-slate-400",
        };
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
              Recent Activity
            </h2>

            <span className="rounded-full bg-cyan-500/10 px-2 py-1 text-[8px] font-medium text-cyan-400">
              LIVE
            </span>

          </div>

          <p className="mt-1 text-xs text-slate-500">
            Latest platform events
          </p>

        </div>


        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10">

          <Clock3
            size={15}
            className="text-cyan-400"
          />

        </div>

      </div>


      {/* =========================================
          ACTIVITY LIST
          ========================================= */}

      <div className="mt-5 space-y-4">

        {activities.length > 0 ? (

          activities.map((activity, index) => {

            const Icon = getActivityIcon(activity.type);

            const style = getActivityStyle(activity.type);

            return (
              <div
                key={`${activity.title}-${index}`}
                className="group flex gap-3"
              >

                {/* Icon */}

                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${style.background}`}
                >

                  <Icon
                    size={15}
                    className={style.text}
                  />

                </div>


                {/* Content */}

                <div className="min-w-0 flex-1">

                  <div className="flex items-start justify-between gap-3">

                    <p className="truncate text-xs font-medium text-white">
                      {activity.title}
                    </p>

                    <span className="shrink-0 text-[9px] text-slate-600">
                      {activity.time}
                    </span>

                  </div>


                  <p className="mt-1 truncate text-[10px] text-slate-600">
                    {activity.description}
                  </p>


                  {/* Timeline line */}

                  {index < activities.length - 1 && (
                    <div className="ml-[-21px] mt-3 h-3 border-l border-slate-800" />
                  )}

                </div>

              </div>
            );
          })

        ) : (

          /* =========================================
             EMPTY STATE
             ========================================= */

          <div className="rounded-lg border border-dashed border-slate-800 p-6 text-center">

            <Clock3
              size={22}
              className="mx-auto text-slate-700"
            />

            <p className="mt-3 text-xs text-slate-500">
              No recent activity
            </p>

            <p className="mt-1 text-[9px] text-slate-700">
              Waiting for platform events
            </p>

          </div>

        )}

      </div>


      {/* =========================================
          FOOTER
          ========================================= */}

      <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900 py-2.5 text-[10px] font-medium text-slate-400 transition hover:border-cyan-500/30 hover:text-cyan-400">

        View Activity Log

      </button>


      {/* API STATUS */}

      <div className="mt-4 flex items-center justify-center gap-2">

        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />

        <span className="text-[8px] text-slate-600">
          Activity data from AOUT-FREIGHT API
        </span>

      </div>

    </div>
  );
}


export default RecentActivity;