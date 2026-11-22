import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowRight, BookOpen, CheckCircle2, RefreshCw } from "lucide-react";
import { getWeakAreas } from "../../services/studentService";
import { startPractice } from "../../services/practiceService";
import useSessionStore from "../../store/sessionStore";
import useAuthStore from "../../store/authStore";
import { useToast } from "../ui/Toast";
import PortalPage from "../shared/PortalPage";

type WeakArea = {
  id: string;
  subject: string;
  unit: number;
  topic: string;
  accuracy: number;
  attempts: number;
};

type WeakAreasResponse = {
  weak_areas?: WeakArea[];
  has_topic_data?: boolean;
  attempts_analyzed?: number;
  subject_topic_counts?: Record<string, number>;
};

export default function DiagnosticGapsView(): React.ReactElement {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const startSession = useSessionStore((state) => state.startSession);
  const user = useAuthStore((state) => state.user);
  const [weakAreas, setWeakAreas] = useState<WeakArea[]>([]);
  const [hasTopicData, setHasTopicData] = useState(false);
  const [attemptsAnalyzed, setAttemptsAnalyzed] = useState(0);
  const [subjectTopicCounts, setSubjectTopicCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [launchingId, setLaunchingId] = useState<string | null>(null);

  const loadAreas = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await getWeakAreas();
      const data: WeakAreasResponse = response.data || {};
      setWeakAreas(Array.isArray(data.weak_areas) ? data.weak_areas : []);
      setHasTopicData(Boolean(data.has_topic_data));
      setAttemptsAnalyzed(Number(data.attempts_analyzed) || 0);
      setSubjectTopicCounts(data.subject_topic_counts || {});
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadAreas(); }, [loadAreas]);

  const subjects = useMemo(() => Array.from(new Set(weakAreas.map((area) => area.subject))).sort(), [weakAreas]);
  const filteredAreas = useMemo(() => selectedSubject === "All"
    ? weakAreas
    : weakAreas.filter((area) => area.subject.toLowerCase() === selectedSubject.toLowerCase()), [weakAreas, selectedSubject]);
  const selectedTopicCount = selectedSubject === "All"
    ? Object.values(subjectTopicCounts).reduce((total, count) => total + count, 0)
    : subjectTopicCounts[selectedSubject] || 0;

  const handleLaunchUnit = async (area: WeakArea) => {
    setLaunchingId(area.id);
    try {
      const gradeMatch = String(user?.grade || "").match(/\d+/);
      const grade = gradeMatch ? Number(gradeMatch[0]) : undefined;
      const response = await startPractice({ subject: area.subject, mode: "unit", unit: area.unit, ...(grade ? { grade } : {}) });
      const data = response.data?.data || response.data || {};
      if (!data.id || !Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error(data.error || data.message || "Practice questions are not available for this unit yet.");
      }
      startSession(data.id, data.session_type || "unit", data.questions, data.duration_seconds || data.duration || 1800);
      showToast({ type: "success", title: "Unit practice started", message: `${area.subject}, Unit ${area.unit}` });
      navigate("/student/session");
    } catch (err: any) {
      showToast({ type: "error", title: "Could not start unit practice", message: err?.response?.data?.message || err?.response?.data?.error || err?.message || "Try again later." });
    } finally {
      setLaunchingId(null);
    }
  };

  return (
    <PortalPage className="max-w-5xl space-y-6">
      <header className="flex flex-col gap-4 border-b border-stone-200 pb-5 dark:border-white/10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#881337] dark:text-[#FBBF24]"><AlertTriangle className="h-4 w-4" aria-hidden="true" />Practice insights</div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900 dark:text-[#FDFBF7]">Knowledge gaps</h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-stone-600 dark:text-[#E7E0D6]">Review topics where your practice accuracy is below 50%.</p>
        </div>
        <div className="flex items-center gap-3">
          {!loading && !error && <span className="text-xs text-stone-500 dark:text-[#A89C90]">{weakAreas.length} topic{weakAreas.length === 1 ? "" : "s"} below 50%</span>}
          <button type="button" onClick={() => void loadAreas()} disabled={loading} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-stone-300 bg-white px-3 text-xs font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-60 dark:border-white/15 dark:bg-[#261E1A] dark:text-[#E7E0D6] dark:hover:bg-white/5"><RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} aria-hidden="true" />Refresh</button>
        </div>
      </header>

      {subjects.length > 0 && (
        <nav className="flex items-center gap-2 overflow-x-auto" aria-label="Filter weak topics by subject">
          {["All", ...subjects].map((subject) => (
            <button key={subject} type="button" onClick={() => setSelectedSubject(subject)} aria-pressed={selectedSubject === subject} className={`min-h-10 shrink-0 rounded-lg px-3.5 text-xs font-semibold transition-colors ${selectedSubject === subject ? "bg-[#881337] text-white" : "bg-white text-stone-600 hover:bg-stone-50 dark:bg-[#261E1A] dark:text-[#E7E0D6] dark:hover:bg-white/5"}`}>{subject}</button>
          ))}
        </nav>
      )}

      <section className="space-y-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-[#261E1A] sm:p-6" aria-labelledby="weak-topics-heading">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><h2 id="weak-topics-heading" className="text-base font-semibold text-stone-900 dark:text-[#FDFBF7]">Topics to review</h2>          <p className="mt-1 text-xs text-stone-500 dark:text-[#A89C90]">Review threshold: below 50% accuracy.</p></div>
          {!loading && !error && hasTopicData && <span className="text-xs text-stone-500 dark:text-[#A89C90]">{attemptsAnalyzed} answers analyzed</span>}
        </div>

        {loading ? (
          <p role="status" className="py-8 text-center text-sm text-stone-500 dark:text-[#A89C90]">Loading practice insights...</p>
        ) : error ? (
          <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200">Practice insights could not be loaded. Refresh to try again.</div>
        ) : !hasTopicData ? (
          <div className="rounded-xl border border-dashed border-stone-300 p-7 text-center dark:border-white/15">
            <BookOpen className="mx-auto h-8 w-8 text-stone-400 dark:text-[#A89C90]" aria-hidden="true" />
            <h3 className="mt-3 text-sm font-semibold text-stone-900 dark:text-[#FDFBF7]">No topic-level practice data yet</h3>
            <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-stone-600 dark:text-[#A89C90]">Complete practice to see topics that need review.</p>
            <button type="button" onClick={() => navigate("/student/practice")} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#881337] px-4 text-xs font-semibold text-white hover:bg-[#9F1239]">Start practice <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></button>
          </div>
        ) : filteredAreas.length === 0 ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center dark:border-emerald-900/40 dark:bg-emerald-950/20">
            <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-700 dark:text-emerald-300" aria-hidden="true" />
            <h3 className="mt-3 text-sm font-semibold text-emerald-950 dark:text-emerald-100">{selectedTopicCount === 0 ? "No topic attempts for this subject" : "No topics below the review threshold"}</h3>
            <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-emerald-900/80 dark:text-emerald-100/80">{selectedTopicCount === 0 ? "Complete practice in this subject to build a topic-level record." : `No topics below 50% were found in ${selectedTopicCount} topics with recorded answers.`}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAreas.map((area) => (
              <article key={area.id} className="rounded-xl border border-stone-200 bg-[#FAF8F5] p-4 dark:border-white/10 dark:bg-[#1C1512]">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-stone-200 px-2 py-1 text-[10px] font-bold uppercase text-stone-800 dark:bg-white/10 dark:text-[#FDFBF7]">{area.subject} · Unit {area.unit}</span>
                      <span className="text-[11px] text-stone-500 dark:text-[#A89C90]">{area.attempts} answer{area.attempts === 1 ? "" : "s"}</span>
                    </div>
                    <h3 className="mt-2 text-sm font-semibold text-stone-900 dark:text-[#FDFBF7]">{area.topic}</h3>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-stone-200 dark:bg-white/10" role="img" aria-label={`${area.accuracy}% accuracy`}><div className="h-full rounded-full bg-rose-600" style={{ width: `${Math.max(0, Math.min(100, area.accuracy))}%` }} /></div>
                  </div>
                  <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <span className="text-sm font-semibold tabular-nums text-rose-800 dark:text-rose-200">{area.accuracy}%</span>
                    <button type="button" onClick={() => void handleLaunchUnit(area)} disabled={launchingId === area.id} className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg bg-[#881337] px-3 text-xs font-semibold text-white transition-colors hover:bg-[#9F1239] disabled:cursor-wait disabled:opacity-60">{launchingId === area.id ? "Starting..." : `Practice Unit ${area.unit}`}<ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </PortalPage>
  );
}

export { DiagnosticGapsView as WeakAreaDashboard };