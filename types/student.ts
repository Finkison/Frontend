export interface DashboardData {
  student_name?: string;
  name?: string;
  grade?: number | string;
  stream?: string;
  current_predicted_score?: number | null;
  predicted_score?: number | null;
  target_score?: number | null;
  streak_days?: number;
  national_rank?: number;
  days_until_exam?: number;
  total_xp?: number;
  level?: number;
  attendance_rate?: number;
  is_school_enrolled?: boolean;
}

export interface StudentSchoolAssignment {
  id: string;
  exam_title: string;
  subject?: string;
  duration_minutes?: number;
  due_date?: string;
  assigned_by?: string;
  school_name?: string | null;
  is_completed: boolean;
  score?: number | null;
  score_percent?: number | null;
  exam_id?: string | null;
  created_at?: string;
}

export interface StudentAssignmentsResponse {
  success: boolean;
  assignments: StudentSchoolAssignment[];
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
