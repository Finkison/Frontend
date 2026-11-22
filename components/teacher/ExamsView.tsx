import React, { useCallback, useEffect, useState } from "react";
import { ArrowRight, BarChart3, AlertCircle, FileCheck2, RefreshCw, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../../i18n";
import { getApiErrorMessage } from "../../services/api";
import { getTeacherExamResults, getTeacherExams, type TeacherExamResult, type TeacherExamSummary } from "../../services/schoolService";
import PageHeader from "../shared/PageHeader";
import PortalPage from "../shared/PortalPage";

export default function TeacherExamsView(): React.ReactElement {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [exams, setExams] = useState<TeacherExamSummary[]>([]);
  const [selectedExam, setSelectedExam] = useState<TeacherExamSummary | null>(null);
  const [results, setResults] = useState<TeacherExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultsError, setResultsError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadExams = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getTeacherExams();
      setExams(response.data?.exams || []);
    } catch (loadError) {
      setError(getApiErrorMessage(loadError) || t("classroomWorkflows.teacherExams.loadError"));
    } finally {
      setLoading(false);
    }
  }, [refreshKey, t]);

  useEffect(() => { void loadExams(); }, [loadExams]);

  const showResults = async (exam: TeacherExamSummary) => {
    setSelectedExam(exam);
    setResults([]);
    setResultsLoading(true);
    setResultsError(null);
    try {
      const response = await getTeacherExamResults(exam.id);
      setResults(response.data?.results || []);
    } catch (loadError) {
      setResultsError(getApiErrorMessage(loadError) || t("classroomWorkflows.teacherExams.resultsError"));
    } finally {
      setResultsLoading(false);
    }
  };

  return (
    <PortalPage className="max-w-6xl space-y-6">
      <PageHeader
        eyebrow={t("classroomWorkflows.teacherExams.eyebrow")}
        title={t("classroomWorkflows.teacherExams.title")}
        description={t("classroomWorkflows.teacherExams.description")}
        secondaryActions={[{ label: t("classroomWorkflows.teacherExams.refresh"), onClick: () => setRefreshKey((value) => value + 1), icon: RefreshCw, loading }]}
        primaryAction={{ label: t("classroomWorkflows.teacherExams.createExam"), onClick: () => navigate("/teacher/assessment-builder"), icon: FileCheck2 }}
      />

      {error && <div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />{error}</div>}
      {loading ? <div role="status" className="rounded-2xl border border-[#E7E0D6] bg-white p-10 text-center text-sm text-stone-500 dark:border-white/10 dark:bg-[#261E1A] dark:text-[#A89C90]">{t("classroomWorkflows.teacherExams.loading")}</div> : exams.length === 0 ? <section className="rounded-2xl border border-[#E7E0D6] bg-white p-10 text-center dark:border-white/10 dark:bg-[#261E1A]"><FileCheck2 className="mx-auto h-9 w-9 text-stone-300" aria-hidden="true" /><h2 className="mt-3 font-semibold text-stone-900 dark:text-[#FDFBF7]">{t("classroomWorkflows.teacherExams.emptyTitle")}</h2><p className="mx-auto mt-1 max-w-md text-sm leading-6 text-stone-600 dark:text-[#A89C90]">{t("classroomWorkflows.teacherExams.emptyDescription")}</p><button type="button" onClick={() => navigate("/teacher/assessment-builder")} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#881337] px-4 text-sm font-semibold text-white hover:bg-[#9F1239]">{t("classroomWorkflows.teacherExams.createExam")}<ArrowRight className="h-4 w-4" aria-hidden="true" /></button></section> : (
        <section className="overflow-hidden rounded-2xl border border-[#E7E0D6] bg-white shadow-xs dark:border-white/10 dark:bg-[#261E1A]"><div className="flex items-center justify-between gap-3 border-b border-[#E7E0D6] p-5 dark:border-white/10"><div><h2 className="font-semibold text-stone-900 dark:text-[#FDFBF7]">{t("classroomWorkflows.teacherExams.assessmentsTitle")}</h2><p className="mt-1 text-xs text-stone-500 dark:text-[#A89C90]">{t("classroomWorkflows.teacherExams.assessmentsDescription")}</p></div><span className="rounded-full bg-[#FAF8F5] px-3 py-1 text-xs font-semibold text-stone-700 dark:bg-[#1C1512] dark:text-[#E7E0D6]">{exams.length}</span></div><div className="divide-y divide-[#E7E0D6] dark:divide-white/10">{exams.map((exam) => <article key={exam.id} className="grid gap-4 p-5 lg:grid-cols-[minmax(0,1fr)_repeat(3,minmax(95px,auto))_auto] lg:items-center"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold text-stone-900 dark:text-[#FDFBF7]">{exam.title}</h3><span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${exam.status === "Published" ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200" : "bg-amber-50 text-amber-800 dark:bg-amber-950/30 dark:text-amber-200"}`}>{t(`classroomWorkflows.teacherExams.status.${exam.status.toLowerCase()}`)}</span></div><p className="mt-1 text-sm text-stone-600 dark:text-[#A89C90]">{exam.subject} · {exam.sections.map((section) => section.name).join(", ") || t("classroomWorkflows.teacherExams.noSections")}</p><p className="mt-1 text-xs text-stone-500 dark:text-[#A89C90]">{new Date(exam.created_at).toLocaleDateString()} · {t("classroomWorkflows.teacherExams.duration", { minutes: exam.duration_minutes })} · {t("classroomWorkflows.teacherExams.questionCount", { count: exam.total_questions })}</p></div><div className="flex items-center gap-2 text-sm text-stone-700 dark:text-[#E7E0D6]"><Users className="h-4 w-4 text-stone-400" aria-hidden="true" />{t("classroomWorkflows.teacherExams.candidates", { count: exam.candidate_count })}</div><div className="text-sm text-stone-700 dark:text-[#E7E0D6]">{t("classroomWorkflows.teacherExams.completedCount", { completed: exam.completed_count, total: exam.candidate_count })}</div><div className="flex items-center gap-2 text-sm text-stone-700 dark:text-[#E7E0D6]"><BarChart3 className="h-4 w-4 text-stone-400" aria-hidden="true" />{exam.average_percent == null ? t("classroomWorkflows.teacherExams.noResults") : `${exam.average_percent}%`}</div><button type="button" onClick={() => void showResults(exam)} className="min-h-10 rounded-lg border border-stone-300 px-3 text-xs font-semibold text-stone-700 hover:border-[#881337] hover:text-[#881337] dark:border-white/15 dark:text-[#E7E0D6] dark:hover:border-[#FBBF24]">{t("classroomWorkflows.teacherExams.viewResults")}</button></article>)}</div></section>
      )}

      {selectedExam && <section className="overflow-hidden rounded-2xl border border-[#E7E0D6] bg-white shadow-xs dark:border-white/10 dark:bg-[#261E1A]" aria-labelledby="exam-results-heading"><div className="flex flex-col gap-3 border-b border-[#E7E0D6] p-5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-medium text-stone-500 dark:text-[#A89C90]">{selectedExam.subject}</p><h2 id="exam-results-heading" className="mt-1 text-lg font-semibold text-stone-900 dark:text-[#FDFBF7]">{selectedExam.title} · {t("classroomWorkflows.teacherExams.resultsTitle")}</h2></div><button type="button" onClick={() => setSelectedExam(null)} className="min-h-9 self-start rounded-lg px-3 text-xs font-semibold text-stone-600 hover:bg-stone-100 dark:text-[#E7E0D6] dark:hover:bg-white/5">{t("classroomWorkflows.teacherExams.close")}</button></div>{resultsLoading ? <p role="status" className="p-8 text-center text-sm text-stone-500 dark:text-[#A89C90]">{t("classroomWorkflows.teacherExams.loadingResults")}</p> : resultsError ? <p role="alert" className="p-6 text-sm text-rose-800 dark:text-rose-200">{resultsError}</p> : results.length === 0 ? <p className="p-8 text-center text-sm text-stone-500 dark:text-[#A89C90]">{t("classroomWorkflows.teacherExams.noResultsYet")}</p> : <div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm"><thead className="bg-[#FAF8F5] text-xs font-semibold text-stone-500 dark:bg-[#1C1512] dark:text-[#A89C90]"><tr><th className="px-5 py-3">{t("classroomWorkflows.teacherExams.learner")}</th><th className="px-5 py-3">{t("classroomWorkflows.teacherExams.classLabel")}</th><th className="px-5 py-3">{t("classroomWorkflows.teacherExams.scoreLabel")}</th><th className="px-5 py-3">{t("classroomWorkflows.teacherExams.submittedLabel")}</th></tr></thead><tbody className="divide-y divide-[#E7E0D6] dark:divide-white/10">{results.map((result) => <tr key={result.student_id}><td className="px-5 py-3 font-semibold text-stone-900 dark:text-[#FDFBF7]">{result.student_name}</td><td className="px-5 py-3 text-stone-600 dark:text-[#E7E0D6]">Grade {result.grade} · {result.section}</td><td className="px-5 py-3 font-mono tabular-nums text-stone-700 dark:text-[#E7E0D6]">{result.score_percent == null ? "—" : `${result.score_percent}%`} <span className="text-xs text-stone-500">({result.score}/{result.max_score})</span></td><td className="px-5 py-3 text-stone-600 dark:text-[#E7E0D6]">{new Date(result.submitted_at).toLocaleString()}</td></tr>)}</tbody></table></div>}</section>}
    </PortalPage>
  );
}
