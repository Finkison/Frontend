
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

  dueReviews: ReviewItem[];
  dueCount: number;
  reviewsLoading: boolean;
  reviewQueueError: string | null;

  todayPlan: StudyPlan | null;
  planLoading: boolean;
  planError: string | null;

  masteryMap: ConceptMastery[];
  masteryLoading: boolean;

  abilityProfile: AbilityProfile | null;
  abilityLoading: boolean;

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

export const useLearningStore = create<LearningState>((set) => ({

  dueReviews: [],
  dueCount: 0,
  reviewsLoading: false,
  reviewQueueError: null,
  todayPlan: null,
  planLoading: false,
  planError: null,
  masteryMap: [],
  masteryLoading: false,
  abilityProfile: null,
  abilityLoading: false,

  fetchDueReviews: async () => {
    set({ reviewsLoading: true, reviewQueueError: null });
    try {
      const reviews = await getDueReviews(30);
      set({ dueReviews: reviews, dueCount: reviews.length, reviewsLoading: false, reviewQueueError: null });
    } catch {
      set({ reviewsLoading: false, reviewQueueError: "Your review queue could not be loaded. Check your connection and try again." });
    }
  },

  handleReviewSubmit: async (conceptStateId, rating, timeTaken, confidence) => {
    const result = await submitReview(conceptStateId, rating, timeTaken, confidence);
    return { message: result.message, new_mastery: result.new_mastery };
  },

  fetchTodayPlan: async () => {
    set({ planLoading: true, planError: null });
    try {
      const plan = await getTodayPlan();
      set({ todayPlan: plan, planLoading: false });
    } catch {
      set({ planLoading: false, planError: "Your study plan could not be loaded. Check your connection and try again." });
    }
  },

  generatePlan: async (minutes) => {
    set({ planLoading: true, planError: null });
    try {
      const plan = await generateStudyPlan(minutes);
      set({ todayPlan: plan, planLoading: false });
    } catch {
      set({ planLoading: false, planError: "Your study plan could not be generated. Try again in a moment." });
    }
  },

  completeTaskAction: async (planId, taskIndex, minutes) => {
    try {
      const plan = await completeTask(planId, taskIndex, minutes);
      set({ todayPlan: plan, planError: null });
    } catch {
      set({ planError: "This task could not be updated. Check your connection and try again." });
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
