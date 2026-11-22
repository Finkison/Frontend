export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  ABOUT: "/about",
  TEAM: "/how-we-work",
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
    PROFILE: "/student/profile"
  },
  PARENT: {
    ROOT: "/parent",
    CHILDREN: "/parent/children",
    RESULTS: "/parent/results",
    SETTINGS: "/parent/settings",
    MESSAGES: "/parent/messages",
    ALERTS: "/parent/alerts"
  },
  SCHOOL: {
    ROOT: "/school",
    STUDENTS: "/school/people",
    ANALYTICS: "/school/reports"
  }
} as const;

export type PortalArea = "student" | "parent" | "school" | "teacher";

export const PORTAL_ALLOWED_ROLES: Record<PortalArea, string[]> = {
  student: ["STUDENT", "ADMIN"],
  parent: ["PARENT", "ADMIN"],
  school: ["PRINCIPAL", "SCHOOL_ADMIN", "ADMIN", "SUPER_ADMIN", "TEACHER"],
  teacher: ["TEACHER", "ADMIN", "SUPER_ADMIN"],
};

export const ELEVATED_ROLES = ["ADMIN", "PRINCIPAL", "SUPER_ADMIN"] as const;

export function isElevatedRole(role?: string | null): boolean {
  return ELEVATED_ROLES.includes((role || "").toUpperCase() as (typeof ELEVATED_ROLES)[number]);
}

export function canAccessPortal(role: string | null | undefined, portal: PortalArea): boolean {
  const normalizedRole = (role || "").toUpperCase();
  return PORTAL_ALLOWED_ROLES[portal].includes(normalizedRole) || isElevatedRole(normalizedRole);
}
