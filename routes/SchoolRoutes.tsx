import React, { Suspense, lazy } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import SchoolLayout from "../components/layouts/SchoolLayout";
import { useI18n } from "../i18n";

const DashboardView = lazy(() => import("../components/school/DashboardView"));
const PeopleView = lazy(() => import("../components/school/PeopleView"));
const SectionsView = lazy(() => import("../components/school/SectionsView"));
const AssignmentsView = lazy(() => import("../components/school/AssignmentsView"));
const ReportsView = lazy(() => import("../components/school/ReportsView"));
const MessagesView = lazy(() => import("../components/school/MessagesView"));
const BillingView = lazy(() => import("../components/school/BillingView"));
const SettingsView = lazy(() => import("../components/school/SettingsView"));
const AuditLogView = lazy(() => import("../components/school/AuditLogView"));
const SecurityView = lazy(() => import("../components/school/SecurityView"));
const StudentJoinRequestsView = lazy(() => import("../components/school/StudentJoinRequestsView"));
const ClassScheduleView = lazy(() => import("../components/shared/ClassScheduleView"));

function RouteLoader() {
  const { t } = useI18n();
  return (
    <div role="status" aria-live="polite" className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-sm text-stone-500 dark:text-[#A89C90]">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#E7E0D6] border-t-[#881337] dark:border-white/10 dark:border-t-[#FBBF24]" />
      <span>{t("appNavigation.loadingPage")}</span>
    </div>
  );
}

export function SchoolRoutes(): React.ReactElement {
  return (
    <SchoolLayout>
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          <Route index element={<DashboardView />} />
          <Route path="people" element={<PeopleView />} />
          <Route path="sections" element={<SectionsView />} />
          <Route path="assignments" element={<AssignmentsView />} />
          <Route path="reports" element={<ReportsView />} />
          <Route path="join-requests" element={<StudentJoinRequestsView />} />
          <Route path="schedule" element={<ClassScheduleView />} />
          <Route path="messages" element={<MessagesView />} />
          <Route path="billing" element={<BillingView />} />
          <Route path="settings" element={<SettingsView />} />
          <Route path="audit-log" element={<AuditLogView />} />
          <Route path="security" element={<SecurityView />} />

          <Route path="class" element={<Navigate to="sections" replace />} />
          <Route path="students" element={<Navigate to="people" replace />} />
          <Route path="teachers" element={<Navigate to="people" replace />} />
          <Route path="*" element={<Navigate to="/school" replace />} />
        </Routes>
      </Suspense>
    </SchoolLayout>
  );
}

export default SchoolRoutes;
