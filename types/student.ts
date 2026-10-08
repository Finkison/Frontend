export interface DashboardData {
  student_name?: string;
  name?: string;
  current_predicted_score?: number;
  predicted_score?: number;
  target_score?: number;
  streak_days?: number;
  national_rank?: number;
  target_university?: string;
  days_until_exam?: number;
  total_xp?: number;
  level?: number;
}

export interface SubjectProgress {
  subject: string;
  accuracy_percent?: number;
  accuracy?: number;
  total_questions?: number;
  correct_answers?: number;
  mastered?: boolean;
}

export interface PracticeHistoryItem {
  id: number;
  subject: string;
  score_percent: number;
  total_questions: number;
  correct_answers: number;
  created_at: string;
  session_type?: string;
}

export interface AIInsights {
  summary?: string;
  focus_topic?: string;
  projected_gain?: number;
  recommended_drills?: number;
}

export interface WeakArea {
  id?: number;
  subject: string;
  topic: string;
  accuracy_percent?: number;
  accuracy?: number;
  priority?: "critical" | "high" | "medium" | "low";
}
