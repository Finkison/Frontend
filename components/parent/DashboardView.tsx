import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getChildren, linkChild, getParentAlerts, type ParentAlert, type ParentChildSummary } from "../../services/parentService";
import { 
  TrendingUp, 
  UserPlus,
  Bell,
  ClipboardList
} from "lucide-react";
import Button from "../ui/Button";
import PageHeader from "../shared/PageHeader";
import PortalPage from "../shared/PortalPage";
import Modal from "../ui/Modal";
import { useI18n } from "../../i18n";

type ParentDashboardMode = "overview" | "children";

export default function ParentDashboard({ viewMode = "overview" }: { viewMode?: ParentDashboardMode }): React.ReactElement {
  const { t, language } = useI18n();
  const navigate = useNavigate();
  const [children, setChildren] = useState<ParentChildSummary[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>("");
  const [alerts, setAlerts] = useState<ParentAlert[]>([]);
  const [alertsError, setAlertsError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [refreshNonce, setRefreshNonce] = useState(0);

  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkInput, setLinkInput] = useState("");
  const [linking, setLinking] = useState(false);
  const [linkMsg, setLinkMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleLinkChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkInput.trim()) return;
    setLinking(true);
    setLinkMsg(null);
    try {
      const res = await linkChild({ student_id: linkInput.trim() });
      if (res.data?.success) {
        setLinkMsg({ type: "success", text: t("parentDashboard.linkSuccess") });
        setTimeout(() => {
          setShowLinkModal(false);
          setLinkInput("");
          setLinkMsg(null);
          getChildren().then((r) => setChildren(r.data || [])).catch(() => setLoadError(true));
        }, 1200);
      } else {
        setLinkMsg({ type: "error", text: res.data?.message || t("parentDashboard.studentNotFound") });
      }
    } catch (err: any) {
      setLinkMsg({ type: "error", text: err?.response?.data?.message || t("parentDashboard.linkError") });
    } finally {
      setLinking(false);
    }
  };

  useEffect(() => {
    Promise.allSettled([
      getChildren(),
      getParentAlerts()
    ]).then(([childRes, alertRes]) => {
      if (childRes.status === "fulfilled" && Array.isArray(childRes.value.data)) {
        setChildren(childRes.value.data);
      } else {
        setChildren([]);
        setLoadError(true);
      }
      if (alertRes.status === "fulfilled") {
        const payload = alertRes.value.data;
        const alertItems = Array.isArray(payload) ? payload : Array.isArray(payload?.results) ? payload.results : null;
        if (alertItems) {
          setAlerts(alertItems);
          setAlertsError(false);
        } else {
          setAlerts([]);
          setAlertsError(true);
        }
      } else {
        setAlerts([]);
        setAlertsError(true);
      }
    }).finally(() => setLoading(false));
  }, [refreshNonce]);

  const activeChild = children.find((child) => String(child.id) === selectedChildId) || children[0] || null;
  const unreadAlertsCount = alerts.filter((a) => !a.is_read).length;
  const dateLocale = language === "am" ? "am-ET" : language === "om" ? "om-ET" : "en-ET";
  const formatAlertDate = (value: string) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat(dateLocale, { dateStyle: "medium" }).format(date);
  };
  const alertTypeKeys: Record<string, string> = {
    attendance: "attendance",
    achievement: "achievement",
    improvement: "improvement",
    reminder: "reminder",
    update: "update",
  };

  return (
    <PortalPage>

      <PageHeader
        eyebrow={viewMode === "children" ? t("parentDashboard.childrenEyebrow") : t("parentDashboard.eyebrow")}
        title={viewMode === "children" ? t("parentDashboard.childrenTitle") : t("parentDashboard.title")}
        description={viewMode === "children" ? t("parentDashboard.childrenDescription") : t("parentDashboard.description")}
        primaryAction={{ label: t("parentDashboard.linkStudent"), onClick: () => setShowLinkModal(true), icon: UserPlus }}
        secondaryActions={[{ label: t("parentDashboard.refresh"), onClick: () => { setLoading(true); setRefreshNonce((value) => value + 1); }, loading }]}
      />

      {loading ? (
        <div role="status" className="rounded-2xl border border-[#E7E0D6] bg-white p-10 text-center text-sm text-stone-500 dark:border-white/10 dark:bg-[#261E1A] dark:text-[#A89C90]">{t("parentDashboard.loading")}</div>
      ) : loadError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center dark:border-rose-900/40 dark:bg-rose-950/20">
          <p role="alert" className="text-sm text-rose-800 dark:text-rose-200">{t("parentDashboard.loadError")}</p>
          <button type="button" onClick={() => { setLoading(true); setRefreshNonce((value) => value + 1); }} disabled={loading} className="mt-3 min-h-10 rounded-lg border border-rose-300 px-4 text-sm font-semibold text-rose-900 hover:bg-rose-100 disabled:opacity-60 dark:text-rose-200">{t("parentDashboard.tryAgain")}</button>
        </div>
      ) : !activeChild ? (
        <div className="rounded-2xl border border-[#E7E0D6] dark:border-white/10 bg-white dark:bg-[#261E1A] p-12 text-center space-y-3 shadow-xs">
          <UserPlus className="w-10 h-10 text-stone-300 mx-auto" />
          <h2 className="text-base font-semibold text-stone-900 dark:text-[#FDFBF7]">{t("parentDashboard.noStudentsTitle")}</h2>
          <p className="text-xs text-stone-500 dark:text-[#A89C90] max-w-sm mx-auto">
            {t("parentDashboard.noStudentsDescription")}
          </p>
          <Button
            onClick={() => setShowLinkModal(true)}
            variant="primary"
            size="sm"
            className="mt-2"
          >
            {t("parentDashboard.linkStudent")}
          </Button>
        </div>
      ) : (
      <>

      {viewMode === "overview" && children.length > 1 && activeChild && (
        <div className="flex flex-col gap-2 rounded-xl border border-[#E7E0D6] bg-white p-4 dark:border-white/10 dark:bg-[#261E1A] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <label htmlFor="parent-child-selector" className="text-sm font-semibold text-stone-900 dark:text-[#FDFBF7]">{t("parentDashboard.viewingProgress")}</label>
            <p className="mt-0.5 text-xs text-stone-500 dark:text-[#A89C90]">{t("parentDashboard.selectStudent")}</p>
          </div>
          <select
            id="parent-child-selector"
            value={String(activeChild.id)}
            onChange={(event) => setSelectedChildId(event.target.value)}
            className="min-h-11 min-w-52 rounded-lg border border-stone-300 bg-white px-3 text-sm font-medium text-stone-800 focus:border-[#881337] focus:outline-none focus:ring-2 focus:ring-[#881337]/20 dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]"
          >
            {children.map((child) => <option key={child.id} value={String(child.id)}>{child.user__full_name || child.name || t("parentDashboard.studentFallback")}</option>)}
          </select>
        </div>
      )}

      {viewMode === "overview" && <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" role="region" aria-label={t("parentDashboard.summaryRegion")}>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#261E1A] border border-[#E7E0D6] dark:border-white/10 shadow-xs hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-[#A89C90]">
            <span>{t("parentDashboard.latestExamScore")}</span>
            <TrendingUp className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-semibold text-emerald-700 tabular-nums font-mono">
            {activeChild.latest_exam_score !== null && activeChild.latest_exam_score !== undefined ? (
              <>{activeChild.latest_exam_score}{activeChild.latest_exam_max_score ? <span className="text-xs font-normal text-stone-400 dark:text-[#A89C90] font-sans"> / {activeChild.latest_exam_max_score}</span> : null}</>
            ) : (
              <span className="text-base text-stone-400 dark:text-[#A89C90] font-normal font-sans">{t("parentDashboard.noExamYet")}</span>
            )}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#261E1A] border border-[#E7E0D6] dark:border-white/10 shadow-xs hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-[#A89C90]">
            <span>{t("parentDashboard.pendingClasswork")}</span>
            <ClipboardList className="w-4 h-4 text-stone-400 dark:text-[#A89C90]" />
          </div>
          <div className="text-2xl font-semibold text-stone-900 dark:text-[#FDFBF7] tabular-nums font-mono">
            {activeChild.pending_classwork_count ?? 0}
          </div>
          <span className="text-[11px] text-stone-500 dark:text-[#A89C90] block">
            {t("parentDashboard.fromSchool")}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#261E1A] border border-[#E7E0D6] dark:border-white/10 shadow-xs hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-[#A89C90]">
            <span>{t("parentDashboard.unreadNotices")}</span>
            <Bell className="w-4 h-4 text-stone-400 dark:text-[#A89C90]" />
          </div>
          <div className="text-2xl font-semibold text-stone-900 dark:text-[#FDFBF7] tabular-nums font-mono">
            {alertsError ? t("parentDashboard.unavailable") : unreadAlertsCount}
          </div>
          <span className="text-[11px] text-stone-500 dark:text-[#A89C90] block">
            {t("parentDashboard.fromSchool")}
          </span>
        </div>

      </div>

      <div className="rounded-2xl bg-white dark:bg-[#261E1A] border border-[#E7E0D6] dark:border-white/10 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-white/10 pb-3">
          <div>
            <h2 className="text-base font-semibold text-stone-900 dark:text-[#FDFBF7]">
              {t("parentDashboard.noticesTitle")}
            </h2>
            <p className="text-xs text-stone-500 dark:text-[#A89C90] mt-0.5">
              {t("parentDashboard.noticesDescription")}
            </p>
          </div>
          <span className="text-xs font-mono tabular-nums text-stone-500 dark:text-[#A89C90]">
            {alertsError ? t("parentDashboard.unavailable") : t("parentDashboard.recentCount", { count: alerts.length })}
          </span>
        </div>

        {alertsError ? (
          <div role="alert" className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 sm:flex-row sm:items-center sm:justify-between"><p>{t("parentDashboard.noticesLoadError")}</p><button type="button" onClick={() => { setLoading(true); setRefreshNonce((value) => value + 1); }} disabled={loading} className="min-h-9 self-start rounded-lg border border-rose-300 px-3 text-xs font-semibold hover:bg-rose-100 disabled:opacity-60 sm:self-auto">{t("parentDashboard.tryAgain")}</button></div>
        ) : alerts.length === 0 ? (
          <div className="p-8 text-center text-xs text-stone-400 dark:text-[#A89C90]">
            {t("parentDashboard.noNotices")}
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="p-4 rounded-xl border border-[#E7E0D6] dark:border-white/10 bg-[#FAF8F5]/50 dark:bg-[#1C1512]/50 hover:bg-[#FAF8F5] dark:hover:bg-white/5 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {alert.type ? t(`parentAlerts.types.${alertTypeKeys[alert.type.toLowerCase()] || "update"}`) : t("parentDashboard.defaultNoticeType")}
                    </span>
                    {alert.created_at && <span className="text-xs text-stone-500 dark:text-[#A89C90]">{formatAlertDate(alert.created_at)}</span>}
                  </div>
                  <h3 className="text-sm font-semibold text-stone-900 dark:text-[#FDFBF7]">
                    {alert.title}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-[#E7E0D6]">
                    {alert.message}
                  </p>
                </div>
                <Button
                  onClick={() => navigate("/parent/messages")}
                  variant="outline"
                  size="sm"
                  className="shrink-0"
                >
                  {t("parentDashboard.messageSchool")}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      </>}

      <div className="rounded-2xl bg-white dark:bg-[#261E1A] border border-[#E7E0D6] dark:border-white/10 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-white/10 pb-3">
          <div>
            <h2 className="text-base font-semibold text-stone-900 dark:text-[#FDFBF7]">
              {t("parentDashboard.linkedStudents")}
            </h2>
          </div>
          <span className="text-xs font-mono tabular-nums text-stone-500 dark:text-[#A89C90]">
            {t("parentDashboard.linkedCount", { count: children.length })}
          </span>
        </div>

        {children.length === 0 ? (
          <div className="text-center py-8 text-xs text-stone-500 dark:text-[#A89C90]">
            {t("parentDashboard.emptyLinkedStudents")}
          </div>
        ) : (
          <div className="space-y-3">
            {children.map((c) => {
              const latestExamScore = c.latest_exam_score;
              const latestExamMaxScore = c.latest_exam_max_score;
              const targetScore = c.target_score;
              const gradeLabel = c.grade_display || (c.grade ? t("parentDashboard.grade", { grade: c.grade }) : "");
              const studentMeta = [gradeLabel, c.stream].filter(Boolean).join(" · ");
              const schoolMeta = [c.school, c.region].filter(Boolean).join(" · ");

              return (
                <div
                  key={c.id}
                  className="p-5 rounded-xl border border-[#E7E0D6] dark:border-white/10 bg-white dark:bg-[#261E1A] hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-stone-900 dark:text-[#FDFBF7]">
                        {c.user__full_name || c.name || t("parentDashboard.studentFallback")}
                      </h3>
{studentMeta && <span className="rounded border border-stone-200 bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-700 dark:border-white/10 dark:bg-[#201815] dark:text-[#E7E0D6]">{studentMeta}</span>}
                    </div>
{schoolMeta && <p className="text-xs text-stone-500 dark:text-[#A89C90]">{schoolMeta}</p>}
                    <div className="flex flex-wrap items-center gap-4 pt-2 text-xs">
                      <div>
                        <span className="text-stone-500 dark:text-[#A89C90]">{t("parentDashboard.latestExamShort")}: </span>
                        <span className="font-semibold text-emerald-700 tabular-nums font-mono">
                          {latestExamScore !== null && latestExamScore !== undefined ? `${latestExamScore}${latestExamMaxScore ? ` / ${latestExamMaxScore}` : ""}` : t("parentDashboard.noExamYet")}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-500 dark:text-[#A89C90]">{t("parentDashboard.goal")}: </span>
                        <span className="font-semibold text-stone-900 dark:text-[#FDFBF7] tabular-nums font-mono">
                          {targetScore || t("parentDashboard.notSet")}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-500 dark:text-[#A89C90]">{t("parentDashboard.pendingClasswork")}: </span>
                        <span className="font-semibold text-stone-900 dark:text-[#FDFBF7] tabular-nums font-mono">
                          {c.pending_classwork_count ?? 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col gap-2 shrink-0">
                    <Button
                      onClick={() => navigate(`/parent/child/${c.id}`)}
                      variant="primary"
                      size="sm"
                      className="w-full text-center"
                    >
                      {t("parentDashboard.viewProfile")}
                    </Button>
                    <Button
                      onClick={() => navigate("/parent/messages")}
                      variant="outline"
                      size="sm"
                      className="w-full text-center"
                    >
                      {t("parentDashboard.messageSchool")}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal
        isOpen={showLinkModal}
        onClose={() => {
          setShowLinkModal(false);
          setLinkMsg(null);
        }}
        title={t("parentDashboard.linkStudent")}
        description={t("parentDashboard.linkDialogDescription")}
        maxWidth="sm"
        footer={(
          <>
            <Button type="button" variant="outline" size="sm" onClick={() => setShowLinkModal(false)}>
              {t("parentDashboard.cancel")}
            </Button>
            <Button type="submit" form="link-student-form" variant="primary" size="sm" isLoading={linking} loadingText={t("parentDashboard.checking")}>
              {t("parentDashboard.linkStudent")}
            </Button>
          </>
        )}
      >
        {linkMsg && (
          <div role={linkMsg.type === "error" ? "alert" : "status"} className={`p-2.5 rounded-md text-xs border ${
            linkMsg.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}>
            {linkMsg.text}
          </div>
        )}
        <form id="link-student-form" onSubmit={handleLinkChild} className="space-y-3">
          <label htmlFor="link-student-identifier" className="block text-xs font-medium text-stone-700 dark:text-[#E7E0D6]">
            {t("parentDashboard.studentIdentifier")}
            <input
              type="text"
              id="link-student-identifier"
              required
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              placeholder={t("parentDashboard.identifierPlaceholder")}
              className="mt-1 w-full px-3 py-2 rounded-md border border-stone-300 dark:border-white/20 text-sm font-mono focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 outline-none"
            />
          </label>
        </form>
      </Modal>

      </>
      )}

    </PortalPage>
  );
}
