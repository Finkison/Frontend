
import { create } from "zustand";
import {
  getDueReviews,
  submitReview,
  getTodayPlan,
  generateStudyPlan,
  completeTask,
  getMasteryMap,
  getAbilityProfile,
  type ReviewItem,
  type StudyPlan,
  type ConceptMastery,
  type AbilityProfile,
} from "../services/learningEngineService";

interface LearningState {
  // Review queue
  dueReviews: ReviewItem[];
  dueCount: number;
  reviewsLoading: boolean;

  // Study plan
  todayPlan: StudyPlan | null;
  planLoading: boolean;

  // Mastery
  masteryMap: ConceptMastery[];
  masteryLoading: boolean;

  // Ability
  abilityProfile: AbilityProfile | null;
  abilityLoading: boolean;

  // Actions
  fetchDueReviews: () => Promise<void>;
  handleReviewSubmit: (
    conceptStateId: string,
    rating: 1 | 2 | 3 | 4,
    timeTaken: number,
    confidence: number,
  ) => Promise<{ message: string; new_mastery: number }>;
  fetchTodayPlan: () => Promise<void>;
  generatePlan: (minutes: number) => Promise<void>;
  completeTaskAction: (planId: string, taskIndex: number, minutes: number) => Promise<void>;
  fetchMasteryMap: (subjectId?: string) => Promise<void>;
  fetchAbilityProfile: () => Promise<void>;
}

export const useLearningStore = create<LearningState>((set, get) => ({
  // Initial state
  dueReviews: [],
  dueCount: 0,
  reviewsLoading: false,
  todayPlan: null,
  planLoading: false,
  masteryMap: [],
  masteryLoading: false,
  abilityProfile: null,
  abilityLoading: false,

  fetchDueReviews: async () => {
    set({ reviewsLoading: true });
    try {
      const reviews = await getDueReviews(30);
      set({ dueReviews: reviews, dueCount: reviews.length, reviewsLoading: false });
    } catch {
      set({ reviewsLoading: false });
    }
  },

  handleReviewSubmit: async (conceptStateId, rating, timeTaken, confidence) => {
    const result = await submitReview(conceptStateId, rating, timeTaken, confidence);
    get().fetchDueReviews();
    return { message: result.message, new_mastery: result.new_mastery };
  },

  fetchTodayPlan: async () => {
    set({ planLoading: true });
    try {
      const plan = await getTodayPlan();
      set({ todayPlan: plan, planLoading: false });
    } catch {
      set({ planLoading: false });
    }
  },

  generatePlan: async (minutes) => {
    set({ planLoading: true });
    try {
      const plan = await generateStudyPlan(minutes);
      set({ todayPlan: plan, planLoading: false });
    } catch {
      set({ planLoading: false });
    }
  },

  completeTaskAction: async (planId, taskIndex, minutes) => {
    try {
      const plan = await completeTask(planId, taskIndex, minutes);
      set({ todayPlan: plan });
    } catch {
      console.error("Failed to complete task");
    }
  },

  fetchMasteryMap: async (subjectId) => {
    set({ masteryLoading: true });
    try {
      const map = await getMasteryMap(subjectId);
      set({ masteryMap: map, masteryLoading: false });
    } catch {
      set({ masteryLoading: false });
    }
  },

  fetchAbilityProfile: async () => {
    set({ abilityLoading: true });
    try {
      const profile = await getAbilityProfile();
      set({ abilityProfile: profile, abilityLoading: false });
    } catch {
      set({ abilityLoading: false });
    }
  },
}));
