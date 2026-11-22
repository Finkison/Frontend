import {
  LayoutDashboard,
  Layers,
  ListChecks,
  FileSpreadsheet,
  CalendarCheck,
  CalendarDays,
  School,
  UserRoundPlus,
  Bell,
  MessageSquare,
  Users,
  HeartHandshake,
  CreditCard,
  FileText,
  HelpCircle,
  Settings,
  ShieldCheck,
  BookOpen,
  Sparkles,
  GraduationCap,
  FileCheck,
  BrainCircuit,
  TrendingUp,
  Repeat,
  type LucideIcon,
} from "lucide-react";

export type RoleType =
  | "SUPER_ADMIN"
  | "SCHOOL_ADMIN"
  | "PRINCIPAL"
  | "TEACHER"
  | "STUDENT"
  | "PARENT";

export interface NavItem {
  id: string;
  labelKey: string;
  to: string;
  icon: LucideIcon;
  badge?: number | string;
  disabled?: boolean;
  disabledReason?: string;
  grade12Only?: boolean;
}

export interface NavGroup {
  groupTitleKey?: string;
  items: NavItem[];
}

export interface RoleNavigationConfig {
  roleNameKey: string;
  primaryNav: NavItem[];
  secondaryNav: NavGroup;
  secondaryGroups?: NavGroup[];
  bottomItems: NavItem[];
  mobileBottomTabs?: NavItem[];
}

export const ROLE_NAVIGATION_MAP: Record<string, RoleNavigationConfig> = {

  SCHOOL_ADMIN: {
    roleNameKey: "schoolAdministrator",
    primaryNav: [
      { id: "dashboard", labelKey: "overview", to: "/school", icon: LayoutDashboard },
      { id: "people", labelKey: "people", to: "/school/people", icon: Users },
      { id: "sections", labelKey: "classes", to: "/school/sections", icon: Layers },
      { id: "assignments", labelKey: "teachingAssignments", to: "/school/assignments", icon: ListChecks },
      { id: "reports", labelKey: "reports", to: "/school/reports", icon: FileText },
      { id: "messages", labelKey: "messages", to: "/school/messages", icon: MessageSquare },
      { id: "billing", labelKey: "billing", to: "/school/billing", icon: CreditCard },
    ],
    secondaryNav: {
      groupTitleKey: "schoolAdministration",
      items: [
        { id: "settings", labelKey: "settings", to: "/school/settings", icon: Settings },
        { id: "schedule", labelKey: "schedule", to: "/school/schedule", icon: CalendarDays },
        { id: "school-join-requests", labelKey: "studentJoinRequests", to: "/school/join-requests", icon: UserRoundPlus },
        { id: "security", labelKey: "accountSecurity", to: "/school/security", icon: ShieldCheck },
        { id: "audit-log", labelKey: "activityLog", to: "/school/audit-log", icon: FileText },
      ],
    },
    bottomItems: [
      { id: "help", labelKey: "helpSupport", to: "/contact", icon: HelpCircle },
    ],
    mobileBottomTabs: [
      { id: "dashboard", labelKey: "overview", to: "/school", icon: LayoutDashboard },
      { id: "people", labelKey: "people", to: "/school/people", icon: Users },
      { id: "sections", labelKey: "classes", to: "/school/sections", icon: Layers },
      { id: "reports", labelKey: "reports", to: "/school/reports", icon: FileText },
    ],
  },

  TEACHER: {
    roleNameKey: "teacher",
    primaryNav: [
      { id: "dashboard", labelKey: "overview", to: "/teacher", icon: LayoutDashboard },
      { id: "my-sections", labelKey: "myClasses", to: "/teacher/sections", icon: Layers },
      { id: "lessons", labelKey: "lessons", to: "/teacher/lessons", icon: BookOpen },
      { id: "exams", labelKey: "exams", to: "/teacher/exams", icon: FileCheck },
      { id: "tasks", labelKey: "assignments", to: "/teacher/tasks", icon: ListChecks },
      { id: "question-bank", labelKey: "questionLibrary", to: "/teacher/question-bank", icon: Sparkles },
      { id: "assessment-builder", labelKey: "assessmentBuilder", to: "/teacher/assessment-builder", icon: FileCheck },
    ],
    secondaryNav: {
      groupTitleKey: "classroomTools",
      items: [
        { id: "gradebook", labelKey: "grades", to: "/teacher/gradebook", icon: FileSpreadsheet },
        { id: "diagnostic-scores", labelKey: "diagnosticScores", to: "/teacher/diagnostic-scores", icon: TrendingUp },
        { id: "ai-teaching-tools", labelKey: "aiTeachingTools", to: "/teacher/ai-tools", icon: Sparkles },
        { id: "attendance", labelKey: "attendance", to: "/teacher/attendance", icon: CalendarCheck },
        { id: "schedule", labelKey: "schedule", to: "/teacher/schedule", icon: CalendarDays },
        { id: "past-papers", labelKey: "pastExamPapers", to: "/teacher/past-papers", icon: GraduationCap, grade12Only: true },
        { id: "messages", labelKey: "messages", to: "/teacher/messages", icon: MessageSquare },
        { id: "security", labelKey: "accountSecurity", to: "/teacher/security", icon: ShieldCheck },
      ],
    },
    bottomItems: [
      { id: "help", labelKey: "helpSupport", to: "/contact", icon: HelpCircle },
    ],
    mobileBottomTabs: [
      { id: "dashboard", labelKey: "overview", to: "/teacher", icon: LayoutDashboard },
      { id: "my-sections", labelKey: "myClasses", to: "/teacher/sections", icon: Layers },
      { id: "tasks", labelKey: "assignments", to: "/teacher/tasks", icon: ListChecks },
      { id: "attendance", labelKey: "attendance", to: "/teacher/attendance", icon: CalendarCheck },
    ],
  },

  STUDENT: {
    roleNameKey: "student",
    primaryNav: [
      { id: "dashboard", labelKey: "overview", to: "/student", icon: LayoutDashboard },
      { id: "lessons", labelKey: "lessons", to: "/student/lessons", icon: BookOpen },
      { id: "practice", labelKey: "practice", to: "/student/practice", icon: Sparkles },
      { id: "exams", labelKey: "exams", to: "/student/exams", icon: FileCheck },
    ],
    secondaryNav: {
      groupTitleKey: "learningTools",
      items: [
        { id: "class-resources", labelKey: "learningResources", to: "/student/resources", icon: BookOpen },
        { id: "coursework", labelKey: "classwork", to: "/student/coursework", icon: ListChecks },
        { id: "progress", labelKey: "progress", to: "/student/score", icon: TrendingUp },
        { id: "study-tools", labelKey: "studyTools", to: "/student/notes", icon: BrainCircuit },
        { id: "ai-tutor", labelKey: "aiTutor", to: "/student/ai-tutor", icon: BrainCircuit },
        { id: "study-plan", labelKey: "studyPlan", to: "/student/study-plan", icon: CalendarDays },
        { id: "spaced-review", labelKey: "spacedReview", to: "/student/spaced-review", icon: Repeat },
        { id: "knowledge-map", labelKey: "knowledgeMap", to: "/student/knowledge-map", icon: BrainCircuit },
        { id: "weak-areas", labelKey: "weakAreas", to: "/student/weak-areas", icon: TrendingUp },
        { id: "exam-history", labelKey: "examHistory", to: "/student/exam-history", icon: FileSpreadsheet },
        { id: "achievements", labelKey: "achievements", to: "/student/achievements", icon: Sparkles },
        { id: "past-papers", labelKey: "pastExamPapers", to: "/student/past-papers", icon: GraduationCap, grade12Only: true },
        { id: "attendance-record", labelKey: "attendanceRecord", to: "/student/attendance", icon: CalendarCheck },
        { id: "school-access", labelKey: "schoolAccess", to: "/student/school-access", icon: School },
      ],
    },
    secondaryGroups: [
      {
        groupTitleKey: "learningTools",
        items: [
          { id: "class-resources", labelKey: "learningResources", to: "/student/resources", icon: BookOpen },
          { id: "coursework", labelKey: "classwork", to: "/student/coursework", icon: ListChecks },
          { id: "progress", labelKey: "progress", to: "/student/score", icon: TrendingUp },
          { id: "study-tools", labelKey: "studyTools", to: "/student/notes", icon: BrainCircuit },
          { id: "ai-tutor", labelKey: "aiTutor", to: "/student/ai-tutor", icon: BrainCircuit },
          { id: "study-plan", labelKey: "studyPlan", to: "/student/study-plan", icon: CalendarDays },
          { id: "spaced-review", labelKey: "spacedReview", to: "/student/spaced-review", icon: Repeat },
        ],
      },
      {
        groupTitleKey: "moreLearning",
        items: [
          { id: "knowledge-map", labelKey: "knowledgeMap", to: "/student/knowledge-map", icon: BrainCircuit },
          { id: "weak-areas", labelKey: "weakAreas", to: "/student/weak-areas", icon: TrendingUp },
          { id: "exam-history", labelKey: "examHistory", to: "/student/exam-history", icon: FileSpreadsheet },
          { id: "achievements", labelKey: "achievements", to: "/student/achievements", icon: Sparkles },
          { id: "past-papers", labelKey: "pastExamPapers", to: "/student/past-papers", icon: GraduationCap, grade12Only: true },
          { id: "attendance-record", labelKey: "attendanceRecord", to: "/student/attendance", icon: CalendarCheck },
          { id: "school-access", labelKey: "schoolAccess", to: "/student/school-access", icon: School },
        ],
      },
    ],
    bottomItems: [
      { id: "help", labelKey: "helpSupport", to: "/contact", icon: HelpCircle },
      { id: "billing", labelKey: "studentPlansBilling", to: "/student/subscription", icon: CreditCard },
      { id: "settings", labelKey: "settings", to: "/student/settings", icon: Settings },
    ],
    mobileBottomTabs: [
      { id: "dashboard", labelKey: "overview", to: "/student", icon: LayoutDashboard },
      { id: "lessons", labelKey: "lessons", to: "/student/lessons", icon: BookOpen },
      { id: "coursework", labelKey: "classwork", to: "/student/coursework", icon: ListChecks },
      { id: "practice", labelKey: "practice", to: "/student/practice", icon: Sparkles },
    ],
  },

  PARENT: {
    roleNameKey: "parentGuardian",
    primaryNav: [
      { id: "dashboard", labelKey: "overview", to: "/parent", icon: LayoutDashboard },
      { id: "children", labelKey: "myChildren", to: "/parent/children", icon: HeartHandshake },
      { id: "results", labelKey: "results", to: "/parent/results", icon: FileSpreadsheet },
      { id: "messages", labelKey: "messages", to: "/parent/messages", icon: MessageSquare },
    ],
    secondaryNav: {
      groupTitleKey: "updates",
      items: [
        { id: "notifications", labelKey: "notifications", to: "/parent/alerts", icon: Bell },
      ],
    },
    bottomItems: [
      { id: "help", labelKey: "helpSupport", to: "/contact", icon: HelpCircle },
      { id: "settings", labelKey: "settings", to: "/parent/settings", icon: Settings },
    ],
    mobileBottomTabs: [
      { id: "dashboard", labelKey: "overview", to: "/parent", icon: LayoutDashboard },
      { id: "children", labelKey: "myChildren", to: "/parent/children", icon: HeartHandshake },
      { id: "results", labelKey: "results", to: "/parent/results", icon: FileSpreadsheet },
      { id: "messages", labelKey: "messages", to: "/parent/messages", icon: MessageSquare },
      { id: "notifications", labelKey: "notifications", to: "/parent/alerts", icon: Bell },
    ],
  },
};

export function getNavigationForRole(role?: string, grade?: string | number): RoleNavigationConfig {
  const normalized = (role || "").toUpperCase();
  let config: RoleNavigationConfig;

  if (normalized === "SUPER_ADMIN" || normalized === "ADMIN" || normalized === "PRINCIPAL" || normalized === "SCHOOL_ADMIN") {
    config = ROLE_NAVIGATION_MAP.SCHOOL_ADMIN;
  } else if (normalized === "TEACHER") {
    config = ROLE_NAVIGATION_MAP.TEACHER;
  } else if (normalized === "PARENT") {
    config = ROLE_NAVIGATION_MAP.PARENT;
  } else {
    config = ROLE_NAVIGATION_MAP.STUDENT;
  }

  const isGrade12 = grade != null && /(^|\D)12(\D|$)/.test(String(grade));
  const canSeeGrade12Resources = normalized === "TEACHER" || isGrade12;
  if (!canSeeGrade12Resources) {
    return {
      ...config,
      secondaryNav: {
        ...config.secondaryNav,
        items: config.secondaryNav.items.filter((item) => !item.grade12Only),
      },
    };
  }

  return config;
}
