import api from "./api";

export interface StudentProfileUpdate {
  grade?: number;
  stream?: string;
  target_score?: number;
  full_name?: string;
  phone?: string;
  region?: string;
  school?: string;
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
export const getDepartments = () => api.get("/student/departments/");
export const getExamHistory = () => api.get("/student/exam-history/");
export const globalSearch = (q: string) => api.get(`/search/?q=${encodeURIComponent(q)}`);
