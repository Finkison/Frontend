import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import StudentLayout from "../components/layouts/StudentLayout";
import ProtectedRoute from "../components/shared/ProtectedRoute";

const DashboardView = lazy(() => import("../components/student/DashboardView"));
const PracticeSetup = lazy(() => import("../components/student/PracticeSetup"));
const ExamSession = lazy(() => import("../components/student/ExamSession"));
const SessionResults = lazy(() => import("../components/student/SessionResults"));
const DiagnosticGapsView = lazy(() => import("../components/student/DiagnosticGapsView"));
const ScorePredictor = lazy(() => import("../components/student/ScorePredictor"));
const Leaderboard = lazy(() => import("../components/student/Leaderboard"));
const Profile = lazy(() => import("../components/student/Profile"));
const AcademicStreamsView = lazy(() => import("../components/student/AcademicStreamsView"));
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
const OnboardingFlow = lazy(() => import("../components/auth/OnboardingFlow"));

function RouteLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="w-9 h-9 border-3 border-slate-200 border-t-amber-500 rounded-full animate-spin" />
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
          <Route path="session" element={<ExamSession />} />
          <Route path="results" element={<SessionResults />} />
          <Route path="weak-areas" element={<DiagnosticGapsView />} />
          <Route path="score-predictor" element={<ScorePredictor />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="departments" element={<AcademicStreamsView />} />
          <Route path="streams" element={<AcademicStreamsView />} />
          <Route path="battle" element={<BattleArena />} />
          <Route path="challenges" element={<ChallengeArena />} />
          <Route path="ai-tutor" element={<AITutorChat />} />
          <Route path="national-exams" element={<NationalExamsHub />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="exam-history" element={<ExamHistory />} />
          <Route path="settings" element={<SettingsView />} />
          <Route path="onboarding" element={<OnboardingFlow />} />
        </Routes>
      </Suspense>
    </StudentLayout>
  );
}

export default StudentRoutes;
