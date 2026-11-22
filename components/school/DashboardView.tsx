import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  FileSpreadsheet,
  Layers,
  Mail,
  RefreshCw,
  Users,
  UserRoundCheck,
} from "lucide-react";
import {
  getAssignmentMatrix,
  getClassrooms,
  getInvitations,
  getSchoolAnalytics,
  getSchoolProfile,
  getTeachers,
} from "../../services/schoolService";
import PageHeader from "../shared/PageHeader";
import PortalPage from "../shared/PortalPage";
import { useI18n } from "../../i18n";

interface OverviewData {
  schoolName: string | null;
  academicYear: string | null;
  students: number | null;
  sections: number | null;
  teachers: number | null;
  pendingInvitations: number | null;
  unassignedSubjects: number | null;
  classworkPendingReview: number | null;
}

const emptyOverview: OverviewData = {
  schoolName: null,
  academicYear: null,
  students: null,
  sections: null,
  teachers: null,
  pendingInvitations: null,
  unassignedSubjects: null,
  classworkPendingReview: null,
};

export default function SchoolDashboard(): React.ReactElement {
  const { t, language } = useI18n();
  const navigate = useNavigate();
  const [overview, setOverview] = useState<OverviewData>(emptyOverview);
  const [loading, setLoading] = useState(true);
  const [hasLoadError, setHasLoadError] = useState(false);

  const loadOverview = useCallback(async () => {
    setLoading(true);
    const [profileResult, analyticsResult, classroomsResult, teachersResult, invitationsResult, assignmentsResult] =
      await Promise.allSettled([
        getSchoolProfile(),
        getSchoolAnalytics(),
        getClassrooms(),
        getTeachers(),
        getInvitations(),
        getAssignmentMatrix(),
      ]);

    const profile = profileResult.status === "fulfilled" ? profileResult.value.data : null;
    const analytics = analyticsResult.status === "fulfilled" ? analyticsResult.value.data : null;
    const classroomsResponse = classroomsResult.status === "fulfilled" ? classroomsResult.value.data : null;
    const teachersResponse = teachersResult.status === "fulfilled" ? teachersResult.value.data : null;
    const invitationsResponse = invitationsResult.status === "fulfilled" ? invitationsResult.value.data : null;
    const assignments = assignmentsResult.status === "fulfilled" ? assignmentsResult.value.data : null;
    const classrooms = Array.isArray(classroomsResponse)
      ? classroomsResponse
      : Array.isArray(classroomsResponse?.data)
        ? classroomsResponse.data
        : null;
    const teachers = Array.isArray(teachersResponse)
      ? teachersResponse
      : Array.isArray(teachersResponse?.data)
        ? teachersResponse.data
        : null;
    const invitations = Array.isArray(invitationsResponse?.invitations)
      ? invitationsResponse.invitations
      : null;

    setOverview({
      schoolName: profile?.name || analytics?.school_name || null,
      academicYear: profile?.academic_year || null,
      students: typeof analytics?.total_students === "number" ? analytics.total_students : null,
      sections: classrooms?.length ?? null,
      teachers: teachers?.length ?? null,
      pendingInvitations: invitations
        ? invitations.filter((invitation: any) => invitation.status === "pending").length
        : null,
      unassignedSubjects:
        typeof assignments?.unassigned_subjects_count === "number"
          ? assignments.unassigned_subjects_count
          : null,
      classworkPendingReview: typeof analytics?.classwork_pending_review_count === "number"
        ? analytics.classwork_pending_review_count
        : null,
    });
    setHasLoadError(
      [profileResult, analyticsResult, classroomsResult, teachersResult, invitationsResult, assignmentsResult].some(
        (result) => result.status === "rejected",
      ),
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadOverview();
  }, [loadOverview]);

  const locale = language === "am" ? "am-ET" : language === "om" ? "om-ET" : "en-ET";
  const numberFormat = new Intl.NumberFormat(locale);
  const formatCount = (
    key:
      | "schoolDashboard.openItems"
      | "schoolDashboard.invitationTitle"
      | "schoolDashboard.unassignedTitle"
      | "schoolDashboard.classworkTitle",
    count: number,
  ) => t(key).replace("{{count}}", numberFormat.format(count));
  const metrics = [
    { label: t("schoolDashboard.metrics.students"), value: overview.students, icon: Users, action: () => navigate("people") },
    { label: t("schoolDashboard.metrics.classes"), value: overview.sections, icon: Layers, action: () => navigate("sections") },
    { label: t("schoolDashboard.metrics.teachers"), value: overview.teachers, icon: UserRoundCheck, action: () => navigate("people") },
    { label: t("schoolDashboard.metrics.pendingInvitations"), value: overview.pendingInvitations, icon: Mail, action: () => navigate("people") },
  ];

  const pendingInvitations = overview.pendingInvitations ?? 0;
  const unassignedSubjects = overview.unassignedSubjects ?? 0;
  const classworkPendingReview = overview.classworkPendingReview ?? 0;
  const hasActionItems = pendingInvitations > 0 || unassignedSubjects > 0 || classworkPendingReview > 0;
  const setupSteps = [
    { id: "classes", done: (overview.sections ?? 0) > 0, label: t("schoolDashboard.setupClasses"), href: "/school/sections" },
    { id: "teachers", done: (overview.teachers ?? 0) > 0 || pendingInvitations > 0, label: t("schoolDashboard.setupTeachers"), href: "/school/people" },
    { id: "assignments", done: (overview.sections ?? 0) > 0 && unassignedSubjects === 0, label: t("schoolDashboard.setupAssignments"), href: "/school/assignments" },
  ];
  const showSetupGuide = !loading && !hasLoadError && setupSteps.some((step) => !step.done);

  return (
    <PortalPage>
      <PageHeader
        eyebrow={t("schoolDashboard.eyebrow")}
        title={overview.schoolName || t("schoolDashboard.title")}
        description={t("schoolDashboard.description")}
        badge={overview.academicYear ? { text: overview.academicYear, variant: "neutral" } : undefined}
        secondaryActions={[{ label: t("schoolDashboard.reports"), href: "/school/reports", icon: FileSpreadsheet }]}
        primaryAction={{ label: t("schoolDashboard.managePeople"), href: "/school/people", icon: Users }}
      />

      {hasLoadError && (
        <div role="alert" className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950 sm:flex-row sm:items-center sm:justify-between">
          <p>{t("schoolDashboard.partialLoadError")}</p>
          <button
            type="button"
            onClick={() => void loadOverview()}
            disabled={loading}
            className="inline-flex min-h-9 items-center gap-2 self-start rounded-lg border border-amber-300 bg-white dark:bg-[#261E1A] px-3 py-1.5 font-semibold hover:bg-amber-100 disabled:cursor-wait disabled:opacity-60 sm:self-auto"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} aria-hidden="true" />
            {t("schoolDashboard.tryAgain")}
          </button>
        </div>
      )}

      <section aria-label={t("schoolDashboard.metricsLabel")} className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, icon: Icon, action }) => (
          <button
            key={label}
            type="button"
            onClick={action}
            className="group rounded-xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#261E1A] p-5 text-left shadow-xs transition-colors hover:border-[#881337]/35 focus:outline-none focus:ring-2 focus:ring-[#881337]"
          >
            <span className="flex items-center justify-between text-sm font-medium text-stone-600 dark:text-[#E7E0D6]">
              {label}
              <Icon className="h-4 w-4 text-[#881337]" aria-hidden="true" />
            </span>
            <span className="mt-3 block text-3xl font-semibold tabular-nums text-[#261E1A] dark:text-[#FDFBF7]">
              {loading && value === null ? "…" : value === null ? "—" : numberFormat.format(value)}
            </span>
            <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#881337]">
              {t("schoolDashboard.viewDetails")}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </span>
          </button>
        ))}
      </section>

      {showSetupGuide && <section className="rounded-xl border border-[#E7E0D6] bg-[#FAF8F5] p-5 dark:border-white/10 dark:bg-[#261E1A]" aria-labelledby="school-setup-heading">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#881337] dark:text-[#FBBF24]">{t("schoolDashboard.setupEyebrow")}</p>
            <h2 id="school-setup-heading" className="mt-1 text-base font-semibold text-stone-900 dark:text-[#FDFBF7]">{t("schoolDashboard.setupTitle")}</h2>
            <p className="mt-1 text-sm text-stone-600 dark:text-[#E7E0D6]">{t("schoolDashboard.setupDescription")}</p>
          </div>
          <span className="text-xs font-medium text-stone-500 dark:text-[#A89C90]">{t("schoolDashboard.setupProgress", { done: setupSteps.filter((step) => step.done).length, total: setupSteps.length })}</span>
        </div>
        <ol className="mt-4 grid gap-3 md:grid-cols-3">
          {setupSteps.map((step, index) => <li key={step.id} className="flex min-w-0 items-start gap-3 rounded-lg border border-stone-200 bg-white p-4 dark:border-white/10 dark:bg-[#1C1512]">
            <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${step.done ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200" : "bg-stone-100 text-stone-700 dark:bg-white/10 dark:text-[#E7E0D6]"}`} aria-label={step.done ? t("schoolDashboard.setupComplete") : t("schoolDashboard.setupStep", { number: index + 1 })}>
              {step.done ? <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> : index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-stone-800 dark:text-[#FDFBF7]">{step.label}</p>
              <Link to={step.href} className="mt-2 inline-flex min-h-8 items-center gap-1 text-xs font-semibold text-[#881337] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#881337] dark:text-[#FBBF24]">{step.done ? t("schoolDashboard.setupReview") : t("schoolDashboard.setupAction")}<ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></Link>
            </div>
          </li>)}
        </ol>
      </section>}

      <section className="overflow-hidden rounded-xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#261E1A] shadow-xs" aria-labelledby="admin-tasks-heading">
        <div className="flex flex-col gap-2 border-b border-stone-200 dark:border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 id="admin-tasks-heading" className="text-base font-semibold text-[#261E1A] dark:text-[#FDFBF7]">{t("schoolDashboard.attentionTitle")}</h2>
            <p className="mt-1 text-sm text-stone-600 dark:text-[#E7E0D6]">{t("schoolDashboard.attentionDescription")}</p>
          </div>
          {overview.pendingInvitations === null || overview.unassignedSubjects === null || overview.classworkPendingReview === null ? (
            <span className="text-xs text-stone-500 dark:text-[#A89C90]">{t("schoolDashboard.countsUnavailable")}</span>
          ) : hasActionItems ? (
            <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-900">
              {formatCount("schoolDashboard.openItems", pendingInvitations + unassignedSubjects + classworkPendingReview)}
            </span>
          ) : (
            <span className="text-xs font-medium text-emerald-700">{t("schoolDashboard.allCaughtUp")}</span>
          )}
        </div>

        {hasActionItems ? (
          <ul className="divide-y divide-stone-100">
            {pendingInvitations > 0 && (
              <li className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-[#261E1A] dark:text-[#FDFBF7]">
                    {formatCount("schoolDashboard.invitationTitle", pendingInvitations)}
                  </h3>
                  <p className="mt-1 text-sm text-stone-600 dark:text-[#E7E0D6]">{t("schoolDashboard.invitationDescription")}</p>
                </div>
                <button type="button" onClick={() => navigate("people")} className="inline-flex min-h-9 items-center gap-1 self-start rounded-lg border border-stone-300 dark:border-white/20 px-3 py-1.5 text-sm font-semibold text-stone-700 dark:text-[#E7E0D6] hover:bg-stone-50 dark:hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-[#881337] sm:self-auto">
                  {t("schoolDashboard.manageInvitations")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </li>
            )}
            {unassignedSubjects > 0 && (
              <li className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-[#261E1A] dark:text-[#FDFBF7]">
                    {formatCount("schoolDashboard.unassignedTitle", unassignedSubjects)}
                  </h3>
                  <p className="mt-1 text-sm text-stone-600 dark:text-[#E7E0D6]">{t("schoolDashboard.unassignedDescription")}</p>
                </div>
                <button type="button" onClick={() => navigate("assignments")} className="inline-flex min-h-9 items-center gap-1 self-start rounded-lg border border-stone-300 dark:border-white/20 px-3 py-1.5 text-sm font-semibold text-stone-700 dark:text-[#E7E0D6] hover:bg-stone-50 dark:hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-[#881337] sm:self-auto">
                  {t("schoolDashboard.assignTeachers")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </li>
            )}
            {classworkPendingReview > 0 && (
              <li className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-[#261E1A] dark:text-[#FDFBF7]">
                    {formatCount("schoolDashboard.classworkTitle", classworkPendingReview)}
                  </h3>
                  <p className="mt-1 text-sm text-stone-600 dark:text-[#E7E0D6]">{t("schoolDashboard.classworkDescription")}</p>
                </div>
                <button type="button" onClick={() => navigate("reports")} className="inline-flex min-h-9 items-center gap-1 self-start rounded-lg border border-stone-300 dark:border-white/20 px-3 py-1.5 text-sm font-semibold text-stone-700 dark:text-[#E7E0D6] hover:bg-stone-50 dark:hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-[#881337] sm:self-auto">
                  {t("schoolDashboard.viewReports")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </li>
            )}
          </ul>
        ) : overview.pendingInvitations === 0 && overview.unassignedSubjects === 0 && overview.classworkPendingReview === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-stone-600 dark:text-[#E7E0D6]">{t("schoolDashboard.noActionItems")}</p>
        ) : (
          <p className="px-5 py-8 text-center text-sm text-stone-600 dark:text-[#E7E0D6]">{t("schoolDashboard.actionItemsUnavailable")}</p>
        )}
      </section>
    </PortalPage>
  );
}
