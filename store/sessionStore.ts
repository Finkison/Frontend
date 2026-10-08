import { create } from "zustand";

export interface Question {
  id: string;
  subject?: string;
  topic?: string;
  questionText?: string;
  question?: string;
  options: any[];
  correctAnswer: number;
  explanation?: string;
  [key: string]: any;
}

export interface SessionAnswer {
  questionId: string;
  selected: number;
  timeTaken?: number;
}

export interface SessionState {
  sessionId: string | null;
  sessionType: string | null;
  questions: Question[];
  sections: any[];
  currentQuestionIndex: number;
  answers: SessionAnswer[];
  bookmarkedQuestionIds: string[];
  timeRemaining: number | null;
  result: any;
  startSession: (id: string, type: string, questions: Question[], duration?: number, sections?: any[]) => void;
  submitAnswer: (questionId: string, selected: number, timeTaken?: number) => void;
  toggleBookmark: (questionId: string) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  goToQuestion: (index: number) => void;
  tickTimer: () => void;
  restoreSession: () => boolean;
  setResult: (result: any) => void;
  endSession: () => void;
}

const STORAGE_KEY = "finkison_active_exam_session";

const saveToLocalStorage = (data: Partial<SessionState>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
  }
};

const clearLocalStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
};

const useSessionStore = create<SessionState>((set, get) => ({
  sessionId: null,
  sessionType: null,
  questions: [],
  sections: [],
  currentQuestionIndex: 0,
  answers: [],
  bookmarkedQuestionIds: [],
  timeRemaining: null,
  result: null,

  startSession: (id, type, questions, duration, sections) => {
    const newState = {
      sessionId: id,
      sessionType: type,
      questions,
      sections: sections || [],
      currentQuestionIndex: 0,
      answers: [],
      bookmarkedQuestionIds: [],
      timeRemaining: duration || null,
      result: null
    };
    saveToLocalStorage(newState);
    set(newState);
  },

  submitAnswer: (questionId, selected, timeTaken) => {
    set((state) => {
      const filtered = state.answers.filter((a) => a.questionId !== questionId);
      const updatedAnswers = [...filtered, { questionId, selected, timeTaken }];
      saveToLocalStorage({
        sessionId: state.sessionId,
        sessionType: state.sessionType,
        questions: state.questions,
        sections: state.sections,
        currentQuestionIndex: state.currentQuestionIndex,
        answers: updatedAnswers,
        bookmarkedQuestionIds: state.bookmarkedQuestionIds,
        timeRemaining: state.timeRemaining
      });
      return { answers: updatedAnswers };
    });
  },

  toggleBookmark: (questionId: string) => {
    set((state) => {
      const exists = state.bookmarkedQuestionIds.includes(questionId);
      const updatedBookmarks = exists
        ? state.bookmarkedQuestionIds.filter((id) => id !== questionId)
        : [...state.bookmarkedQuestionIds, questionId];
      saveToLocalStorage({
        sessionId: state.sessionId,
        sessionType: state.sessionType,
        questions: state.questions,
        sections: state.sections,
        currentQuestionIndex: state.currentQuestionIndex,
        answers: state.answers,
        bookmarkedQuestionIds: updatedBookmarks,
        timeRemaining: state.timeRemaining
      });
      return { bookmarkedQuestionIds: updatedBookmarks };
    });
  },

  nextQuestion: () => {
    set((state) => {
      const nextIdx = Math.min(state.questions.length - 1, state.currentQuestionIndex + 1);
      saveToLocalStorage({ ...state, currentQuestionIndex: nextIdx });
      return { currentQuestionIndex: nextIdx };
    });
  },

  prevQuestion: () => {
    set((state) => {
      const prevIdx = Math.max(0, state.currentQuestionIndex - 1);
      saveToLocalStorage({ ...state, currentQuestionIndex: prevIdx });
      return { currentQuestionIndex: prevIdx };
    });
  },

  goToQuestion: (index) => {
    set((state) => {
      saveToLocalStorage({ ...state, currentQuestionIndex: index });
      return { currentQuestionIndex: index };
    });
  },

  tickTimer: () => {
    set((state) => {
      if (state.timeRemaining === null || state.timeRemaining <= 0) return {};
      const newTime = state.timeRemaining - 1;
      return { timeRemaining: newTime };
    });
  },

  restoreSession: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.sessionId && parsed.questions && parsed.questions.length > 0) {
          set({
            sessionId: parsed.sessionId,
            sessionType: parsed.sessionType,
            questions: parsed.questions,
            sections: parsed.sections || [],
            currentQuestionIndex: parsed.currentQuestionIndex || 0,
            answers: parsed.answers || [],
            bookmarkedQuestionIds: parsed.bookmarkedQuestionIds || [],
            timeRemaining: parsed.timeRemaining,
            result: null
          });
          return true;
        }
      }
    } catch {
      // Ignore corrupted json
    }
    return false;
  },

  setResult: (result) => {
    clearLocalStorage();
    set({ result });
  },

  endSession: () => {
    clearLocalStorage();
    set({
      sessionId: null,
      sessionType: null,
      questions: [],
      sections: [],
      currentQuestionIndex: 0,
      answers: [],
      bookmarkedQuestionIds: [],
      timeRemaining: null,
      result: null
    });
  },
}));

export default useSessionStore;
