import api from "./api";
import { ChallengeRoom } from "../types/challenge";

export type { ChallengeRoom };
export type { ChallengeRoom as BattleRoom };

export const listChallengeRooms = (): Promise<ChallengeRoom[]> =>
  api.get("/battle/rooms/").then((r) => r.data?.data || r.data || []);

export const createChallengeRoom = (payload: { subject: string; stakeXp?: number; hostId?: string }) =>
  api.post("/battle/create-room/", payload).then((r) => r.data?.data || r.data);

export const joinChallengeRoom = (payload: { roomId: string; participantId?: string }) =>
  api.post("/battle/join-room/", payload).then((r) => r.data?.data || r.data);

export const submitChallengeAnswer = (payload: {
  roomId: string;
  participantId: string;
  questionId: string;
  selectedAnswer: number;
  timeTakenSeconds?: number;
  isFinalQuestion?: boolean;
}) => api.post("/battle/submit-answer/", payload).then((r) => r.data?.data || r.data);

export const getChallengeRoomStatus = (roomId: string) =>
  api.get(`/battle/room/${roomId}/status/`).then((r) => r.data?.data || r.data);

// Backward-compatible aliases
export const listBattleRooms = listChallengeRooms;
export const createBattleRoom = createChallengeRoom;
export const joinBattleRoom = joinChallengeRoom;
export const submitBattleAnswer = submitChallengeAnswer;
export const getBattleRoomStatus = getChallengeRoomStatus;
