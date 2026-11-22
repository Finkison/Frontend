import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, ArrowRight, BookOpen, Brain, Clock3, Loader2, Network, RefreshCw, Search, Target, Zap } from "lucide-react";
import { getMasteryMap, type ConceptMastery } from "../../services/learningEngineService";
import { startPractice } from "../../services/practiceService";
import useSessionStore from "../../store/sessionStore";
import { useToast } from "../ui/Toast";
import PortalPage from "../shared/PortalPage";

const masteryPercent = (value: number) => Math.max(0, Math.min(100, Math.round(value <= 1 ? value * 100 : value)));

function stateLabel(concept: ConceptMastery): string {
  if (concept.mastery_label?.trim()) return concept.mastery_label;
  if (masteryPercent(concept.mastery) >= 90) return "Mastered";
  if (masteryPercent(concept.mastery) > 0) return "In progress";
  return "Not started";
}

function formatDate(value: string | null): string {
  if (!value) return "No review scheduled";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
}

export default function KnowledgeMap(): React.ReactElement {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const startSession = useSessionStore((state) => state.startSession);
  const [concepts, setConcepts] = useState<ConceptMastery[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [gradeFilter, setGradeFilter] = useState<number | "all">("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [launching, setLaunching] = useState(false);

  const loadConcepts = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const rows = await getMasteryMap();
      setConcepts(Array.isArray(rows) ? rows : []);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadConcepts(); }, [loadConcepts]);

  const subjects = useMemo(() => Array.from(new Set(concepts.map((item) => item.subject).filter(Boolean)).values()).sort(), [concepts]);
  const grades = useMemo(() => Array.from(new Set(concepts.map((item) => Number(item.grade)).filter((grade) => Number.isFinite(grade)))).sort((a, b) => a - b), [concepts]);
  const filteredConcepts = useMemo(() => {
    const term = search.trim().toLocaleLowerCase();
    return concepts.filter((item) => {
      if (subjectFilter !== "all" && item.subject !== subjectFilter) return false;
      if (gradeFilter !== "all" && Number(item.grade) !== gradeFilter) return false;
      if (term && !`${item.name} ${item.subject} ${item.description || ""}`.toLocaleLowerCase().includes(term)) return false;
      return true;
    });
  }, [concepts, gradeFilter, search, subjectFilter]);
  const selectedConcept = filteredConcepts.find((item) => item.concept_id === selectedId) || filteredConcepts[0] || null;
  const subjectAverage = filteredConcepts.length
    ? Math.round(filteredConcepts.reduce((sum, item) => sum + masteryPercent(item.mastery), 0) / filteredConcepts.length)
    : null;
  const masteredCount = filteredConcepts.filter((item) => masteryPercent(item.mastery) >= 90).length;

  const handlePractice = async (concept: ConceptMastery) => {
    const unit = Number(concept.unit_number);
    if (!Number.isInteger(unit) || unit < 1 || launching) return;
    setLaunching(true);
    try {
      const response = await startPractice({ subject: concept.subject, mode: "unit", unit, grade: Number(concept.grade) });
      const data = response.data?.data || response.data || {};
      if (!data.id || !Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error(data.error || data.message || "There are no practice questions for this unit yet.");
      }
      startSession(data.id, data.session_type || "unit", data.questions, data.duration_seconds || data.duration || 1800);
      navigate("/student/session");
    } catch (error: any) {
      showToast({ title: "Practice is unavailable", message: error?.response?.data?.error || error?.message || "Try another unit or come back later.", type: "error" });
    } finally {
      setLaunching(false);
    }
  };

  return (
    <PortalPage className="space-y-6">
      <header className="rounded-2xl bg-[#4C0519] p-5 text-white sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-[#FDE68A]"><Network className="h-3.5 w-3.5" aria-hidden="true" />Your learning map</div>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">Knowledge map</h1>
            <p className="mt-2 text-sm leading-6 text-white/75">Track the topics you’ve studied and your mastery.</p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:min-w-64">
            <div className="rounded-xl border border-white/10 bg-white/10 p-3"><p className="text-[11px] text-white/65">Tracked topics</p><p className="mt-1 text-xl font-semibold">{loading ? "—" : filteredConcepts.length}</p></div>
            <div className="rounded-xl border border-white/10 bg-white/10 p-3"><p className="text-[11px] text-white/65">Visible-topic average</p><p className="mt-1 text-xl font-semibold">{loading || subjectAverage == null ? "—" : `${subjectAverage}%`}</p></div>
          </div>
        </div>
      </header>

      <section className="rounded-xl border border-[#E7E0D6] bg-white p-4 dark:border-white/10 dark:bg-[#261E1A]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by subject">
            <button type="button" onClick={() => setSubjectFilter("all")} aria-pressed={subjectFilter === "all"} className={`min-h-9 rounded-lg px-3 text-xs font-semibold ${subjectFilter === "all" ? "bg-[#881337] text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-[#1C1512] dark:text-[#E7E0D6] dark:hover:bg-white/10"}`}>All subjects</button>
            {subjects.map((subject) => <button key={subject} type="button" onClick={() => setSubjectFilter(subject)} aria-pressed={subjectFilter === subject} className={`min-h-9 rounded-lg px-3 text-xs font-semibold ${subjectFilter === subject ? "bg-[#881337] text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-[#1C1512] dark:text-[#E7E0D6] dark:hover:bg-white/10"}`}>{subject}</button>)}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            {grades.length > 0 && <label><span className="sr-only">Filter by grade</span><select value={gradeFilter} onChange={(event) => setGradeFilter(event.target.value === "all" ? "all" : Number(event.target.value))} className="min-h-10 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]"><option value="all">All grades</option>{grades.map((grade) => <option key={grade} value={grade}>Grade {grade}</option>)}</select></label>}
            <label className="relative block"><span className="sr-only">Search topics</span><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" aria-hidden="true" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search topics" className="min-h-10 w-full rounded-lg border border-stone-300 bg-white pl-9 pr-3 text-sm outline-none focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/15 dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7] sm:w-56" /></label>
          </div>
        </div>
      </section>

      {loading ? <div role="status" className="rounded-xl border border-[#E7E0D6] bg-white p-12 text-center text-sm text-stone-500 dark:border-white/10 dark:bg-[#261E1A] dark:text-[#A89C90]"><Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" aria-hidden="true" />Loading your learning map…</div>
        : loadError ? <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center dark:border-rose-900/40 dark:bg-rose-950/20"><AlertCircle className="mx-auto h-5 w-5 text-rose-700 dark:text-rose-200" aria-hidden="true" /><p className="mt-2 text-sm font-semibold text-rose-800 dark:text-rose-100">Your learning map could not be loaded.</p><button type="button" onClick={() => void loadConcepts()} className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-lg border border-rose-300 px-3 text-xs font-semibold text-rose-800 hover:bg-rose-100 dark:border-rose-800 dark:text-rose-100 dark:hover:bg-rose-950/50"><RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />Try again</button></div>
          : concepts.length === 0 ? <section className="rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center dark:border-white/15 dark:bg-[#261E1A]"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF1F2] text-[#881337] dark:bg-[#4C0519]/40 dark:text-[#FBBF24]"><BookOpen className="h-6 w-6" aria-hidden="true" /></div><h2 className="mt-4 text-base font-semibold text-stone-900 dark:text-[#FDFBF7]">Your map will grow with practice</h2><p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-stone-600 dark:text-[#A89C90]">Start a practice session to build your map.</p><button type="button" onClick={() => navigate("/student/practice")} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#881337] px-4 text-sm font-semibold text-white hover:bg-[#9F1239]">Start practice<ArrowRight className="h-4 w-4" aria-hidden="true" /></button></section>
            : filteredConcepts.length === 0 ? <div className="rounded-xl border border-dashed border-stone-300 bg-white p-10 text-center text-sm text-stone-500 dark:border-white/15 dark:bg-[#261E1A] dark:text-[#A89C90]">No topics match these filters. Choose another subject or clear your search.</div>
              : <div className="grid items-start gap-5 lg:grid-cols-12">
                <section className="space-y-3 lg:col-span-7" aria-label="Tracked topics">
                  <div className="flex items-center justify-between px-1 text-xs text-stone-500 dark:text-[#A89C90]"><span className="font-semibold">Topics you’ve practiced</span><span>{filteredConcepts.length} shown · {masteredCount} mastered</span></div>
                  <ul className="space-y-2.5">{filteredConcepts.map((concept) => {
                    const percent = masteryPercent(concept.mastery);
                    const active = selectedConcept?.concept_id === concept.concept_id;
                    return <li key={concept.concept_id}><button type="button" aria-pressed={active} onClick={() => setSelectedId(concept.concept_id)} className={`w-full rounded-xl border p-4 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-[#881337]/25 ${active ? "border-[#881337] bg-[#FFF8F8] dark:border-[#FBBF24] dark:bg-[#4C0519]/20" : "border-stone-200 bg-white hover:border-stone-300 dark:border-white/10 dark:bg-[#261E1A] dark:hover:border-white/20"}`}>
                      <div className="flex items-start justify-between gap-4"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="rounded-md bg-stone-100 px-2 py-1 text-[10px] font-semibold text-stone-600 dark:bg-white/5 dark:text-[#E7E0D6]">Grade {concept.grade}</span><span className="text-[10px] text-stone-500 dark:text-[#A89C90]">{concept.subject}{concept.unit_number ? ` · Unit ${concept.unit_number}` : ""}</span></div><h2 className="mt-2 text-sm font-semibold text-stone-900 dark:text-[#FDFBF7]">{concept.name}</h2></div><span className="shrink-0 text-sm font-semibold text-stone-800 dark:text-[#FDFBF7]">{percent}%</span></div>
                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-stone-100 dark:bg-white/10"><div className={`h-full rounded-full ${percent >= 90 ? "bg-emerald-500" : percent >= 60 ? "bg-[#881337] dark:bg-[#FBBF24]" : "bg-amber-500"}`} style={{ width: `${percent}%` }} /></div>
                      <p className="mt-2 text-[11px] text-stone-500 dark:text-[#A89C90]">{stateLabel(concept)}</p>
                    </button></li>;
                  })}</ul>
                </section>

                <aside className="lg:sticky lg:top-20 lg:col-span-5">{selectedConcept && <section className="rounded-2xl border border-[#E7E0D6] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#261E1A] sm:p-6">
                  <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wide text-[#881337] dark:text-[#FBBF24]">Grade {selectedConcept.grade}{selectedConcept.unit_number ? ` · Unit ${selectedConcept.unit_number}` : ""}</p><h2 className="mt-1 text-xl font-semibold tracking-tight text-stone-900 dark:text-[#FDFBF7]">{selectedConcept.name}</h2><p className="mt-1 text-xs text-stone-500 dark:text-[#A89C90]">{selectedConcept.subject}</p></div><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF1F2] text-[#881337] dark:bg-[#4C0519]/40 dark:text-[#FBBF24]"><Target className="h-5 w-5" aria-hidden="true" /></div></div>
                  {selectedConcept.description && <p className="mt-4 text-sm leading-6 text-stone-600 dark:text-[#E7E0D6]">{selectedConcept.description}</p>}
                  <div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-lg bg-stone-50 p-3 dark:bg-[#1C1512]"><p className="text-[11px] text-stone-500 dark:text-[#A89C90]">Recorded mastery</p><p className="mt-1 text-lg font-semibold text-stone-900 dark:text-[#FDFBF7]">{masteryPercent(selectedConcept.mastery)}%</p></div><div className="rounded-lg bg-stone-50 p-3 dark:bg-[#1C1512]"><p className="text-[11px] text-stone-500 dark:text-[#A89C90]">EUEE weight</p><p className="mt-1 text-lg font-semibold text-stone-900 dark:text-[#FDFBF7]">{selectedConcept.euee_weight > 0 ? `~${selectedConcept.euee_weight} marks` : "Not provided"}</p></div></div>
                  <div className="mt-4 rounded-lg border border-stone-200 p-3 dark:border-white/10"><p className="flex items-center gap-2 text-xs font-semibold text-stone-800 dark:text-[#FDFBF7]"><Clock3 className="h-3.5 w-3.5 text-stone-500" aria-hidden="true" />Next review</p><p className="mt-1 text-xs text-stone-600 dark:text-[#A89C90]">{formatDate(selectedConcept.next_review)}</p></div>
                  <div className="mt-5"><h3 className="text-xs font-semibold text-stone-800 dark:text-[#FDFBF7]">Builds on</h3>{selectedConcept.prerequisite_details?.length ? <ul className="mt-2 space-y-2">{selectedConcept.prerequisite_details.map((prerequisite) => {
                    const tracked = concepts.find((item) => item.concept_id === prerequisite.id);
                    return <li key={prerequisite.id} className="flex items-start justify-between gap-3 rounded-lg bg-stone-50 px-3 py-2.5 dark:bg-[#1C1512]"><div><p className="text-xs font-medium text-stone-800 dark:text-[#FDFBF7]">{prerequisite.name}</p><p className="mt-0.5 text-[10px] text-stone-500 dark:text-[#A89C90]">{prerequisite.subject} · Grade {prerequisite.grade}{prerequisite.unit_number ? ` · Unit ${prerequisite.unit_number}` : ""}</p></div><span className={`shrink-0 text-[10px] font-medium ${tracked ? "text-emerald-700 dark:text-emerald-300" : "text-stone-500 dark:text-[#A89C90]"}`}>{tracked ? `${masteryPercent(tracked.mastery)}% mastery` : "Not tracked"}</span></li>;
                  })}</ul> : <p className="mt-2 rounded-lg bg-stone-50 p-3 text-xs text-stone-600 dark:bg-[#1C1512] dark:text-[#A89C90]">No prerequisite links are recorded for this topic.</p>}</div>
                  <button type="button" onClick={() => void handlePractice(selectedConcept)} disabled={launching || !selectedConcept.unit_number} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#881337] px-4 text-sm font-semibold text-white hover:bg-[#9F1239] disabled:cursor-not-allowed disabled:opacity-60">{launching ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Zap className="h-4 w-4" aria-hidden="true" />}{launching ? "Preparing practice…" : "Practice this unit"}</button>
                  <button type="button" onClick={() => navigate("/student/spaced-review")} className="mt-2 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-stone-300 px-4 text-xs font-semibold text-stone-700 hover:bg-stone-50 dark:border-white/15 dark:text-[#E7E0D6] dark:hover:bg-white/5"><Brain className="h-3.5 w-3.5" aria-hidden="true" />Review due topics</button>
                </section>}</aside>
              </div>}
    </PortalPage>
  );
}
