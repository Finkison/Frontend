export interface SubjectItem {
  id: string;
  name: string;
  stream: string;
  icon?: string;
  unitsCount: number;
  totalQuestions: number;
  pastYears?: number[];
}

export interface WorkedExample {
  title: string;
  question: string;
  solution_steps: string[];
  final_answer: string;
}

export interface LessonSummary {
  id: string;
  title: string;
  lesson_number: number;
  read_time_minutes: number;
  summary: string;
  key_formulas_count: number;
  key_terms_count: number;
}

export interface UnitSyllabus {
  unit_number: number;
  unit_title: string;
  subject: string;
  lessons: LessonSummary[];
}

export interface LessonDetail {
  id: string;
  subject: string;
  subject_icon?: string;
  grade: number;
  unit_number: number;
  unit_title: string;
  lesson_number: number;
  title: string;
  read_time_minutes: number;
  summary: string;
  content_markdown: string;
  key_formulas: Array<{ formula: string; explanation: string; note?: string }>;
  key_terms: Array<{ term: string; definition_en: string; definition_am?: string; definition_or?: string }>;
  worked_examples: WorkedExample[];
  exam_tips?: string;
  prev_lesson_id?: string | null;
  next_lesson_id?: string | null;
  related_questions?: any[];
}
