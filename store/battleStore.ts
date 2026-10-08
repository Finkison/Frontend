import { create } from "zustand";
import { BattleRoom, BattleStatus } from "../types/battle";

export interface BattleStoreState {
  rooms: BattleRoom[];
  activeBattle: BattleRoom | null;
  matchStatus: BattleStatus;
  currentQIndex: number;
  playerScore: number;
  opponentScore: number;
  timeLeft: number;
  isAiBotMode: boolean;
  selectedOption: number | null;
  showResultModal: boolean;

  setRooms: (rooms: BattleRoom[]) => void;
  startBattle: (room: BattleRoom, isBot?: boolean) => void;
  selectOption: (index: number) => void;
  updateScores: (playerDelta: number, opponentDelta: number) => void;
  nextQuestion: (totalQuestions: number) => void;
  tickTimer: () => void;
  setTimeLeft: (seconds: number) => void;
  finishBattle: () => void;
  resetBattle: () => void;
}

export const useBattleStore = create<BattleStoreState>((set) => ({
  rooms: [],
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

  startBattle: (room, isBot = false) =>
    set({
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
      if (state.currentQIndex < totalQuestions - 1) {
        return {
          currentQIndex: state.currentQIndex + 1,
          selectedOption: null,
          timeLeft: state.activeBattle?.timeLimitSeconds || 15,
        };
      }
      return {
        showResultModal: true,
        matchStatus: "COMPLETED",
      };
    }),

  tickTimer: () =>
    set((state) => ({
      timeLeft: Math.max(0, state.timeLeft - 1),
    })),

  setTimeLeft: (seconds) => set({ timeLeft: seconds }),

  finishBattle: () =>
    set({
      matchStatus: "COMPLETED",
      showResultModal: true,
    }),

  resetBattle: () =>
    set({
      activeBattle: null,
      matchStatus: "WAITING",
      currentQIndex: 0,
      playerScore: 0,
      opponentScore: 0,
      selectedOption: null,
      showResultModal: false,
    }),
}));

export default useBattleStore;
