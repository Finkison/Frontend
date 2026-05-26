import { create } from "zustand";

const useSessionStore = create((set) => ({
  sessionId: null,
  sessionType: null,
  questions: [],
  currentQuestionIndex: 0,
  answers: [],
  timeRemaining: null,
  result: null,
  startSession: (id, type, questions, duration) =>
    set({ sessionId: id, sessionType: type, questions, currentQuestionIndex: 0, answers: [], timeRemaining: duration, result: null }),
  submitAnswer: (questionId, selected, timeTaken) =>
    set((state) => ({ answers: [...state.answers, { questionId, selected, timeTaken }] })),
  nextQuestion: () => set((state) => ({ currentQuestionIndex: state.currentQuestionIndex + 1 })),
  setResult: (result) => set({ result }),
  endSession: () => set({ sessionId: null, sessionType: null, questions: [], currentQuestionIndex: 0, answers: [], timeRemaining: null, result: null }),
}));

export default useSessionStore;
