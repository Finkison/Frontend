import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, BookOpen, CalendarDays, Clock3, GraduationCap, RefreshCw } from "lucide-react";
import { getExams, startExam } from "../../services/practiceService";
import useSessionStore from "../../store/sessionStore";
import useAuthStore from "../../store/authStore";
import { CardSkeleton } from "../ui/Skeleton";
import PortalPage from "../shared/PortalPage";

interface PublishedExam {
  id: string;
  title: string;
  subject?: string;
  stream?: string;
  year?: string;
  durationMinutes?: number;
  totalQuestions?: number;
}

export default function NationalExamsHub(): React.ReactElement {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const startSession = useSessionStore((state) => state.startSession);
  const [exams, setExams] = useState<PublishedExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [launchError, setLaunchError] = useState("");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedStream, setSelectedStream] = useState(user?.stream || "All");
  const [launchingId, setLaunchingId] = useState<string | null>(null);

  const fetchExams = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const response = await getExams();
      const list = response.data?.data || response.data || [];
      setExams(Array.isArray(list) ? list : []);
    } catch {
      setExams([]);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchExams(); }, [fetchExams]);

  const availableYears = useMemo(() => Array.from(new Set(exams.map((exam) => exam.year).filter((year): year is string => Boolean(year)))).sort((a, b) => b.localeCompare(a)), [exams]);
  const availableSubjects = useMemo(() => Array.from(new Set(exams.map((exam) => exam.subject).filter((subject): subject is string => Boolean(subject)))).sort((a, b) => a.localeCompare(b)), [exams]);
  const availableStreams = useMemo(() => Array.from(new Set(exams.map((exam) => exam.stream).filter((stream): stream is string => Boolean(stream)))).sort((a, b) => a.localeCompare(b)), [exams]);
  useEffect(() => {
    if (!loading && selectedStream !== "All" && !availableStreams.includes(selectedStream)) setSelectedStream("All");
  }, [loading, selectedStream, availableStreams]);
  const filteredExams = useMemo(() => exams.filter((exam) =>
    (selectedYear === "All" || exam.year === selectedYear)
    && (selectedSubject === "All" || exam.subject === selectedSubject)
    && (selectedStream === "All" || exam.stream === selectedStream),
  ), [exams, selectedYear, selectedSubject, selectedStream]);

  const handleStartExam = async (exam: PublishedExam) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setLaunchingId(exam.id);
    setLaunchError("");
    try {
      const response = await startExam({ exam_id: exam.id, stream: exam.stream });
      const data = response.data?.data || response.data || {};
      if (!data.id || !Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error(data.message || data.error || "This exam has no available questions.");
      }
      const durationSeconds = Number(data.duration_seconds || data.duration) || (Number(exam.durationMinutes) * 60) || 7200;
      startSession(data.id, "national_mock", data.questions, durationSeconds, data.sections || []);
      navigate("/student/session");
    } catch (error: any) {
      setLaunchError(error?.response?.data?.message || error?.response?.data?.error || error?.message || "This exam could not be started. Try again.");
    } finally {
      setLaunchingId(null);
    }
  };

  const selectClass = "min-h-10 rounded-lg border border-stone-300 bg-white px-3 text-sm font-medium text-stone-700 outline-none focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/15 dark:border-white/15 dark:bg-[#261E1A] dark:text-[#E7E0D6]";

  return (
    <PortalPage className="space-y-7">
      <header className="flex flex-col gap-4 border-b border-stone-200 pb-5 dark:border-white/10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#881337] dark:text-[#FBBF24]"><GraduationCap className="h-4 w-4" aria-hidden="true" />Exam practice</div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900 dark:text-[#FDFBF7]">Published exam papers</h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-stone-600 dark:text-[#E7E0D6]">Browse approved papers by year, subject, and stream.</p>
        </div>
        <button type="button" onClick={() => navigate("/student/practice")} className="inline-flex min-h-10 shrink-0 items-center gap-2 self-start rounded-lg border border-stone-300 px-3 text-xs font-semibold text-stone-700 transition-colors hover:bg-stone-50 dark:border-white/15 dark:text-[#E7E0D6] dark:hover:bg-white/5 sm:self-auto"><BookOpen className="h-4 w-4" aria-hidden="true" />Set up practice</button>
      </header>

      <section className="grid gap-3 sm:grid-cols-3" aria-label="Exam paper summary">
        <article className="rounded-xl border border-stone-200 bg-white p-4 dark:border-white/10 dark:bg-[#261E1A]">
          <div className="flex items-center gap-2 text-xs font-medium text-stone-500 dark:text-[#A89C90]"><BookOpen className="h-4 w-4 text-[#881337]" aria-hidden="true" />Approved papers</div>
          <p className="mt-3 text-2xl font-semibold tabular-nums text-stone-900 dark:text-[#FDFBF7]">{loading ? "Loading" : loadError ? "Unavailable" : exams.length}</p>
          <p className="mt-1 text-[11px] text-stone-500 dark:text-[#A89C90]">Available in the exam library</p>
        </article>
        <article className="rounded-xl border border-stone-200 bg-white p-4 dark:border-white/10 dark:bg-[#261E1A]">
          <div className="flex items-center gap-2 text-xs font-medium text-stone-500 dark:text-[#A89C90]"><CalendarDays className="h-4 w-4 text-[#881337]" aria-hidden="true" />Years represented</div>
          <p className="mt-3 text-2xl font-semibold tabular-nums text-stone-900 dark:text-[#FDFBF7]">{loading ? "Loading" : loadError ? "Unavailable" : availableYears.length}</p>
          <p className="mt-1 text-[11px] text-stone-500 dark:text-[#A89C90]">Based on published papers</p>
        </article>
        <article className="rounded-xl border border-stone-200 bg-white p-4 dark:border-white/10 dark:bg-[#261E1A]">
          <div className="flex items-center gap-2 text-xs font-medium text-stone-500 dark:text-[#A89C90]"><GraduationCap className="h-4 w-4 text-[#881337]" aria-hidden="true" />Subjects represented</div>
          <p className="mt-3 text-2xl font-semibold tabular-nums text-stone-900 dark:text-[#FDFBF7]">{loading ? "Loading" : loadError ? "Unavailable" : availableSubjects.length}</p>
          <p className="mt-1 text-[11px] text-stone-500 dark:text-[#A89C90]">Based on published papers</p>
        </article>
      </section>

      <section className="space-y-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-[#261E1A] sm:p-6" aria-labelledby="exam-library-heading">
        <div className="flex flex-col gap-3 border-b border-stone-100 pb-4 dark:border-white/10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="exam-library-heading" className="text-base font-semibold text-stone-900 dark:text-[#FDFBF7]">Exam library</h2>
            <p className="mt-1 text-xs text-stone-500 dark:text-[#A89C90]">Filter the papers currently available to your account.</p>
          </div>
          <button type="button" onClick={() => void fetchExams()} disabled={loading} className="inline-flex min-h-10 items-center gap-2 self-start rounded-lg border border-stone-300 px-3 text-xs font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-60 dark:border-white/15 dark:text-[#E7E0D6] dark:hover:bg-white/5 sm:self-auto"><RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} aria-hidden="true" />Refresh</button>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <label className="text-xs font-semibold text-stone-700 dark:text-[#E7E0D6]" htmlFor="exam-year-filter">Year
            <select id="exam-year-filter" value={selectedYear} onChange={(event) => setSelectedYear(event.target.value)} className={`${selectClass} mt-1 w-full`} disabled={loading || loadError}>
              <option value="All">All years</option>
              {availableYears.map((year) => <option key={year} value={year}>{year}</option>)}
            </select>
          </label>
          <label className="text-xs font-semibold text-stone-700 dark:text-[#E7E0D6]" htmlFor="exam-subject-filter">Subject
            <select id="exam-subject-filter" value={selectedSubject} onChange={(event) => setSelectedSubject(event.target.value)} className={`${selectClass} mt-1 w-full`} disabled={loading || loadError}>
              <option value="All">All subjects</option>
              {availableSubjects.map((subject) => <option key={subject} value={subject}>{subject}</option>)}
            </select>
          </label>
          <label className="text-xs font-semibold text-stone-700 dark:text-[#E7E0D6]" htmlFor="exam-stream-filter">Stream
            <select id="exam-stream-filter" value={selectedStream} onChange={(event) => setSelectedStream(event.target.value)} className={`${selectClass} mt-1 w-full`} disabled={loading || loadError}>
              <option value="All">All streams</option>
              {availableStreams.map((stream) => <option key={stream} value={stream}>{stream}</option>)}
            </select>
          </label>
        </div>

        {launchError && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200">{launchError}</p>}

        {loading ? (
          <div role="status" aria-label="Loading exam papers"><CardSkeleton count={3} /></div>
        ) : loadError ? (
          <div role="alert" className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200 sm:flex-row sm:items-center sm:justify-between"><p>Exam papers could not be loaded.</p><button type="button" onClick={() => void fetchExams()} className="min-h-10 self-start rounded-lg border border-rose-300 px-3 text-xs font-semibold hover:bg-rose-100 sm:self-auto">Try again</button></div>
        ) : exams.length === 0 ? (
          <div className="rounded-xl border border-dashed border-stone-300 p-8 text-center dark:border-white/15">
            <GraduationCap className="mx-auto h-8 w-8 text-stone-400 dark:text-[#A89C90]" aria-hidden="true" />
            <h3 className="mt-3 text-sm font-semibold text-stone-900 dark:text-[#FDFBF7]">No approved exam papers yet</h3>
            <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-stone-600 dark:text-[#A89C90]">Use unit or adaptive practice while the library is prepared.</p>
            <button type="button" onClick={() => navigate("/student/practice")} className="mt-4 min-h-10 rounded-lg bg-[#881337] px-4 text-xs font-semibold text-white hover:bg-[#9F1239]">Set up practice</button>
          </div>
        ) : filteredExams.length === 0 ? (
          <div className="rounded-xl border border-dashed border-stone-300 p-8 text-center dark:border-white/15">
            <p className="text-sm font-semibold text-stone-800 dark:text-[#FDFBF7]">No papers match these filters</p>
            <p className="mt-1 text-xs text-stone-500 dark:text-[#A89C90]">Clear the filters or browse all streams to see other available papers.</p>
            <button type="button" onClick={() => { setSelectedYear("All"); setSelectedSubject("All"); setSelectedStream("All"); }} className="mt-3 min-h-10 rounded-lg border border-stone-300 px-3 text-xs font-semibold text-stone-700 hover:bg-stone-50 dark:border-white/15 dark:text-[#E7E0D6] dark:hover:bg-white/5">Clear filters</button>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filteredExams.map((exam) => {
              const isLaunching = launchingId === exam.id;
              return (
                <article key={exam.id} className="flex flex-col justify-between gap-5 rounded-xl border border-stone-200 bg-white p-4 transition-colors hover:border-[#881337]/30 dark:border-white/10 dark:bg-[#1C1512] dark:hover:border-[#FBBF24]/40 sm:p-5">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      {exam.year && <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-900 dark:bg-amber-950/40 dark:text-amber-200"><CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />{exam.year}</span>}
                      {exam.stream && <span className="rounded-md bg-stone-100 px-2 py-1 text-[11px] font-medium text-stone-600 dark:bg-white/10 dark:text-[#E7E0D6]">{exam.stream}</span>}
                    </div>
                    <h3 className="mt-3 text-base font-semibold leading-6 text-stone-900 dark:text-[#FDFBF7]">{exam.title || "Published exam"}</h3>
                    <p className="mt-1 text-sm text-stone-600 dark:text-[#A89C90]">{exam.subject || "Comprehensive"}</p>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 pt-3 dark:border-white/10">
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-stone-500 dark:text-[#A89C90]">
                      {exam.durationMinutes != null && <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" aria-hidden="true" />{exam.durationMinutes} min</span>}
                      {exam.totalQuestions != null && <span>{exam.totalQuestions} question{exam.totalQuestions === 1 ? "" : "s"}</span>}
                    </div>
                    <button type="button" onClick={() => void handleStartExam(exam)} disabled={isLaunching || launchingId !== null} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#881337] px-3 text-xs font-semibold text-white hover:bg-[#9F1239] disabled:cursor-wait disabled:opacity-60">
                      {isLaunching ? <><RefreshCw className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />Preparing</> : <>Start paper <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></>}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </PortalPage>
  );
}
