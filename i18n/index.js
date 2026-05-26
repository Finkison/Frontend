import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import en from "./en.json";
import am from "./am.json";
import om from "./om.json";

const resources = {
  en: { translation: en },
  am: { translation: am },
  om: { translation: om },
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
  const { t, i18n: instance } = useTranslation();
  return {
    language: instance.language,
    setLanguage: (lang) => instance.changeLanguage(lang),
    t,
  };
}

export default i18n;
