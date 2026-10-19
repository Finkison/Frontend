/**
 * ============================================================================
 * FINKISON ENTERPRISE ROLE-BASED NAVIGATION MANIFEST
 * ============================================================================
 * Authoritative, type-safe navigation contracts strictly scoped by user role.
 * Implements the Zero-Leakage Access Model ensuring that each role exclusively
 * sees only their permitted services in navigation, drawers, and search modals.
 * ============================================================================
 */

export interface NavItem {
  id: string;
  label: string;
  to: string;
  icon: string;
  description?: string;
  badge?: string;
}

export interface NavGroup {
  id: string;
  title: string;
  items: NavItem[];
}

export interface RoleNavigationConfig {
  portalTitle: string;
  homeRoute: string;
  primaryNav: NavGroup[];
  quickActions: NavItem[];
}

export const ROLE_NAVIGATION_MANIFEST: Record<string, RoleNavigationConfig> = {
  STUDENT: {
    portalTitle: "Candidate Portal",
    homeRoute: "/student",
    primaryNav: [
      {
        id: "learn",
        title: "Learn & Resources",
        items: [
          { id: "lessons", label: "Course Materials", to: "/student/lessons", icon: "BookOpen", description: "Structured national lessons" },
          { id: "notes", label: "Smart Notes", to: "/student/notes", icon: "FileText", description: "AI-generated summaries" },
          { id: "map", label: "Learning Pathway", to: "/student/knowledge-map", icon: "Network", description: "Prerequisite concept map" },
          { id: "srs", label: "Spaced Repetition", to: "/student/spaced-review", icon: "Brain", description: "Flashcard retention system" },
          { id: "planner", label: "Study Planner", to: "/student/study-plan", icon: "Calendar", description: "Adaptive daily schedule" },
        ],
      },
      {
        id: "practice",
        title: "Practice & Drills",
        items: [
          { id: "drills", label: "Question Bank", to: "/student/practice", icon: "Sparkles", description: "Adaptive topic drills" },
          { id: "tutor", label: "AI Tutor", to: "/student/ai-tutor", icon: "Bot", description: "24/7 guided explanations" },
          { id: "battle", label: "Quiz Arena", to: "/student/battle", icon: "Swords", description: "Real-time competitive quizzes" },
        ],
      },
      {
        id: "assessments",
        title: "Assessments",
        items: [
          { id: "mock", label: "Mock Tests", to: "/student/exams", icon: "FileCheck2", description: "Full-length timed exams" },
          { id: "past", label: "Past Papers", to: "/student/past-papers", icon: "GraduationCap", description: "Official archives with solutions" },
          { id: "history", label: "Score Analysis", to: "/student/exam-history", icon: "TrendingUp", description: "Performance history" },
        ],
      },
      {
        id: "analytics",
        title: "Progress & Goals",
        items: [
          { id: "predictor", label: "Score Predictor", to: "/student/score", icon: "TrendingUp", description: "University entrance forecast" },
          { id: "gaps", label: "Knowledge Gaps", to: "/student/weak-areas", icon: "Target", description: "Targeted weakness drills" },
          { id: "pathways", label: "University Pathways", to: "/student/departments", icon: "Building2", description: "Department requirements" },
          { id: "ranks", label: "Leaderboard", to: "/student/leaderboard", icon: "Flame", description: "National XP rankings" },
          { id: "badges", label: "Achievements", to: "/student/achievements", icon: "Award", description: "Milestone badges" },
        ],
      },
    ],
    quickActions: [
      { id: "profile", label: "My Profile", to: "/student/profile", icon: "User" },
      { id: "settings", label: "Settings", to: "/student/settings", icon: "Settings" },
    ],
  },

  TEACHER: {
    portalTitle: "Faculty Portal",
    homeRoute: "/school",
    primaryNav: [
      {
        id: "operations",
        title: "Classroom & Students",
        items: [
          { id: "dash", label: "School Dashboard", to: "/school", icon: "LayoutDashboard", description: "Institutional overview" },
          { id: "classes", label: "Class Sections", to: "/school/class", icon: "Layers", description: "Manage class cohorts" },
          { id: "students", label: "Student Roster", to: "/school/students", icon: "Users", description: "Marks, continuous assessment & conduct" },
          { id: "proctor", label: "Live Proctoring", to: "/school/proctor", icon: "ShieldCheck", description: "Real-time exam monitor" },
        ],
      },
      {
        id: "academics",
        title: "Faculty & Transcripts",
        items: [
          { id: "faculty", label: "Faculty Directory", to: "/school/teachers", icon: "GraduationCap", description: "Teacher profiles & assignments" },
          { id: "reports", label: "Official Reports", to: "/school/reports", icon: "FileSpreadsheet", description: "Official report cards & exports" },
          { id: "curriculum", label: "National Syllabi", to: "/academics", icon: "BookOpen", description: "Grades 9–12 standards" },
        ],
      },
    ],
    quickActions: [
      { id: "settings", label: "Preferences", to: "/school/settings", icon: "Settings" },
    ],
  },

  PRINCIPAL: {
    portalTitle: "Institutional Administration",
    homeRoute: "/school",
    primaryNav: [
      {
        id: "operations",
        title: "Institutional Operations",
        items: [
          { id: "dash", label: "Executive Dashboard", to: "/school", icon: "LayoutDashboard", description: "School-wide metrics & attendance" },
          { id: "classes", label: "Class Sections", to: "/school/class", icon: "Layers", description: "Section capacity & streams" },
          { id: "students", label: "Student Records", to: "/school/students", icon: "Users", description: "Official continuous assessments" },
          { id: "proctor", label: "Proctoring Center", to: "/school/proctor", icon: "ShieldCheck", description: "High-stakes testing console" },
        ],
      },
      {
        id: "governance",
        title: "Governance & Reporting",
        items: [
          { id: "faculty", label: "Faculty Directory", to: "/school/teachers", icon: "GraduationCap", description: "Staff allocation" },
          { id: "reports", label: "Statutory Reports", to: "/school/reports", icon: "FileSpreadsheet", description: "Terminal continuous assessment records" },
          { id: "settings", label: "School Governance", to: "/school/settings", icon: "Settings", description: "Licensing, rollover & branding" },
        ],
      },
    ],
    quickActions: [
      { id: "settings", label: "School Settings", to: "/school/settings", icon: "Settings" },
    ],
  },

  PARENT: {
    portalTitle: "Family Oversight Portal",
    homeRoute: "/parent",
    primaryNav: [
      {
        id: "family",
        title: "Child Tracking & Communications",
        items: [
          { id: "progress", label: "Progress Overview", to: "/parent", icon: "LayoutDashboard", description: "Academic marks & attendance" },
          { id: "alerts", label: "Performance Alerts", to: "/parent/alerts", icon: "Bell", description: "Risk & achievement notifications" },
          { id: "messages", label: "Teacher Advisory", to: "/parent/messages", icon: "MessageSquare", description: "Direct communication with faculty" },
          { id: "syllabus", label: "National Syllabus", to: "/academics", icon: "BookOpen", description: "Grades 9–12 learning outcomes" },
        ],
      },
    ],
    quickActions: [
      { id: "home", label: "Family Dashboard", to: "/parent", icon: "HeartHandshake" },
    ],
  },

  ADMIN: {
    portalTitle: "Platform Administration",
    homeRoute: "/school",
    primaryNav: [
      {
        id: "platform",
        title: "Institutional Management",
        items: [
          { id: "dash", label: "Platform Console", to: "/school", icon: "LayoutDashboard", description: "Multi-tenant institutional overview" },
          { id: "classes", label: "All Classrooms", to: "/school/class", icon: "Layers", description: "Institutional cohorts & sections" },
          { id: "students", label: "All Students", to: "/school/students", icon: "Users", description: "Candidate registries & assessments" },
          { id: "proctor", label: "Proctor Control", to: "/school/proctor", icon: "ShieldCheck", description: "Live exam monitoring" },
          { id: "faculty", label: "Faculty Registry", to: "/school/teachers", icon: "GraduationCap", description: "Staff assignments" },
          { id: "reports", label: "Statutory Audit", to: "/school/reports", icon: "FileSpreadsheet", description: "Official transcripts & compliance" },
          { id: "governance", label: "Tenant Settings", to: "/school/settings", icon: "Settings", description: "System & school settings" },
        ],
      },
    ],
    quickActions: [
      { id: "settings", label: "Admin Settings", to: "/school/settings", icon: "Settings" },
    ],
  },
};

/**
 * Get navigation configuration for a given role with safe fallback to STUDENT.
 */
export function getNavigationForRole(role?: string): RoleNavigationConfig {
  const normalizedRole = (role || "STUDENT").toUpperCase();
  return ROLE_NAVIGATION_MANIFEST[normalizedRole] || ROLE_NAVIGATION_MANIFEST.STUDENT;
}

/**
 * Quick links for search modal or spotlight shortcuts by role.
 */
export const QUICK_LINKS_BY_ROLE: Record<string, Array<{ label: string; url: string; icon: string }>> = {
  STUDENT: [
    { label: "Question Bank", url: "/student/practice", icon: "Sparkles" },
    { label: "Mock Exams", url: "/student/exams", icon: "FileCheck2" },
    { label: "Past Papers", url: "/student/past-papers", icon: "GraduationCap" },
    { label: "Score Predictor", url: "/student/score", icon: "TrendingUp" },
    { label: "Learning Pathway", url: "/student/knowledge-map", icon: "Network" },
    { label: "Study Planner", url: "/student/study-plan", icon: "Calendar" },
  ],
  TEACHER: [
    { label: "School Dashboard", url: "/school", icon: "LayoutDashboard" },
    { label: "Class Sections", url: "/school/class", icon: "Layers" },
    { label: "Student Roster", url: "/school/students", icon: "Users" },
    { label: "Live Proctor Console", url: "/school/proctor", icon: "ShieldCheck" },
    { label: "Faculty Directory", url: "/school/teachers", icon: "GraduationCap" },
    { label: "Official Reports", url: "/school/reports", icon: "FileSpreadsheet" },
  ],
  PRINCIPAL: [
    { label: "Executive Dashboard", url: "/school", icon: "LayoutDashboard" },
    { label: "Class Sections", url: "/school/class", icon: "Layers" },
    { label: "Student Records", url: "/school/students", icon: "Users" },
    { label: "Faculty Management", url: "/school/teachers", icon: "GraduationCap" },
    { label: "School Governance", url: "/school/settings", icon: "Settings" },
    { label: "Terminal Transcripts", url: "/school/reports", icon: "FileSpreadsheet" },
  ],
  PARENT: [
    { label: "Progress Overview", url: "/parent", icon: "LayoutDashboard" },
    { label: "Performance Alerts", url: "/parent/alerts", icon: "Bell" },
    { label: "Teacher Advisory", url: "/parent/messages", icon: "MessageSquare" },
    { label: "National Curriculum", url: "/academics", icon: "BookOpen" },
  ],
  ADMIN: [
    { label: "Platform Console", url: "/school", icon: "LayoutDashboard" },
    { label: "Class Sections", url: "/school/class", icon: "Layers" },
    { label: "Student Records", url: "/school/students", icon: "Users" },
    { label: "Proctor Control", url: "/school/proctor", icon: "ShieldCheck" },
    { label: "Tenant Settings", url: "/school/settings", icon: "Settings" },
  ],
};

/**
 * Returns whether a given route path is permissible for a role.
 */
export function isRouteAllowedForRole(role: string = "STUDENT", path: string): boolean {
  const normRole = role.toUpperCase();
  if (normRole === "ADMIN") return true;

  if (normRole === "STUDENT") {
    if (path.startsWith("/school") || path.startsWith("/parent")) return false;
    return true;
  }

  if (normRole === "TEACHER" || normRole === "PRINCIPAL") {
    if (path.startsWith("/parent")) return false;
    if (
      path.startsWith("/student/study-plan") ||
      path.startsWith("/student/notes") ||
      path.startsWith("/student/spaced-review") ||
      path.startsWith("/student/battle") ||
      path.startsWith("/student/session")
    ) {
      return false;
    }
    return true;
  }

  if (normRole === "PARENT") {
    if (path.startsWith("/school") || path.startsWith("/student")) return false;
    return true;
  }

  return true;
}
