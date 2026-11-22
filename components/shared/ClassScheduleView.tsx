import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarDays, AlertCircle, Clock3, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useI18n } from "../../i18n";
import { getApiErrorMessage } from "../../services/api";
import { createClassScheduleEntry, deleteClassScheduleEntry, getClassSchedule, getScheduleTeachingAssignments, updateClassScheduleEntry, type ClassScheduleEntry, type ClassScheduleInput, type TeachingAssignmentOption } from "../../services/schoolService";
import useAuthStore from "../../store/authStore";

const blankForm = { assignment_id: "", weekday: 0, start_time: "08:00", end_time: "08:45", room: "" };

export default function ClassScheduleView(): React.ReactElement {
  const { t } = useI18n();
  const role = useAuthStore((state) => state.role);
  const canManage = ["PRINCIPAL", "ADMIN", "SCHOOL_ADMIN"].includes(String(role || "").toUpperCase());
  const [entries, setEntries] = useState<ClassScheduleEntry[]>([]);
  const [assignments, setAssignments] = useState<TeachingAssignmentOption[]>([]);
  const [selectedDay, setSelectedDay] = useState<number | "all">("all");
  const [form, setForm] = useState(blankForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [scheduleResponse, assignmentResponse] = await Promise.all([getClassSchedule(), getScheduleTeachingAssignments()]);
      setEntries(scheduleResponse.data?.entries || []);
      setAssignments(assignmentResponse.data?.assignments || []);
    } catch (loadError) {
      setError(getApiErrorMessage(loadError) || t("classroomWorkflows.schedule.loadError"));
    } finally {
      setLoading(false);
    }
  }, [reloadKey, t]);

  useEffect(() => { void load(); }, [load]);

  const visibleEntries = useMemo(() => entries.filter((entry) => selectedDay === "all" || entry.weekday === selectedDay), [entries, selectedDay]);
  const selectedAssignment = assignments.find((assignment) => assignment.id === form.assignment_id);

  const saveEntry = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedAssignment) return;
    setSaving(true);
    setError(null);
    setNotice(null);
    const payload: ClassScheduleInput = {
      section_id: selectedAssignment.section_id,
      subject_id: selectedAssignment.subject_id,
      teacher_id: selectedAssignment.teacher_id,
      weekday: Number(form.weekday),
      start_time: form.start_time,
      end_time: form.end_time,
      room: form.room.trim(),
    };
    try {
      if (editingId) await updateClassScheduleEntry(editingId, payload);
      else await createClassScheduleEntry(payload);
      setNotice(t(editingId ? "classroomWorkflows.schedule.updated" : "classroomWorkflows.schedule.created"));
      setEditingId(null);
      setForm(blankForm);
      await load();
    } catch (saveError) {
      setError(getApiErrorMessage(saveError) || t("classroomWorkflows.schedule.saveError"));
    } finally {
      setSaving(false);
    }
  };

  const startEditing = (entry: ClassScheduleEntry) => {
    const assignment = assignments.find((item) => item.section_id === entry.section_id && item.subject_id === entry.subject_id && item.teacher_id === entry.teacher_id);
    if (!assignment) {
      setError(t("classroomWorkflows.schedule.assignmentUnavailable"));
      return;
    }
    setEditingId(entry.id);
    setForm({ assignment_id: assignment.id, weekday: entry.weekday, start_time: entry.start_time, end_time: entry.end_time, room: entry.room || "" });
  };

  const removeEntry = async (entryId: string) => {
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      await deleteClassScheduleEntry(entryId);
      setNotice(t("classroomWorkflows.schedule.removed"));
      if (editingId === entryId) { setEditingId(null); setForm(blankForm); }
      await load();
    } catch (deleteError) {
      setError(getApiErrorMessage(deleteError) || t("classroomWorkflows.schedule.deleteError"));
    } finally {
      setSaving(false);
    }
  };

  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const groupedEntries = dayNames.map((day, weekday) => ({ day, weekday, entries: visibleEntries.filter((entry) => entry.weekday === weekday) })).filter((group) => group.entries.length || selectedDay === group.weekday);

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-12 font-sans">
      <header className="flex flex-col gap-3 border-b border-[#E7E0D6] pb-5 dark:border-white/10 sm:flex-row sm:items-end sm:justify-between"><div><div className="inline-flex items-center gap-2 text-sm font-semibold text-[#881337] dark:text-[#FBBF24]"><CalendarDays className="h-4 w-4" aria-hidden="true" />{t("classroomWorkflows.schedule.eyebrow")}</div><h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900 dark:text-[#FDFBF7]">{t("classroomWorkflows.schedule.title")}</h1><p className="mt-1 text-sm text-stone-600 dark:text-[#A89C90]">{t(canManage ? "classroomWorkflows.schedule.adminDescription" : "classroomWorkflows.schedule.teacherDescription")}</p></div><button type="button" onClick={() => setReloadKey((value) => value + 1)} disabled={loading} className="inline-flex min-h-10 self-start items-center gap-2 rounded-lg border border-stone-300 px-3 text-xs font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-50 dark:border-white/15 dark:text-[#E7E0D6] dark:hover:bg-white/5 sm:self-auto"><RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} aria-hidden="true" />{t("classroomWorkflows.schedule.refresh")}</button></header>
      {error && <div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />{error}</div>}
      {notice && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-100">{notice}</div>}

      {canManage && <section className="rounded-2xl border border-[#E7E0D6] bg-white p-5 shadow-xs dark:border-white/10 dark:bg-[#261E1A]"><div className="mb-4 flex items-center gap-2"><Plus className="h-4 w-4 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" /><h2 className="font-semibold text-stone-900 dark:text-[#FDFBF7]">{t(editingId ? "classroomWorkflows.schedule.editTitle" : "classroomWorkflows.schedule.addTitle")}</h2></div><form onSubmit={(event) => void saveEntry(event)} className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6"><label className="block space-y-1 sm:col-span-2 xl:col-span-2"><span className="text-xs font-medium text-stone-600 dark:text-[#A89C90]">{t("classroomWorkflows.schedule.assignmentLabel")}</span><select required value={form.assignment_id} onChange={(event) => setForm((current) => ({ ...current, assignment_id: event.target.value }))} className="min-h-10 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-800 focus:border-[#881337] focus:outline-none focus:ring-2 focus:ring-[#881337]/15 dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]"><option value="">{t("classroomWorkflows.schedule.chooseAssignment")}</option>{assignments.map((assignment) => <option key={assignment.id} value={assignment.id}>{assignment.section_name} · {assignment.subject_name} · {assignment.teacher_name}</option>)}</select></label><label className="block space-y-1"><span className="text-xs font-medium text-stone-600 dark:text-[#A89C90]">{t("classroomWorkflows.schedule.weekday")}</span><select value={form.weekday} onChange={(event) => setForm((current) => ({ ...current, weekday: Number(event.target.value) }))} className="min-h-10 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-800 focus:border-[#881337] focus:outline-none dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]">{dayNames.map((day, index) => <option key={day} value={index}>{t(`classroomWorkflows.schedule.days.${index}`)}</option>)}</select></label><label className="block space-y-1"><span className="text-xs font-medium text-stone-600 dark:text-[#A89C90]">{t("classroomWorkflows.schedule.startTime")}</span><input required type="time" value={form.start_time} onChange={(event) => setForm((current) => ({ ...current, start_time: event.target.value }))} className="min-h-10 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-800 focus:border-[#881337] focus:outline-none dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]" /></label><label className="block space-y-1"><span className="text-xs font-medium text-stone-600 dark:text-[#A89C90]">{t("classroomWorkflows.schedule.endTime")}</span><input required type="time" value={form.end_time} onChange={(event) => setForm((current) => ({ ...current, end_time: event.target.value }))} className="min-h-10 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-800 focus:border-[#881337] focus:outline-none dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]" /></label><label className="block space-y-1"><span className="text-xs font-medium text-stone-600 dark:text-[#A89C90]">{t("classroomWorkflows.schedule.room")}</span><input maxLength={100} value={form.room} onChange={(event) => setForm((current) => ({ ...current, room: event.target.value }))} placeholder={t("classroomWorkflows.schedule.roomPlaceholder")} className="min-h-10 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-800 focus:border-[#881337] focus:outline-none dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]" /></label><div className="flex items-end gap-2 sm:col-span-2 xl:col-span-6"><button type="submit" disabled={saving || loading || assignments.length === 0} className="min-h-10 rounded-lg bg-[#881337] px-4 text-sm font-semibold text-white hover:bg-[#9F1239] disabled:opacity-50">{saving ? t("classroomWorkflows.schedule.saving") : t(editingId ? "classroomWorkflows.schedule.saveChanges" : "classroomWorkflows.schedule.addEntry")}</button>{editingId && <button type="button" onClick={() => { setEditingId(null); setForm(blankForm); }} className="min-h-10 rounded-lg border border-stone-300 px-4 text-sm font-semibold text-stone-700 dark:border-white/15 dark:text-[#E7E0D6]">{t("classroomWorkflows.schedule.cancelEdit")}</button>}</div></form>{assignments.length === 0 && <p className="mt-3 text-xs text-amber-800 dark:text-amber-200">{t("classroomWorkflows.schedule.noAssignments")}</p>}</section>}

      <section className="space-y-4"><div className="flex flex-wrap gap-2" role="group" aria-label={t("classroomWorkflows.schedule.filterDays")}><button type="button" aria-pressed={selectedDay === "all"} onClick={() => setSelectedDay("all")} className={`min-h-9 rounded-lg px-3 text-xs font-semibold ${selectedDay === "all" ? "bg-[#881337] text-white" : "border border-stone-300 text-stone-700 dark:border-white/15 dark:text-[#E7E0D6]"}`}>{t("classroomWorkflows.schedule.allDays")}</button>{dayNames.map((day, index) => <button type="button" key={day} aria-pressed={selectedDay === index} onClick={() => setSelectedDay(index)} className={`min-h-9 rounded-lg px-3 text-xs font-semibold ${selectedDay === index ? "bg-[#881337] text-white" : "border border-stone-300 text-stone-700 dark:border-white/15 dark:text-[#E7E0D6]"}`}>{t(`classroomWorkflows.schedule.days.${index}`)}</button>)}</div>
        {loading ? <div role="status" className="rounded-2xl border border-[#E7E0D6] bg-white p-8 text-center text-sm text-stone-500 dark:border-white/10 dark:bg-[#261E1A]">{t("classroomWorkflows.schedule.loading")}</div> : visibleEntries.length === 0 ? <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center text-sm text-stone-500 dark:border-white/15 dark:bg-[#261E1A] dark:text-[#A89C90]">{t("classroomWorkflows.schedule.empty")}</div> : <div className="grid gap-4 lg:grid-cols-2">{groupedEntries.map((group) => <section key={group.weekday} className="overflow-hidden rounded-2xl border border-[#E7E0D6] bg-white dark:border-white/10 dark:bg-[#261E1A]"><h2 className="border-b border-[#E7E0D6] bg-[#FAF8F5] px-4 py-3 text-sm font-semibold text-stone-900 dark:border-white/10 dark:bg-[#1C1512] dark:text-[#FDFBF7]">{t(`classroomWorkflows.schedule.days.${group.weekday}`)}</h2><div className="divide-y divide-[#E7E0D6] dark:divide-white/10">{group.entries.map((entry) => <article key={entry.id} className="flex items-start justify-between gap-3 p-4"><div className="flex min-w-0 gap-3"><span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FFF1F2] text-[#881337] dark:bg-[#4C0519]/40 dark:text-[#FBBF24]"><Clock3 className="h-4 w-4" aria-hidden="true" /></span><div className="min-w-0"><p className="font-semibold text-stone-900 dark:text-[#FDFBF7]">{entry.start_time}–{entry.end_time} · {entry.subject_name}</p><p className="mt-1 text-sm text-stone-600 dark:text-[#A89C90]">{entry.section_name} · Grade {entry.grade}</p><p className="mt-0.5 text-xs text-stone-500 dark:text-[#A89C90]">{entry.teacher_name}{entry.room ? ` · ${t("classroomWorkflows.schedule.roomShort")} ${entry.room}` : ""}</p></div></div>{canManage && <div className="flex shrink-0 gap-1"><button type="button" aria-label={t("classroomWorkflows.schedule.editEntry")} onClick={() => startEditing(entry)} className="min-h-9 min-w-9 rounded-lg text-stone-500 hover:bg-stone-100 hover:text-[#881337] dark:text-[#A89C90] dark:hover:bg-white/5"><Pencil className="mx-auto h-4 w-4" aria-hidden="true" /></button><button type="button" aria-label={t("classroomWorkflows.schedule.removeEntry")} onClick={() => void removeEntry(entry.id)} disabled={saving} className="min-h-9 min-w-9 rounded-lg text-stone-500 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-50 dark:text-[#A89C90] dark:hover:bg-rose-950/30"><Trash2 className="mx-auto h-4 w-4" aria-hidden="true" /></button></div>}</article>)}</div></section>)}</div>}
      </section>
    </div>
  );
}
