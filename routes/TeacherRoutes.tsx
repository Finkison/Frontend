import React, { Suspense, lazy } from "react";
import { Route, Routes, Navigate, useSearchParams } from "react-router-dom";
import TeacherLayout from "../components/layouts/TeacherLayout";
import { useI18n } from "../i18n";

const DashboardView = lazy(() => import("../components/teacher/DashboardView"));
const AssignedSectionsView = lazy(() => import("../components/teacher/AssignedSectionsView"));
const LessonsView = lazy(() => import("../components/teacher/LessonsView"));
const ExamsView = lazy(() => import("../components/teacher/ExamsView"));
const TasksView = lazy(() => import("../components/teacher/TasksView"));
const QuestionBankView = lazy(() => import("../components/teacher/QuestionBankView"));
const AssessmentBuilderView = lazy(() => import("../components/teacher/AssessmentBuilderView"));
const AITeachingToolsView = lazy(() => import("../components/teacher/AITeachingToolsView"));
const GradebookView = lazy(() => import("../components/teacher/GradebookView"));
const DiagnosticScoresView = lazy(() => import("../components/teacher/DiagnosticScoresView"));
const AttendanceView = lazy(() => import("../components/teacher/AttendanceView"));
const PastPapersView = lazy(() => import("../components/teacher/PastPapersView"));
const MessagesView = lazy(() => import("../components/teacher/MessagesView"));
const SecurityView = lazy(() => import("../components/school/SecurityView"));
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

function LegacyAssistantRedirect(): React.ReactElement {
  const [searchParams] = useSearchParams();
  const requestedTool = searchParams.get("tool");
  const toolAlias = requestedTool === "notes" ? "notes_generator" : requestedTool;
  const destination = toolAlias
    ? `/teacher/ai-tools?tool=${encodeURIComponent(toolAlias)}`
    : "/teacher/assessment-builder";
  return <Navigate to={destination} replace />;
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
          <Route path="assessment-builder" element={<AssessmentBuilderView />} />
          <Route path="ai-assistant" element={<LegacyAssistantRedirect />} />
          <Route path="ai-tools" element={<AITeachingToolsView />} />
          <Route path="gradebook" element={<GradebookView />} />
          <Route path="diagnostic-scores" element={<DiagnosticScoresView />} />
          <Route path="attendance" element={<AttendanceView />} />
          <Route path="schedule" element={<ClassScheduleView />} />
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
