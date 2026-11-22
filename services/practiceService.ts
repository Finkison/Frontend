import api from "./api";

export interface PracticeStartPayload {
  subject?: string;
  mode?: string;
  type?: string;
  grade?: number;
  unit?: number;
  past_exam_year?: string;
  past_paper_unit?: number;
}

export interface PracticeAnswerPayload {
  session_id: string;
  question_id: string | number;
  selected_answer: number | string;
  time_taken?: number;
}

export interface CompletePracticePayload {
  session_id: string;
  time_spent?: number;
  answers?: Record<string, number | string>;
}

export interface ExamStartPayload {
  exam_id?: string;
  assignment_id?: string;
  stream?: string;
}

export interface SectionalExamPayload {
  subject?: string;
  stream?: string;
  year?: string;
  simultaneous?: boolean;
}

export interface ExamSubmissionPayload {
  session_id?: string;
  assignment_id?: string;
  answers?: Record<string, number | string>;
  time_spent?: number;
}

export const startPractice = (payload: PracticeStartPayload) => api.post("/practice/start/", payload);
export const submitAnswer = (payload: PracticeAnswerPayload) => api.post("/practice/answer/", payload);
export const completePractice = (payload: CompletePracticePayload) => api.post("/practice/complete/", payload);
export const getPracticeHistory = () => api.get("/practice/history/");

export const getExams = (stream?: string) =>
  api.get("/exams/", { params: stream ? { stream } : {} });
export const startExam = (payload?: ExamStartPayload) => api.post("/exam/start/", payload);
export const generateSectionalExam = (payload?: SectionalExamPayload) => api.post("/exam/generate-sectional/", payload);
export const submitExam = (payload?: ExamSubmissionPayload) => api.post("/exam/submit/", payload);
export const getExamResults = (id: string) => api.get(`/exam/results/${id}/`);
