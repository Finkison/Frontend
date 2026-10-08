import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import SchoolLayout from "../components/layouts/SchoolLayout";

const SchoolDashboard = lazy(() => import("../components/school/SchoolDashboard"));
const ClassView = lazy(() => import("../components/school/ClassView"));
const StudentTable = lazy(() => import("../components/school/StudentTable"));
const TeacherPortal = lazy(() => import("../components/school/TeacherPortal"));
const ReportsExport = lazy(() => import("../components/school/ReportsExport"));
const SchoolSettings = lazy(() => import("../components/school/SchoolSettings"));
const LiveProctorConsole = lazy(() => import("../components/school/LiveProctorConsole"));

function RouteLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="w-8 h-8 border-3 border-slate-200 border-t-amber-500 rounded-full animate-spin" />
    </div>
  );
}

export default function SchoolRoutes() {
  return (
    <SchoolLayout>
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          <Route index element={<SchoolDashboard />} />
          <Route path="class" element={<ClassView />} />
          <Route path="students" element={<StudentTable />} />
          <Route path="teachers" element={<TeacherPortal />} />
          <Route path="proctor" element={<LiveProctorConsole />} />
          <Route path="reports" element={<ReportsExport />} />
          <Route path="settings" element={<SchoolSettings />} />
        </Routes>
      </Suspense>
    </SchoolLayout>
  );
}
