import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  role: null,
  token: null,
  isAuthenticated: false,
  login: (user, role, token) => set({ user, role, token, isAuthenticated: true }),
  logout: () => set({ user: null, role: null, token: null, isAuthenticated: false }),
}));

export default useAuthStore;
