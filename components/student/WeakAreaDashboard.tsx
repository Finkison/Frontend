import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWeakAreas } from "../../services/studentService";
import { startPractice } from "../../services/practiceService";
import useSessionStore from "../../store/sessionStore";
import { useToast } from "../shared/Toast";
import { 
  Target, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Flame, 
  Filter, 
  BookOpen 
} from "lucide-react";

interface WeakArea {
  id: string;
  subject: string;
  unit: number;
  topic: string;
  accuracy: number;
  accuracy_percent?: number;
}

export default function WeakAreaDashboard(): React.ReactElement {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const startSession = useSessionStore((s) => s.startSession);

  const [weakAreas, setWeakAreas] = useState<WeakArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [launchingId, setLaunchingId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getWeakAreas()
      .then((res) => {
        setWeakAreas(res.data || []);
      })
      .catch(() => setWeakAreas([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredAreas = useMemo(() => {
    if (selectedSubject === "All") return weakAreas;
    return weakAreas.filter((w) => w.subject.toLowerCase() === selectedSubject.toLowerCase());
  }, [weakAreas, selectedSubject]);

  const handleLaunchTopic = async (subject: string, topic: string) => {
    const idKey = `${subject}-${topic}`;
    setLaunchingId(idKey);
    try {
      const { data } = await startPractice({ subject, mode: "adaptive" });
      startSession(data.id, data.session_type, data.questions, data.duration || 1800);
      showToast({
        type: "success",
        title: "Adaptive Drill Launched",
        message: `Focusing on ${subject}: ${topic}`
      });
      navigate("/student/session");
    } catch {
      showToast({
        type: "info",
        title: "Starting Practice Mode",
        message: `Redirecting to subject practice configuration for ${subject}.`
      });
      navigate("/student/practice");
    } finally {
      setLaunchingId(null);
    }
  };

  const recommendations = useMemo(() => {
    return filteredAreas.map((w) => {
      let action = "";
      let estTime = "";
      if (w.subject === "Physics") {
        action = "Review Unit 3 Electromagnetic induction formulas and work through 15 adaptive practice questions.";
        estTime = "45 mins";
      } else if (w.subject === "Biology") {
        action = "Read step-by-step meiosis vs mitosis diagrams, then take a targeted concept simulation test.";
        estTime = "30 mins";
      } else if (w.subject === "Chemistry") {
        action = "Consolidate galvanic cell oxidation-reduction equations and calculate standard cell potentials.";
        estTime = "35 mins";
      } else {
        action = "Consolidate definite integral substitution rules and review 2015-2016 entrance exam problems.";
        estTime = "25 mins";
      }

      return {
        id: w.id || `${w.subject}-${w.topic}`,
        subject: w.subject,
        topic: w.topic,
        action,
        estTime,
        accuracy: w.accuracy_percent ?? w.accuracy ?? 45
      };
    });
  }, [filteredAreas]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-700 text-xs font-semibold border border-rose-500/20 mb-2">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Diagnostic Diagnostic Telemetry</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Weak Area & Conceptual Gaps Analyzer
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Finkison models your test telemetry and incorrect response options. Concepts below 50% mastery threshold receive targeted intervention drills to recover entrance exam points.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
              {weakAreas.length} Target Topics Identified
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
          {["All", "Chemistry", "Physics", "Mathematics", "Biology"].map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 cursor-pointer transition-colors ${
                selectedSubject === sub
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-base">
            Tracked Topic Mastery Levels
          </h2>
          <span className="text-xs text-slate-400">
            Threshold: 50% minimum national benchmark
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            Loading diagnostic weak areas...
          </div>
        ) : filteredAreas.length === 0 ? (
          <div className="p-8 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <p className="text-sm font-bold text-emerald-950">
              No Critical Weak Areas Detected!
            </p>
            <p className="text-xs text-emerald-800 max-w-md mx-auto">
              All concepts in this subject maintain mastery levels above 50%. Keep practicing to reach 90%+ elite thresholds.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAreas.map((w, idx) => {
              const accuracy = w.accuracy_percent ?? w.accuracy ?? 45;
              const isCritical = accuracy < 45;

              return (
                <div
                  key={w.id || idx}
                  className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-colors space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-200 text-slate-800 text-[10px] font-bold uppercase">
                        {w.subject} &bull; Unit {w.unit}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900">
                        {w.topic}
                      </h3>
                    </div>

                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full border self-start sm:self-auto ${
                        isCritical
                          ? "bg-rose-50 text-rose-800 border-rose-200"
                          : "bg-amber-50 text-amber-800 border-amber-200"
                      }`}
                    >
                      {accuracy}% Accuracy &bull; {isCritical ? "Critical Intervention" : "Needs Review"}
                    </span>
                  </div>

                  {/* Meter Bar */}
                  <div className="w-full h-2 rounded-full bg-slate-200/70 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCritical
                          ? "bg-rose-500"
                          : "bg-gradient-to-r from-amber-500 to-amber-600"
                      }`}
                      style={{ width: `${accuracy}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Action Plan */}
      {recommendations.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-slate-900">
                Personalized Intervention Roadmap
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Targeted short drills to eliminate accuracy bottlenecks before the entrance examination.
              </p>
            </div>
            <Sparkles className="w-5 h-5 text-amber-500" />
          </div>

          <div className="grid gap-3 pt-2">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 shadow-2xs space-y-3 flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                        High Priority
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Est. {rec.estTime}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">
                      {rec.subject} &mdash; {rec.topic}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1">
                      {rec.action}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleLaunchTopic(rec.subject, rec.topic)}
                    disabled={launchingId === `${rec.subject}-${rec.topic}`}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
                  >
                    <span>
                      {launchingId === `${rec.subject}-${rec.topic}`
                        ? "Launching Drill..."
                        : "Launch Targeted Practice"}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
