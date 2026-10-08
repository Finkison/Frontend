import React, { useState, useEffect, useCallback } from "react";
import { 
  ShieldAlert, 
  Clock, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  Pause, 
  Play, 
  PlusCircle, 
  Send, 
  RefreshCw,
  Search,
  Filter,
  Eye,
  Flag
} from "lucide-react";
import { getActiveProctorSessions, performProctorAction } from "../../services/schoolService";

export default function LiveProctorConsole(): React.ReactElement {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [actionBusyId, setActionBusyId] = useState<string | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getActiveProctorSessions();
      setData(res.data);
    } catch (err) {
      console.error("Failed to load proctor sessions:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 15000); // 15s poll
    return () => clearInterval(interval);
  }, [fetchSessions]);

  const handleAction = async (studentId: string, action: string, extraMins?: number) => {
    setActionBusyId(studentId);
    try {
      const res = await performProctorAction({
        student_id: studentId,
        action,
        extra_minutes: extraMins || 10
      });
      setActionSuccessMessage(res.data?.message || `Action executed on session.`);
      setTimeout(() => setActionSuccessMessage(null), 3500);
      await fetchSessions();
    } catch (err) {
      console.error("Proctor action failed:", err);
    } finally {
      setActionBusyId(null);
    }
  };

  const formatSeconds = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}m ${s.toString().padStart(2, "0")}s`;
  };

  const filteredSessions = (data?.sessions || []).filter((s: any) => {
    const matchesSearch = 
      s.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.student_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.section.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = 
      statusFilter === "all" ||
      (statusFilter === "flagged" && s.is_flagged) ||
      s.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Control Deck */}
      <div className="card p-6 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-serif font-black text-xl text-slate-900">
                Live Examination Proctoring Console
              </h2>
              <p className="text-xs text-slate-500">
                Real-time active candidate telemetry, focus tracking, and remote session administration.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchSessions}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Telemetry</span>
          </button>
        </div>
      </div>

      {actionSuccessMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccessMessage}</span>
          </div>
          <button onClick={() => setActionSuccessMessage(null)} className="text-emerald-700 hover:text-emerald-900">
            &times;
          </button>
        </div>
      )}

      {/* Metric Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card p-5 bg-white rounded-2xl border border-slate-200">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Active Candidates</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900">{data?.active_candidates_count || 0}</span>
            <span className="text-xs font-bold text-emerald-600">Online</span>
          </div>
        </div>

        <div className="card p-5 bg-white rounded-2xl border border-slate-200">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 block">Integrity Alerts</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-rose-600">{data?.flagged_count || 0}</span>
            <span className="text-xs font-bold text-rose-600">Flagged</span>
          </div>
        </div>

        <div className="card p-5 bg-white rounded-2xl border border-slate-200">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Current Exam Task</span>
          <p className="text-sm font-bold text-slate-900 truncate mt-1">
            {data?.exam_title || "National Entrance Mock"}
          </p>
        </div>

        <div className="card p-5 bg-white rounded-2xl border border-slate-200">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Completed Submissions</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900">{data?.completed_count || 0}</span>
            <span className="text-xs font-bold text-slate-500">Graded</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card p-4 bg-white rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidate name, ID, or section..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto text-xs">
          {[
            { id: "all", label: "All Sessions" },
            { id: "flagged", label: "Flagged Only" },
            { id: "in_progress", label: "In Progress" },
            { id: "completed", label: "Submitted" }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all ${
                statusFilter === tab.id
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Candidate Live Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSessions.map((s: any) => {
          const isBusy = actionBusyId === s.student_id;
          return (
            <div
              key={s.student_id}
              className={`card p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                s.is_flagged
                  ? "border-rose-400 bg-rose-50/20 shadow-xs ring-1 ring-rose-200"
                  : s.status === "COMPLETED"
                  ? "border-slate-200 bg-slate-50/50 opacity-80"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="space-y-3">
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-slate-900 truncate">{s.student_name}</h4>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {s.grade} • Sec {s.section} • ID: {s.student_id}
                    </p>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                    s.is_flagged
                      ? "bg-rose-100 text-rose-800 border border-rose-300"
                      : s.status === "IN_PROGRESS"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : s.status === "IDLE"
                      ? "bg-amber-100 text-amber-800 border border-amber-300"
                      : "bg-slate-100 text-slate-700"
                  }`}>
                    {s.status.replace("_", " ")}
                  </span>
                </div>

                {/* Progress Bar & Question index */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
                    <span>Question {s.current_question} of {s.total_questions}</span>
                    <span className="font-mono text-slate-900 font-bold">
                      {Math.round((s.current_question / s.total_questions) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        s.is_flagged ? "bg-rose-500" : "bg-slate-900"
                      }`}
                      style={{ width: `${(s.current_question / s.total_questions) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Telemetry metrics */}
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono font-bold">
                      {s.status === "COMPLETED" ? "Submitted" : formatSeconds(s.time_remaining_seconds)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {s.tab_switches > 0 ? (
                      <span className="font-bold text-rose-600 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>{s.tab_switches} Focus Loss</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        <span>Clean Session</span>
                      </span>
                    )}
                  </div>
                </div>

                {s.is_flagged && (
                  <div className="p-2 rounded-xl bg-rose-100/70 border border-rose-300 text-[11px] font-bold text-rose-900">
                    ⚠️ Candidate left active browser window multiple times.
                  </div>
                )}
              </div>

              {/* Action Toolbar */}
              {s.status !== "COMPLETED" && (
                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => handleAction(s.student_id, "add_time", 10)}
                    className="flex-1 py-1 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold transition-colors cursor-pointer text-center"
                    title="Add 10 extra minutes"
                  >
                    +10 Min
                  </button>

                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => handleAction(s.student_id, "pause")}
                    className="py-1 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold transition-colors cursor-pointer"
                    title="Pause timer"
                  >
                    <Pause className="w-3 h-3" />
                  </button>

                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => handleAction(s.student_id, "flag_cheating")}
                    className={`py-1 px-2 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                      s.is_flagged
                        ? "bg-rose-600 text-white"
                        : "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                    }`}
                    title="Flag for suspicious behavior"
                  >
                    <Flag className="w-3 h-3" />
                  </button>

                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => {
                      if (window.confirm(`Force-submit exam for ${s.student_name}?`)) {
                        handleAction(s.student_id, "force_submit");
                      }
                    }}
                    className="py-1 px-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-bold transition-colors cursor-pointer"
                    title="Force submit active exam"
                  >
                    Submit
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
