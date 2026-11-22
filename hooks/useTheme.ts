import { useThemeContext, ThemeProvider, type ThemeContextType, type ThemeMode } from "../context/ThemeContext";

export type { ThemeContextType, ThemeMode };
export { ThemeProvider };

export function useTheme(): ThemeContextType {
  return useThemeContext();
}

export default useTheme;
