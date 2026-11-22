import React, { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ParentLayout from "../components/layouts/ParentLayout";
import { useI18n } from "../i18n";

const DashboardView = lazy(() => import("../components/parent/DashboardView"));
const ChildDetailView = lazy(() => import("../components/parent/ChildDetailView"));
const AlertsView = lazy(() => import("../components/parent/AlertsView"));
const MessagingView = lazy(() => import("../components/parent/MessagingView"));
const ResultsView = lazy(() => import("../components/parent/ResultsView"));
const SettingsView = lazy(() => import("../components/parent/SettingsView"));

function RouteLoader() {
  const { t } = useI18n();
  return (
    <div role="status" aria-live="polite" className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-sm text-stone-500 dark:text-[#A89C90]">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#E7E0D6] border-t-[#881337] dark:border-white/10 dark:border-t-[#FBBF24]" />
      <span>{t("appNavigation.loadingPage")}</span>
    </div>
  );
}

export function ParentRoutes(): React.ReactElement {
  return (
    <ParentLayout>
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          <Route index element={<DashboardView />} />
          <Route path="children" element={<DashboardView viewMode="children" />} />
          <Route path="results" element={<ResultsView />} />
          <Route path="settings" element={<SettingsView />} />
          <Route path="child/:id" element={<ChildDetailView />} />
          <Route path="alerts" element={<AlertsView />} />
          <Route path="messages" element={<MessagingView />} />
          <Route path="*" element={<Navigate to="/parent" replace />} />
        </Routes>
      </Suspense>
    </ParentLayout>
  );
}

export default ParentRoutes;
