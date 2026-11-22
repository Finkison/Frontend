import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, BookOpenCheck, CheckCircle2, Clock3, RefreshCw, Search, Users, type LucideIcon } from "lucide-react";
import PageHeader from "../shared/PageHeader";
import PortalPage from "../shared/PortalPage";
import { useI18n } from "../../i18n";
import { getSchoolTaskSubmissions, getSchoolTasks, type SchoolTaskSubmission } from "../../services/schoolService";

type TeacherTask = {
  id: string;
  title: string;
  subject: string;
  sections: string[];
  due_date: string;
  status: string;
  max_marks: number;
  total_assigned: number;
  submitted_count: number;
  needs_review_count: number;
};

const statusTranslationKey: Record<string, string> = {
  Assigned: "statusAssigned",
  Overdue: "statusOverdue",
  Submitted: "statusSubmitted",
  Graded: "statusGraded",
};

export default function TeacherGradebookView(): React.ReactElement {
  const { t, language } = useI18n();
  const [searchParams] = useSearchParams();
  const requestedTaskId = searchParams.get("task") || "";
  const [tasks, setTasks] = useState<TeacherTask[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState(requestedTaskId);
  const [selectedClass, setSelectedClass] = useState("all");
  const [studentSearch, setStudentSearch] = useState("");
  const [submissions, setSubmissions] = useState<SchoolTaskSubmission[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [tasksError, setTasksError] = useState(false);
  const [submissionsError, setSubmissionsError] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadTasks = useCallback(async () => {
    setTasksLoading(true);
    setTasksError(false);
    try {
      const response = await getSchoolTasks();
      const rows = Array.isArray(response.data?.tasks) ? response.data.tasks : [];
      const normalized: TeacherTask[] = rows.map((row: Record<string, unknown>) => ({
        id: String(row.id ?? ""),
        title: String(row.title ?? ""),
        subject: String(row.subject ?? ""),
        sections: Array.isArray(row.sections) ? row.sections.map(String) : [],
        due_date: String(row.due_date ?? ""),
        status: String(row.status ?? "Assigned"),
        max_marks: Number(row.max_marks) || 0,
        total_assigned: Number(row.total_assigned) || 0,
        submitted_count: Number(row.submitted_count) || 0,
        needs_review_count: Number(row.needs_review_count) || 0,
      })).filter((task) => task.id);
      setTasks(normalized);
      setSelectedTaskId((current) => normalized.some((task) => task.id === current)
        ? current
        : normalized.some((task) => task.id === requestedTaskId)
          ? requestedTaskId
          : normalized[0]?.id || "");
    } catch {
      setTasksError(true);
      setTasks([]);
      setSelectedTaskId("");
    } finally {
      setTasksLoading(false);
    }
  }, [requestedTaskId]);

  useEffect(() => { void loadTasks(); }, [loadTasks, refreshKey]);

  const classes = useMemo(() => [...new Set(tasks.flatMap((task) => task.sections))].sort((a, b) => a.localeCompare(b)), [tasks]);
  const visibleTasks = useMemo(() => tasks.filter((task) => selectedClass === "all" || task.sections.includes(selectedClass)), [tasks, selectedClass]);
  const activeTask = visibleTasks.find((task) => task.id === selectedTaskId) || visibleTasks[0] || null;

  useEffect(() => {
    if (activeTask && activeTask.id !== selectedTaskId) setSelectedTaskId(activeTask.id);
  }, [activeTask, selectedTaskId]);

  useEffect(() => {
    if (!activeTask) {
      setSubmissions([]);
      setSubmissionsLoading(false);
      setSubmissionsError(false);
      return;
    }
    let current = true;
    setSubmissionsLoading(true);
    setSubmissionsError(false);
    getSchoolTaskSubmissions(activeTask.id)
      .then((response) => {
        if (current) setSubmissions(Array.isArray(response.data?.submissions) ? response.data.submissions : []);
      })
      .catch(() => {
        if (current) {
          setSubmissions([]);
          setSubmissionsError(true);
        }
      })
      .finally(() => {
        if (current) setSubmissionsLoading(false);
      });
    return () => { current = false; };
  }, [activeTask, refreshKey]);

  const filteredSubmissions = useMemo(() => {
    const query = studentSearch.trim().toLocaleLowerCase();
    return submissions.filter((submission) => !query || submission.student_name.toLocaleLowerCase().includes(query));
  }, [studentSearch, submissions]);

  const gradedCount = submissions.filter((item) => item.status === "Graded").length;
  const reviewCount = submissions.filter((item) => item.status === "Submitted").length;
  const formatDate = (value: string | null) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    const locale = language === "am" ? "am-ET" : language === "om" ? "om-ET" : "en-ET";
    return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(date);
  };

  return (
    <PortalPage className="max-w-7xl space-y-6">
      <PageHeader
        title={t("appNavigation.items.grades")}
        description={t("teacherGradebook.description")}
        primaryAction={{ label: t("teacherGradebook.browseAssignments"), href: "/teacher/tasks", icon: ArrowRight }}
        secondaryActions={[{ label: t("teacherGradebook.refresh"), onClick: () => setRefreshKey((value) => value + 1), icon: RefreshCw, loading: tasksLoading || submissionsLoading }]}
      />

      <div className="grid gap-3 sm:grid-cols-3" aria-label={t("teacherGradebook.description")}>
        <SummaryCard icon={BookOpenCheck} label={t("teacherGradebook.assessments")} value={visibleTasks.length} />
        <SummaryCard icon={CheckCircle2} label={t("teacherGradebook.gradedCount")} value={gradedCount} />
        <SummaryCard icon={Clock3} label={t("teacherGradebook.needsReview")} value={reviewCount} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(16rem,0.75fr)_minmax(0,1.75fr)]">
        <section className="overflow-hidden rounded-2xl border border-[#E7E0D6] bg-white dark:border-white/10 dark:bg-[#261E1A]" aria-label={t("teacherGradebook.assessments")}>
          <div className="border-b border-[#E7E0D6] p-4 dark:border-white/10">
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-stone-700 dark:text-[#E7E0D6]">{t("teacherGradebook.classFilter")}</span>
              <select value={selectedClass} onChange={(event) => setSelectedClass(event.target.value)} className="min-h-10 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-900 focus:border-[#881337] focus:outline-none focus:ring-2 focus:ring-[#881337]/15 dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]">
                <option value="all">{t("teacherGradebook.allClasses")}</option>
                {classes.map((name) => <option key={name} value={name}>{name}</option>)}
              </select>
            </label>
          </div>
          {tasksLoading ? (
            <p role="status" className="p-8 text-center text-sm text-stone-500 dark:text-[#A89C90]">{t("teacherAssignments.loading")}</p>
          ) : tasksError ? (
            <div className="p-6 text-center">
              <p role="alert" className="text-sm text-rose-800 dark:text-rose-200">{t("teacherAssignments.loadError")}</p>
              <button type="button" onClick={() => setRefreshKey((value) => value + 1)} className="mt-3 min-h-10 rounded-lg border border-stone-300 px-3 text-sm font-semibold dark:border-white/15">{t("teacherGradebook.refresh")}</button>
            </div>
          ) : tasks.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="mx-auto h-7 w-7 text-stone-400" aria-hidden="true" />
              <h2 className="mt-3 text-sm font-semibold text-stone-900 dark:text-[#FDFBF7]">{t("teacherGradebook.noAssignmentsTitle")}</h2>
              <p className="mt-1 text-xs leading-5 text-stone-500 dark:text-[#A89C90]">{t("teacherGradebook.noAssignmentsBody")}</p>
              <Link to="/teacher/tasks" className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#881337] px-4 text-xs font-semibold text-white dark:bg-[#FBBF24] dark:text-[#1C1512]">{t("teacherGradebook.browseAssignments")}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            </div>
          ) : visibleTasks.length === 0 ? (
            <p className="p-8 text-center text-sm text-stone-500 dark:text-[#A89C90]">{t("teacherGradebook.noMatchingAssignments")}</p>
          ) : (
            <ul className="divide-y divide-[#E7E0D6] dark:divide-white/10">
              {visibleTasks.map((task) => {
                const selected = activeTask?.id === task.id;
                return <li key={task.id}>
                  <button type="button" aria-pressed={selected} onClick={() => setSelectedTaskId(task.id)} className={`w-full p-4 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#881337] ${selected ? "bg-rose-50 dark:bg-[#4C0519]/30" : "hover:bg-stone-50 dark:hover:bg-white/5"}`}>
                    <span className="block truncate text-sm font-semibold text-stone-900 dark:text-[#FDFBF7]">{task.title || t("teacherAssignments.untitledAssignment")}</span>
                    <span className="mt-1 block text-xs text-stone-500 dark:text-[#A89C90]">{[task.subject, task.sections.join(", ")].filter(Boolean).join(" · ")}</span>
                    <span className="mt-2 flex flex-wrap gap-3 text-[11px] text-stone-600 dark:text-[#E7E0D6]">
                      <span>{task.submitted_count} / {task.total_assigned} {t("teacherGradebook.submissions").toLocaleLowerCase()}</span>
                      <span>{task.needs_review_count} {t("teacherGradebook.needsReview").toLocaleLowerCase()}</span>
                    </span>
                  </button>
                </li>;
              })}
            </ul>
          )}
        </section>

        <section className="min-w-0 overflow-hidden rounded-2xl border border-[#E7E0D6] bg-white dark:border-white/10 dark:bg-[#261E1A]" aria-live="polite">
          {!activeTask ? (
            <div className="p-10 text-center text-sm text-stone-500 dark:text-[#A89C90]">{t("teacherGradebook.selectAssignment")}</div>
          ) : <>
            <div className="flex flex-col gap-3 border-b border-[#E7E0D6] p-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h2 className="truncate text-base font-semibold text-stone-900 dark:text-[#FDFBF7]">{activeTask.title || t("teacherAssignments.untitledAssignment")}</h2>
                <p className="mt-1 text-xs text-stone-500 dark:text-[#A89C90]">{activeTask.subject} · {activeTask.max_marks} {t("teacherAssignments.pointsValue", { points: activeTask.max_marks })}</p>
              </div>
              <label className="relative block w-full sm:max-w-xs">
                <span className="sr-only">{t("teacherGradebook.searchStudents")}</span>
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" aria-hidden="true" />
                <input value={studentSearch} onChange={(event) => setStudentSearch(event.target.value)} className="min-h-10 w-full rounded-lg border border-stone-300 bg-white pl-9 pr-3 text-sm dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]" />
              </label>
            </div>
            {submissionsLoading ? (
              <p role="status" className="p-10 text-center text-sm text-stone-500 dark:text-[#A89C90]">{t("teacherAssignments.loadingSubmissions")}</p>
            ) : submissionsError ? (
              <div className="p-8 text-center"><p role="alert" className="text-sm text-rose-800 dark:text-rose-200">{t("teacherAssignments.submissionsError")}</p><button type="button" onClick={() => setRefreshKey((value) => value + 1)} className="mt-3 min-h-10 rounded-lg border border-stone-300 px-3 text-sm font-semibold dark:border-white/15">{t("teacherGradebook.refresh")}</button></div>
            ) : submissions.length === 0 ? (
              <div className="p-10 text-center"><h3 className="text-sm font-semibold text-stone-900 dark:text-[#FDFBF7]">{t("teacherGradebook.noSubmissionsTitle")}</h3><p className="mt-1 text-xs text-stone-500 dark:text-[#A89C90]">{t("teacherGradebook.noSubmissionsBody")}</p></div>
            ) : filteredSubmissions.length === 0 ? (
              <p className="p-8 text-center text-sm text-stone-500 dark:text-[#A89C90]">{t("teacherGradebook.noMatchingStudents")}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-left text-sm">
                  <caption className="sr-only">{activeTask.title} — {t("teacherGradebook.submissions")}</caption>
                  <thead className="bg-[#FAF8F5] text-xs font-semibold text-stone-600 dark:bg-[#1C1512] dark:text-[#A89C90]"><tr>
                    <th scope="col" className="px-4 py-3">{t("teacherGradebook.student")}</th>
                    <th scope="col" className="px-4 py-3">{t("teacherGradebook.status")}</th>
                    <th scope="col" className="px-4 py-3">{t("teacherGradebook.mark")}</th>
                    <th scope="col" className="px-4 py-3">{t("teacherGradebook.feedback")}</th>
                    <th scope="col" className="px-4 py-3">{t("teacherGradebook.action")}</th>
                  </tr></thead>
                  <tbody className="divide-y divide-[#E7E0D6] dark:divide-white/10">{filteredSubmissions.map((submission) => {
                    const statusKey = statusTranslationKey[submission.status] || "statusAssigned";
                    const statusLabel = t(`teacherGradebook.${statusKey}`);
                    return <tr key={submission.id}>
                      <th scope="row" className="px-4 py-3 font-medium text-stone-900 dark:text-[#FDFBF7]">{submission.student_name}<span className="mt-0.5 block text-[11px] font-normal text-stone-500 dark:text-[#A89C90]">{submission.classroom}</span></th>
                      <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${submission.status === "Graded" ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200" : submission.status === "Submitted" ? "bg-amber-50 text-amber-900 dark:bg-amber-950/30 dark:text-amber-100" : "bg-stone-100 text-stone-700 dark:bg-white/10 dark:text-[#E7E0D6]"}`}>{statusLabel}{submission.submitted_late ? ` · ${t("teacherGradebook.late")}` : ""}</span>{submission.submitted_at && <span className="mt-1 block text-[11px] text-stone-500 dark:text-[#A89C90]">{t("teacherGradebook.submittedAt", { date: formatDate(submission.submitted_at) })}</span>}</td>
                      <td className="px-4 py-3 font-semibold tabular-nums text-stone-900 dark:text-[#FDFBF7]">{submission.mark == null ? t("teacherGradebook.notGraded") : `${submission.mark} / ${activeTask.max_marks}`}</td>
                      <td className="max-w-56 px-4 py-3 text-xs leading-5 text-stone-600 dark:text-[#E7E0D6]">{submission.feedback || t("teacherGradebook.notProvided")}</td>
                      <td className="px-4 py-3"><Link to={`/teacher/tasks?task=${encodeURIComponent(activeTask.id)}`} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-stone-300 px-3 text-xs font-semibold text-stone-800 hover:bg-stone-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#881337] dark:border-white/15 dark:text-[#FDFBF7] dark:hover:bg-white/5">{t("teacherGradebook.reviewSubmission")}<ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></Link></td>
                    </tr>;
                  })}</tbody>
                </table>
              </div>
            )}
          </>}
        </section>
      </div>
    </PortalPage>
  );
}

function SummaryCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: number }): React.ReactElement {
  return <article className="rounded-xl border border-[#E7E0D6] bg-white p-4 dark:border-white/10 dark:bg-[#261E1A]">
    <div className="flex items-center justify-between text-xs font-medium text-stone-600 dark:text-[#A89C90]">{label}<Icon className="h-4 w-4 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" /></div>
    <p className="mt-3 font-mono text-2xl font-semibold tabular-nums text-stone-900 dark:text-[#FDFBF7]">{value}</p>
  </article>;
}
