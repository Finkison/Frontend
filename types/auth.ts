export type UserRole = "STUDENT" | "TEACHER" | "PARENT" | "PRINCIPAL" | "SCHOOL_ADMIN" | "ADMIN";

export type StreamType = "Natural Science" | "Social Science" | "General Secondary";

export interface UserProfile {
  id: string;
  name: string;
  fullName?: string;
  phone: string;
  email?: string;
  role: UserRole;
  grade: string | number;
  stream: StreamType;
  school?: string;
  region?: string;
  targetUniversity?: string;
  targetScore?: number;
  currentPredictedScore?: number;
  predictedScore?: number;
  streakDays?: number;
  xpPoints?: number;
  nationalRank?: number;
  isSubscribed?: boolean;
  is_subscribed?: boolean;
  subscriptionTier?: string;
  preferredLanguage?: "English" | "Amharic" | "Afaan Oromoo";
}

export interface AuthTokens {
  token: string;
  accessToken: string;
  refreshToken?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user: UserProfile;
    token: string;
    accessToken: string;
    refreshToken?: string;
  };
}
