import React, { Suspense, lazy } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import SchoolLayout from "../components/layouts/SchoolLayout";

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

function RouteLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-slate-200 border-t-[#881337] rounded-full animate-spin" />
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
          <Route path="messages" element={<MessagesView />} />
          <Route path="billing" element={<BillingView />} />
          <Route path="settings" element={<SettingsView />} />
          <Route path="audit-log" element={<AuditLogView />} />
          <Route path="security" element={<SecurityView />} />

          {/* Legacy route redirects */}
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
