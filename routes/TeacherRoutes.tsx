import React, { Suspense, lazy } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import TeacherLayout from "../components/layouts/TeacherLayout";

const DashboardView = lazy(() => import("../components/teacher/DashboardView"));
const AssignedSectionsView = lazy(() => import("../components/teacher/AssignedSectionsView"));
const LessonsView = lazy(() => import("../components/teacher/LessonsView"));
const ExamsView = lazy(() => import("../components/teacher/ExamsView"));
const TasksView = lazy(() => import("../components/teacher/TasksView"));
const QuestionBankView = lazy(() => import("../components/teacher/QuestionBankView"));
const AIAssistantView = lazy(() => import("../components/teacher/AIAssistantView"));
const GradebookView = lazy(() => import("../components/teacher/GradebookView"));
const AttendanceView = lazy(() => import("../components/teacher/AttendanceView"));
const PastPapersView = lazy(() => import("../components/teacher/PastPapersView"));
const MessagesView = lazy(() => import("../components/teacher/MessagesView"));
const SecurityView = lazy(() => import("../components/school/SecurityView"));

function RouteLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-slate-200 border-t-[#1D4ED8] rounded-full animate-spin" />
    </div>
  );
}

export function TeacherRoutes(): React.ReactElement {
  return (
    <TeacherLayout>
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          <Route index element={<DashboardView />} />
          <Route path="sections" element={<AssignedSectionsView />} />
          <Route path="lessons" element={<LessonsView />} />
          <Route path="exams" element={<ExamsView />} />
          <Route path="tasks" element={<TasksView />} />
          <Route path="question-bank" element={<QuestionBankView />} />
          <Route path="ai-assistant" element={<AIAssistantView />} />
          <Route path="gradebook" element={<GradebookView />} />
          <Route path="attendance" element={<AttendanceView />} />
          <Route path="past-papers" element={<PastPapersView />} />
          <Route path="messages" element={<MessagesView />} />
          <Route path="security" element={<SecurityView />} />
          <Route path="*" element={<Navigate to="/teacher" replace />} />
        </Routes>
      </Suspense>
    </TeacherLayout>
  );
}

export default TeacherRoutes;
