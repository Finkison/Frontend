
import React, { createContext, useContext, useMemo } from "react";
import useAuthStore, { User } from "../store/authStore";

// ─── Types ───
export type UserRole = "STUDENT" | "TEACHER" | "PRINCIPAL" | "PARENT" | "ADMIN";
export type GradeLevel = 9 | 10 | 11 | 12;
export type StreamType = "Natural Science" | "Social Science" | "General Secondary";

export interface UserScope {
  /** Current user role */
  role: UserRole;
  
  gradeLevel: GradeLevel;
  
  gradeDisplay: string;
  /** Academic stream */
  stream: StreamType;
  /** User-friendly stream label */
  streamDisplay: string;
  /** Short stream label */
  streamShort: string;
  
  isJuniorSecondary: boolean;
  
  canSelectStream: boolean;
  
  naturalCourses: string[];
  
  socialCourses: string[];
  /** Core foundational courses */
  commonCourses: string[];
  
  isAuthenticated: boolean;
  
  isElevated: boolean;
  
  isStudent: boolean;
  
  isEducator: boolean;
  
  isParent: boolean;

  canAccessLearning: boolean;
  
  canAccessSchoolAdmin: boolean;
  
  canAccessParentPortal: boolean;
  
  canAccessBattleArena: boolean;
  
  canAccessScholarships: boolean;
  
  canAccessScorePredictor: boolean;
  
  canAccessPastPapers: boolean;
  
  canAccessDepartments: boolean;
  
  canAccessStudyPlan: boolean;
  
  canAccessSpacedReview: boolean;
  
  canAccessKnowledgeMap: boolean;

  availableSubjects: string[];
  
  visibleGradeLevels: GradeLevel[];
  
  homeRoute: string;
}

export const GRADE_9_10_NATURAL_COURSES = ["Physics", "Chemistry", "Biology"];
export const GRADE_9_10_SOCIAL_COURSES = ["History", "Geography", "Economics", "Civics"];
export const GRADE_9_10_CORE_COURSES = ["Mathematics", "English", "Information Technology"];
export const GRADE_9_10_ALL_SUBJECTS = [
  "Mathematics",
  "English",
  "Physics",
  "Chemistry",
  "Biology",
  "History",
  "Geography",
  "Economics",
  "Civics",
  "Information Technology"
];

export const SENIOR_NATURAL_SCIENCE_SUBJECTS = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Aptitude"];
export const SENIOR_SOCIAL_SCIENCE_SUBJECTS = ["Mathematics", "History", "Geography", "Economics", "Civics", "English", "Aptitude"];

function getSubjectsForScope(stream: StreamType, grade: GradeLevel): string[] {

  if (grade <= 10) {
    return GRADE_9_10_ALL_SUBJECTS;
  }

  if (stream === "Social Science") return SENIOR_SOCIAL_SCIENCE_SUBJECTS;
  return SENIOR_NATURAL_SCIENCE_SUBJECTS;
}

function parseGradeLevel(grade?: string | number): GradeLevel {
  if (!grade) return 12;
  const numStr = String(grade).replace(/[^0-9]/g, "");
  const num = parseInt(numStr, 10);
  if (num >= 9 && num <= 12) return num as GradeLevel;
  return 12;
}

function parseStream(stream?: string, gradeLevel?: GradeLevel): StreamType {

  if (gradeLevel && gradeLevel <= 10) {
    return "General Secondary";
  }
  if (!stream) return "Natural Science";
  const lower = stream.toLowerCase();
  if (lower.includes("social")) return "Social Science";
  if (lower.includes("general") || lower.includes("common")) return "General Secondary";
  return "Natural Science";
}

function parseRole(role?: string): UserRole {
  if (!role) return "STUDENT";
  const upper = role.toUpperCase();
  if (upper === "TEACHER") return "TEACHER";
  if (upper === "PRINCIPAL") return "PRINCIPAL";
  if (upper === "PARENT") return "PARENT";
  if (upper === "ADMIN") return "ADMIN";
  return "STUDENT";
}

function buildScope(user: User | null, role: string | null, isAuthenticated: boolean): UserScope {
  const userRole = parseRole(role || user?.role);
  const gradeLevel = parseGradeLevel(user?.grade);
  const isJuniorSecondary = gradeLevel <= 10;
  const canSelectStream = !isJuniorSecondary;

  const stream: StreamType = isJuniorSecondary ? "General Secondary" : parseStream(user?.stream, gradeLevel);

  const streamDisplay = isJuniorSecondary
    ? "General Secondary (Natural & Social Sciences)"
    : `${stream} Stream`;

  const streamShort = isJuniorSecondary
    ? "Common (All Courses)"
    : stream;

  const isElevated = userRole === "ADMIN" || userRole === "PRINCIPAL";
  const isStudent = userRole === "STUDENT";
  const isEducator = userRole === "TEACHER" || userRole === "PRINCIPAL";
  const isParent = userRole === "PARENT";

  const isSenior = gradeLevel >= 11;

  const canAccessLearning = isStudent || isElevated;
  const canAccessSchoolAdmin = isEducator || isElevated;
  const canAccessParentPortal = isParent || isElevated;

  const canAccessBattleArena = (isStudent && isSenior) || isElevated;
  const canAccessScholarships = (isStudent && isSenior) || isElevated;
  const canAccessScorePredictor = (isStudent && isSenior) || isElevated;
  const canAccessPastPapers = (isStudent && isSenior) || isElevated;
  const canAccessDepartments = (isStudent && isSenior) || isElevated;

  const canAccessStudyPlan = isStudent || isElevated;
  const canAccessSpacedReview = isStudent || isElevated;
  const canAccessKnowledgeMap = isStudent || isElevated;

  const availableSubjects = getSubjectsForScope(stream, gradeLevel);

  const visibleGradeLevels: GradeLevel[] = isElevated
    ? [9, 10, 11, 12]
    : isEducator
    ? [9, 10, 11, 12]
    : [gradeLevel];

  const homeRoute = isParent
    ? "/parent"
    : isEducator
    ? "/school"
    : "/student";

  return {
    role: userRole,
    gradeLevel,
    gradeDisplay: `Grade ${gradeLevel}`,
    stream,
    streamDisplay,
    streamShort,
    isJuniorSecondary,
    canSelectStream,
    naturalCourses: isJuniorSecondary ? GRADE_9_10_NATURAL_COURSES : (stream === "Natural Science" ? ["Physics", "Chemistry", "Biology"] : []),
    socialCourses: isJuniorSecondary ? GRADE_9_10_SOCIAL_COURSES : (stream === "Social Science" ? ["History", "Geography", "Economics", "Civics"] : []),
    commonCourses: isJuniorSecondary ? GRADE_9_10_CORE_COURSES : ["Mathematics", "English", "Aptitude"],
    isAuthenticated,
    isElevated,
    isStudent,
    isEducator,
    isParent,
    canAccessLearning,
    canAccessSchoolAdmin,
    canAccessParentPortal,
    canAccessBattleArena,
    canAccessScholarships,
    canAccessScorePredictor,
    canAccessPastPapers,
    canAccessDepartments,
    canAccessStudyPlan,
    canAccessSpacedReview,
    canAccessKnowledgeMap,
    availableSubjects,
    visibleGradeLevels,
    homeRoute,
  };
}

// ─── Context ───
const ScopeContext = createContext<UserScope>(
  buildScope(null, null, false)
);

export function ScopeProvider({ children }: { children: React.ReactNode }) {
  const { user, role, isAuthenticated } = useAuthStore();

  const scope = useMemo(
    () => buildScope(user, role, isAuthenticated),
    [user, role, isAuthenticated]
  );

  return (
    <ScopeContext.Provider value={scope}>
      {children}
    </ScopeContext.Provider>
  );
}

export function useScope(): UserScope {
  return useContext(ScopeContext);
}

export default useScope;
