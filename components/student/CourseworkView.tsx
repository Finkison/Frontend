import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AlertCircle, BookOpen, CheckCircle2, Download, ExternalLink, Loader2, RefreshCw, Save, Send, Trash2, Upload } from "lucide-react";
import { getApiErrorMessage } from "../../services/api";
import { downloadSchoolTaskSubmissionFile, getSchoolTasks, removeSchoolTaskDraftFile, saveSchoolTaskDraft, submitSchoolTask, uploadSchoolTaskDraftFile, type StudentSchoolTask } from "../../services/schoolService";
import { useI18n } from "../../i18n";
import useAuthStore from "../../store/authStore";
import PageHeader from "../shared/PageHeader";
import PortalPage from "../shared/PortalPage";

type SubmissionDraft = { text: string; attachmentUrl: string };
const draftSignature = (draft: SubmissionDraft) => JSON.stringify({ text: draft.text.trim(), attachmentUrl: draft.attachmentUrl.trim() });

function formatDate(value: string, language: string): string {
  const date = new Date(value);
  const locale = language === "am" ? "am-ET" : language === "om" ? "om-ET" : "en-ET";
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString(locale, { dateStyle: "medium", timeStyle: "short" });
}

const taskTypeKeys: Record<string, string> = {
  Homework: "homework",
  Quiz: "quiz",
  Reading: "reading",
  Project: "project",
  "Practice set": "practiceSet",
  "Lab report": "labReport",
};

const statusKeys: Record<string, string> = {
  Assigned: "assigned",
  Overdue: "overdue",
  Submitted: "submitted",
  Graded: "graded",
};

export default function CourseworkView(): React.ReactElement {
  const { t, language } = useI18n();
  const user = useAuthStore((state) => state.user);
  const [searchParams] = useSearchParams();
  const isSchoolEnrolled = Boolean(user?.schoolId || user?.isSchoolEnrolled);
  const requestedTaskId = searchParams.get("task") || "";
  const [tasks, setTasks] = useState<StudentSchoolTask[]>([]);
  const [statusFilter, setStatusFilter] = useState<"all" | "to_do" | "submitted" | "graded">("all");
  const [drafts, setDrafts] = useState<Record<string, SubmissionDraft>>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [savingDrafts, setSavingDrafts] = useState<Record<string, boolean>>({});
  const [uploadingFileId, setUploadingFileId] = useState<string | null>(null);
  const [removingFileId, setRemovingFileId] = useState<string | null>(null);
  const [fileError, setFileError] = useState<Record<string, string>>({});
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [draftSaveError, setDraftSaveError] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<Record<string, string>>({});
  const inFlightDrafts = useRef(new Set<string>());
  const pendingDrafts = useRef(new Map<string, SubmissionDraft>());
  const savedDraftSignatures = useRef<Record<string, string>>({});

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const response = await getSchoolTasks();
      const items = Array.isArray(response.data?.tasks) ? response.data.tasks : [];
      items.forEach((task: StudentSchoolTask) => {
        savedDraftSignatures.current[task.id] = draftSignature({
          text: task.submission_text || "",
          attachmentUrl: task.submission_attachment_url || "",
        });
      });
      setTasks(items);
      setDrafts((current) => {
        const next = { ...current };
        items.forEach((task: StudentSchoolTask) => {
          if (!next[task.id]) next[task.id] = {
            text: task.submission_text || "",
            attachmentUrl: task.submission_attachment_url || "",
          };
        });
        return next;
      });
    } catch (error) {
      setLoadError(getApiErrorMessage(error) || t("classroomWorkflows.coursework.loadError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { void loadTasks(); }, [loadTasks]);

  useEffect(() => {
    if (!requestedTaskId || loading || !tasks.some((task) => task.id === requestedTaskId)) return;
    const frame = window.requestAnimationFrame(() => {
      const target = document.getElementById(`classwork-${requestedTaskId}`);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
      target?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [loading, requestedTaskId, tasks]);

  const persistDraft = useCallback(async (task: StudentSchoolTask, initialDraft: SubmissionDraft) => {
    const taskId = task.id;
    if (inFlightDrafts.current.has(taskId)) {
      pendingDrafts.current.set(taskId, initialDraft);
      return;
    }

    inFlightDrafts.current.add(taskId);
    let nextDraft: SubmissionDraft | null = initialDraft;
    try {
      while (nextDraft) {
        const signature = draftSignature(nextDraft);
        if (signature === savedDraftSignatures.current[taskId]) {
          nextDraft = pendingDrafts.current.get(taskId) || null;
          pendingDrafts.current.delete(taskId);
          continue;
        }

        setSavingDrafts((current) => ({ ...current, [taskId]: true }));
        setDraftSaveError((current) => ({ ...current, [taskId]: "" }));
        const response = await saveSchoolTaskDraft(taskId, {
          submission_text: nextDraft.text.trim(),
          attachment_url: nextDraft.attachmentUrl.trim(),
        });
        if (response.data?.success === false) throw new Error(response.data?.error || t("classroomWorkflows.coursework.draftSaveError"));

        const savedText = nextDraft.text.trim();
        const savedAttachment = nextDraft.attachmentUrl.trim();
        savedDraftSignatures.current[taskId] = signature;
        const savedAt = String(response.data?.draft_saved_at || new Date().toISOString());
        setTasks((current) => current.map((item) => item.id === taskId
          ? { ...item, submission_text: savedText, submission_attachment_url: savedAttachment, draft_saved_at: savedAt }
          : item));

        const queuedDraft = pendingDrafts.current.get(taskId);
        pendingDrafts.current.delete(taskId);
        nextDraft = queuedDraft && draftSignature(queuedDraft) !== savedDraftSignatures.current[taskId] ? queuedDraft : null;
      }
    } catch (error) {
      setDraftSaveError((current) => ({ ...current, [taskId]: getApiErrorMessage(error) || t("classroomWorkflows.coursework.draftSaveError") }));
    } finally {
      inFlightDrafts.current.delete(taskId);
      setSavingDrafts((current) => ({ ...current, [taskId]: false }));
    }
  }, [t]);

  useEffect(() => {
    const timers = tasks.flatMap((task) => {
      const isSubmitted = task.status === "Submitted" || task.status === "Graded";
      const lateSubmissionBlocked = task.status === "Overdue" && task.late_policy === "no_late";
      if (isSubmitted || lateSubmissionBlocked || submittingId === task.id) return [];
      const draft = drafts[task.id] || { text: "", attachmentUrl: "" };
      if (draftSignature(draft) === savedDraftSignatures.current[task.id]) return [];
      const timer = window.setTimeout(() => { void persistDraft(task, draft); }, 800);
      return [timer];
    });
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [tasks, drafts, persistDraft, submittingId]);

  const handleSaveDraft = (task: StudentSchoolTask) => {
    const draft = drafts[task.id] || { text: "", attachmentUrl: "" };
    if (!draft.text.trim() && !draft.attachmentUrl.trim() && !task.draft_saved_at) return;
    void persistDraft(task, draft);
  };

  const handleSubmit = async (task: StudentSchoolTask) => {
    const draft = drafts[task.id] || { text: "", attachmentUrl: "" };
    if (!draft.text.trim() && !draft.attachmentUrl.trim() && !task.has_submission_file) {
      setSubmitError((current) => ({ ...current, [task.id]: t("classroomWorkflows.coursework.submitRequired") }));
      return;
    }
    setSubmittingId(task.id);
    setSubmitError((current) => ({ ...current, [task.id]: "" }));
    try {
      await submitSchoolTask(task.id, {
        submission_text: draft.text.trim(),
        attachment_url: draft.attachmentUrl.trim(),
      });
      await loadTasks();
    } catch (error) {
      setSubmitError((current) => ({ ...current, [task.id]: getApiErrorMessage(error) || t("classroomWorkflows.coursework.submitError") }));
    } finally {
      setSubmittingId(null);
    }
  };

  const handleUploadFile = async (task: StudentSchoolTask, file?: File) => {
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      setFileError((current) => ({ ...current, [task.id]: t("classroomWorkflows.coursework.fileTooLarge") }));
      return;
    }
    setUploadingFileId(task.id);
    setFileError((current) => ({ ...current, [task.id]: "" }));
    try {
      const response = await uploadSchoolTaskDraftFile(task.id, file);
      if (response.data?.success === false) throw new Error(response.data?.error || t("classroomWorkflows.coursework.fileAttachError"));
      const fileDetails = response.data?.file || {};
      const fileName = String(fileDetails.name || file.name);
      setTasks((current) => current.map((item) => item.id === task.id
        ? {
            ...item,
            has_submission_file: true,
            submission_file_name: fileName,
            submission_file_size: Number(fileDetails.size) || file.size,
            draft_saved_at: String(response.data?.draft_saved_at || new Date().toISOString()),
          }
        : item));
    } catch (error) {
      setFileError((current) => ({ ...current, [task.id]: getApiErrorMessage(error) || t("classroomWorkflows.coursework.fileAttachError") }));
    } finally {
      setUploadingFileId(null);
    }
  };

  const handleRemoveFile = async (task: StudentSchoolTask) => {
    setRemovingFileId(task.id);
    setFileError((current) => ({ ...current, [task.id]: "" }));
    try {
      const response = await removeSchoolTaskDraftFile(task.id);
      if (response.data?.success === false) throw new Error(response.data?.error || t("classroomWorkflows.coursework.fileRemoveError"));
      setTasks((current) => current.map((item) => item.id === task.id
        ? { ...item, has_submission_file: false, submission_file_name: "", submission_file_size: 0 }
        : item));
    } catch (error) {
      setFileError((current) => ({ ...current, [task.id]: getApiErrorMessage(error) || t("classroomWorkflows.coursework.fileRemoveError") }));
    } finally {
      setRemovingFileId(null);
    }
  };

  const handleDownloadFile = async (task: StudentSchoolTask) => {
    if (!task.submission_id) return;
    try {
      await downloadSchoolTaskSubmissionFile(task.id, task.submission_id, task.submission_file_name);
    } catch (error) {
      setFileError((current) => ({ ...current, [task.id]: getApiErrorMessage(error) || t("classroomWorkflows.coursework.fileDownloadError") }));
    }
  };

  const updateDraft = (taskId: string, field: keyof SubmissionDraft, value: string) => {
    setDrafts((current) => ({
      ...current,
      [taskId]: { ...(current[taskId] || { text: "", attachmentUrl: "" }), [field]: value },
    }));
  };

  const pendingCount = tasks.filter((task) => task.status === "Assigned" || task.status === "Overdue").length;
  const submittedCount = tasks.filter((task) => task.status === "Submitted").length;
  const gradedCount = tasks.filter((task) => task.status === "Graded").length;
  const visibleTasks = tasks.filter((task) => {
    if (statusFilter === "to_do") return task.status === "Assigned" || task.status === "Overdue";
    if (statusFilter === "submitted") return task.status === "Submitted";
    if (statusFilter === "graded") return task.status === "Graded";
    return true;
  });

  return (
    <PortalPage className="max-w-5xl space-y-6">
      <PageHeader
        eyebrow={t("classroomWorkflows.coursework.eyebrow")}
        title={t("classroomWorkflows.coursework.title")}
        description={t("classroomWorkflows.coursework.description")}
        secondaryActions={[{ label: t("classroomWorkflows.coursework.refresh"), onClick: () => void loadTasks(), icon: RefreshCw, loading }]}
      />

      {!loading && !loadError && tasks.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-stone-200 bg-white p-2 dark:border-white/10 dark:bg-[#261E1A]" role="group" aria-label={t("classroomWorkflows.coursework.filterLabel")}>
          {([
            ["all", t("classroomWorkflows.coursework.filters.all"), tasks.length],
            ["to_do", t("classroomWorkflows.coursework.filters.toDo"), pendingCount],
            ["submitted", t("classroomWorkflows.coursework.filters.submitted"), submittedCount],
            ["graded", t("classroomWorkflows.coursework.filters.graded"), gradedCount],
          ] as const).map(([value, label, count]) => (
            <button
              key={value}
              type="button"
              aria-pressed={statusFilter === value}
              onClick={() => setStatusFilter(value)}
              className={`min-h-10 rounded-lg px-3 text-sm font-semibold transition-colors ${statusFilter === value ? "bg-[#881337] text-white" : "text-stone-600 hover:bg-stone-50 dark:text-[#E7E0D6] dark:hover:bg-white/5"}`}
            >
              {label} <span className={statusFilter === value ? "text-white/75" : "text-stone-400 dark:text-[#A89C90]"}>({count})</span>
            </button>
          ))}
        </div>
      )}

      {loadError && <div role="alert" className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /><p>{loadError}</p></div>}

      {loading ? <div role="status" className="rounded-2xl border border-stone-200 bg-white p-10 text-center text-sm text-stone-500 dark:border-white/10 dark:bg-[#261E1A] dark:text-[#A89C90]">{t("classroomWorkflows.coursework.loading")}</div>
        : !loadError && tasks.length === 0 ? <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center dark:border-white/15 dark:bg-[#261E1A]"><BookOpen className="mx-auto h-8 w-8 text-stone-300 dark:text-stone-600" aria-hidden="true" /><h2 className="mt-3 text-base font-semibold text-stone-900 dark:text-[#FDFBF7]">{t(isSchoolEnrolled ? "classroomWorkflows.coursework.emptyTitle" : "classroomWorkflows.coursework.independentEmptyTitle")}</h2><p className="mx-auto mt-1 max-w-lg text-sm leading-6 text-stone-600 dark:text-[#A89C90]">{t(isSchoolEnrolled ? "classroomWorkflows.coursework.emptyDescription" : "classroomWorkflows.coursework.independentEmptyDescription")}</p>{!isSchoolEnrolled && <Link to="/student/school-access" className="mt-4 inline-flex min-h-10 items-center justify-center rounded-lg bg-[#881337] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#9F1239] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#881337] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#261E1A]">{t("classroomWorkflows.schoolAccess.linkAction")}</Link>}</div>
          : visibleTasks.length === 0 ? <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center dark:border-white/15 dark:bg-[#261E1A]"><BookOpen className="mx-auto h-8 w-8 text-stone-300 dark:text-stone-600" aria-hidden="true" /><h2 className="mt-3 text-base font-semibold text-stone-900 dark:text-[#FDFBF7]">{t("classroomWorkflows.coursework.emptyFilteredTitle")}</h2><p className="mt-1 text-sm text-stone-600 dark:text-[#A89C90]">{t("classroomWorkflows.coursework.emptyFilteredDescription")}</p></div>
          : <div className="space-y-4">{visibleTasks.map((task) => {
            const isSubmitted = task.status === "Submitted" || task.status === "Graded";
            const lateSubmissionBlocked = task.status === "Overdue" && task.late_policy === "no_late";
            const draft = drafts[task.id] || { text: "", attachmentUrl: "" };
            const hasUnsavedDraft = draft.text.trim() !== task.submission_text || draft.attachmentUrl.trim() !== task.submission_attachment_url;
            return <article id={`classwork-${task.id}`} key={task.id} tabIndex={-1} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-[#881337] dark:border-white/10 dark:bg-[#261E1A] dark:focus-visible:ring-[#FBBF24]">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-[#FFF1F2] px-2.5 py-1 text-xs font-semibold text-[#881337] dark:bg-[#4C0519]/40 dark:text-[#FBBF24]">{task.subject}</span><span className="text-xs text-stone-500 dark:text-[#A89C90]">{taskTypeKeys[task.type] ? t(`classroomWorkflows.coursework.type.${taskTypeKeys[task.type]}`) : task.type}</span></div>
                  <h2 className="mt-2 text-lg font-semibold text-stone-900 dark:text-[#FDFBF7]">{task.title}</h2>
                  <p className="mt-1 text-xs text-stone-500 dark:text-[#A89C90]">{t("classroomWorkflows.coursework.taskDetails", { teacher: task.teacher, date: formatDate(task.due_date, language), points: task.max_marks })}</p>
                </div>
                <span className={`inline-flex min-h-8 shrink-0 items-center gap-1.5 rounded-full px-3 text-xs font-semibold ${task.status === "Graded" ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200" : isSubmitted ? "bg-sky-50 text-sky-800 dark:bg-sky-950/30 dark:text-sky-200" : "bg-amber-50 text-amber-800 dark:bg-amber-950/30 dark:text-amber-200"}`}>
                  {isSubmitted && <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />}{t(`classroomWorkflows.coursework.status.${statusKeys[task.status] || "assigned"}`)}
                </span>
              </div>
              {(task.topic || task.instructions) && <div className="mt-4 rounded-xl bg-[#FAF8F5] p-4 text-sm leading-6 text-stone-700 dark:bg-[#1C1512] dark:text-[#E7E0D6]">{task.topic && <p className="font-semibold">{task.topic}</p>}{task.instructions && <p className={task.topic ? "mt-1" : ""}>{task.instructions}</p>}</div>}
              {task.attachment_url && <a href={task.attachment_url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#881337] hover:underline dark:text-[#FBBF24]">{t("classroomWorkflows.coursework.openAttachment")} <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /></a>}

              {isSubmitted ? <div className="mt-4 space-y-3 rounded-xl border border-stone-200 p-4 dark:border-white/10">
                <div><p className="text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-[#A89C90]">{t("classroomWorkflows.coursework.yourSubmission")} {task.submitted_late && <span className="ml-1 normal-case text-amber-700 dark:text-amber-200">{t("classroomWorkflows.coursework.submittedLate")}</span>}</p>{task.submission_text && <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-stone-800 dark:text-[#FDFBF7]">{task.submission_text}</p>}{task.submission_attachment_url && <a href={task.submission_attachment_url} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[#881337] hover:underline dark:text-[#FBBF24]">{t("classroomWorkflows.coursework.openWorkLink")} <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /></a>}{task.has_submission_file && <div className="mt-2"><button type="button" onClick={() => void handleDownloadFile(task)} className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-stone-300 px-3 text-sm font-semibold text-[#881337] hover:bg-stone-50 dark:border-white/15 dark:text-[#FBBF24]"><Download className="h-4 w-4" aria-hidden="true" />{task.submission_file_name} ({Math.max(1, Math.round(task.submission_file_size / 1024))} KB)</button></div>}</div>
                {task.status === "Graded" && <div className="flex flex-wrap items-start justify-between gap-3 border-t border-stone-100 pt-3 dark:border-white/10"><p className="text-sm text-stone-600 dark:text-[#E7E0D6]">{task.feedback || t("classroomWorkflows.coursework.gradedFeedback")}</p><span className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200">{task.score} / {task.max_marks}</span></div>}
              </div> : lateSubmissionBlocked ? <div role="status" className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-100">{t("classroomWorkflows.coursework.deadlineClosed")}</div> : <div className="mt-4 space-y-3">
                {savingDrafts[task.id]
                  ? <p role="status" className="text-xs text-stone-500 dark:text-[#A89C90]">{t("classroomWorkflows.coursework.savingDraft")}</p>
                  : hasUnsavedDraft
                    ? <p role="status" className="text-xs text-amber-700 dark:text-amber-200">{t("classroomWorkflows.coursework.unsavedChanges")}</p>
                    : task.draft_saved_at && <p role="status" className="text-xs text-emerald-700 dark:text-emerald-300">{t("classroomWorkflows.coursework.draftSaved", { date: formatDate(task.draft_saved_at, language) })}</p>}
                <label className="block space-y-1.5"><span className="text-sm font-semibold text-stone-700 dark:text-[#E7E0D6]">{t("classroomWorkflows.coursework.writtenResponse")}</span><textarea value={draft.text} onChange={(event) => updateDraft(task.id, "text", event.target.value)} rows={4} maxLength={10000} placeholder={t("classroomWorkflows.coursework.writtenResponsePlaceholder")} className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm leading-6 text-stone-900 outline-none focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/15 dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]" /></label>
                <label className="block space-y-1.5"><span className="text-sm font-semibold text-stone-700 dark:text-[#E7E0D6]">{t("classroomWorkflows.coursework.workLink")}</span><input type="url" value={draft.attachmentUrl} onChange={(event) => updateDraft(task.id, "attachmentUrl", event.target.value)} placeholder="https://…" className="min-h-10 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-900 outline-none focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/15 dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]" /></label>
                <div className="space-y-2 rounded-xl border border-dashed border-stone-300 p-4 dark:border-white/15">
                  <div><p className="text-sm font-semibold text-stone-700 dark:text-[#E7E0D6]">{t("classroomWorkflows.coursework.attachFile")}</p><p className="mt-0.5 text-xs text-stone-500 dark:text-[#A89C90]">{t("classroomWorkflows.coursework.fileHelp")}</p></div>
                  {task.has_submission_file ? <div className="flex flex-wrap items-center justify-between gap-2"><span className="min-w-0 truncate text-sm text-stone-700 dark:text-[#E7E0D6]">{task.submission_file_name} · {Math.max(1, Math.round(task.submission_file_size / 1024))} KB</span><div className="flex gap-2"><button type="button" onClick={() => void handleDownloadFile(task)} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-stone-300 px-3 text-xs font-semibold text-stone-700 dark:border-white/15 dark:text-[#E7E0D6]"><Download className="h-3.5 w-3.5" aria-hidden="true" />{t("classroomWorkflows.coursework.download")}</button><button type="button" onClick={() => void handleRemoveFile(task)} disabled={removingFileId === task.id || uploadingFileId === task.id} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-rose-200 px-3 text-xs font-semibold text-rose-700 disabled:opacity-50 dark:border-rose-900/40 dark:text-rose-200"><Trash2 className="h-3.5 w-3.5" aria-hidden="true" />{removingFileId === task.id ? t("classroomWorkflows.coursework.removing") : t("classroomWorkflows.coursework.remove")}</button></div></div>
                    : <label className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border border-stone-300 px-3 text-sm font-semibold text-stone-700 hover:bg-stone-50 dark:border-white/15 dark:text-[#E7E0D6] dark:hover:bg-white/5"><Upload className="h-4 w-4" aria-hidden="true" />{uploadingFileId === task.id ? t("classroomWorkflows.coursework.uploading") : t("classroomWorkflows.coursework.chooseFile")}<input type="file" accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg" className="sr-only" disabled={uploadingFileId === task.id} onChange={(event) => { void handleUploadFile(task, event.target.files?.[0]); event.currentTarget.value = ""; }} /></label>}
                  {fileError[task.id] && <p role="alert" className="text-sm text-rose-700 dark:text-rose-200">{fileError[task.id]}</p>}
                </div>
                {draftSaveError[task.id] && <p role="alert" className="text-sm text-rose-700 dark:text-rose-200">{draftSaveError[task.id]}</p>}
                {submitError[task.id] && <p role="alert" className="text-sm text-rose-700 dark:text-rose-200">{submitError[task.id]}</p>}
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => handleSaveDraft(task)} disabled={savingDrafts[task.id] || submittingId === task.id || (!draft.text.trim() && !draft.attachmentUrl.trim() && !task.draft_saved_at)} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-stone-300 px-4 text-sm font-semibold text-stone-700 hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/15 dark:text-[#E7E0D6] dark:hover:bg-white/5"><Save className="h-4 w-4" aria-hidden="true" />{t("classroomWorkflows.coursework.saveDraft")}</button>
                  <button type="button" onClick={() => void handleSubmit(task)} disabled={submittingId === task.id || savingDrafts[task.id] || uploadingFileId === task.id || removingFileId === task.id} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#881337] px-4 text-sm font-semibold text-white hover:bg-[#9F1239] disabled:opacity-60"><Send className="h-4 w-4" aria-hidden="true" />{submittingId === task.id ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />{t("classroomWorkflows.coursework.submitting")}</> : t("classroomWorkflows.coursework.submitWork")}</button>
                </div>
              </div>}
            </article>;
          })}</div>}
    </PortalPage>
  );
}
