import {
  LayoutDashboard,
  Layers,
  ListChecks,
  FileSpreadsheet,
  CalendarCheck,
  MessageSquare,
  Users,
  HeartHandshake,
  CreditCard,
  FileText,
  HelpCircle,
  Settings,
  ShieldCheck,
  Receipt,
  BookOpen,
  Sparkles,
  GraduationCap,
  FileCheck,
  BrainCircuit,
  TrendingUp,
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
  label: string;
  to: string;
  icon: LucideIcon;
  badge?: number | string;
  disabled?: boolean;
  disabledReason?: string;
  grade12Only?: boolean;
}

export interface NavGroup {
  groupTitle?: string;
  items: NavItem[];
}

export interface RoleNavigationConfig {
  roleName: string;
  primaryNav: NavItem[];
  secondaryNav: NavGroup;
  bottomItems: NavItem[];
  mobileBottomTabs?: NavItem[];
}

export const ROLE_NAVIGATION_MAP: Record<string, RoleNavigationConfig> = {
  // School Director (tenant owner - monitoring, people, assignments, settings, audit)
  SCHOOL_ADMIN: {
    roleName: "School Director",
    primaryNav: [
      { id: "dashboard", label: "Dashboard", to: "/school", icon: LayoutDashboard },
      { id: "people", label: "People", to: "/school/people", icon: Users },
      { id: "sections", label: "Sections", to: "/school/sections", icon: Layers },
      { id: "assignments", label: "Assignments", to: "/school/assignments", icon: ListChecks },
      { id: "reports", label: "Reports", to: "/school/reports", icon: FileText },
      { id: "messages", label: "Messages", to: "/school/messages", icon: MessageSquare },
      { id: "billing", label: "Billing", to: "/school/billing", icon: CreditCard },
    ],
    secondaryNav: {
      groupTitle: "Governance",
      items: [
        { id: "settings", label: "Settings", to: "/school/settings", icon: Settings },
        { id: "security", label: "Account Security", to: "/school/security", icon: ShieldCheck },
        { id: "audit-log", label: "Audit log", to: "/school/audit-log", icon: FileText },
      ],
    },
    bottomItems: [
      { id: "help", label: "Help & Support", to: "/contact", icon: HelpCircle },
    ],
  },

  // Teacher (assigned subject only - teaching assistant, assigned sections only)
  TEACHER: {
    roleName: "Subject Teacher",
    primaryNav: [
      { id: "dashboard", label: "Dashboard", to: "/teacher", icon: LayoutDashboard },
      { id: "my-sections", label: "My sections", to: "/teacher/sections", icon: Layers },
      { id: "lessons", label: "Lessons", to: "/teacher/lessons", icon: BookOpen },
      { id: "exams", label: "Exams", to: "/teacher/exams", icon: FileCheck },
      { id: "tasks", label: "Tasks", to: "/teacher/tasks", icon: ListChecks },
      { id: "question-bank", label: "Question bank", to: "/teacher/question-bank", icon: Sparkles },
      { id: "ai-assistant", label: "AI assistant", to: "/teacher/ai-assistant", icon: BrainCircuit },
    ],
    secondaryNav: {
      groupTitle: "Classroom Tools",
      items: [
        { id: "gradebook", label: "Gradebook", to: "/teacher/gradebook", icon: FileSpreadsheet },
        { id: "attendance", label: "Attendance", to: "/teacher/attendance", icon: CalendarCheck },
        { id: "past-papers", label: "Past papers", to: "/teacher/past-papers", icon: GraduationCap, grade12Only: true },
        { id: "messages", label: "Messages", to: "/teacher/messages", icon: MessageSquare },
        { id: "security", label: "Account Security", to: "/teacher/security", icon: ShieldCheck },
      ],
    },
    bottomItems: [
      { id: "help", label: "Help & Support", to: "/contact", icon: HelpCircle },
    ],
  },

  // Student (own section, own results only)
  STUDENT: {
    roleName: "Student",
    primaryNav: [
      { id: "dashboard", label: "Dashboard", to: "/student", icon: LayoutDashboard },
      { id: "lessons", label: "Lessons", to: "/student/lessons", icon: BookOpen },
      { id: "practice", label: "Practice", to: "/student/practice", icon: Sparkles },
      { id: "exams", label: "Exams", to: "/student/exams", icon: FileCheck },
      { id: "study-tools", label: "Study tools", to: "/student/notes", icon: BrainCircuit },
      { id: "progress", label: "Progress", to: "/student/score", icon: TrendingUp },
    ],
    secondaryNav: {
      groupTitle: "Communication & Archives",
      items: [
        { id: "messages", label: "Messages", to: "/parent/messages", icon: MessageSquare },
        { id: "past-papers", label: "Past papers", to: "/student/past-papers", icon: GraduationCap, grade12Only: true },
      ],
    },
    bottomItems: [
      { id: "help", label: "Help & Support", to: "/contact", icon: HelpCircle },
      { id: "settings", label: "Settings", to: "/student/settings", icon: Settings },
    ],
    mobileBottomTabs: [
      { id: "dashboard", label: "Dashboard", to: "/student", icon: LayoutDashboard },
      { id: "lessons", label: "Lessons", to: "/student/lessons", icon: BookOpen },
      { id: "practice", label: "Practice", to: "/student/practice", icon: Sparkles },
      { id: "exams", label: "Exams", to: "/student/exams", icon: FileCheck },
      { id: "progress", label: "Progress", to: "/student/score", icon: TrendingUp },
    ],
  },

  // Parent (linked children only)
  PARENT: {
    roleName: "Parent",
    primaryNav: [
      { id: "dashboard", label: "Dashboard", to: "/parent", icon: LayoutDashboard },
      { id: "children", label: "Children", to: "/parent", icon: HeartHandshake },
      { id: "results", label: "Results", to: "/parent", icon: FileSpreadsheet },
      { id: "messages", label: "Messages", to: "/parent/messages", icon: MessageSquare },
      { id: "fees", label: "Fees", to: "/client", icon: Receipt },
    ],
    secondaryNav: {
      groupTitle: "Notifications",
      items: [
        { id: "attendance", label: "Attendance alerts", to: "/parent/alerts", icon: CalendarCheck },
      ],
    },
    bottomItems: [
      { id: "help", label: "Help & Support", to: "/contact", icon: HelpCircle },
      { id: "settings", label: "Settings", to: "/parent", icon: Settings },
    ],
    mobileBottomTabs: [
      { id: "dashboard", label: "Dashboard", to: "/parent", icon: LayoutDashboard },
      { id: "children", label: "Children", to: "/parent", icon: HeartHandshake },
      { id: "results", label: "Results", to: "/parent", icon: FileSpreadsheet },
      { id: "messages", label: "Messages", to: "/parent/messages", icon: MessageSquare },
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

  // Filter out Grade 12 only items if student/teacher is not Grade 12
  const isGrade12 = grade ? String(grade).includes("12") : true; // Default true if unspecified
  if (!isGrade12) {
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
