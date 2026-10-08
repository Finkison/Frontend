import api from "./api";

export interface LessonSummary {
  id: string;
  title: string;
  lesson_number: number;
  read_time_minutes: number;
  summary: string;
  key_formulas_count: number;
  key_terms_count: number;
}

export interface UnitGroup {
  unit_number: number;
  unit_title: string;
  subject: string;
  lessons: LessonSummary[];
}

export interface LessonDetail {
  id: string;
  subject: string;
  subject_icon: string;
  grade: number;
  unit_number: number;
  unit_title: string;
  lesson_number: number;
  title: string;
  read_time_minutes: number;
  summary: string;
  content_markdown: string;
  key_formulas: Array<{ name: string; formula: string; note?: string }>;
  key_terms: Array<{ term: string; definition: string; amharic?: string; oromo?: string }>;
  worked_examples: Array<{ title: string; passage_excerpt?: string; question: string; solution: string }>;
  exam_tips: string;
  prev_lesson_id: string | null;
  next_lesson_id: string | null;
  related_questions: any[];
}

export const getSubjects = (stream?: string) =>
  api.get("/curriculum/subjects/", { params: stream ? { stream } : {} });

export const getLessons = (params?: { subject?: string; grade?: number; unit?: number }) => {
  const query = new URLSearchParams();
  if (params?.subject) query.append("subject", params.subject);
  if (params?.grade) query.append("grade", String(params.grade));
  if (params?.unit) query.append("unit", String(params.unit));
  const qs = query.toString();
  return api.get(`/curriculum/lessons/${qs ? `?${qs}` : ""}`);
};

export const getLessonDetail = (lessonId: string) =>
  api.get(`/curriculum/lessons/${lessonId}/`);

export const explainLessonAI = (payload: {
  lesson_id: string;
  prompt: string;
  language?: "en" | "am" | "or";
  context_snippet?: string;
}) => api.post("/curriculum/lessons/ai-explain/", payload);

export interface StudentNoteItem {
  id: string;
  lesson_id?: string;
  subject: string;
  topic?: string;
  title: string;
  content: string;
  is_pinned: boolean;
  source: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export const getStudentNotes = (params?: { lesson_id?: string; subject?: string }) =>
  api.get("/student/notes/", { params });

export const createStudentNote = (payload: {
  lesson_id?: string;
  subject?: string;
  topic?: string;
  title?: string;
  content: string;
  tags?: string[];
  source?: string;
}) => api.post("/student/notes/", payload);

export const updateStudentNote = (
  noteId: string,
  payload: { title?: string; content?: string; is_pinned?: boolean; tags?: string[] }
) => api.put(`/student/notes/${noteId}/`, payload);

export const deleteStudentNote = (noteId: string) =>
  api.delete(`/student/notes/${noteId}/`);

export const getStudentAssignments = () =>
  api.get("/student/assignments/");

