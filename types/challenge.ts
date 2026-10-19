import { QuestionItem } from "./exam";

export type ChallengeStatus = "WAITING" | "ACTIVE" | "COMPLETED";

export interface ChallengeParticipant {
  id: string;
  name: string;
  xpPoints: number;
}

export interface ChallengeRoomData {
  id: string;
  roomId: string;
  subject: string;
  stakeXp: number;
  status: ChallengeStatus;
  host: ChallengeParticipant;
  opponent?: ChallengeParticipant | null;
  hostScore: number;
  opponentScore: number;
  timeLimitSeconds: number;
  questions: QuestionItem[];
  createdAt: string;
}

export type ChallengeRoom = ChallengeRoomData;

export interface SubmitChallengeAnswerPayload {
  roomId: string;
  participantId: string;
  questionId: string;
  selectedAnswer: number;
  timeTakenSeconds?: number;
  isFinalQuestion?: boolean;
}

export interface SubmitChallengeAnswerResponse {
  success: boolean;
  data: {
    isCorrect: boolean;
    correctAnswer: number;
    explanation: string;
    earnedXp?: number;
  };
}

// Backward-compatible type aliases
export type BattleStatus = ChallengeStatus;
export type BattleParticipant = ChallengeParticipant;
export type BattleRoomData = ChallengeRoomData;
export type BattleRoom = ChallengeRoom;
export type SubmitBattleAnswerPayload = SubmitChallengeAnswerPayload;
export type SubmitBattleAnswerResponse = SubmitChallengeAnswerResponse;
