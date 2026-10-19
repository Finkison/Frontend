import { create } from "zustand";
import { ChallengeRoom, ChallengeStatus } from "../types/challenge";

export interface ChallengeStoreState {
  rooms: ChallengeRoom[];
  activeChallenge: ChallengeRoom | null;
  matchStatus: ChallengeStatus;
  currentQIndex: number;
  playerScore: number;
  opponentScore: number;
  timeLeft: number;
  isAiBotMode: boolean;
  selectedOption: number | null;
  showResultModal: boolean;

  setRooms: (rooms: ChallengeRoom[]) => void;
  startChallenge: (room: ChallengeRoom, isBot?: boolean) => void;
  selectOption: (index: number) => void;
  updateScores: (playerDelta: number, opponentDelta: number) => void;
  nextQuestion: (totalQuestions: number) => void;
  tickTimer: () => void;
  setTimeLeft: (seconds: number) => void;
  finishChallenge: () => void;
  resetChallenge: () => void;

  // Backward-compatible battle aliases
  activeBattle?: ChallengeRoom | null;
  startBattle?: (room: ChallengeRoom, isBot?: boolean) => void;
  finishBattle?: () => void;
  resetBattle?: () => void;
}

export const useChallengeStore = create<ChallengeStoreState>((set) => ({
  rooms: [],
  activeChallenge: null,
  activeBattle: null,
  matchStatus: "WAITING",
  currentQIndex: 0,
  playerScore: 0,
  opponentScore: 0,
  timeLeft: 15,
  isAiBotMode: false,
  selectedOption: null,
  showResultModal: false,

  setRooms: (rooms) => set({ rooms }),

  startChallenge: (room, isBot = false) =>
    set({
      activeChallenge: room,
      activeBattle: room,
      matchStatus: "ACTIVE",
      currentQIndex: 0,
      playerScore: 0,
      opponentScore: 0,
      timeLeft: room.timeLimitSeconds || 15,
      isAiBotMode: isBot,
      selectedOption: null,
      showResultModal: false,
    }),

  startBattle: (room, isBot = false) =>
    set({
      activeChallenge: room,
      activeBattle: room,
      matchStatus: "ACTIVE",
      currentQIndex: 0,
      playerScore: 0,
      opponentScore: 0,
      timeLeft: room.timeLimitSeconds || 15,
      isAiBotMode: isBot,
      selectedOption: null,
      showResultModal: false,
    }),

  selectOption: (index) => set({ selectedOption: index }),

  updateScores: (playerDelta, opponentDelta) =>
    set((state) => ({
      playerScore: state.playerScore + playerDelta,
      opponentScore: state.opponentScore + opponentDelta,
    })),

  nextQuestion: (totalQuestions) =>
    set((state) => {
      const nextIndex = state.currentQIndex + 1;
      if (nextIndex >= totalQuestions) {
        return { matchStatus: "COMPLETED", showResultModal: true };
      }
      return {
        currentQIndex: nextIndex,
        selectedOption: null,
        timeLeft: state.activeChallenge?.timeLimitSeconds || 15,
      };
    }),

  tickTimer: () =>
    set((state) => ({
      timeLeft: state.timeLeft > 0 ? state.timeLeft - 1 : 0,
    })),

  setTimeLeft: (seconds) => set({ timeLeft: seconds }),

  finishChallenge: () => set({ matchStatus: "COMPLETED", showResultModal: true }),
  finishBattle: () => set({ matchStatus: "COMPLETED", showResultModal: true }),

  resetChallenge: () =>
    set({
      activeChallenge: null,
      activeBattle: null,
      matchStatus: "WAITING",
      currentQIndex: 0,
      playerScore: 0,
      opponentScore: 0,
      timeLeft: 15,
      isAiBotMode: false,
      selectedOption: null,
      showResultModal: false,
    }),
  resetBattle: () =>
    set({
      activeChallenge: null,
      activeBattle: null,
      matchStatus: "WAITING",
      currentQIndex: 0,
      playerScore: 0,
      opponentScore: 0,
      timeLeft: 15,
      isAiBotMode: false,
      selectedOption: null,
      showResultModal: false,
    }),
}));

export const useBattleStore = useChallengeStore;
export default useChallengeStore;
