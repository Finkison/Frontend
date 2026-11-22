import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Check, AlertCircle, Save, Users } from "lucide-react";
import { useI18n } from "../../i18n";
import { getApiErrorMessage } from "../../services/api";
import { getTeacherAssignedPairs, getTeacherAttendanceRoster, saveTeacherAttendance, type AttendanceRosterStudent } from "../../services/schoolService";
import PageHeader from "../shared/PageHeader";
import PortalPage from "../shared/PortalPage";
import PortalLoading from "../shared/PortalLoading";

interface TeachingPair {
  assignment_id: string;
  section_id: string;
  section_name: string;
  grade: string;
  subject_id: string;
  subject_name: string;
}

const today = () => {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};

const attendanceStatuses = ["present", "absent", "late", "excused"] as const;
type AttendanceStatus = typeof attendanceStatuses[number];

export default function TeacherAttendanceView(): React.ReactElement {
  const { t } = useI18n();
  const [pairs, setPairs] = useState<TeachingPair[]>([]);
  const [selectedPairId, setSelectedPairId] = useState("");
  const [attendanceDate, setAttendanceDate] = useState(today);
  const [students, setStudents] = useState<AttendanceRosterStudent[]>([]);
  const [marks, setMarks] = useState<Record<string, AttendanceStatus | "unmarked">>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [rosterLoading, setRosterLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getTeacherAssignedPairs()
      .then((response) => {
        if (!active) return;
        const values = Array.isArray(response.data?.pairs) ? response.data.pairs as TeachingPair[] : [];
        setPairs(values);
        setSelectedPairId((current) => values.some((pair) => String(pair.assignment_id) === current)
          ? current
          : String(values[0]?.assignment_id || ""));
        setError(null);
      })
      .catch((loadError) => {
        if (active) setError(getApiErrorMessage(loadError) || t("classroomWorkflows.attendance.loadError"));
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [refreshKey, t]);

  const selectedPair = pairs.find((pair) => String(pair.assignment_id) === selectedPairId) || pairs[0] || null;

  const loadRoster = useCallback(async () => {
    if (!selectedPair) {
      setStudents([]);
      return;
    }
    setRosterLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await getTeacherAttendanceRoster(selectedPair.section_id, selectedPair.subject_id, attendanceDate);
      const roster = response.data?.students || [];
      setStudents(roster);
      setMarks(Object.fromEntries(roster.map((student) => [student.id, student.status])));
      setNotes(Object.fromEntries(roster.map((student) => [student.id, student.note || ""])));
    } catch (loadError) {
      setStudents([]);
      setError(getApiErrorMessage(loadError) || t("classroomWorkflows.attendance.loadError"));
    } finally {
      setRosterLoading(false);
    }
  }, [selectedPair?.section_id, selectedPair?.subject_id, attendanceDate, t]);

  useEffect(() => { void loadRoster(); }, [loadRoster]);

  const markedCount = useMemo(() => Object.values(marks).filter((status) => status !== "unmarked").length, [marks]);

  const saveRegister = async () => {
    if (!selectedPair || students.length === 0) return;
    if (markedCount !== students.length) {
      setError(t("classroomWorkflows.attendance.markAllRequired"));
      setSuccess(null);
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await saveTeacherAttendance({
        section_id: selectedPair.section_id,
        subject_id: selectedPair.subject_id,
        attendance_date: attendanceDate,
        attendance: students.map((student) => ({ student_id: student.id, status: marks[student.id] as AttendanceStatus, note: notes[student.id] || "" })),
      });
      const savedNotice = t("classroomWorkflows.attendance.saved", { count: result.data.saved_count });
      await loadRoster();
      setSuccess(savedNotice);
    } catch (saveError) {
      setError(getApiErrorMessage(saveError) || t("classroomWorkflows.attendance.saveError"));
    } finally {
      setSaving(false);
    }
  };

  const markAllPresent = () => {
    setMarks(Object.fromEntries(students.map((student) => [student.id, "present" as AttendanceStatus])));
    setError(null);
    setSuccess(null);
  };

  if (loading) return <PortalPage className="max-w-5xl"><PortalLoading message={t("classroomWorkflows.attendance.loading")} /></PortalPage>;

  return (
    <PortalPage className="max-w-5xl space-y-6">
      <PageHeader title={t("classroomWorkflows.attendance.title")} description={t("classroomWorkflows.attendance.description")}>
        {selectedPair && <div className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#FAF8F5] px-3 text-xs font-semibold text-stone-700 dark:bg-[#1C1512] dark:text-[#E7E0D6]"><Users className="h-4 w-4 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />{t("classroomWorkflows.attendance.markedCount", { marked: markedCount, total: students.length })}</div>}
      </PageHeader>

      {error && <div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />{error}</div>}
      {success && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-100">{success}</div>}

      {pairs.length === 0 ? (
        <section className="rounded-2xl border border-[#E7E0D6] bg-white p-8 text-center dark:border-white/10 dark:bg-[#261E1A]"><Users className="mx-auto h-8 w-8 text-stone-300" aria-hidden="true" /><h2 className="mt-3 font-semibold text-stone-900 dark:text-[#FDFBF7]">{t("classroomWorkflows.attendance.noAssignments")}</h2><p className="mt-1 text-sm text-stone-600 dark:text-[#A89C90]">{t("classroomWorkflows.attendance.noAssignmentsHelp")}</p></section>
      ) : (
        <>
          <section className="grid gap-4 rounded-2xl border border-[#E7E0D6] bg-white p-5 shadow-xs dark:border-white/10 dark:bg-[#261E1A] sm:grid-cols-[1fr_220px_auto] sm:items-end">
            <label className="block space-y-1.5"><span className="text-sm font-medium text-stone-700 dark:text-[#E7E0D6]">{t("classroomWorkflows.attendance.classLabel")}</span><select value={selectedPairId} onChange={(event) => setSelectedPairId(event.target.value)} className="min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-900 focus:border-[#881337] focus:outline-none focus:ring-2 focus:ring-[#881337]/15 dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]">{pairs.map((pair) => <option key={pair.assignment_id} value={pair.assignment_id}>{pair.section_name} · {pair.subject_name}</option>)}</select></label>
            <label className="block space-y-1.5"><span className="text-sm font-medium text-stone-700 dark:text-[#E7E0D6]">{t("classroomWorkflows.attendance.dateLabel")}</span><input type="date" value={attendanceDate} max={today()} onChange={(event) => setAttendanceDate(event.target.value)} className="min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-900 focus:border-[#881337] focus:outline-none focus:ring-2 focus:ring-[#881337]/15 dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]" /></label>
            <button type="button" onClick={markAllPresent} disabled={!students.length || rosterLoading} className="min-h-11 rounded-lg border border-stone-300 px-4 text-sm font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-50 dark:border-white/15 dark:text-[#E7E0D6] dark:hover:bg-white/5">{t("classroomWorkflows.attendance.markAllPresent")}</button>
          </section>

          <section className="overflow-hidden rounded-2xl border border-[#E7E0D6] bg-white shadow-xs dark:border-white/10 dark:bg-[#261E1A]" aria-label={t("classroomWorkflows.attendance.rosterLabel")}>
            <div className="flex flex-col gap-1 border-b border-[#E7E0D6] p-5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-semibold text-stone-900 dark:text-[#FDFBF7]">{selectedPair?.section_name} · {selectedPair?.subject_name}</h2><p className="mt-1 text-xs text-stone-500 dark:text-[#A89C90]">{new Date(`${attendanceDate}T12:00:00`).toLocaleDateString()}</p></div><button type="button" onClick={() => void loadRoster()} disabled={rosterLoading} className="min-h-9 self-start rounded-lg px-3 text-xs font-semibold text-[#881337] hover:bg-[#FFF1F2] disabled:opacity-50 dark:text-[#FBBF24] dark:hover:bg-white/5">{t("classroomWorkflows.attendance.refresh")}</button></div>
            {rosterLoading ? <p role="status" className="p-10 text-center text-sm text-stone-500 dark:text-[#A89C90]">{t("classroomWorkflows.attendance.loadingRoster")}</p> : students.length === 0 ? <p className="p-10 text-center text-sm text-stone-500 dark:text-[#A89C90]">{t("classroomWorkflows.attendance.emptyRoster")}</p> : <div className="divide-y divide-[#E7E0D6] dark:divide-white/10">{students.map((student) => <div key={student.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0 sm:w-44"><p className="font-medium text-stone-900 dark:text-[#FDFBF7]">{student.name}</p><p className="mt-0.5 text-xs text-stone-500 dark:text-[#A89C90]">{student.grade}</p></div><div className="grid grid-cols-2 gap-2 sm:flex" role="group" aria-label={t("classroomWorkflows.attendance.markFor", { name: student.name })}>{attendanceStatuses.map((status) => <button key={status} type="button" aria-pressed={marks[student.id] === status} onClick={() => { setMarks((current) => ({ ...current, [student.id]: status })); setError(null); setSuccess(null); }} className={`min-h-10 min-w-24 rounded-lg border px-3 text-xs font-semibold capitalize transition-colors ${marks[student.id] === status ? "border-[#881337] bg-[#881337] text-white dark:border-[#FBBF24] dark:bg-[#FBBF24] dark:text-[#1C1512]" : "border-stone-300 text-stone-600 hover:bg-stone-50 dark:border-white/15 dark:text-[#E7E0D6] dark:hover:bg-white/5"}`}>{marks[student.id] === status && <Check className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" />}{t(`classroomWorkflows.attendance.status.${status}`)}</button>)}</div><label className="block min-w-0 flex-1 space-y-1"><span className="text-xs font-medium text-stone-600 dark:text-[#A89C90]">{t("classroomWorkflows.attendance.noteLabel")}</span><input maxLength={500} value={notes[student.id] || ""} onChange={(event) => setNotes((current) => ({ ...current, [student.id]: event.target.value }))} aria-label={t("classroomWorkflows.attendance.noteFor", { name: student.name })} placeholder={t("classroomWorkflows.attendance.notePlaceholder")} className="min-h-10 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-800 focus:border-[#881337] focus:outline-none dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]" /></label></div>)}</div>}
            {students.length > 0 && <div className="flex flex-col gap-3 border-t border-[#E7E0D6] p-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs text-stone-500 dark:text-[#A89C90]">{t("classroomWorkflows.attendance.saveHelp")}</p><button type="button" onClick={() => void saveRegister()} disabled={saving || rosterLoading || !students.length} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#881337] px-5 text-sm font-semibold text-white hover:bg-[#9F1239] disabled:cursor-wait disabled:opacity-60"><Save className="h-4 w-4" aria-hidden="true" />{saving ? t("classroomWorkflows.attendance.saving") : t("classroomWorkflows.attendance.save")}</button></div>}
          </section>
        </>
      )}
    </PortalPage>
  );
}
