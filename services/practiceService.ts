import api from "./api";

export const startPractice = (payload) => api.post("/practice/start/", payload);
export const submitAnswer = (payload) => api.post("/practice/answer/", payload);
export const completePractice = (payload) => api.post("/practice/complete/", payload);
export const getPracticeHistory = () => api.get("/practice/history/");

export const getExams = (stream?: string) =>
  api.get("/exams/", { params: stream ? { stream } : {} });
export const startExam = (payload?: any) => api.post("/exam/start/", payload);
export const generateSectionalExam = (payload?: any) => api.post("/exam/generate-sectional/", payload);
export const submitExam = (payload?: any) => api.post("/exam/submit/", payload);
export const getExamResults = (id: string) => api.get(`/exam/results/${id}/`);

