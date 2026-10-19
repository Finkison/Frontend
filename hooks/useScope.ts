import {
  useScopeContext,
  ScopeProvider,
  buildScope,
  ScopeContext,
  GRADE_9_10_NATURAL_COURSES,
  GRADE_9_10_SOCIAL_COURSES,
  GRADE_9_10_CORE_COURSES,
  GRADE_9_10_ALL_SUBJECTS,
  SENIOR_NATURAL_SCIENCE_SUBJECTS,
  SENIOR_SOCIAL_SCIENCE_SUBJECTS,
  type UserRole,
  type GradeLevel,
  type StreamType,
  type UserScope,
} from "../context/ScopeContext";

export type { UserRole, GradeLevel, StreamType, UserScope };
export {
  ScopeProvider,
  buildScope,
  ScopeContext,
  GRADE_9_10_NATURAL_COURSES,
  GRADE_9_10_SOCIAL_COURSES,
  GRADE_9_10_CORE_COURSES,
  GRADE_9_10_ALL_SUBJECTS,
  SENIOR_NATURAL_SCIENCE_SUBJECTS,
  SENIOR_SOCIAL_SCIENCE_SUBJECTS,
};

/**
 * useScope - RBAC & Curriculum Scope Hook
 * Powered by canonical ScopeContext in ../context/ScopeContext.tsx
 */
export function useScope(): UserScope {
  return useScopeContext();
}

export default useScope;
