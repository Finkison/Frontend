import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import StudentLayout from "../components/layouts/StudentLayout";
import ProtectedRoute from "../components/shared/ProtectedRoute";

const Dashboard = lazy(() => import("../components/student/Dashboard"));
const PracticeSetup = lazy(() => import("../components/student/PracticeSetup"));
const ExamSession = lazy(() => import("../components/student/ExamSession"));
const SessionResults = lazy(() => import("../components/student/SessionResults"));
const WeakAreaDashboard = lazy(() => import("../components/student/WeakAreaDashboard"));
const ScorePredictor = lazy(() => import("../components/student/ScorePredictor"));
const Leaderboard = lazy(() => import("../components/student/Leaderboard"));
const Profile = lazy(() => import("../components/student/Profile"));
const DepartmentsExplorer = lazy(() => import("../components/student/DepartmentsExplorer"));
const BattleArena = lazy(() => import("../components/student/BattleArena"));
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
const SettingsPage = lazy(() => import("../components/student/SettingsPage"));
const OnboardingFlow = lazy(() => import("../components/auth/OnboardingFlow"));

function RouteLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="w-9 h-9 border-3 border-slate-200 border-t-amber-500 rounded-full animate-spin" />
    </div>
  );
}

export default function StudentRoutes() {
  return (
    <StudentLayout>
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          <Route index element={<Dashboard />} />

          <Route path="study-plan" element={<StudyPlanner />} />
          <Route path="spaced-review" element={<SpacedReview />} />
          <Route path="knowledge-map" element={<KnowledgeMap />} />
          <Route path="notes" element={<NotesGenerator />} />
          <Route path="achievements" element={<Achievements />} />

          <Route
            path="past-papers"
            element={
              <ProtectedRoute allowedRoles={["STUDENT", "ADMIN"]} minGrade={11}>
                <PastPaperAnalyzer />
              </ProtectedRoute>
            }
          />

          <Route path="lessons" element={<LessonReader />} />
          <Route path="practice" element={<PracticeSetup />} />
          <Route path="ai-tutor" element={<AITutorChat />} />
          <Route path="session" element={<ExamSession />} />
          <Route path="results" element={<SessionResults />} />

          <Route
            path="exams"
            element={
              <ProtectedRoute allowedRoles={["STUDENT", "ADMIN"]} minGrade={11}>
                <NationalExamsHub />
              </ProtectedRoute>
            }
          />

          <Route
            path="battle"
            element={
              <ProtectedRoute allowedRoles={["STUDENT", "ADMIN"]} minGrade={11}>
                <BattleArena />
              </ProtectedRoute>
            }
          />

          <Route path="weak-areas" element={<WeakAreaDashboard />} />
          <Route path="exam-history" element={<ExamHistory />} />

          <Route
            path="score"
            element={
              <ProtectedRoute allowedRoles={["STUDENT", "ADMIN"]} minGrade={11}>
                <ScorePredictor />
              </ProtectedRoute>
            }
          />

          <Route path="leaderboard" element={<Leaderboard />} />
          <Route
            path="departments"
            element={
              <ProtectedRoute allowedRoles={["STUDENT", "ADMIN"]} minGrade={11}>
                <DepartmentsExplorer />
              </ProtectedRoute>
            }
          />

          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<SettingsPage />} />

          <Route
            path="onboarding"
            element={<OnboardingFlow onComplete={() => (window.location.href = "/student")} />}
          />
        </Routes>
      </Suspense>
    </StudentLayout>
  );
}
