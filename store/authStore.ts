import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface User {
  id?: string;
  name?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  role?: string;
  subject?: string;
  grade?: string;
  stream?: string;
  school?: string;
  schoolId?: string | null;
  isSchoolEnrolled?: boolean;
  region?: string;
  country?: string;
  targetScore?: number | null;
  currentPredictedScore?: number | null;
  streakDays?: number;
  xpPoints?: number;
  nationalRank?: number;
  preferredLanguage?: string;
  isSubscribed?: boolean;
  subscriptionTier?: string;
}

export interface AuthState {
  user: User | null;
  role: string | null;
  token: string | null;
  isAuthenticated: boolean;
  sessionInitialized: boolean;
  legacyRefreshToken: string | null;
  login: (user: User, role?: string, token?: string) => void;
  setTokens: (token: string) => void;
  setSessionInitialized: (initialized: boolean) => void;
  clearLegacyRefreshToken: () => void;
  discardPersistedCredentials: (legacyRefreshToken: string | null) => void;
  logout: () => void;
  updateUser: (partial: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      role: null,
      token: null,
      isAuthenticated: false,
      sessionInitialized: false,
      legacyRefreshToken: null,

      login: (user, role, token) => {
        const resolvedRole = role || user.role || null;
        const resolvedToken = token || null;

        try {
          if (resolvedToken) localStorage.setItem("finkison_token", resolvedToken);
          if (resolvedRole) localStorage.setItem("finkison_role", resolvedRole);
          localStorage.removeItem("finkison_refresh_token");
          localStorage.removeItem("finkison_user");
        } catch {}

        set({
          user,
          role: resolvedRole,
          token: resolvedToken,
          isAuthenticated: Boolean(resolvedToken),
          sessionInitialized: true,
          legacyRefreshToken: null,
        });
      },

      setTokens: (token) => set({ token, isAuthenticated: true }),

      setSessionInitialized: (sessionInitialized) => set({ sessionInitialized }),

      clearLegacyRefreshToken: () => set({ legacyRefreshToken: null }),

      discardPersistedCredentials: (legacyRefreshToken) => {
        try {
          localStorage.removeItem("finkison_token");
          localStorage.removeItem("finkison_refresh_token");
          localStorage.removeItem("finkison_user");
          localStorage.removeItem("finkison_role");
        } catch {}
        set({
          token: null,
          isAuthenticated: false,
          sessionInitialized: false,
          legacyRefreshToken,
        });
      },

      logout: () => {
        try {
          localStorage.removeItem("finkison_token");
          localStorage.removeItem("finkison_refresh_token");
          localStorage.removeItem("finkison_user");
          localStorage.removeItem("finkison_role");
        } catch {}

        set({
          user: null,
          role: null,
          token: null,
          isAuthenticated: false,
          sessionInitialized: true,
          legacyRefreshToken: null,
        });
      },

      updateUser: (partial) =>
        set((state) => {
          if (!state.user) return state;
          const updated = { ...state.user, ...partial };
          const newRole = partial.role !== undefined ? partial.role : state.role;
          return { user: updated, role: newRole };
        }),
    }),
    {
      name: "finkison_auth_storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, role: state.role }),
      onRehydrateStorage: () => (state) => {
        const persistedState = state as (AuthState & { refreshToken?: string }) | undefined;
        let legacyRefreshToken = persistedState?.refreshToken || null;
        try {
          legacyRefreshToken ||= localStorage.getItem("finkison_refresh_token");
        } catch {}
        persistedState?.discardPersistedCredentials(legacyRefreshToken);
      },
    }
  )
);

export default useAuthStore;
