import api from "./api";

export const getStudentProfile = () => api.get("/student/profile/");
export const updateStudentProfile = (payload) => api.patch("/student/profile/", payload);
export const getStudentDashboard = () => api.get("/student/dashboard/");
export const getStudentProgress = (subject) => api.get(`/student/progress/${subject ? `?subject=${subject}` : ""}`);
export const getStudentAIInsights = () => api.get("/student/ai-insights/");
export const getWeakAreas = () => api.get("/student/weak-areas/");
export const getScoreTrajectory = () => api.get("/student/score-trajectory/");
export const getDepartments = () => api.get("/student/departments/");
export const getTechnologyTracks = () => api.get("/student/technology-tracks/");
