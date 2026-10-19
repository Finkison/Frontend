import { useThemeContext, ThemeProvider, type ThemeContextType, type ThemeMode } from "../context/ThemeContext";

export type { ThemeContextType, ThemeMode };
export { ThemeProvider };

/**
 * useTheme - Hook to access active theme state and toggles
 * Powered by canonical ThemeContext in ../context/ThemeContext.tsx
 */
export function useTheme(): ThemeContextType {
  return useThemeContext();
}

export default useTheme;
