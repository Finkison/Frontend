import { QuestionItem } from "./exam";

export type BattleStatus = "WAITING" | "ACTIVE" | "COMPLETED";

export interface BattleParticipant {
  id: string;
  name: string;
  xpPoints: number;
}

export interface BattleRoomData {
  id: string;
  roomId: string;
  subject: string;
  stakeXp: number;
  status: BattleStatus;
  host: BattleParticipant;
  opponent?: BattleParticipant | null;
  hostScore: number;
  opponentScore: number;
  timeLimitSeconds: number;
  questions: QuestionItem[];
  createdAt: string;
}

export type BattleRoom = BattleRoomData;

export interface SubmitBattleAnswerPayload {
  roomId: string;
  participantId: string;
  questionId: string;
  selectedAnswer: number;
  timeTakenSeconds?: number;
  isFinalQuestion?: boolean;
}

export interface SubmitBattleAnswerResponse {
  success: boolean;
  data: {
    isCorrect: boolean;
    pointsEarned: number;
    hostScore: number;
    opponentScore: number;
    isCompleted: boolean;
    winner?: string | null;
    status: BattleStatus;
  };
}
