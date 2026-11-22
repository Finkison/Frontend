import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { createSchoolTask, downloadSchoolTaskSubmissionFile, getSchoolTaskSubmissions, getSchoolTasks, getTeacherAssignedPairs, gradeSchoolTaskSubmission, type SchoolTaskSubmission } from "../../services/schoolService";
import { 
  Download,
  Plus, 
  Clock, 
  X
} from "lucide-react";
import { useToast } from "../ui/Toast";
import PageHeader from "../shared/PageHeader";
import PortalPage from "../shared/PortalPage";
import PortalLoading from "../shared/PortalLoading";
import PortalError from "../shared/PortalError";
import { useI18n } from "../../i18n";
import { getApiErrorMessage } from "../../services/api";

type AssignedPair = {
  assignment_id?: string | number;
  section_id: string | number;
  section_name?: string;
  grade?: string;
  subject_id: string;
  subject_name: string;
};

type TeacherTask = {
  id: string;
  title: string;
  type: string;
  sections: string[];
  dueDate: string;
  submittedCount: number;
  needsReviewCount: number;
  totalCount: number;
  maxMarks: number;
  status: string;
  latePolicy: "accept_late" | "no_late";
};

const pairKey = (pair: AssignedPair) => `${pair.subject_id}:${pair.section_id}`;

function normalizeTask(task: any): TeacherTask {
  const status = task.status || "Assigned";
  return {
    id: String(task.id ?? task.task_id ?? `${task.title}-${task.due_date}`),
    title: task.title || "",
    type: task.type || task.task_type || "Assignment",
    sections: Array.isArray(task.sections) ? task.sections : [],
    dueDate: task.due_date || task.dueDate || "",
    submittedCount: Number(task.submitted_count ?? task.submittedCount) || 0,
    needsReviewCount: Number(task.needs_review_count ?? task.needsReviewCount) || 0,
    totalCount: Number(task.total_assigned ?? task.totalCount) || 0,
    maxMarks: Number(task.max_marks ?? task.maxMarks) || 0,
    status: status === "Assigned" ? "Active" : status,
    latePolicy: task.late_policy === "no_late" ? "no_late" : "accept_late",
  };
}

function formatDateInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function defaultDueDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return formatDateInput(date);
}

const ALLOWED_TASK_TYPES = [
  "Homework",
  "Quiz",
  "Reading",
  "Project",
  "Practice set",
  "Lab report"
] as const;

const TASK_TYPE_KEYS: Record<string, string> = {
  Homework: "homework",
  Quiz: "quiz",
  Reading: "reading",
  Project: "project",
  "Practice set": "practiceSet",
  "Lab report": "labReport",
};

const TASK_STATUS_KEYS: Record<string, string> = {
  Active: "active",
  Assigned: "active",
  Archived: "archived",
  Submitted: "submitted",
  Graded: "graded",
};

export default function TeacherTasksView(): React.ReactElement {
  const { t, language } = useI18n();
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const requestedTaskId = searchParams.get("task") || "";

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");
  const [assignedPairs, setAssignedPairs] = useState<AssignedPair[]>([]);
  const [assignmentsLoading, setAssignmentsLoading] = useState(true);
  const [assignmentsError, setAssignmentsError] = useState(false);
  const [selectedAssignmentKey, setSelectedAssignmentKey] = useState("");
  const [tasksLoading, setTasksLoading] = useState(true);
  const [tasksError, setTasksError] = useState(false);

  const [taskForm, setTaskForm] = useState({
    title: "",
    task_type: "Homework",
    due_date: defaultDueDate(),
    max_marks: 20,
    late_policy: "accept_late" as "accept_late" | "no_late",
    instructions: ""
  });
  const [creating, setCreating] = useState(false);

  const [tasks, setTasks] = useState<TeacherTask[]>([]);
  const [reviewingTask, setReviewingTask] = useState<TeacherTask | null>(null);
  const [submissions, setSubmissions] = useState<SchoolTaskSubmission[]>([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [gradeDrafts, setGradeDrafts] = useState<Record<string, { mark: string; feedback: string }>>({});
  const [gradingId, setGradingId] = useState<string | null>(null);
  const [downloadingSubmissionId, setDownloadingSubmissionId] = useState<string | null>(null);
  const [autoOpenedTaskId, setAutoOpenedTaskId] = useState<string | null>(null);
  const createDialogRef = useRef<HTMLDivElement>(null);
  const reviewDialogRef = useRef<HTMLElement>(null);
  const dialogTriggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const activeDialog = reviewingTask ? reviewDialogRef.current : showCreateModal ? createDialogRef.current : null;
    if (!activeDialog) return;

    dialogTriggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusFirst = () => activeDialog.querySelector<HTMLElement>(selector)?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        if (reviewingTask) setReviewingTask(null);
        else setShowCreateModal(false);
        return;
      }
      if (event.key !== "Tab") return;
      const focusables = Array.from(activeDialog.querySelectorAll<HTMLElement>(selector)).filter((element) => !element.hasAttribute("disabled"));
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(focusFirst);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
      window.requestAnimationFrame(() => dialogTriggerRef.current?.focus());
    };
  }, [reviewingTask, showCreateModal]);

  const loadTasks = useCallback(async () => {
    setTasksLoading(true);
    setTasksError(false);
    try {
      const response = await getSchoolTasks();
      const items = response.data?.tasks;
      setTasks(Array.isArray(items) ? items.map(normalizeTask) : []);
    } catch {
      setTasksError(true);
    } finally {
      setTasksLoading(false);
    }
  }, []);

  useEffect(() => {
    let isCurrent = true;
    getTeacherAssignedPairs()
      .then((response) => {
        if (!isCurrent) return;
        const items = response.data?.pairs;
        const pairs = Array.isArray(items) ? items : [];
        setAssignedPairs(pairs);
        setSelectedAssignmentKey(pairs[0] ? pairKey(pairs[0]) : "");
      })
      .catch(() => {
        if (isCurrent) setAssignmentsError(true);
      })
      .finally(() => {
        if (isCurrent) setAssignmentsLoading(false);
      });
    void loadTasks();
    return () => { isCurrent = false; };
  }, [loadTasks]);

  const selectedAssignment = assignedPairs.find((pair) => pairKey(pair) === selectedAssignmentKey) || assignedPairs[0];
  const teacherSubject = selectedAssignment?.subject_name || t("teacherAssignments.assignedSubject");
  const locale = language === "am" ? "am-ET" : language === "om" ? "om-ET" : "en-ET";
  const formatDueDate = (value: string) => {
    if (!value) return t("teacherAssignments.noDueDate");
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(locale, { dateStyle: "medium" });
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.title.trim() || !selectedAssignment) {
      showToast({ title: t("teacherAssignments.detailsRequired"), message: t("teacherAssignments.detailsRequiredMessage"), type: "error" });
      return;
    }

    setCreating(true);
    try {
      const res = await createSchoolTask({
        title: taskForm.title,
        task_type: taskForm.task_type,
        subject_id: selectedAssignment.subject_id,
        section_ids: [String(selectedAssignment.section_id)],
        due_date: taskForm.due_date,
        max_marks: Number(taskForm.max_marks),
        late_policy: taskForm.late_policy,
        instructions: taskForm.instructions
      });
      if (res.data?.success === false) throw new Error(t("teacherAssignments.createError"));
      showToast({ title: t("teacherAssignments.created"), message: t("teacherAssignments.assignedTo", { className: selectedAssignment.section_name || selectedAssignment.section_id }), type: "success" });
      setShowCreateModal(false);
      setTaskForm({ title: "", task_type: "Homework", due_date: defaultDueDate(), max_marks: 20, late_policy: "accept_late", instructions: "" });
      await loadTasks();
    } catch (err: any) {
      showToast({
        title: t("teacherAssignments.createFailed"),
        message: getApiErrorMessage(err) || t("teacherAssignments.createError"),
        type: "error"
      });
    } finally {
      setCreating(false);
    }
  };

  const filteredTasks = filterType === "all" ? tasks : tasks.filter((t) => t.type === filterType || t.status === filterType);

  const openReview = async (task: TeacherTask) => {
    setReviewingTask(task);
    setSubmissions([]);
    setSubmissionError("");
    setSubmissionsLoading(true);
    try {
      const response = await getSchoolTaskSubmissions(task.id);
      const rows = Array.isArray(response.data?.submissions) ? response.data.submissions : [];
      setSubmissions(rows);
      setGradeDrafts((current) => {
        const next = { ...current };
        rows.forEach((row) => {
          next[row.id] = { mark: row.mark == null ? "" : String(row.mark), feedback: row.feedback || "" };
        });
        return next;
      });
    } catch (error: any) {
      setSubmissionError(getApiErrorMessage(error) || t("teacherAssignments.submissionsError"));
    } finally {
      setSubmissionsLoading(false);
    }
  };

  useEffect(() => {
    if (!requestedTaskId || tasksLoading || autoOpenedTaskId === requestedTaskId) return;
    const requestedTask = tasks.find((task) => task.id === requestedTaskId);
    if (!requestedTask) return;
    setAutoOpenedTaskId(requestedTaskId);
    void openReview(requestedTask);
  }, [autoOpenedTaskId, requestedTaskId, tasks, tasksLoading]);

  const saveGrade = async (submission: SchoolTaskSubmission) => {
    if (!reviewingTask) return;
    const draft = gradeDrafts[submission.id];
    const mark = Number(draft?.mark);
    if (!Number.isInteger(mark) || mark < 0 || mark > reviewingTask.maxMarks) {
      showToast({ title: t("teacherAssignments.checkMark"), message: t("teacherAssignments.markRange", { max: reviewingTask.maxMarks }), type: "error" });
      return;
    }
    setGradingId(submission.id);
    try {
      await gradeSchoolTaskSubmission(reviewingTask.id, submission.id, { mark, feedback: draft.feedback });
      await openReview(reviewingTask);
      await loadTasks();
      showToast({ title: t("teacherAssignments.workGraded"), message: t("teacherAssignments.gradeSaved", { mark, max: reviewingTask.maxMarks, student: submission.student_name }), type: "success" });
    } catch (error: any) {
      showToast({ title: t("teacherAssignments.gradeSaveError"), message: getApiErrorMessage(error) || t("teacherAssignments.tryAgain"), type: "error" });
    } finally {
      setGradingId(null);
    }
  };

  const downloadSubmissionFile = async (submission: SchoolTaskSubmission) => {
    if (!reviewingTask) return;
    setDownloadingSubmissionId(submission.id);
    try {
      await downloadSchoolTaskSubmissionFile(reviewingTask.id, submission.id, submission.file_name);
    } catch (error: any) {
      showToast({ title: t("teacherAssignments.downloadError"), message: getApiErrorMessage(error) || t("teacherAssignments.tryAgain"), type: "error" });
    } finally {
      setDownloadingSubmissionId(null);
    }
  };

  const activeCount = tasks.filter((t) => t.status === "Active").length;
  const archivedCount = tasks.filter((t) => t.status === "Archived").length;
  const completionTasks = tasks.filter((task) => task.totalCount > 0);
  const avgCompletion = completionTasks.length > 0
    ? Math.round((completionTasks.reduce((acc, task) => acc + task.submittedCount / task.totalCount, 0) / completionTasks.length) * 100)
    : null;

  return (
    <PortalPage className="animate-fade-in text-start">

      <PageHeader
        eyebrow={t("teacherAssignments.eyebrow")}
        title={t("teacherAssignments.title")}
        description={t("teacherAssignments.description")}
        badge={selectedAssignment ? { text: teacherSubject, variant: "brand" } : undefined}
        primaryAction={{
          label: t("teacherAssignments.createAssignment"),
          onClick: () => setShowCreateModal(true),
          icon: Plus,
          disabled: assignmentsLoading || assignmentsError || assignedPairs.length === 0,
        }}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#261E1A] p-4 rounded-2xl border border-[#E7E0D6] dark:border-white/10 shadow-xs hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 space-y-1">
          <span className="text-xs text-stone-500 dark:text-[#A89C90] font-medium">{t("teacherAssignments.stats.total")}</span>
          <div className="text-2xl font-bold font-mono text-[#261E1A] dark:text-[#FDFBF7]">{tasksLoading || tasksError ? "—" : tasks.length}</div>
        </div>

        <div className="bg-white dark:bg-[#261E1A] p-4 rounded-2xl border border-rose-100 bg-rose-50/20 shadow-xs hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 space-y-1">
          <span className="text-xs text-[#881337] font-medium">{t("teacherAssignments.stats.active")}</span>
          <div className="text-2xl font-bold font-mono text-[#881337]">{tasksLoading || tasksError ? "—" : activeCount}</div>
        </div>

        <div className="bg-white dark:bg-[#261E1A] p-4 rounded-2xl border border-emerald-100 bg-emerald-50/20 shadow-xs hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 space-y-1">
          <span className="text-xs text-emerald-700 font-medium">{t("teacherAssignments.stats.archived")}</span>
          <div className="text-2xl font-bold font-mono text-emerald-700">{tasksLoading || tasksError ? "—" : archivedCount}</div>
        </div>

        <div className="bg-white dark:bg-[#261E1A] p-4 rounded-2xl border border-[#E7E0D6] dark:border-white/10 shadow-xs hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 space-y-1">
          <span className="text-xs text-stone-500 dark:text-[#A89C90] font-medium">{t("teacherAssignments.stats.completion")}</span>
          <div className="text-2xl font-bold font-mono text-stone-800 dark:text-[#FDFBF7]">{tasksLoading || tasksError || avgCompletion === null ? "—" : `${avgCompletion}%`}</div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#261E1A] border border-[#E7E0D6] dark:border-white/10 rounded-2xl p-3 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div role="group" aria-label={t("teacherAssignments.filterLabel")} className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            type="button"
            aria-pressed={filterType === "all"}
            onClick={() => setFilterType("all")}
            className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
              filterType === "all" ? "bg-[#881337] text-white shadow-2xs" : "text-stone-600 dark:text-[#E7E0D6] hover:bg-stone-50 dark:hover:bg-white/5"
            }`}
          >
            {t("teacherAssignments.filters.all")}
          </button>
          <button
            type="button"
            aria-pressed={filterType === "Active"}
            onClick={() => setFilterType("Active")}
            className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
              filterType === "Active" ? "bg-[#881337] text-white shadow-2xs" : "text-stone-600 dark:text-[#E7E0D6] hover:bg-stone-50 dark:hover:bg-white/5"
            }`}
          >
            {t("teacherAssignments.status.active")}
          </button>
          <button
            type="button"
            aria-pressed={filterType === "Archived"}
            onClick={() => setFilterType("Archived")}
            className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
              filterType === "Archived" ? "bg-[#881337] text-white shadow-2xs" : "text-stone-600 dark:text-[#E7E0D6] hover:bg-stone-50 dark:hover:bg-white/5"
            }`}
          >
            {t("teacherAssignments.status.archived")}
          </button>
        </div>

        <span className="text-[11px] text-stone-500 dark:text-[#A89C90]">{t("teacherAssignments.statusLabel")}</span>
      </div>

      <div className="bg-white dark:bg-[#261E1A] border border-[#E7E0D6] dark:border-white/10 rounded-[8px] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <caption className="sr-only">{t("teacherAssignments.tableCaption")}</caption>
            <thead>
              <tr className="bg-[#FAF8F5] dark:bg-[#1C1512] border-b border-[#E7E0D6] dark:border-white/10 text-stone-500 dark:text-[#A89C90] font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">{t("teacherAssignments.table.assignment")}</th>
                <th className="py-3 px-4">{t("teacherAssignments.table.type")}</th>
                <th className="py-3 px-4">{t("teacherAssignments.table.classes")}</th>
                <th className="py-3 px-4">{t("teacherAssignments.table.dueDate")}</th>
                <th className="py-3 px-4">{t("teacherAssignments.table.submissions")}</th>
                <th className="py-3 px-4">{t("teacherAssignments.table.points")}</th>
                <th className="py-3 px-4 text-right">{t("teacherAssignments.table.review")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E0D6] text-[#261E1A] dark:text-[#FDFBF7]">
              {tasksLoading ? (
                <tr><td colSpan={7}><PortalLoading message={t("teacherAssignments.loading")} className="rounded-none border-0 shadow-none" /></td></tr>
              ) : tasksError ? (
                <tr><td colSpan={7}><PortalError message={t("teacherAssignments.loadError")} actionLabel={t("teacherAssignments.tryAgain")} onAction={() => void loadTasks()} className="m-4" /></td></tr>
              ) : assignmentsError ? (
                <tr><td colSpan={7}><PortalError message={t("teacherAssignments.classesLoadError")} className="m-4" /></td></tr>
              ) : filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-500 dark:text-[#A89C90]">
                    {filterType === "all" ? t("teacherAssignments.emptyTitle") : t("teacherAssignments.emptyFiltered", { status: t(`teacherAssignments.status.${filterType.toLowerCase()}`) })}
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => {
                const completionPercent = task.totalCount > 0 ? Math.max(0, Math.min(100, Math.round((task.submittedCount / task.totalCount) * 100))) : null;
                return (
                  <tr key={task.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-4 font-semibold text-[#261E1A] dark:text-[#FDFBF7]">
                      <div className="space-y-0.5">
                        <p>{task.title || t("teacherAssignments.untitledAssignment")}</p>
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${
                          task.status === "Active" ? "bg-[#FFF1F2] dark:bg-[#4C0519]/40 text-[#881337] dark:text-[#FBBF24]" : "bg-emerald-50 text-emerald-700"
                        }`}>
                          {TASK_STATUS_KEYS[task.status] ? t(`teacherAssignments.status.${TASK_STATUS_KEYS[task.status]}`) : task.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-stone-100 dark:bg-[#201815] text-stone-700 dark:text-[#E7E0D6]">
                        {TASK_TYPE_KEYS[task.type] ? t(`teacherAssignments.types.${TASK_TYPE_KEYS[task.type]}`) : task.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-600 dark:text-[#E7E0D6] font-medium">
                      {task.sections.length ? task.sections.join(", ") : "—"}
                    </td>
                    <td className="py-3 px-4 text-stone-600 dark:text-[#E7E0D6]">
                      <div className="flex items-center gap-1 font-mono text-[11px]">
                        <Clock className="w-3 h-3 text-stone-400 dark:text-[#A89C90]" />
                        <span>{formatDueDate(task.dueDate)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="font-mono text-stone-700 dark:text-[#E7E0D6]">{completionPercent === null ? t("teacherAssignments.noSubmissions") : `${task.submittedCount}/${task.totalCount}`}</span>
                          {completionPercent !== null && <span className="font-semibold text-stone-500 dark:text-[#A89C90]">{completionPercent}%</span>}
                        </div>
                        <div role="progressbar" aria-label={t("teacherAssignments.submissionProgress", { assignment: task.title || t("teacherAssignments.untitledAssignment") })} aria-valuenow={completionPercent ?? 0} aria-valuemin={0} aria-valuemax={100} className="w-28 h-1.5 bg-stone-100 dark:bg-[#201815] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${completionPercent !== null && completionPercent >= 80 ? "bg-emerald-500" : "bg-[#881337]"}`}
                            style={{ width: `${completionPercent ?? 0}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-stone-800 dark:text-[#FDFBF7]">
                      {task.maxMarks > 0 ? t("teacherAssignments.pointsValue", { count: task.maxMarks }) : "—"}
                    </td>
                    <td className="py-3 px-4 text-right"><button type="button" onClick={() => void openReview(task)} className="min-h-9 rounded-lg border border-stone-300 px-3 text-xs font-semibold text-stone-700 hover:border-[#881337] hover:text-[#881337] dark:border-white/15 dark:text-[#E7E0D6] dark:hover:border-[#FBBF24]">{t("teacherAssignments.table.review")}</button></td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-xs p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowCreateModal(false); }}>
          <div ref={createDialogRef} role="dialog" aria-modal="true" aria-labelledby="create-task-title" className="bg-white dark:bg-[#261E1A] rounded-2xl max-w-lg w-full p-6 space-y-5 border border-[#E7E0D6] dark:border-white/10 shadow-xl animate-fade-in text-start">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-white/10 pb-3">
              <div>
                <h2 id="create-task-title" className="text-base font-bold text-[#261E1A] dark:text-[#FDFBF7]">{t("teacherAssignments.createAssignment")}</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                aria-label={t("teacherAssignments.closeCreateForm")}
                className="text-stone-400 dark:text-[#A89C90] hover:text-stone-600 text-sm font-semibold p-1 cursor-pointer"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label htmlFor="task-assignment" className="block font-semibold text-stone-800 dark:text-[#FDFBF7]">{t("teacherAssignments.classAndSubject")}</label>
                <select
                  id="task-assignment"
                  value={selectedAssignmentKey}
                  onChange={(event) => setSelectedAssignmentKey(event.target.value)}
                  disabled={assignmentsLoading || assignmentsError || assignedPairs.length === 0}
                  required
                  className="min-h-11 w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-800 focus:border-[#881337] focus:outline-none focus:ring-2 focus:ring-[#881337]/20 disabled:opacity-60 dark:border-white/10 dark:bg-[#261E1A] dark:text-[#FDFBF7]"
                >
                  <option value="">{assignmentsLoading ? t("teacherAssignments.loadingClasses") : t("teacherAssignments.chooseClass")}</option>
                  {assignedPairs.map((pair) => (
                    <option key={pairKey(pair)} value={pairKey(pair)}>
                      {[pair.section_name || pair.grade || t("teacherAssignments.classWithId", { id: pair.section_id }), pair.subject_name].filter(Boolean).join(" · ")}
                    </option>
                  ))}
                </select>
                {assignmentsError && <p role="alert" className="text-xs text-rose-700">{t("teacherAssignments.classesLoadError")}</p>}
                {!assignmentsLoading && !assignmentsError && assignedPairs.length === 0 && <p className="text-xs text-stone-500 dark:text-[#A89C90]">{t("teacherAssignments.noAssignedClasses")}</p>}
              </div>

              <div className="space-y-1">
                <label htmlFor="task-title" className="font-semibold text-stone-800 dark:text-[#FDFBF7] block">{t("teacherAssignments.assignmentTitle")}</label>
                <input
                  id="task-title"
                  type="text"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  placeholder={t("teacherAssignments.titlePlaceholder")}
                  className="w-full px-3 py-2 border border-stone-200 dark:border-white/10 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#881337]/20 focus:border-[#881337]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="task-format" className="font-semibold text-stone-800 dark:text-[#FDFBF7] block">{t("teacherAssignments.assignmentType")}</label>
                <select
                  id="task-format"
                  value={taskForm.task_type}
                  onChange={(e) => setTaskForm({ ...taskForm, task_type: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 dark:border-white/10 rounded-lg text-xs bg-white dark:bg-[#261E1A] font-medium focus:outline-none focus:ring-2 focus:ring-[#881337]/20 focus:border-[#881337]"
                >
                  {ALLOWED_TASK_TYPES.map((type) => (
                    <option key={type} value={type}>{t(`teacherAssignments.types.${TASK_TYPE_KEYS[type]}`)}</option>
                  ))}
                </select>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="space-y-1">
                  <label htmlFor="task-due-date" className="font-semibold text-stone-800 dark:text-[#FDFBF7] block">{t("teacherAssignments.dueDateLabel")}</label>
                  <input
                    id="task-due-date"
                    type="date"
                    value={taskForm.due_date}
                    onChange={(e) => setTaskForm({ ...taskForm, due_date: e.target.value })}
                    min={formatDateInput(new Date())}
                    className="w-full px-3 py-2 border border-stone-200 dark:border-white/10 rounded-lg text-xs bg-white dark:bg-[#261E1A] focus:outline-none focus:ring-2 focus:ring-[#881337]/20 focus:border-[#881337]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="task-max-marks" className="font-semibold text-stone-800 dark:text-[#FDFBF7] block">{t("teacherAssignments.maximumMarks")}</label>
                  <input
                    id="task-max-marks"
                    type="number"
                    min={5}
                    max={100}
                    value={taskForm.max_marks}
                    onChange={(e) => setTaskForm({ ...taskForm, max_marks: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-200 dark:border-white/10 rounded-lg text-xs bg-white dark:bg-[#261E1A] font-mono focus:outline-none focus:ring-2 focus:ring-[#881337]/20 focus:border-[#881337]"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="task-late-policy" className="font-semibold text-stone-800 dark:text-[#FDFBF7] block">{t("teacherAssignments.lateWork")}</label>
                  <select
                    id="task-late-policy"
                    value={taskForm.late_policy}
                    onChange={(event) => setTaskForm({ ...taskForm, late_policy: event.target.value as "accept_late" | "no_late" })}
                    className="w-full px-3 py-2 border border-stone-200 dark:border-white/10 rounded-lg text-xs bg-white dark:bg-[#261E1A] focus:outline-none focus:ring-2 focus:ring-[#881337]/20 focus:border-[#881337]"
                  >
                    <option value="accept_late">{t("teacherAssignments.latePolicy.accept")}</option>
                    <option value="no_late">{t("teacherAssignments.latePolicy.close")}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="task-instructions" className="font-semibold text-stone-800 dark:text-[#FDFBF7] block">{t("teacherAssignments.instructions")}</label>
                <textarea
                  id="task-instructions"
                  rows={3}
                  value={taskForm.instructions}
                  onChange={(e) => setTaskForm({ ...taskForm, instructions: e.target.value })}
                  placeholder={t("teacherAssignments.instructionsPlaceholder")}
                  className="w-full px-3 py-2 border border-stone-200 dark:border-white/10 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#881337]/20 focus:border-[#881337]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-100 dark:border-white/10">
                <button
                  type="button"
                  aria-label={t("teacherAssignments.closeCreateForm")}
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-stone-600 dark:text-[#E7E0D6] hover:bg-stone-100 dark:hover:bg-white/10 cursor-pointer"
                >
                  {t("teacherAssignments.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={creating || assignmentsLoading || assignmentsError || !selectedAssignment}
                  className="px-5 py-2 rounded-xl bg-[#881337] hover:bg-[#70102B] active:scale-[0.98] text-white text-xs font-semibold cursor-pointer shadow-xs disabled:opacity-50 transition-all"
                >
                  {creating ? t("teacherAssignments.creating") : t("teacherAssignments.createAssignment")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {reviewingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/50 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setReviewingTask(null); }}>
          <section ref={reviewDialogRef} role="dialog" aria-modal="true" aria-labelledby="task-review-title" className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[#E7E0D6] bg-white p-5 shadow-xl dark:border-white/10 dark:bg-[#261E1A] sm:p-6">
            <header className="flex items-start justify-between gap-4 border-b border-stone-100 pb-4 dark:border-white/10"><div><p className="text-xs font-semibold uppercase tracking-wide text-[#881337] dark:text-[#FBBF24]">{t("teacherAssignments.studentWork")}</p><h2 id="task-review-title" className="mt-1 text-lg font-semibold text-stone-900 dark:text-[#FDFBF7]">{reviewingTask.title || t("teacherAssignments.untitledAssignment")}</h2><p className="mt-1 text-xs text-stone-500 dark:text-[#A89C90]">{t("teacherAssignments.lateWorkSummary", { points: reviewingTask.maxMarks, policy: reviewingTask.latePolicy === "accept_late" ? t("teacherAssignments.latePolicy.accepted") : t("teacherAssignments.latePolicy.closed") })}</p></div><button type="button" aria-label={t("teacherAssignments.closeReview")} onClick={() => setReviewingTask(null)} className="min-h-9 rounded-lg px-3 text-sm font-semibold text-stone-600 hover:bg-stone-100 dark:text-[#E7E0D6] dark:hover:bg-white/5">{t("teacherAssignments.close")}</button></header>
            {submissionsLoading ? <PortalLoading message={t("teacherAssignments.loadingSubmissions")} className="mt-4" />
              : submissionError ? <PortalError message={submissionError} className="mt-4" />
                : submissions.length === 0 ? <p className="py-10 text-center text-sm text-stone-500 dark:text-[#A89C90]">{t("teacherAssignments.noStudentSubmissions")}</p>
                  : <div className="mt-4 space-y-4">{submissions.map((submission) => {
                    const draft = gradeDrafts[submission.id] || { mark: "", feedback: "" };
                    const statusLabel = submission.status === "Graded" ? t("teacherAssignments.status.graded") : t("teacherAssignments.status.submitted");
                    const submittedAt = submission.submitted_at ? new Date(submission.submitted_at).toLocaleString(locale, { dateStyle: "medium", timeStyle: "short" }) : "";
                    return <article key={submission.id} className="rounded-xl border border-stone-200 p-4 dark:border-white/10">
                      <div className="flex flex-wrap items-start justify-between gap-2"><div><h3 className="text-sm font-semibold text-stone-900 dark:text-[#FDFBF7]">{submission.student_name}</h3><p className="mt-0.5 text-xs text-stone-500 dark:text-[#A89C90]">{[submission.classroom, submission.submitted_late ? t("teacherAssignments.submittedLate") : statusLabel, submittedAt].filter(Boolean).join(" · ")}</p></div>{submission.mark !== null && <span className="rounded-lg bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200">{submission.mark} / {reviewingTask.maxMarks}</span>}</div>
                      {submission.submission_text && <p className="mt-3 whitespace-pre-wrap rounded-lg bg-[#FAF8F5] p-3 text-sm leading-6 text-stone-700 dark:bg-[#1C1512] dark:text-[#E7E0D6]">{submission.submission_text}</p>}
                      {submission.attachment_url && <a href={submission.attachment_url} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-sm font-semibold text-[#881337] hover:underline dark:text-[#FBBF24]">{t("teacherAssignments.openWorkLink")} ↗</a>}
                      {submission.has_file && <button type="button" onClick={() => void downloadSubmissionFile(submission)} disabled={downloadingSubmissionId === submission.id} className="mt-3 inline-flex min-h-9 items-center gap-2 rounded-lg border border-stone-300 px-3 text-xs font-semibold text-[#881337] hover:bg-stone-50 disabled:opacity-60 dark:border-white/15 dark:text-[#FBBF24]"><Download className="h-3.5 w-3.5" aria-hidden="true" />{downloadingSubmissionId === submission.id ? t("teacherAssignments.downloading") : t("teacherAssignments.downloadFile", { fileName: submission.file_name, size: Math.max(1, Math.round(submission.file_size / 1024)) })}</button>}
                      {submission.status === "Submitted" || submission.status === "Graded" ? <form className="mt-4 grid gap-3 border-t border-stone-100 pt-4 dark:border-white/10 sm:grid-cols-[9rem_1fr_auto]" onSubmit={(event) => { event.preventDefault(); void saveGrade(submission); }}>
                        <label className="space-y-1 text-xs font-semibold text-stone-700 dark:text-[#E7E0D6]">{t("teacherAssignments.markLabel")}<input type="number" min={0} max={reviewingTask.maxMarks} step={1} required value={draft.mark} onChange={(event) => setGradeDrafts((current) => ({ ...current, [submission.id]: { ...draft, mark: event.target.value } }))} className="mt-1 min-h-10 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]" /></label>
                        <label className="space-y-1 text-xs font-semibold text-stone-700 dark:text-[#E7E0D6]">{t("teacherAssignments.feedbackLabel")}<textarea rows={2} value={draft.feedback} onChange={(event) => setGradeDrafts((current) => ({ ...current, [submission.id]: { ...draft, feedback: event.target.value } }))} className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]" placeholder={t("teacherAssignments.feedbackPlaceholder")} /></label>
                        <button type="submit" disabled={gradingId === submission.id} className="self-end inline-flex min-h-10 items-center justify-center rounded-lg bg-[#881337] px-4 text-sm font-semibold text-white disabled:opacity-60">{gradingId === submission.id ? t("teacherAssignments.saving") : submission.status === "Graded" ? t("teacherAssignments.updateGrade") : t("teacherAssignments.saveGrade")}</button>
                      </form> : <p className="mt-3 text-xs text-stone-500 dark:text-[#A89C90]">{t("teacherAssignments.notSubmittedYet")}</p>}
                      {submission.feedback && <p className="mt-2 text-xs text-stone-600 dark:text-[#A89C90]">{t("teacherAssignments.currentFeedback", { feedback: submission.feedback })}</p>}
                    </article>;
                  })}</div>}
          </section>
        </div>
      )}
    </PortalPage>
  );
}
