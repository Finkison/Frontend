import { Route, Routes } from "react-router-dom";
import StudentLayout from "../components/layouts/StudentLayout";
import Dashboard from "../components/student/Dashboard";
import PracticeSetup from "../components/student/PracticeSetup";
import ExamSession from "../components/student/ExamSession";
import SessionResults from "../components/student/SessionResults";
import WeakAreaDashboard from "../components/student/WeakAreaDashboard";
import ScorePredictor from "../components/student/ScorePredictor";
import ScholarshipHub from "../components/student/ScholarshipHub";
import Leaderboard from "../components/student/Leaderboard";
import Profile from "../components/student/Profile";
import DepartmentsExplorer from "../components/student/DepartmentsExplorer";
import TechnologyHub from "../components/student/TechnologyHub";

export default function StudentRoutes() {
  return (
    <StudentLayout>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="practice" element={<PracticeSetup />} />
        <Route path="session" element={<ExamSession />} />
        <Route path="results" element={<SessionResults />} />
        <Route path="weak-areas" element={<WeakAreaDashboard />} />
        <Route path="score" element={<ScorePredictor />} />
        <Route path="scholarships" element={<ScholarshipHub />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="departments" element={<DepartmentsExplorer />} />
        <Route path="technology" element={<TechnologyHub />} />
      </Routes>
    </StudentLayout>
  );
}
