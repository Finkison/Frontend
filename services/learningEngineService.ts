
import api from "./api";

// ==========================================
// TYPES
// ==========================================

export interface ReviewItem {
  concept_state_id: string;
  concept_id: string;
  concept_name: string;
  concept_name_am: string;
  subject: string;
  mastery_level: number;
  state: string;
  review_count: number;
  lapse_count: number;
  last_review: string | null;
  questions: Array<{
    id: string;
    question_text: string;
    options: string[];
    correct_answer: number;
    difficulty: string;
  }>;
}

export interface StudyTask {
  concept_id: string | null;
  concept_name: string;
  subject: string;
  activity_type: string;
  activity_label: string;
  duration_min: number;
  priority: "URGENT" | "HIGH" | "MEDIUM" | "LOW";
  mastery: number | null;
  reason: string;
  completed: boolean;
}

export interface StudyPlan {
  id: string;
  date: string;
  status: string;
  planned_minutes: number;
  actual_minutes: number;
  completion_rate: number;
  tasks: StudyTask[];
  xp_earned: number;
  days_until_euee: number;
  target_score: number;
  predicted_score: number;
}

export interface AbilityProfile {
  overall_ability: number;
  overall_ability_label: string;
  subjects: Record<string, {
    total_concepts: number;
    mastered_concepts: number;
    avg_mastery: number;
    total_reviews: number;
    total_lapses: number;
    weakest_concepts: Array<{
      concept: string;
      mastery: number;
      lapses: number;
    }>;
  }>;
  recommended_focus: string[];
}

export interface ConceptMastery {
  concept_id: string;
  name: string;
  name_am: string;
  subject: string;
  grade: number;
  mastery: number;
  state: string;
  mastery_label: string;
  prerequisites: string[];
  euee_weight: number;
  next_review: string | null;
}

// ==========================================
// SPACED REPETITION
// ==========================================

export async function getDueReviews(limit: number = 30): Promise<ReviewItem[]> {
  const res = await api.get(`/learning/reviews/due/?limit=${limit}`);
  return res.data.reviews || [];
}

export async function submitReview(
  conceptStateId: string,
  rating: 1 | 2 | 3 | 4,
  timeTakenSeconds: number = 0,
  confidence: number = 3,
): Promise<{
  new_mastery: number;
  new_state: string;
  next_review_days: number;
  mastery_label: string;
  message: string;
}> {
  const res = await api.post("/learning/reviews/submit/", {
    concept_state_id: conceptStateId,
    rating,
    time_taken_seconds: timeTakenSeconds,
    confidence,
  });
  return res.data;
}

// ==========================================
// ADAPTIVE QUESTIONS
// ==========================================

export async function getAdaptiveQuestions(
  subjectId?: string,
  conceptId?: string,
  count: number = 10,
): Promise<{
  student_ability: number;
  questions: Array<{
    id: string;
    question_text: string;
    options: string[];
    difficulty: string;
    subject: string | null;
    topic: string;
  }>;
}> {
  const res = await api.post("/learning/questions/adaptive/", {
    subject_id: subjectId || null,
    concept_id: conceptId || null,
    count,
  });
  return res.data;
}

// ==========================================
// STUDY PLANS
// ==========================================

export async function generateStudyPlan(
  availableMinutes: number = 120,
): Promise<StudyPlan> {
  const res = await api.post("/learning/plan/generate/", {
    available_minutes: availableMinutes,
  });
  return res.data.plan;
}

export async function getTodayPlan(): Promise<StudyPlan | null> {
  const res = await api.get("/learning/plan/today/");
  return res.data.plan || null;
}

export async function completeTask(
  planId: string,
  taskIndex: number,
  actualMinutes: number = 0,
): Promise<StudyPlan> {
  const res = await api.post("/learning/plan/complete-task/", {
    plan_id: planId,
    task_index: taskIndex,
    actual_minutes: actualMinutes,
  });
  return res.data.plan;
}

export async function getWeeklySummary(): Promise<{
  total_study_minutes: number;
  study_hours: number;
  plans_completed: number;
  total_plans: number;
  plan_completion_rate: number;
  questions_answered: number;
  questions_correct: number;
  accuracy: number;
  concepts_mastered: number;
  daily_breakdown: Array<{ date: string; minutes: number }>;
}> {
  const res = await api.get("/learning/plan/weekly-summary/");
  return res.data.summary;
}

// ==========================================
// ==========================================

export async function getMasteryMap(
  subjectId?: string,
): Promise<ConceptMastery[]> {
  const url = subjectId
    ? `/learning/mastery/?subject_id=${subjectId}`
    : "/learning/mastery/";
  const res = await api.get(url);
  return res.data.concepts || [];
}

export async function getAbilityProfile(): Promise<AbilityProfile> {
  const res = await api.get("/learning/ability-profile/");
  return res.data.profile;
}

// ==========================================
// EVENT LOGGING
// ==========================================

export async function logStudyEvent(
  eventType: string,
  conceptId?: string,
  durationSeconds: number = 0,
  isCorrect?: boolean,
  metadata?: Record<string, unknown>,
): Promise<void> {
  try {
    await api.post("/learning/events/log/", {
      event_type: eventType,
      concept_id: conceptId || null,
      duration_seconds: durationSeconds,
      is_correct: isCorrect ?? null,
      metadata: metadata || {},
    });
  } catch {
    console.warn("[LearningEngine] Failed to log study event:", eventType);
  }
}

export const learningEngineService = {
  getDueReviews,
  submitReview,
  getAdaptiveQuestions,
  generateStudyPlan,
  getTodayPlan,
  completeTask,
  getWeeklySummary,
  getMasteryMap,
  getAbilityProfile,
  logStudyEvent,
  recordStudyEvent: (data: {
    event_type: string;
    concept_id?: string;
    duration_seconds: number;
    confidence_before?: number;
    is_correct?: boolean;
    is_offline?: boolean;
  }) => logStudyEvent(data.event_type, data.concept_id, data.duration_seconds, data.is_correct, {
    confidence_before: data.confidence_before,
    is_offline: data.is_offline,
  }),
};
