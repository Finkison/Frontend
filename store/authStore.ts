import { create } from "zustand";

export interface User {
  id?: string;
  name?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  role?: string;
  grade?: string;
  stream?: string;
  school?: string;
  region?: string;
  country?: string;
  targetUniversity?: string;
  targetScore?: number;
  currentPredictedScore?: number;
  streakDays?: number;
  xpPoints?: number;
  nationalRank?: number;
  preferredLanguage?: string;
  isSubscribed?: boolean;
  subscriptionTier?: string;
  [key: string]: any;
}

export interface AuthState {
  user: User | null;
  role: string | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, role?: string, token?: string) => void;
  logout: () => void;
  updateUser: (partial: Partial<User>) => void;
}

const getInitialAuth = () => {
  try {
    const storedToken = localStorage.getItem("finkison_token");
    const storedUserStr = localStorage.getItem("finkison_user");
    const storedRole = localStorage.getItem("finkison_role");

    if (storedToken && storedUserStr) {
      const parsedUser = JSON.parse(storedUserStr);
      return {
        token: storedToken,
        user: parsedUser,
        role: storedRole || parsedUser.role || "STUDENT",
        isAuthenticated: true,
      };
    }
  } catch {
  }
  return {
    token: null,
    user: null,
    role: null,
    isAuthenticated: false,
  };
};

const initial = getInitialAuth();

const useAuthStore = create<AuthState>((set) => ({
  user: initial.user,
  role: initial.role,
  token: initial.token,
  isAuthenticated: initial.isAuthenticated,

  login: (user, role, token) => {
    const resolvedRole = role || user.role || "STUDENT";
    const resolvedToken = token || "finkison_auth_jwt_token";

    try {
      localStorage.setItem("finkison_token", resolvedToken);
      localStorage.setItem("finkison_user", JSON.stringify(user));
      localStorage.setItem("finkison_role", resolvedRole);
    } catch {}

    set({
      user,
      role: resolvedRole,
      token: resolvedToken,
      isAuthenticated: true,
    });
  },

  logout: () => {
    try {
      localStorage.removeItem("finkison_token");
      localStorage.removeItem("finkison_user");
      localStorage.removeItem("finkison_role");
    } catch {}

    set({
      user: null,
      role: null,
      token: null,
      isAuthenticated: false,
    });
  },

  updateUser: (partial) =>
    set((state) => {
      if (!state.user) return state;
      const updated = { ...state.user, ...partial };
      try {
        localStorage.setItem("finkison_user", JSON.stringify(updated));
      } catch {}
      return { user: updated };
    }),
}));

export default useAuthStore;
