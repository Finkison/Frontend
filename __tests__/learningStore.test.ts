import { describe, it, expect, beforeEach, vi } from "vitest";
import { useLearningStore } from "../store/learningStore";

describe("Learning Engine Store Test Suite", () => {
  beforeEach(() => {
    useLearningStore.setState({
      dueReviews: [],
      dueCount: 0,
      reviewsLoading: false,
      todayPlan: null,
      planLoading: false,
      masteryMap: [],
      masteryLoading: false,
      abilityProfile: null,
      abilityLoading: false,
    });
  });

  it("should initialize with empty default state", () => {
    const state = useLearningStore.getState();
    expect(state.dueReviews).toEqual([]);
    expect(state.dueCount).toBe(0);
    expect(state.todayPlan).toBeNull();
    expect(state.masteryMap).toEqual([]);
    expect(state.abilityProfile).toBeNull();
  });

  it("should maintain state when setting mock review items", () => {
    const mockItem = {
      concept_state_id: "scs-1",
      concept_id: "c-calc",
      concept_name: "Calculus Limits",
      concept_name_am: "የካልኩለስ መግቢያ",
      subject: "Mathematics",
      mastery_level: 0.75,
      state: "REVIEW",
      review_count: 3,
      lapse_count: 0,
      last_review: new Date().toISOString(),
      questions: [
        {
          id: "q-1",
          question_text: "Evaluate limit",
          options: ["1", "2", "3", "4"],
          correct_answer: 0,
          difficulty: "Medium",
        },
      ],
    };

    useLearningStore.setState({
      dueReviews: [mockItem],
      dueCount: 1,
    });

    const state = useLearningStore.getState();
    expect(state.dueCount).toBe(1);
    expect(state.dueReviews[0].concept_id).toBe("c-calc");
    expect(state.dueReviews[0].mastery_level).toBe(0.75);
  });

  it("should handle mock study plan state updates", () => {
    const mockPlan = {
      id: "pln-today",
      date: "2026-10-03",
      status: "IN_PROGRESS",
      planned_minutes: 120,
      actual_minutes: 30,
      completion_rate: 0.25,
      tasks: [
        {
          concept_id: "c-calc",
          concept_name: "Calculus Limits",
          subject: "Mathematics",
          activity_type: "SPACED_REVIEW",
          activity_label: "Spaced Repetition Review",
          duration_min: 20,
          priority: "HIGH" as const,
          mastery: 0.6,
          reason: "Due for review on forgetting curve",
          completed: false,
        },
      ],
      xp_earned: 50,
      days_until_euee: 188,
      target_score: 520,
      predicted_score: 440,
    };

    useLearningStore.setState({ todayPlan: mockPlan });

    const state = useLearningStore.getState();
    expect(state.todayPlan).not.toBeNull();
    expect(state.todayPlan?.planned_minutes).toBe(120);
    expect(state.todayPlan?.tasks.length).toBe(1);
    expect(state.todayPlan?.tasks[0].priority).toBe("HIGH");
  });
});
