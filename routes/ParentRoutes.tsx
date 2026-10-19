import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import ParentLayout from "../components/layouts/ParentLayout";

const DashboardView = lazy(() => import("../components/parent/DashboardView"));
const ChildDetailView = lazy(() => import("../components/parent/ChildDetailView"));
const AlertsView = lazy(() => import("../components/parent/AlertsView"));
const MessagingView = lazy(() => import("../components/parent/MessagingView"));

function RouteLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="w-8 h-8 border-3 border-slate-200 border-t-amber-500 rounded-full animate-spin" />
    </div>
  );
}

export function ParentRoutes(): React.ReactElement {
  return (
    <ParentLayout>
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          <Route index element={<DashboardView />} />
          <Route path="child/:id" element={<ChildDetailView />} />
          <Route path="alerts" element={<AlertsView />} />
          <Route path="messages" element={<MessagingView />} />
        </Routes>
      </Suspense>
    </ParentLayout>
  );
}

export default ParentRoutes;
