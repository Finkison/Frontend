import api from "./api";

export const startPractice = (payload) => api.post("/practice/start/", payload);
export const submitAnswer = (payload) => api.post("/practice/answer/", payload);
export const completePractice = (payload) => api.post("/practice/complete/", payload);
export const getPracticeHistory = () => api.get("/practice/history/");

export const startExam = (payload) => api.post("/exam/start/", payload);
export const submitExam = (payload) => api.post("/exam/submit/", payload);
export const getExamResults = (id) => api.get(`/exam/results/${id}/`);
