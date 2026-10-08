import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getChildren, linkChild } from "../../services/parentService";
import { 
  User, 
  TrendingUp, 
  Flame, 
  GraduationCap, 
  ArrowRight, 
  MessageSquare, 
  Bell, 
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Plus,
  X,
  UserPlus
} from "lucide-react";

export default function ParentDashboard(): React.ReactElement {
  const navigate = useNavigate();
  const [children, setChildren] = useState<any[]>([]);
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
        setLinkMsg({ type: "error", text: res.data?.message || "Candidate not found." });
      }
    } catch (err: any) {
      setLinkMsg({ type: "error", text: err?.response?.data?.message || "Failed to link candidate." });
    } finally {
      setLinking(false);
    }
  };

  useEffect(() => {
    getChildren()
      .then((r) => setChildren(r.data || []))
      .catch(() => setChildren([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#0F2744] to-[#1A3A5C] text-white p-6 sm:p-8 rounded-3xl shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            Guardian Portal & SMS Tracker
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
            Child Academic Performance Monitor
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Real-time tracking for Ethiopian National University Entrance Examination candidates, practice attendance, and school communications.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowLinkModal(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Link Candidate</span>
          </button>
          <button
            onClick={() => navigate("alerts")}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4 text-amber-400" />
            <span>Alerts & Logs</span>
          </button>
          <button
            onClick={() => navigate("messages")}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center gap-2 transition-colors shadow cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Message School</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm font-medium">
          Loading candidate data...
        </div>
      ) : children.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <User className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-slate-900">No Registered Candidates Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Please link your candidate's Student ID in your profile or contact the preparatory school administration.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {children.map((c) => {
            const predScore = c.predicted_score || c.predictedScore || 498;
            const targetScore = c.target_score || c.targetScore || 540;
            const percent = Math.min(100, Math.round((predScore / targetScore) * 100));

            return (
              <div
                key={c.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow p-6 sm:p-8 flex flex-col lg:flex-row justify-between gap-6"
              >
                <div className="space-y-4 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-sm">
                      {(c.user__full_name || c.name || "D")[0]}
                    </div>
                    <div>
                      <h2 className="font-serif text-xl font-bold text-slate-900 leading-tight">
                        {c.user__full_name || c.name || "Candidate"}
                      </h2>
                      <p className="text-xs text-slate-500">
                        {c.school || "Menelik II Secondary School"} &bull; {c.region || "Addis Ababa"}
                      </p>
                    </div>
                    <span className="ml-auto sm:ml-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-xs font-bold">
                      {c.grade_display || `Grade ${c.grade || 12}`} &bull; {c.stream || "Natural Science"}
                    </span>
                  </div>

                  {/* Key Stats Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[11px] font-semibold text-slate-500 block mb-1">Predicted Score</span>
                      <span className="font-serif text-xl font-bold text-blue-900">{predScore} / 600</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[11px] font-semibold text-slate-500 block mb-1">Target Score</span>
                      <span className="font-serif text-xl font-bold text-amber-600">{targetScore} / 600</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[11px] font-semibold text-slate-500 block mb-1">Active Study Streak</span>
                      <div className="flex items-center gap-1.5 font-bold text-base text-slate-900">
                        <Flame className="w-4 h-4 text-amber-500" />
                        <span>{c.streak_days || 14} Days</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[11px] font-semibold text-slate-500 block mb-1">Exam Readiness</span>
                      <div className="flex items-center gap-1.5 font-bold text-base text-emerald-600">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>High ({percent}%)</span>
                      </div>
                    </div>
                  </div>

                  {/* Goal Progress bar */}
                  <div>
                    <div className="flex justify-between items-center text-xs font-semibold mb-1.5 text-slate-600">
                      <span>Proximity to AAU Engineering / Medicine Threshold</span>
                      <span className="font-bold text-slate-900">{percent}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Action Box */}
                <div className="lg:w-56 flex flex-col justify-center gap-3 pt-4 lg:pt-0 lg:pl-6 lg:border-l border-slate-100">
                  <button
                    onClick={() => navigate(`child/${c.id}`)}
                    className="w-full py-3 px-4 rounded-xl font-bold bg-slate-900 hover:bg-slate-800 text-white text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <span>Full Diagnostic Report</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => navigate("messages")}
                    className="w-full py-2.5 px-4 rounded-xl font-semibold border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                    <span>Contact Teachers</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Link Child Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-600" />
                <h3 className="font-serif text-lg font-bold text-slate-900">
                  Link Student Candidate
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowLinkModal(false);
                  setLinkMsg(null);
                }}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {linkMsg && (
              <div className={`p-3.5 rounded-2xl text-xs font-medium flex items-center gap-2 ${
                linkMsg.type === "success" 
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200" 
                  : "bg-rose-50 text-rose-800 border border-rose-200"
              }`}>
                {linkMsg.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />}
                <span>{linkMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleLinkChild} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Student ID or Registered Phone Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. std-001 or +251 911 234 567"
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-emerald-500 outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Ask your child for their 8-character Finkison Candidate ID from their school orientation slip.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={linking}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{linking ? "Verifying..." : "Link to Guardian"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
