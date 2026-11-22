import React, { useCallback, useEffect, useState } from "react";
import { AlertCircle, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "../../i18n";
import { getApiErrorMessage } from "../../services/api";
import { getStudentAttendance } from "../../services/schoolService";
import useAuthStore from "../../store/authStore";
import PageHeader from "../shared/PageHeader";
import PortalPage from "../shared/PortalPage";

interface AttendanceRecordItem {
  id: string;
  date: string;
  subject: string;
  classroom: string;
  status: string;
  note: string;
}

export default function AttendanceHistoryView(): React.ReactElement {
  const { t } = useI18n();
  const user = useAuthStore((state) => state.user);
  const [summary, setSummary] = useState<{ attendance_rate: number | null; recorded_sessions: number } | null>(null);
  const [records, setRecords] = useState<AttendanceRecordItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getStudentAttendance();
      setSummary(response.data.summary);
      setRecords(response.data.records || []);
    } catch (loadError) {
      setError(getApiErrorMessage(loadError) || t("classroomWorkflows.studentAttendance.loadError"));
    } finally {
      setLoading(false);
    }
  }, [reloadKey, t]);

  useEffect(() => { void load(); }, [load]);

  return (
    <PortalPage className="max-w-4xl space-y-6">
      <PageHeader
        title={t("classroomWorkflows.studentAttendance.title")}
        description={t("classroomWorkflows.studentAttendance.description")}
        secondaryActions={[{ label: t("classroomWorkflows.studentAttendance.retry"), onClick: () => setReloadKey((value) => value + 1), loading }]}
      />
      {error && <div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />{error}<button type="button" onClick={() => setReloadKey((value) => value + 1)} className="ml-auto shrink-0 font-semibold underline">{t("classroomWorkflows.studentAttendance.retry")}</button></div>}
      {loading ? <div role="status" className="rounded-2xl border border-[#E7E0D6] bg-white p-8 text-center text-sm text-stone-500 dark:border-white/10 dark:bg-[#261E1A] dark:text-[#A89C90]">{t("classroomWorkflows.studentAttendance.loading")}</div> : records.length === 0 ? (
        <section className="rounded-2xl border border-[#E7E0D6] bg-white p-8 text-center dark:border-white/10 dark:bg-[#261E1A]"><ClipboardList className="mx-auto h-9 w-9 text-stone-300 dark:text-stone-600" aria-hidden="true" /><h2 className="mt-3 font-semibold text-stone-900 dark:text-[#FDFBF7]">{t("classroomWorkflows.studentAttendance.emptyTitle")}</h2><p className="mx-auto mt-1 max-w-lg text-sm leading-6 text-stone-600 dark:text-[#A89C90]">{user?.isSchoolEnrolled ? t("classroomWorkflows.studentAttendance.emptySchool") : t("classroomWorkflows.studentAttendance.emptyIndependent")}</p>{!user?.isSchoolEnrolled && <Link to="/student/school-access" className="mt-4 inline-flex min-h-10 items-center justify-center rounded-lg bg-[#881337] px-4 text-sm font-semibold text-white hover:bg-[#9F1239]">{t("classroomWorkflows.schoolAccess.linkAction")}</Link>}</section>
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2"><article className="rounded-2xl border border-[#E7E0D6] bg-white p-5 dark:border-white/10 dark:bg-[#261E1A]"><p className="text-xs font-medium text-stone-500 dark:text-[#A89C90]">{t("classroomWorkflows.studentAttendance.rateLabel")}</p><p className="mt-2 font-mono text-3xl font-semibold text-[#881337] dark:text-[#FBBF24]">{summary?.attendance_rate == null ? "—" : `${summary.attendance_rate}%`}</p><p className="mt-1 text-xs text-stone-500 dark:text-[#A89C90]">{t("classroomWorkflows.studentAttendance.recorded", { count: summary?.recorded_sessions || 0 })}</p></article><article className="rounded-2xl border border-[#E7E0D6] bg-white p-5 dark:border-white/10 dark:bg-[#261E1A]"><p className="text-xs font-medium text-stone-500 dark:text-[#A89C90]">{t("classroomWorkflows.studentAttendance.recordsLabel")}</p><p className="mt-2 font-mono text-3xl font-semibold text-stone-900 dark:text-[#FDFBF7]">{records.length}</p><p className="mt-1 text-xs text-stone-500 dark:text-[#A89C90]">{t("classroomWorkflows.studentAttendance.latestRecords")}</p></article></section>
          <section className="overflow-hidden rounded-2xl border border-[#E7E0D6] bg-white dark:border-white/10 dark:bg-[#261E1A]"><div className="border-b border-[#E7E0D6] p-5 dark:border-white/10"><h2 className="font-semibold text-stone-900 dark:text-[#FDFBF7]">{t("classroomWorkflows.studentAttendance.historyTitle")}</h2></div><div className="divide-y divide-[#E7E0D6] dark:divide-white/10">{records.map((record) => <article key={record.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold text-stone-900 dark:text-[#FDFBF7]">{record.subject}</p><p className="mt-0.5 text-xs text-stone-500 dark:text-[#A89C90]">{record.classroom} · {new Date(`${record.date}T12:00:00`).toLocaleDateString()}</p>{record.note && <p className="mt-1 text-xs text-stone-600 dark:text-[#E7E0D6]">{record.note}</p>}</div><span className={`self-start rounded-full px-2.5 py-1 text-xs font-semibold capitalize sm:self-auto ${record.status === "present" ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200" : record.status === "late" ? "bg-amber-50 text-amber-800 dark:bg-amber-950/30 dark:text-amber-200" : record.status === "absent" ? "bg-rose-50 text-rose-800 dark:bg-rose-950/30 dark:text-rose-200" : "bg-stone-100 text-stone-700 dark:bg-white/10 dark:text-[#E7E0D6]"}`}>{t(`classroomWorkflows.attendance.status.${record.status}`)}</span></article>)}</div></section>
        </>
      )}
    </PortalPage>
  );
}
