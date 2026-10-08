export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  ABOUT: "/about",
  TEAM: "/team",
  ACADEMICS: "/academics",
  STUDENT: {
    ROOT: "/student",
    LESSONS: "/student/lessons",
    PRACTICE: "/student/practice",
    EXAMS: "/student/exams",
    BATTLE: "/student/battle",
    AI_TUTOR: "/student/ai-tutor",
    SESSION: "/student/session",
    RESULTS: "/student/results",
    WEAK_AREAS: "/student/weak-areas",
    SCORE: "/student/score",
    LEADERBOARD: "/student/leaderboard",
    PROFILE: "/student/profile",
    DEPARTMENTS: "/student/departments"
  },
  PARENT: {
    ROOT: "/parent",
    CHILDREN: "/parent/children",
    ALERTS: "/parent/alerts"
  },
  SCHOOL: {
    ROOT: "/school",
    STUDENTS: "/school/students",
    ANALYTICS: "/school/analytics"
  }
} as const;
