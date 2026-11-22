import { create } from "zustand";

export interface QuestionOption {
  label?: string;
  text?: string;
  text_en?: string;
  value?: string | number;
  index?: number;
}

export interface Question {
  id: string | number;
  subject?: string;
  topic?: string;
  questionText?: string;
  question_text?: string;
  question_text_en?: string;
  question?: string;
  options?: Array<string | QuestionOption>;
  correctAnswer?: number;
  correct_answer?: number;
  correct_label?: string;
  explanation?: string;
  explanation_en?: string;
  passage?: string;
  section?: string;
  section_instructions?: string;
  question_type?: string;
  difficulty?: "Easy" | "Medium" | "Hard" | "Challenging";
  selected_answer?: string | number | null;
  is_correct?: boolean;
}

export interface SessionSection {
  id?: string | number;
  title: string;
  firstIndex?: number;
  count?: number;
  instructions?: string;
  passage?: string;
  questions?: Question[];
}

export interface SessionResult {
  score_percent?: number | string;
  duration_seconds?: number | string;
  correct_count?: number;
  total_questions?: number;
  score?: number;
  max_score?: number;
  questions?: Question[];
}

export interface SessionAnswer {
  questionId: string | number;
  selected: string | number;
  timeTaken?: number;
}

export interface SessionState {
  sessionId: string | null;
  sessionType: string | null;
  questions: Question[];
  sections: SessionSection[];
  currentQuestionIndex: number;
  answers: SessionAnswer[];
  bookmarkedQuestionIds: Array<string | number>;
  timeRemaining: number | null;
  result: SessionResult | null;
  startSession: (id: string, type: string, questions: Question[], duration?: number, sections?: SessionSection[]) => void;
  submitAnswer: (questionId: string | number, selected: string | number, timeTaken?: number) => void;
  toggleBookmark: (questionId: string | number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  goToQuestion: (index: number) => void;
  tickTimer: () => void;
  restoreSession: () => boolean;
  setResult: (result: SessionResult) => void;
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

  }
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isQuestion = (value: unknown): value is Question =>
  isRecord(value) &&
  (typeof value.id === "string" || typeof value.id === "number") &&
  (value.options === undefined || (
    Array.isArray(value.options) && value.options.every((option: unknown) =>
      typeof option === "string" || (isRecord(option) &&
        (option.label === undefined || typeof option.label === "string") &&
        (option.text === undefined || typeof option.text === "string") &&
        (option.text_en === undefined || typeof option.text_en === "string"))
    )
  )) &&
  (value.question_text === undefined || typeof value.question_text === "string") &&
  (value.question_text_en === undefined || typeof value.question_text_en === "string") &&
  (value.question === undefined || typeof value.question === "string") &&
  (value.questionText === undefined || typeof value.questionText === "string") &&
  (value.section === undefined || typeof value.section === "string") &&
  (value.passage === undefined || typeof value.passage === "string") &&
  (value.section_instructions === undefined || typeof value.section_instructions === "string") &&
  (value.question_type === undefined || typeof value.question_type === "string") &&
  (value.explanation === undefined || typeof value.explanation === "string") &&
  (value.explanation_en === undefined || typeof value.explanation_en === "string");

const isSessionSection = (value: unknown): value is SessionSection =>
  isRecord(value) &&
  typeof value.title === "string" &&
  (value.firstIndex === undefined || typeof value.firstIndex === "number") &&
  (value.count === undefined || typeof value.count === "number");

const isSessionAnswer = (value: unknown): value is SessionAnswer =>
  isRecord(value) &&
  (typeof value.questionId === "string" || typeof value.questionId === "number") &&
  (typeof value.selected === "string" || typeof value.selected === "number") &&
  (value.timeTaken === undefined || typeof value.timeTaken === "number");

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

  toggleBookmark: (questionId: string | number) => {
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
        const parsed: unknown = JSON.parse(raw);
        if (
          isRecord(parsed) &&
          typeof parsed.sessionId === "string" &&
          Array.isArray(parsed.questions) &&
          parsed.questions.length > 0 &&
          parsed.questions.every(isQuestion)
        ) {
          const restoredQuestions = parsed.questions.filter(isQuestion);
          const storedIndex = typeof parsed.currentQuestionIndex === "number" && Number.isInteger(parsed.currentQuestionIndex)
            ? parsed.currentQuestionIndex
            : 0;
          set({
            sessionId: parsed.sessionId,
            sessionType: typeof parsed.sessionType === "string" ? parsed.sessionType : null,
            questions: restoredQuestions,
            sections: Array.isArray(parsed.sections) ? parsed.sections.filter(isSessionSection) : [],
            currentQuestionIndex: Math.min(Math.max(storedIndex, 0), restoredQuestions.length - 1),
            answers: Array.isArray(parsed.answers) ? parsed.answers.filter(isSessionAnswer) : [],
            bookmarkedQuestionIds: Array.isArray(parsed.bookmarkedQuestionIds)
              ? parsed.bookmarkedQuestionIds.filter((id): id is string | number => typeof id === "string" || typeof id === "number")
              : [],
            timeRemaining: typeof parsed.timeRemaining === "number" && Number.isFinite(parsed.timeRemaining)
              ? Math.max(0, parsed.timeRemaining)
              : null,
            result: null
          });
          return true;
        }
        clearLocalStorage();
      }
    } catch {

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
