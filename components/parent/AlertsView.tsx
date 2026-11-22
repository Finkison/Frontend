import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, ArrowLeft, Bell, CalendarCheck, Check, CheckCheck, Flame, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../../i18n";
import { getApiErrorMessage } from "../../services/api";
import { getParentAlerts, markParentAlertRead, type ParentAlert } from "../../services/parentService";
import PageHeader from "../shared/PageHeader";
import PortalPage from "../shared/PortalPage";

type AlertFilter = "all" | "unread" | "attendance";

export default function AlertsPanel(): React.ReactElement {
  const navigate = useNavigate();
  const { language, t } = useI18n();
  const [alerts, setAlerts] = useState<ParentAlert[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [nextOffset, setNextOffset] = useState<number | null>(null);
  const [filter, setFilter] = useState<AlertFilter>("all");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const loadAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getParentAlerts(0, 20);
      setAlerts(response.data.results || []);
      setUnreadCount(response.data.unread_count || 0);
      setNextOffset(response.data.next_offset ?? null);
    } catch (loadError) {
      setError(getApiErrorMessage(loadError) || t("parentAlerts.loadError"));
    } finally {
      setLoading(false);
    }
  }, [reloadKey, t]);

  useEffect(() => { void loadAlerts(); }, [loadAlerts]);

  const loadMore = async () => {
    if (nextOffset === null || loadingMore) return;
    setLoadingMore(true);
    setError(null);
    try {
      const response = await getParentAlerts(nextOffset, 20);
      setAlerts((current) => {
        const knownIds = new Set(current.map((alert) => alert.id));
        return [...current, ...(response.data.results || []).filter((alert) => !knownIds.has(alert.id))];
      });
      setUnreadCount(response.data.unread_count || 0);
      setNextOffset(response.data.next_offset ?? null);
    } catch (loadError) {
      setError(getApiErrorMessage(loadError) || t("parentAlerts.loadMoreError"));
    } finally {
      setLoadingMore(false);
    }
  };

  const markAsRead = async (alert: ParentAlert) => {
    if (alert.is_read || markingId) return;
    setMarkingId(alert.id);
    setError(null);
    try {
      await markParentAlertRead(alert.id);
      setAlerts((current) => current.map((item) => item.id === alert.id ? { ...item, is_read: true } : item));
      setUnreadCount((count) => Math.max(0, count - 1));
    } catch (markError) {
      setError(getApiErrorMessage(markError) || t("parentAlerts.markReadError"));
    } finally {
      setMarkingId(null);
    }
  };

  const visibleAlerts = useMemo(() => alerts.filter((alert) => {
    if (filter === "unread") return !alert.is_read;
    if (filter === "attendance") return alert.type === "attendance";
    return true;
  }), [alerts, filter]);

  const locale = language === "am" ? "am-ET" : language === "om" ? "om-ET" : "en-ET";
  const formatDate = (value: string) => {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? value : new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(parsed);
  };
  const formatAttendanceMessage = (alert: ParentAlert) => {
    const context = alert.context;
    if (alert.type !== "attendance" || !context?.status || !context.subject || !context.date || !alert.student_name) return alert.message;
    const date = new Date(`${context.date}T12:00:00`);
    const localizedDate = Number.isNaN(date.getTime()) ? context.date : new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(date);
    const status = t(`parentAlerts.attendanceStatuses.${context.status}`, { defaultValue: context.status });
    return t("parentAlerts.attendanceMessage", { name: alert.student_name, subject: context.subject, date: localizedDate, status });
  };
  const alertTypeLabel = (type: string) => {
    const knownTypes: Record<string, string> = {
      attendance: t("parentAlerts.types.attendance"),
      achievement: t("parentAlerts.types.achievement"),
      improvement: t("parentAlerts.types.improvement"),
      reminder: t("parentAlerts.types.reminder"),
    };
    return knownTypes[type] || t("parentAlerts.types.update");
  };

  const filters: Array<{ id: AlertFilter; label: string }> = [
    { id: "all", label: t("parentAlerts.filters.all") },
    { id: "unread", label: t("parentAlerts.filters.unread", { count: unreadCount }) },
    { id: "attendance", label: t("parentAlerts.filters.attendance") },
  ];

  return (
    <PortalPage className="max-w-4xl space-y-6">
      <button type="button" onClick={() => navigate("/parent")} className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#881337] dark:text-[#E7E0D6] dark:hover:bg-white/5 dark:hover:text-[#FDFBF7] dark:focus-visible:ring-[#FBBF24]">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />{t("parentAlerts.back")}
      </button>

      <PageHeader
        title={t("parentAlerts.title")}
        description={t("parentAlerts.description")}
        secondaryActions={[{ label: t("parentAlerts.refresh"), onClick: () => setReloadKey((value) => value + 1), icon: RefreshCw, loading }]}
      >
        <span className="inline-flex rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900 dark:bg-amber-950/35 dark:text-amber-200">{t("parentAlerts.unreadCount", { count: unreadCount })}</span>
      </PageHeader>

      {error && <div role="alert" className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /><span className="flex-1">{error}</span><button type="button" onClick={() => setReloadKey((value) => value + 1)} className="shrink-0 font-semibold underline">{t("parentAlerts.retry")}</button></div>}

      <nav className="flex flex-wrap gap-2" aria-label={t("parentAlerts.filters.label")}>
        {filters.map((item) => <button key={item.id} type="button" aria-pressed={filter === item.id} onClick={() => setFilter(item.id)} className={`min-h-10 rounded-lg px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#881337] dark:focus-visible:ring-[#FBBF24] ${filter === item.id ? "bg-[#881337] text-white dark:bg-[#FBBF24] dark:text-[#1C1512]" : "border border-stone-300 text-stone-700 hover:bg-stone-50 dark:border-white/15 dark:text-[#E7E0D6] dark:hover:bg-white/5"}`}>{item.label}</button>)}
      </nav>

      {loading ? (
        <div role="status" className="space-y-3">{[0, 1, 2].map((item) => <div key={item} className="h-28 animate-pulse rounded-2xl border border-[#E7E0D6] bg-white dark:border-white/10 dark:bg-[#261E1A]" />)}<span className="sr-only">{t("parentAlerts.loading")}</span></div>
      ) : visibleAlerts.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-14 text-center dark:border-white/15 dark:bg-[#261E1A]"><Bell className="mx-auto h-9 w-9 text-stone-300 dark:text-stone-600" aria-hidden="true" /><h2 className="mt-3 font-semibold text-stone-900 dark:text-[#FDFBF7]">{alerts.length ? t("parentAlerts.noFilteredTitle") : t("parentAlerts.emptyTitle")}</h2><p className="mx-auto mt-1 max-w-md text-sm leading-6 text-stone-600 dark:text-[#A89C90]">{alerts.length ? t("parentAlerts.noFilteredDescription") : t("parentAlerts.emptyDescription")}</p></section>
      ) : (
        <section className="space-y-3" aria-label={t("parentAlerts.title")}>
          {visibleAlerts.map((alert) => {
            const isAttendance = alert.type === "attendance";
            const isAchievement = alert.type === "achievement" || alert.type === "improvement";
            const Icon = isAttendance ? CalendarCheck : isAchievement ? Flame : alert.type === "reminder" ? CheckCheck : Bell;
            return (
              <article key={alert.id} className={`rounded-2xl border p-5 transition-colors dark:bg-[#261E1A] ${alert.is_read ? "border-[#E7E0D6] bg-white dark:border-white/10" : "border-[#F3C6A0] bg-[#FFFCF8] dark:border-amber-900/50"}`}>
                <div className="flex items-start gap-4">
                  <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isAttendance ? "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-200" : isAchievement ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/35 dark:text-emerald-200" : "bg-amber-50 text-amber-800 dark:bg-amber-950/35 dark:text-amber-200"}`}><Icon className="h-5 w-5" aria-hidden="true" /></span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-semibold text-stone-700 dark:bg-white/10 dark:text-[#E7E0D6]">{alertTypeLabel(alert.type)}</span>
                      {!alert.is_read && <span className="h-2 w-2 rounded-full bg-[#881337] dark:bg-[#FBBF24]" aria-label={t("parentAlerts.unreadLabel")} />}
                    </div>
                    <h2 className="mt-2 font-semibold leading-6 text-stone-900 dark:text-[#FDFBF7]">{isAttendance ? alertTypeLabel(alert.type) : alert.title || alertTypeLabel(alert.type)}</h2>
                    {alert.student_name && <p className="mt-1 text-xs font-medium text-stone-500 dark:text-[#A89C90]">{t("parentAlerts.studentLabel", { name: alert.student_name })}</p>}
                    <p className="mt-2 text-sm leading-6 text-stone-700 dark:text-[#E7E0D6]">{formatAttendanceMessage(alert)}</p>
                    <time dateTime={alert.created_at} className="mt-3 block text-xs text-stone-500 dark:text-[#A89C90]">{formatDate(alert.created_at)}</time>
                  </div>
                  {!alert.is_read && <button type="button" onClick={() => void markAsRead(alert)} disabled={markingId !== null} className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold text-[#881337] hover:bg-rose-50 disabled:opacity-50 dark:text-[#FBBF24] dark:hover:bg-white/5"><Check className="h-3.5 w-3.5" aria-hidden="true" />{markingId === alert.id ? t("parentAlerts.markingRead") : t("parentAlerts.markRead")}</button>}
                </div>
              </article>
            );
          })}
        </section>
      )}

      {nextOffset !== null && <div className="text-center"><button type="button" onClick={() => void loadMore()} disabled={loadingMore || loading} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-stone-300 px-5 text-sm font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-50 dark:border-white/15 dark:text-[#E7E0D6] dark:hover:bg-white/5">{loadingMore && <RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" />}{loadingMore ? t("parentAlerts.loadingMore") : t("parentAlerts.loadMore")}</button></div>}
    </PortalPage>
  );
}
