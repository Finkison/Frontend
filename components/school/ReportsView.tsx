import React, { useCallback, useEffect, useState } from "react";
import { AlertTriangle, CalendarCheck, ClipboardCheck, Download, FileSpreadsheet, RefreshCw, ShieldCheck, TrendingUp, Users } from "lucide-react";
import { exportReports, getSchoolAnalytics } from "../../services/schoolService";
import { useToast } from "../ui/Toast";
import PageHeader from "../shared/PageHeader";
import PortalPage from "../shared/PortalPage";

export default function ReportsView(): React.ReactElement {
  const { showToast } = useToast();
  const [analytics, setAnalytics] = useState<any>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAnalytics = useCallback(() => {
    setAnalyticsLoading(true);
    setAnalyticsError(false);
    getSchoolAnalytics()
      .then((response) => setAnalytics(response.data?.data || response.data || null))
      .catch(() => setAnalyticsError(true))
      .finally(() => setAnalyticsLoading(false));
  }, []);

  useEffect(() => { loadAnalytics(); }, [loadAnalytics]);

  const handleExport = async () => {
    setDownloading(true);
    setDownloaded(false);
    setError(null);

    try {
      const response = await exportReports("csv");
      const blob = response.data instanceof Blob
        ? response.data
        : new Blob([response.data], { type: "text/csv;charset=utf-8;" });
      const disposition = response.headers?.["content-disposition"] || "";
      const fileName = disposition.match(/filename="?([^";]+)"?/i)?.[1] || "school_performance_report.csv";
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 0);
      setDownloaded(true);
      showToast({
        type: "success",
        title: "CSV downloaded",
        message: "The school roster export is ready.",
      });
    } catch {
      setError("The export could not be created. Check your connection and try again.");
      showToast({
        type: "error",
        title: "Export failed",
        message: "No file was downloaded. Try again when the school service is available.",
      });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <PortalPage className="max-w-4xl space-y-6">
      <PageHeader
        title="Reports"
        description="Monitor school progress and export records."
        primaryAction={{ label: downloading ? "Preparing…" : "Download CSV", onClick: () => void handleExport(), icon: Download, loading: downloading }}
        secondaryActions={[{ label: "Refresh", onClick: loadAnalytics, icon: RefreshCw, loading: analyticsLoading }]}
      />

      <section className="space-y-4" aria-labelledby="school-indicators-heading">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="school-indicators-heading" className="text-base font-semibold text-stone-900 dark:text-[#FDFBF7]">School indicators</h2>
            <p className="mt-1 text-xs text-stone-500 dark:text-[#A89C90]">Current school-wide data.</p>
          </div>
        </div>

        {analyticsLoading ? (
          <div role="status" className="grid gap-3 sm:grid-cols-3">
            {[1, 2, 3].map((item) => <div key={item} className="h-24 animate-pulse rounded-xl border border-stone-200 bg-white dark:border-white/10 dark:bg-[#261E1A]" />)}
            <span className="sr-only">Loading school indicators...</span>
          </div>
        ) : analyticsError ? (
          <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200">
            School indicators could not be loaded. You can still export the roster.
          </div>
        ) : analytics ? (
          <>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              <article className="rounded-xl border border-stone-200 bg-white p-4 shadow-xs dark:border-white/10 dark:bg-[#261E1A]">
                <div className="flex items-center justify-between text-xs text-stone-500 dark:text-[#A89C90]"><span>Students</span><Users className="h-4 w-4 text-[#881337]" aria-hidden="true" /></div>
                <p className="mt-3 font-mono text-2xl font-semibold tabular-nums text-stone-900 dark:text-[#FDFBF7]">{typeof analytics.total_students === "number" ? analytics.total_students : "—"}</p>
              </article>
              <article className="rounded-xl border border-stone-200 bg-white p-4 shadow-xs dark:border-white/10 dark:bg-[#261E1A]">
                <div className="flex items-center justify-between text-xs text-stone-500 dark:text-[#A89C90]"><span>Mean predicted score</span><TrendingUp className="h-4 w-4 text-[#881337]" aria-hidden="true" /></div>
                <p className="mt-3 font-mono text-2xl font-semibold tabular-nums text-stone-900 dark:text-[#FDFBF7]">{typeof analytics.average_predicted_score === "number" ? analytics.average_predicted_score : "—"}</p>
              </article>
              <article className="rounded-xl border border-stone-200 bg-white p-4 shadow-xs dark:border-white/10 dark:bg-[#261E1A]">
                <div className="flex items-center justify-between text-xs text-stone-500 dark:text-[#A89C90]"><span>Students flagged for support</span><AlertTriangle className="h-4 w-4 text-amber-700" aria-hidden="true" /></div>
                <p className="mt-3 font-mono text-2xl font-semibold tabular-nums text-stone-900 dark:text-[#FDFBF7]">{typeof analytics.at_risk_count === "number" ? analytics.at_risk_count : "—"}</p>
              </article>
              <article className="rounded-xl border border-stone-200 bg-white p-4 shadow-xs dark:border-white/10 dark:bg-[#261E1A]">
                <div className="flex items-center justify-between text-xs text-stone-500 dark:text-[#A89C90]"><span>Attendance rate</span><CalendarCheck className="h-4 w-4 text-[#881337]" aria-hidden="true" /></div>
                <p className="mt-3 font-mono text-2xl font-semibold tabular-nums text-stone-900 dark:text-[#FDFBF7]">{typeof analytics.attendance_rate === "number" ? `${analytics.attendance_rate}%` : "—"}</p>
              </article>
              <article className="rounded-xl border border-stone-200 bg-white p-4 shadow-xs dark:border-white/10 dark:bg-[#261E1A]">
                <div className="flex items-center justify-between text-xs text-stone-500 dark:text-[#A89C90]"><span>Classwork awaiting review</span><ClipboardCheck className="h-4 w-4 text-[#881337]" aria-hidden="true" /></div>
                <p className="mt-3 font-mono text-2xl font-semibold tabular-nums text-stone-900 dark:text-[#FDFBF7]">{typeof analytics.classwork_pending_review_count === "number" ? analytics.classwork_pending_review_count : "—"}</p>
                <p className="mt-1 text-xs text-stone-500 dark:text-[#A89C90]">Submitted work not yet graded</p>
              </article>
            </div>

            {Array.isArray(analytics.attendance_by_grade) && analytics.attendance_by_grade.length > 0 && <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-[#261E1A]">
              <h3 className="text-sm font-semibold text-stone-900 dark:text-[#FDFBF7]">Attendance by grade</h3>
              <div className="mt-4 space-y-3">{analytics.attendance_by_grade.map((grade: { grade: number | string; attendance_rate: number | null; recorded_sessions: number }) => <div key={grade.grade} className="grid grid-cols-[4.5rem_1fr_3.5rem] items-center gap-3 text-xs"><span className="font-medium text-stone-700 dark:text-[#E7E0D6]">Grade {grade.grade}</span><div className="h-2 overflow-hidden rounded-full bg-stone-100 dark:bg-[#1C1512]" role="img" aria-label={`${grade.attendance_rate ?? 0}% attendance for Grade ${grade.grade}`}><div className="h-full rounded-full bg-emerald-600" style={{ width: `${Math.max(0, Math.min(100, grade.attendance_rate || 0))}%` }} /></div><span className="text-right font-mono tabular-nums text-stone-600 dark:text-[#E7E0D6]">{grade.attendance_rate == null ? "—" : `${grade.attendance_rate}%`}</span></div>)}</div>
            </div>}

            <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-[#261E1A]">
              <h3 className="text-sm font-semibold text-stone-900 dark:text-[#FDFBF7]">Students by grade</h3>
              {Array.isArray(analytics.by_grade) && analytics.by_grade.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {analytics.by_grade.map((grade: { grade: number | string; count: number }) => {
                    const maxCount = Math.max(1, ...analytics.by_grade.map((entry: { count: number }) => entry.count || 0));
                    const percentage = Math.max(0, Math.min(100, Math.round((grade.count / maxCount) * 100)));
                    return (
                      <div key={grade.grade} className="grid grid-cols-[4.5rem_1fr_3rem] items-center gap-3 text-xs">
                        <span className="font-medium text-stone-700 dark:text-[#E7E0D6]">Grade {grade.grade}</span>
                        <div className="h-2 overflow-hidden rounded-full bg-stone-100 dark:bg-[#1C1512]" role="img" aria-label={`${grade.count} students in Grade ${grade.grade}`}><div className="h-full rounded-full bg-[#881337]" style={{ width: `${percentage}%` }} /></div>
                        <span className="text-right font-mono tabular-nums text-stone-600 dark:text-[#E7E0D6]">{grade.count}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-3 text-sm text-stone-500 dark:text-[#A89C90]">No student records are available for a grade breakdown.</p>
              )}
            </div>
          </>
        ) : (
          <p className="rounded-xl border border-dashed border-stone-300 p-5 text-sm text-stone-600 dark:border-white/15 dark:text-[#E7E0D6]">No school indicators are available yet.</p>
        )}
      </section>

      <section className="rounded-xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#261E1A] p-5 shadow-xs sm:p-7" aria-labelledby="roster-export-heading">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FFF1F2] dark:bg-[#4C0519]/40 text-[#881337]">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 id="roster-export-heading" className="text-base font-semibold text-stone-900 dark:text-[#FDFBF7]">Student roster</h2>
            <p className="mt-1 text-sm leading-6 text-stone-600 dark:text-[#E7E0D6]">
              Download a CSV of student records and performance fields available to your school.
            </p>
          </div>
        </div>

        {error && <p role="alert" className="mt-5 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}
        {downloaded && <p role="status" className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">CSV downloaded successfully.</p>}

        <p className="mt-5 border-t border-stone-100 pt-5 text-xs text-stone-500 dark:border-white/10 dark:text-[#A89C90]">Store and share this file securely.</p>
      </section>
    </PortalPage>
  );
}

export { ReportsView as ReportsExport, ReportsView as ReportsExportView };
