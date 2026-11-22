export type UserRole = "STUDENT" | "TEACHER" | "PARENT" | "PRINCIPAL" | "SCHOOL_ADMIN" | "SUPER_ADMIN" | "ADMIN";

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
  targetScore?: number | null;
  currentPredictedScore?: number | null;
  predictedScore?: number | null;
  streakDays?: number;
  xpPoints?: number;
  nationalRank?: number;
  isSubscribed?: boolean;
  is_subscribed?: boolean;
  subscriptionTier?: string;
  preferredLanguage?: "English" | "Amharic" | "Afaan Oromoo";
}

export interface AuthTokens {
  access_token: string;
  token?: string;
  accessToken?: string;
  token_type?: string;
  expires_in?: number;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user: UserProfile;
    access_token: string;
    token?: string;
    accessToken?: string;
  };
}
