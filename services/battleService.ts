import api from "./api";

export interface BattleRoom {
  id: string;
  roomId?: string;
  subject: string;
  stakeXp: number;
  status: "WAITING" | "ACTIVE" | "COMPLETED";
  host: {
    id: string;
    name: string;
    xpPoints: number;
  };
  opponent?: {
    id: string;
    name: string;
    xpPoints: number;
  } | null;
  hostScore: number;
  opponentScore: number;
  timeLimitSeconds: number;
  questions: any[];
  createdAt: string;
}

export const listBattleRooms = () => api.get("/battle/rooms/").then((r) => r.data?.data || r.data || []);

export const createBattleRoom = (payload: { subject: string; stakeXp?: number; hostId?: string }) =>
  api.post("/battle/create-room/", payload).then((r) => r.data?.data || r.data);

export const joinBattleRoom = (payload: { roomId: string; participantId?: string }) =>
  api.post("/battle/join-room/", payload).then((r) => r.data?.data || r.data);

export const submitBattleAnswer = (payload: {
  roomId: string;
  participantId: string;
  questionId: string;
  selectedAnswer: number;
}) => api.post("/battle/submit-answer/", payload).then((r) => r.data?.data || r.data);
