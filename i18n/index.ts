import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import en from "./en.json";

const resources = {
  en: { translation: en },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export function useI18n() {
  const { t } = useTranslation();
  return {
    language: "en",
    setLanguage: (_lang: string) => {
      // Platform is standardized to English
    },
    t,
  };
}

export default i18n;
