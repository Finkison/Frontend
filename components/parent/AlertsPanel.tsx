import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getParentAlerts } from "../../services/parentService";
import { 
  Bell, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  Flame, 
  Calendar,
  ShieldCheck,
  Check
} from "lucide-react";

export default function AlertsPanel(): React.ReactElement {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getParentAlerts()
      .then((r) => setAlerts(r.data || []))
      .catch(() => setAlerts([]))
      .finally(() => setLoading(false));
  }, []);

  const handleMarkAsRead = (id: string) => {
    setAlerts(alerts.map((a) => (a.id === id ? { ...a, is_read: true } : a)));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/parent")}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Guardian Overview</span>
        </button>
        <span className="text-xs font-semibold text-slate-500">
          SMS Notifications Active
        </span>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 text-xs font-semibold border border-amber-500/20 mb-2">
            <Bell className="w-3.5 h-3.5" />
            <span>Academic Alerts & Logged Actions</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-slate-900">
            Notifications & Attendance Flags
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time feed of exam deadlines, conceptual drop warnings, and commendable diagnostic milestones.
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Loading alerts...</div>
        ) : alerts.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No active alerts or critical notifications registered.
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((a) => {
              const msg = a.message || "";
              const isWarning = msg.toLowerCase().includes("drop") || msg.toLowerCase().includes("below") || a.type === "reminder";
              const isSuccess = msg.toLowerCase().includes("streak") || msg.toLowerCase().includes("85%") || a.type === "achievement";

              return (
                <div
                  key={a.id}
                  className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                    a.is_read
                      ? "bg-slate-50/60 border-slate-100 opacity-60"
                      : isWarning
                      ? "bg-amber-50/60 border-amber-200/80 text-amber-950"
                      : isSuccess
                      ? "bg-emerald-50/60 border-emerald-200/80 text-emerald-950"
                      : "bg-blue-50/60 border-blue-200/80 text-blue-950"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-white shadow-2xs mt-0.5 shrink-0">
                      {isWarning ? (
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                      ) : isSuccess ? (
                        <Flame className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Bell className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-semibold leading-relaxed">{a.message}</p>
                      <span className="text-[10px] text-slate-500 block mt-1">
                        {a.date || "Today"} &bull; National Candidate Notification
                      </span>
                    </div>
                  </div>

                  {!a.is_read && (
                    <button
                      onClick={() => handleMarkAsRead(a.id)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] font-semibold hover:bg-slate-50 transition-colors shrink-0 shadow-2xs cursor-pointer"
                    >
                      Acknowledge
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
