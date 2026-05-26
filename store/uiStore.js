import { create } from "zustand";

const useUiStore = create((set) => ({
  language: "en",
  theme: "light",
  setLanguage: (language) => set({ language }),
  setTheme: (theme) => set({ theme }),
}));

export default useUiStore;
