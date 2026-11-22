import React from "react";
import { Moon, Sun } from "lucide-react";
import { useI18n } from "../../i18n";
import { useTheme } from "../../hooks/useTheme";

type PublicPreferencesProps = {
  variant?: "header" | "drawer" | "floating";
  showLanguage?: boolean;
};

export default function PublicPreferences({ variant = "header", showLanguage = true }: PublicPreferencesProps): React.ReactElement {
  const { language, setLanguage, t } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const compact = variant === "header";
  const floating = variant === "floating";

  return (
    <div className={`flex items-center gap-2 ${floating ? "rounded-xl border border-[#E7E0D6] bg-white/95 p-1 shadow-sm dark:border-white/10 dark:bg-[#261E1A]/95" : ""}`}>
      {showLanguage && (
        <>
          <label className="sr-only" htmlFor={`public-language-${variant}`}>{t("public.language")}</label>
          <select
            id={`public-language-${variant}`}
            value={language}
            onChange={(event) => setLanguage(event.target.value as "en" | "am" | "om")}
            className={compact
              ? "h-9 w-[128px] rounded-lg border border-stone-200 bg-white/80 px-1.5 text-[11px] font-medium text-stone-700 shadow-none focus:border-[#881337] focus:outline-none focus:ring-2 focus:ring-[#881337]/20 dark:border-white/15 dark:bg-white/5 dark:text-stone-100"
              : "h-11 min-w-0 flex-1 rounded-xl border border-stone-300 bg-white px-3 text-sm font-medium text-stone-800 focus:border-[#881337] focus:outline-none focus:ring-2 focus:ring-[#881337]/20 dark:border-white/15 dark:bg-white/5 dark:text-white"}
          >
            <option value="en">English</option>
            <option value="am">አማርኛ</option>
            <option value="om">Afaan Oromo</option>
          </select>
        </>
      )}
      <button
        type="button"
        onClick={toggleTheme}
        className={compact
          ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#881337] dark:text-stone-300 dark:hover:bg-white/10 dark:hover:text-white"
          : "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#881337] dark:border-white/15 dark:text-stone-200 dark:hover:bg-white/10"}
        aria-label={t(theme === "dark" ? "public.theme.switchToLight" : "public.theme.switchToDark")}
        title={t(theme === "dark" ? "public.theme.switchToLight" : "public.theme.switchToDark")}
      >
        {theme === "dark" ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
      </button>
    </div>
  );
}
