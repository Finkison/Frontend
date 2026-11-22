import api from "./api";

export interface StudentProfileUpdate {
  grade?: number | string;
  stream?: string;
  target_score?: number | null;
  full_name?: string;
  region?: string;
  preferred_language?: string;
}

export const getStudentProfile = () => api.get("/student/profile/");
export const updateStudentProfile = (payload: StudentProfileUpdate) =>
  api.patch("/student/profile/", payload);
export const getStudentDashboard = () => api.get("/student/dashboard/");
export const getStudentProgress = (subject?: string) =>
  api.get("/student/progress/", { params: subject ? { subject } : {} });
export const getStudentAIInsights = () => api.get("/student/ai-insights/");
export const getWeakAreas = () => api.get("/student/weak-areas/");
export const getScoreTrajectory = () => api.get("/student/score-trajectory/");
export const getExamHistory = () => api.get("/student/exam-history/");
export const globalSearch = (q: string, signal?: AbortSignal) =>
  api.get("/search/", { params: { q }, signal });
export const getLeaderboard = (scope: "national" | "region" | "regional" | "school" | string = "national", region?: string) =>
  api.get(`/leaderboard/?scope=${scope}${region ? `&region=${encodeURIComponent(region)}` : ""}`);
export { getPracticeHistory } from "./practiceService";
