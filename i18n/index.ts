import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import en from "./en.json";
import am from "./am.json";
import om from "./om.json";

export type SupportedLanguage = "en" | "am" | "om";

const resources = {
  en: { translation: en },
  am: { translation: am },
  om: { translation: om },
};

const supportedLanguages: SupportedLanguage[] = ["en", "am", "om"];

function getInitialLanguage(): SupportedLanguage {
  if (typeof window === "undefined") return "en";
  try {
    const savedLanguage = localStorage.getItem("finkison_language");
    return supportedLanguages.includes(savedLanguage as SupportedLanguage)
      ? (savedLanguage as SupportedLanguage)
      : "en";
  } catch {
    return "en";
  }
}

const initialLanguage = getInitialLanguage();

i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

if (typeof document !== "undefined") {
  document.documentElement.lang = initialLanguage;
  i18n.on("languageChanged", (language) => {
    const supportedLanguage = supportedLanguages.includes(language as SupportedLanguage)
      ? language
      : "en";
    document.documentElement.lang = supportedLanguage;
  });
}

export function useI18n() {
  const { t, i18n: i18nInstance } = useTranslation();
  const currentLang = supportedLanguages.includes(i18nInstance.language as SupportedLanguage)
    ? (i18nInstance.language as SupportedLanguage)
    : "en";

  const setLanguage = (lang: SupportedLanguage) => {
    if (!supportedLanguages.includes(lang)) return;
    void i18nInstance.changeLanguage(lang);
    try {
      localStorage.setItem("finkison_language", lang);
    } catch {}
  };

  return {
    language: currentLang,
    setLanguage,
    changeLanguage: setLanguage,
    t,
  };
}

export default i18n;
