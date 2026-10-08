export const APP_CONFIG = {
  APP_NAME: "Finkison",
  TAGLINE: "Ethiopian National Entrance Examination (EUEE) EdTech Platform",
  API_BASE_URL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api",
  EXAM_YEAR: "2016 E.C. / 2024 G.C.",
  EXAM_COUNTDOWN_DAYS: 118,
  DEFAULT_STREAM: "Natural Science",
  SUPPORTED_LANGUAGES: [
    { code: "en", label: "English" },
    { code: "am", label: "አማርኛ" },
    { code: "or", label: "Afaan Oromoo" }
  ],
  PRICING: {
    MONTHLY: {
      AMOUNT: 150,
      PLAN_NAME: "Monthly Pro Pass"
    },
    SEASON: {
      AMOUNT: 450,
      PLAN_NAME: "Entrance Season Pass"
    }
  },
  PAYMENT_GATEWAY: "Chapa"
} as const;
