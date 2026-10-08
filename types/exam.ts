export type DifficultyLevel = "Easy" | "Medium" | "Hard" | "Challenging";

export interface QuestionOption {
  label: string;
  text: string;
  text_en?: string;
  index: number;
}

export interface QuestionItem {
  id: string;
  subject: string;
  stream: string;
  grade: number;
  unit: number;
  topic: string;
  difficulty: DifficultyLevel;
  questionText: string;
  question_text: string;
  options: QuestionOption[];
  correctAnswer: number;
  correct_label: string;
  explanation: string;
  pastExamYear?: string;
  examWeightPercent?: number;
  passage?: string;
  section?: string;
  section_instructions?: string;
  question_type?: string;
}

export interface ExamSection {
  id: string;
  title: string;
  instructions: string;
  passage?: string;
  questions: QuestionItem[];
}

export interface ExamSessionData {
  id: string;
  sessionId: string;
  title: string;
  subject?: string;
  duration: number;
  duration_seconds: number;
  total_questions: number;
  sections?: ExamSection[];
  questions: QuestionItem[];
}

export interface ExamResultBreakdown {
  name: string;
  score: number;
  correct: number;
  total: number;
  percentile: number;
}

export interface ExamSubmissionResult {
  success: boolean;
  result_id: string;
  score: number;
  max_score: number;
  percentile: number;
  sections_breakdown?: Record<string, ExamResultBreakdown>;
  passed: boolean;
  correct_count?: number;
  total_questions?: number;
}
