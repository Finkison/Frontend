import { describe, it, expect, beforeEach } from "vitest";
import useBattleStore from "../store/battleStore";
import { BattleRoom } from "../types/battle";

describe("BattleStore Real-Time State Management", () => {
  beforeEach(() => {
    useBattleStore.getState().resetBattle();
  });

  const mockRoom: BattleRoom = {
    id: "room-test-1",
    roomId: "room-test-1",
    subject: "Mathematics",
    stakeXp: 50,
    status: "ACTIVE",
    host: { id: "p1", name: "Player One", xpPoints: 500 },
    opponent: { id: "p2", name: "Player Two", xpPoints: 600 },
    hostScore: 0,
    opponentScore: 0,
    timeLimitSeconds: 15,
    questions: [
      {
        id: "q-1",
        subject: "Mathematics",
        question: "What is 2 + 2?",
        questionText: "What is 2 + 2?",
        question_text: "What is 2 + 2?",
        stream: "Natural Science",
        grade: 12,
        unit: 1,
        topic: "Arithmetic",
        difficulty: "Easy",
        options: [
          { label: "A", text: "1", index: 0 },
          { label: "B", text: "2", index: 1 },
          { label: "C", text: "3", index: 2 },
          { label: "D", text: "4", index: 3 },
        ],
        correctAnswer: 3,
        correct_answer: 3,
        correct_label: "D",
        explanation: "Simple arithmetic",
      } as any,
      {
        id: "q-2",
        subject: "Mathematics",
        question: "What is 3 * 3?",
        questionText: "What is 3 * 3?",
        question_text: "What is 3 * 3?",
        stream: "Natural Science",
        grade: 12,
        unit: 1,
        topic: "Arithmetic",
        difficulty: "Easy",
        options: [
          { label: "A", text: "6", index: 0 },
          { label: "B", text: "9", index: 1 },
          { label: "C", text: "12", index: 2 },
          { label: "D", text: "15", index: 3 },
        ],
        correctAnswer: 1,
        correct_answer: 1,
        correct_label: "B",
        explanation: "Multiplication",
      } as any,
    ],
    createdAt: new Date().toISOString(),
  };

  it("should initialize with default empty match state", () => {
    const state = useBattleStore.getState();
    expect(state.activeBattle).toBeNull();
    expect(state.playerScore).toBe(0);
    expect(state.opponentScore).toBe(0);
    expect(state.matchStatus).toBe("WAITING");
  });

  it("should start battle with correct room details and active state", () => {
    useBattleStore.getState().startBattle(mockRoom);

    const state = useBattleStore.getState();
    expect(state.activeBattle?.id).toBe("room-test-1");
    expect(state.matchStatus).toBe("ACTIVE");
    expect(state.timeLeft).toBe(15);
  });

  it("should update player and opponent scores dynamically", () => {
    useBattleStore.getState().startBattle(mockRoom);
    useBattleStore.getState().updateScores(100, 80);

    const state = useBattleStore.getState();
    expect(state.playerScore).toBe(100);
    expect(state.opponentScore).toBe(80);
  });

  it("should advance to next question or complete battle", () => {
    useBattleStore.getState().startBattle(mockRoom);

    useBattleStore.getState().nextQuestion(2);
    expect(useBattleStore.getState().currentQIndex).toBe(1);

    useBattleStore.getState().nextQuestion(2);
    expect(useBattleStore.getState().showResultModal).toBe(true);
    expect(useBattleStore.getState().matchStatus).toBe("COMPLETED");
  });
});
