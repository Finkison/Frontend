import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import ParentLayout from "../components/layouts/ParentLayout";

const ParentDashboard = lazy(() => import("../components/parent/ParentDashboard"));
const ChildDetailView = lazy(() => import("../components/parent/ChildDetailView"));
const AlertsPanel = lazy(() => import("../components/parent/AlertsPanel"));
const TeacherMessaging = lazy(() => import("../components/parent/TeacherMessaging"));

function RouteLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="w-8 h-8 border-3 border-slate-200 border-t-amber-500 rounded-full animate-spin" />
    </div>
  );
}

export default function ParentRoutes() {
  return (
    <ParentLayout>
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          <Route index element={<ParentDashboard />} />
          <Route path="child/:id" element={<ChildDetailView />} />
          <Route path="alerts" element={<AlertsPanel />} />
          <Route path="messages" element={<TeacherMessaging />} />
        </Routes>
      </Suspense>
    </ParentLayout>
  );
}
