import React, { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import StudentLayout from "../components/layouts/StudentLayout";
import ProtectedRoute from "../components/shared/ProtectedRoute";
import { useI18n } from "../i18n";

const DashboardView = lazy(() => import("../components/student/DashboardView"));
const PracticeSetup = lazy(() => import("../components/student/PracticeSetup"));
const ExamSession = lazy(() => import("../components/student/ExamSession"));
const SessionResults = lazy(() => import("../components/student/SessionResults"));
const DiagnosticGapsView = lazy(() => import("../components/student/DiagnosticGapsView"));
const ScorePredictor = lazy(() => import("../components/student/ScorePredictor"));
const Leaderboard = lazy(() => import("../components/student/Leaderboard"));
const Profile = lazy(() => import("../components/student/Profile"));
const ChallengeArena = lazy(() => import("../components/student/ChallengeArena"));
const BattleArena = ChallengeArena;
const AITutorChat = lazy(() => import("../components/student/AITutorChat"));
const NationalExamsHub = lazy(() => import("../components/student/NationalExamsHub"));
const LessonReader = lazy(() => import("../components/student/LessonReader"));
const SpacedReview = lazy(() => import("../components/student/SpacedReview"));
const StudyPlanner = lazy(() => import("../components/student/StudyPlanner"));
const KnowledgeMap = lazy(() => import("../components/student/KnowledgeMap"));
const PastPaperAnalyzer = lazy(() => import("../components/student/PastPaperAnalyzer"));
const NotesGenerator = lazy(() => import("../components/student/NotesGenerator"));
const Achievements = lazy(() => import("../components/student/Achievements"));
const ExamHistory = lazy(() => import("../components/student/ExamHistory"));
const SettingsView = lazy(() => import("../components/student/SettingsView"));
const SchoolAccessView = lazy(() => import("../components/student/SchoolAccessView"));
const AttendanceHistoryView = lazy(() => import("../components/student/AttendanceHistoryView"));
const SubscriptionPage = lazy(() => import("../components/student/SubscriptionPage"));
const CourseworkView = lazy(() => import("../components/student/CourseworkView"));
const ClassResourcesView = lazy(() => import("../components/student/ClassResourcesView"));
const OnboardingFlow = lazy(() => import("../components/auth/OnboardingFlow"));

function RouteLoader() {
  const { t } = useI18n();
  return (
    <div role="status" aria-live="polite" className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-sm text-stone-500 dark:text-[#A89C90]">
      <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#E7E0D6] border-t-[#881337] dark:border-white/10 dark:border-t-[#FBBF24]" />
      <span>{t("appNavigation.loadingPage")}</span>
    </div>
  );
}

export function StudentRoutes(): React.ReactElement {
  return (
    <StudentLayout>
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          <Route index element={<DashboardView />} />

          <Route path="study-plan" element={<StudyPlanner />} />
          <Route path="spaced-review" element={<SpacedReview />} />
          <Route path="knowledge-map" element={<KnowledgeMap />} />
          <Route path="notes" element={<NotesGenerator />} />

          <Route
            path="past-papers"
            element={
              <ProtectedRoute allowedRoles={["STUDENT", "ADMIN"]} minGrade={12}>
                <PastPaperAnalyzer />
              </ProtectedRoute>
            }
          />

          <Route path="lessons" element={<LessonReader />} />
          <Route path="practice" element={<PracticeSetup />} />
          <Route path="exams" element={<NationalExamsHub />} />
          <Route path="session" element={<ExamSession />} />
          <Route path="results" element={<SessionResults />} />
          <Route path="weak-areas" element={<DiagnosticGapsView />} />
          <Route path="score" element={<ScorePredictor />} />
          <Route path="score-predictor" element={<ScorePredictor />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="battle" element={<BattleArena />} />
          <Route path="challenges" element={<ChallengeArena />} />
          <Route path="ai-tutor" element={<AITutorChat />} />
          <Route path="national-exams" element={<NationalExamsHub />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="exam-history" element={<ExamHistory />} />
          <Route path="attendance" element={<AttendanceHistoryView />} />
          <Route path="coursework" element={<CourseworkView />} />
          <Route path="resources" element={<ClassResourcesView />} />
          <Route path="school-access" element={<SchoolAccessView />} />
          <Route path="settings" element={<SettingsView />} />
          <Route path="subscription" element={<SubscriptionPage />} />
          <Route path="onboarding" element={<OnboardingFlow />} />
          <Route path="*" element={<Navigate to="/student" replace />} />
        </Routes>
      </Suspense>
    </StudentLayout>
  );
}

export default StudentRoutes;
