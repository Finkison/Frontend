import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getChildren, linkChild, getParentAlerts } from "../../services/parentService";
import { 
  User, 
  TrendingUp, 
  ArrowRight, 
  MessageSquare, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  X, 
  UserPlus,
  CalendarCheck,
  Bell
} from "lucide-react";
import Button from "../ui/Button";

export default function ParentDashboard(): React.ReactElement {
  const navigate = useNavigate();
  const [children, setChildren] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Link Child Modal State
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkInput, setLinkInput] = useState("");
  const [linking, setLinking] = useState(false);
  const [linkMsg, setLinkMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleLinkChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkInput.trim()) return;
    setLinking(true);
    setLinkMsg(null);
    try {
      const res = await linkChild({ student_id: linkInput.trim() });
      if (res.data?.success) {
        setLinkMsg({ type: "success", text: res.data.message });
        setTimeout(() => {
          setShowLinkModal(false);
          setLinkInput("");
          setLinkMsg(null);
          getChildren().then((r) => setChildren(r.data || []));
        }, 1200);
      } else {
        setLinkMsg({ type: "error", text: res.data?.message || "Student record not found." });
      }
    } catch (err: any) {
      setLinkMsg({ type: "error", text: err?.response?.data?.message || "Failed to link student." });
    } finally {
      setLinking(false);
    }
  };

  useEffect(() => {
    Promise.allSettled([
      getChildren(),
      getParentAlerts()
    ]).then(([childRes, alertRes]) => {
      if (childRes.status === "fulfilled" && Array.isArray(childRes.value.data)) {
        setChildren(childRes.value.data);
      } else {
        setChildren([]);
      }
      if (alertRes.status === "fulfilled" && Array.isArray(alertRes.value.data)) {
        setAlerts(alertRes.value.data);
      } else {
        setAlerts([]);
      }
    }).finally(() => setLoading(false));
  }, []);

  const activeChild = children[0] || null;
  const unreadAlertsCount = alerts.filter((a) => !a.is_read).length;

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Parent overview
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Academic progress, attendance, and exam alerts for enrolled children.
          </p>
        </div>
        <div>
          {/* Exactly One Primary Action */}
          <Button
            onClick={() => setShowLinkModal(true)}
            variant="primary"
            size="sm"
            leftIcon={<UserPlus className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            Link student
          </Button>
        </div>
      </div>

      {!activeChild ? (
        <div className="rounded-lg border border-slate-200 bg-white p-12 text-center space-y-3">
          <UserPlus className="w-10 h-10 text-slate-300 mx-auto" />
          <h2 className="text-base font-semibold text-slate-900">No students linked</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Link your child's student ID or phone number to view their academic progress, predicted scores, and teacher notices.
          </p>
          <Button
            onClick={() => setShowLinkModal(true)}
            variant="primary"
            size="sm"
            className="mt-2"
          >
            Link student
          </Button>
        </div>
      ) : (
      <>

      {/* Part 1 Limit: Exactly 4 Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" role="region" aria-label="Key performance metrics">
        
        <div className="p-5 rounded-lg bg-white border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Predicted score</span>
            <TrendingUp className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-semibold text-emerald-700 tabular-nums font-mono">
            {activeChild.predicted_score ? (
              <>{activeChild.predicted_score} <span className="text-xs font-normal text-slate-400 font-sans">/ 600</span></>
            ) : (
              <span className="text-base text-slate-400 font-normal font-sans">Pending</span>
            )}
          </div>
          <span className="text-[11px] text-slate-500 block">
            EUEE national entrance model
          </span>
        </div>

        <div className="p-5 rounded-lg bg-white border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Attendance rate</span>
            <CalendarCheck className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-semibold text-slate-900 tabular-nums font-mono">
            {activeChild.attendance_rate !== undefined && activeChild.attendance_rate !== null ? `${activeChild.attendance_rate}%` : "—"}
          </div>
          <span className="text-[11px] text-emerald-700 block">
            Term 1 homeroom record
          </span>
        </div>

        <div className="p-5 rounded-lg bg-white border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Target score</span>
            <User className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-semibold text-slate-900 tabular-nums font-mono">
            {activeChild.target_score ? (
              <>{activeChild.target_score} <span className="text-xs font-normal text-slate-400 font-sans">/ 600</span></>
            ) : (
              <span className="text-base text-slate-400 font-normal font-sans">Not set</span>
            )}
          </div>
          <span className="text-[11px] text-slate-500 block">
            Faculty admission threshold
          </span>
        </div>

        <div className="p-5 rounded-lg bg-white border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Unread notices</span>
            <Bell className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-semibold text-slate-900 tabular-nums font-mono">
            {unreadAlertsCount}
          </div>
          <span className="text-[11px] text-slate-500 block">
            From homeroom faculty
          </span>
        </div>

      </div>

      {/* Part 1 Limit: One Task List */}
      <div className="rounded-lg bg-white border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Teacher notices
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Direct communications and administrative updates from school faculty.
            </p>
          </div>
          <span className="text-xs font-mono tabular-nums text-slate-500">
            {alerts.length} total
          </span>
        </div>

        {alerts.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No notices from school faculty at this time.
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {alert.subject || "Academic Notice"}
                    </span>
                    <span className="text-xs text-slate-500">
                      {alert.time || "Recent"}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    {alert.title}
                  </h3>
                  <p className="text-xs text-slate-600">
                    {alert.message || alert.body}
                  </p>
                </div>
                <Button
                  onClick={() => navigate("messages")}
                  variant="outline"
                  size="sm"
                  className="shrink-0"
                >
                  Reply to teacher
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Linked Children Dossier */}
      <div className="rounded-lg bg-white border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Enrolled students
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified candidates linked to your guardian telephone number.
            </p>
          </div>
          <span className="text-xs font-mono tabular-nums text-slate-500">
            {children.length} linked
          </span>
        </div>

        {children.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            No students currently linked. Click link student to connect a candidate profile.
          </div>
        ) : (
          <div className="space-y-3">
            {children.map((c) => {
              const predScore = c.predicted_score || c.predictedScore;
              const targetScore = c.target_score || c.targetScore;

              return (
                <div
                  key={c.id}
                  className="p-5 rounded-lg border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-slate-900">
                        {c.user__full_name || c.name || "Student"}
                      </h3>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                        {c.grade_display || `Grade ${c.grade || 12}`} • {c.stream || "Natural Science"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {c.school || "School Workspace"}{c.region ? ` • ${c.region}` : ""}
                    </p>
                    <div className="pt-2 flex items-center gap-4 text-xs">
                      <div>
                        <span className="text-slate-500">Predicted: </span>
                        <span className="font-semibold text-emerald-700 tabular-nums font-mono">
                          {predScore ? `${predScore} / 600` : "Pending diagnostic"}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">Target: </span>
                        <span className="font-semibold text-slate-900 tabular-nums font-mono">
                          {targetScore ? `${targetScore} / 600` : "Not set"}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">Attendance: </span>
                        <span className="font-semibold text-slate-900 tabular-nums font-mono">
                          {c.attendance_rate !== undefined && c.attendance_rate !== null ? `${c.attendance_rate}%` : "Not recorded"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col gap-2 shrink-0">
                    <Button
                      onClick={() => navigate(`child/${c.id}`)}
                      variant="primary"
                      size="sm"
                      className="w-full text-center"
                    >
                      View profile
                    </Button>
                    <Button
                      onClick={() => navigate("messages")}
                      variant="outline"
                      size="sm"
                      className="w-full text-center"
                    >
                      Message teacher
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Link Child Dialog */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 max-w-sm w-full p-6 space-y-4 shadow-md">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-emerald-700" />
                <h2 className="text-sm font-semibold text-slate-900">Link student</h2>
              </div>
              <button
                onClick={() => {
                  setShowLinkModal(false);
                  setLinkMsg(null);
                }}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {linkMsg && (
              <div className={`p-2.5 rounded-md text-xs border ${
                linkMsg.type === "success" 
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                  : "bg-red-50 text-red-800 border-red-200"
              }`}>
                {linkMsg.text}
              </div>
            )}

            <form onSubmit={handleLinkChild} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Student identification number
                </label>
                <input
                  type="text"
                  required
                  placeholder="STD-2026-001"
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-slate-300 text-sm font-mono focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 outline-none"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Enter the student ID printed on the school registration slip.
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLinkModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={linking}
                  loadingText="Verifying..."
                >
                  Link student
                </Button>
              </div>
            </form>

          </div>
        </div>
      )}

      </>
      )}

    </div>
  );
}
