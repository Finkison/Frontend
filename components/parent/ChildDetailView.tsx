import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getChildProgress } from "../../services/parentService";
import { 
  ArrowLeft, 
  GraduationCap, 
  TrendingUp, 
  Target, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  Sparkles,
  Flame
} from "lucide-react";

export default function ChildDetailView(): React.ReactElement {
  const { id } = useParams();
  const navigate = useNavigate();
  const [child, setChild] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getChildProgress(id || "child-1")
      .then((r) => setChild(r.data))
      .catch(() => setChild(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center text-slate-400 text-sm">
        Loading candidate academic portfolio...
      </div>
    );
  }

  if (!child) {
    return (
      <div className="max-w-lg mx-auto bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4 shadow-sm">
        <h3 className="font-serif text-xl font-bold text-slate-900">Candidate Record Not Found</h3>
        <p className="text-xs text-slate-500">
          We could not resolve diagnostic data for this candidate ID.
        </p>
        <button
          onClick={() => navigate("/parent")}
          className="px-6 py-2.5 rounded-xl font-bold bg-slate-900 text-white text-xs hover:bg-slate-800 transition-colors cursor-pointer"
        >
          Return to Portal
        </button>
      </div>
    );
  }

  const events = [
    {
      type: "success",
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
      time: "Today, 2:15 PM",
      title: "Completed Calculus & Limits Diagnostic",
      desc: "Scored 84% accuracy across 25 past national exam questions."
    },
    {
      type: "warning",
      icon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
      time: "Yesterday, 4:30 PM",
      title: "Conceptual Gap Flagged: Electrochemistry",
      desc: "Accuracy dropped to 48% on Galvanic cell voltage calculations. Remedial practice queued."
    },
    {
      type: "info",
      icon: <Flame className="w-4 h-4 text-rose-500" />,
      time: "May 24, 2026",
      title: "14-Day Study Streak Maintained",
      desc: "Consistent 3.4 daily study hours logged on Finkison Socratic Tutor."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/parent")}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Guardian Overview</span>
        </button>
        <span className="text-xs font-semibold text-slate-500">
          Last active: {child.last_active || "Today at 2:15 PM"}
        </span>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Column: Diagnostics */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h1 className="font-serif text-2xl font-bold text-slate-900">
                  {child.name || child.user__full_name || "Daniel Finkison"}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Grade {child.grade || 12} &bull; {child.stream || "Natural Science"} Stream
                </p>
              </div>
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-bold">
                {child.predicted_cutoff_odds || "88% AAU Cutoff Probability"}
              </span>
            </div>

            {/* Score Grid */}
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
                <span className="text-[11px] font-semibold text-blue-700 block mb-1">Current Predicted Score</span>
                <span className="font-serif text-2xl font-bold text-blue-900">{child.predicted_score || 498}</span>
                <span className="text-[10px] text-blue-600/80 block mt-0.5">Out of 600 national max</span>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
                <span className="text-[11px] font-semibold text-amber-800 block mb-1">Target Score Goal</span>
                <span className="font-serif text-2xl font-bold text-amber-900">{child.target_score || 540}</span>
                <span className="text-[10px] text-amber-700/80 block mt-0.5">AAU Medical / Tech target</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-500 block mb-1">Target Department</span>
                <span className="font-serif text-sm font-bold text-slate-900 truncate block mt-1">
                  {child.department || "Software Engineering & AI"}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">High National Demand</span>
              </div>
            </div>

            {/* Weak Areas Breakdown */}
            <div className="space-y-3">
              <h3 className="font-serif text-lg font-bold text-slate-900">
                Identified Conceptual Weak Areas
              </h3>
              <div className="grid gap-3">
                {[
                  { subject: "Chemistry", topic: "Electrochemistry & Redox Reactions", accuracy: 48 },
                  { subject: "Physics", topic: "Rotational Dynamics & Torque", accuracy: 52 },
                  { subject: "Mathematics", topic: "Definite Integral Applications", accuracy: 64 }
                ].map((item, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-900">{item.subject} &bull; <span className="font-normal text-slate-600">{item.topic}</span></span>
                      <span className={`font-bold ${item.accuracy < 50 ? "text-rose-600" : "text-amber-600"}`}>
                        {item.accuracy}% Accuracy
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.accuracy < 50 ? "bg-rose-500" : "bg-amber-500"}`}
                        style={{ width: `${item.accuracy}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-serif text-lg font-bold text-slate-900">
              Recent Activity Feed
            </h3>
            <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
              {events.map((ev, idx) => (
                <div key={idx} className="relative flex items-start gap-3 pl-2">
                  <div className="w-6 h-6 rounded-full bg-white border border-slate-200 shadow-2xs flex items-center justify-center shrink-0 z-10 mt-0.5">
                    {ev.icon}
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-semibold text-slate-400 block">{ev.time}</span>
                    <h4 className="text-xs font-bold text-slate-900">{ev.title}</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{ev.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
