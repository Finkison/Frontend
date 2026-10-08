import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import {
  LayoutDashboard,
  Sparkles,
  Target,
  TrendingUp,
  Award,
  Flame,
  Building2,
  Cpu,
  User,
  LogOut,
  ShieldCheck,
  HeartHandshake,
  School,
  FileSpreadsheet,
  Swords,
  Bot,
  Calendar,
  Brain,
  Network,
  GraduationCap,
  BookOpen,
  ChevronDown,
  FileCheck2,
  Settings,
  Users,
  Layers,
  FileText,
  Bell,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, { icon: LucideIcon; color: string }> = {
  // Institutional / School Portal (Standardized)
  "Dashboard":                                { icon: LayoutDashboard, color: "text-purple-600" },
  "Classes":                                  { icon: Layers,          color: "text-purple-600" },
  "Classrooms":                               { icon: Layers,          color: "text-purple-600" },
  "Students":                                 { icon: Users,           color: "text-blue-600" },
  "Faculty":                                  { icon: GraduationCap,   color: "text-indigo-600" },
  "Reports":                                  { icon: FileSpreadsheet, color: "text-emerald-600" },
  "School Settings":                          { icon: Settings,        color: "text-slate-600" },
  // Legacy School labels
  "Executive Intelligence & Telemetry":       { icon: LayoutDashboard, color: "text-purple-600" },
  "Institutional Dashboard":                  { icon: LayoutDashboard, color: "text-purple-500" },
  "Cohort Sections & Benchmark Dispatch":     { icon: Layers,          color: "text-purple-600" },
  "Classrooms & Exam Generator":              { icon: Layers,          color: "text-purple-500" },
  "Class View":                               { icon: Layers,          color: "text-purple-500" },
  "Candidate Roster & Seat Allocation":       { icon: Users,           color: "text-blue-600" },
  "Student Roster & Cohorts":                 { icon: Users,           color: "text-blue-500" },
  "Faculty Directory & Workload Allocation":  { icon: GraduationCap,   color: "text-indigo-600" },
  "Faculty & Educator Directory":             { icon: GraduationCap,   color: "text-indigo-500" },
  "Teachers":                                 { icon: GraduationCap,   color: "text-indigo-500" },
  "Ministry Transcripts & Statutory Export":  { icon: FileSpreadsheet, color: "text-emerald-600" },
  "MoE Transcripts & Export":                 { icon: FileSpreadsheet, color: "text-emerald-500" },
  "Institutional Governance & Licensing":     { icon: Settings,        color: "text-slate-600" },

  // Guardian / Parent Portal (Standardized)
  "Progress":                                 { icon: LayoutDashboard, color: "text-emerald-600" },
  "Progress Overview":                        { icon: LayoutDashboard, color: "text-emerald-600" },
  "Performance Alerts":                       { icon: Bell,            color: "text-amber-500" },
  "Teacher Messages":                         { icon: MessageSquare,   color: "text-blue-600" },
  // Legacy Parent labels
  "Candidate Longitudinal Telemetry":         { icon: LayoutDashboard, color: "text-emerald-600" },
  "Child Diagnostic Monitor":                 { icon: LayoutDashboard, color: "text-emerald-500" },
  "Academic Milestone & Risk Notifications":  { icon: Bell,            color: "text-amber-500" },
  "Academic Alerts & Logs":                   { icon: Bell,            color: "text-amber-500" },
  "Alerts":                                   { icon: Bell,            color: "text-amber-500" },
  "Faculty Direct Advisory Channel":          { icon: MessageSquare,   color: "text-blue-600" },
  "Teacher Direct Messaging":                 { icon: MessageSquare,   color: "text-blue-500" },
  "Messages":                                 { icon: MessageSquare,   color: "text-blue-500" },

  // Student / Candidate Portal - Learn Pillar (Standardized)
  "Course Materials":                         { icon: BookOpen,        color: "text-blue-600" },
  "Smart Notes":                              { icon: FileText,        color: "text-purple-600" },
  "Learning Pathway":                         { icon: Network,         color: "text-emerald-500" },
  "Spaced Repetition":                        { icon: Brain,           color: "text-indigo-500" },
  "Study Planner":                            { icon: Calendar,        color: "text-emerald-600" },
  // Legacy Learn labels
  "Candidate Command Center":                 { icon: LayoutDashboard, color: "text-slate-700" },
  "Lessons & Textbooks":                      { icon: BookOpen,        color: "text-blue-600" },
  "Curriculum Textbooks & Modular Lessons":   { icon: BookOpen,        color: "text-blue-600" },
  "Digital Textbooks & Lessons":              { icon: BookOpen,        color: "text-blue-600" },
  "Curriculum Lessons (AI)":                  { icon: BookOpen,        color: "text-blue-600" },
  "AI Smart Notes":                           { icon: FileText,        color: "text-purple-600" },
  "AI Conceptual Synthesis Vault":            { icon: FileText,        color: "text-amber-500" },
  "AI Smart Notes & Vault":                   { icon: FileText,        color: "text-amber-500" },
  "AI Study Notes":                           { icon: FileText,        color: "text-amber-500" },
  "Curriculum Map":                           { icon: Network,         color: "text-emerald-500" },
  "Curriculum Prerequisite Knowledge Graph":  { icon: Network,         color: "text-emerald-500" },
  "Curriculum Knowledge Graph":               { icon: Network,         color: "text-emerald-500" },
  "Knowledge Graph":                          { icon: Network,         color: "text-emerald-500" },

  // Student / Candidate Portal - Practice Pillar (Standardized)
  "Question Bank":                            { icon: Sparkles,        color: "text-amber-500" },
  "AI Tutor":                                 { icon: Bot,             color: "text-teal-500" },
  "Quiz Arena":                               { icon: Swords,          color: "text-rose-500" },
  // Legacy Practice labels
  "Adaptive Item Bank & Calibrated Drills":   { icon: Sparkles,        color: "text-amber-500" },
  "Adaptive Question Bank":                   { icon: Sparkles,        color: "text-amber-500" },
  "Practice Drills":                          { icon: Sparkles,        color: "text-amber-500" },
  "Socratic AI Diagnostic Tutor":             { icon: Bot,             color: "text-teal-500" },
  "24/7 Socratic AI Tutor":                   { icon: Bot,             color: "text-teal-500" },
  "24/7 AI Socratic Tutor":                   { icon: Bot,             color: "text-teal-500" },
  "Socratic AI Tutor":                        { icon: Bot,             color: "text-teal-500" },
  "Flashcards & Spaced Review":               { icon: Brain,           color: "text-indigo-500" },
  "Spaced Retrieval Memory Engine (SRS)":     { icon: Brain,           color: "text-indigo-500" },
  "Smart Flashcards (Spaced Review)":         { icon: Brain,           color: "text-indigo-500" },
  "Spaced Review (SRS)":                      { icon: Brain,           color: "text-indigo-500" },
  "1v1 Quiz Battles":                         { icon: Swords,          color: "text-rose-500" },
  "Real-Time Synchronous Speed Arena":        { icon: Swords,          color: "text-rose-500" },
  "1v1 Speed Quiz Battles":                   { icon: Swords,          color: "text-rose-500" },
  "1v1 Quiz Battle":                          { icon: Swords,          color: "text-rose-500" },

  // Student / Candidate Portal - Assessments Pillar (Standardized)
  "Mock Tests":                               { icon: FileSpreadsheet, color: "text-blue-500" },
  "Past Papers":                              { icon: GraduationCap,   color: "text-amber-500" },
  "Score Analysis":                           { icon: FileCheck2,      color: "text-emerald-500" },
  "Live Testing Room":                        { icon: FileCheck2,      color: "text-purple-500" },
  // Legacy Assessment labels
  "National Mock Exams (120-min)":            { icon: FileSpreadsheet, color: "text-blue-500" },
  "Standardized National Mock Examinations":  { icon: FileSpreadsheet, color: "text-blue-500" },
  "National Mock Exams":                      { icon: FileSpreadsheet, color: "text-blue-500" },
  "Ministry of Education EUEE Archive (2012–2016)": { icon: GraduationCap, color: "text-amber-500" },
  "Official EUEE Past Papers":                { icon: GraduationCap,   color: "text-amber-500" },
  "EUEE Past Papers":                         { icon: GraduationCap,   color: "text-amber-500" },
  "Exam Diagnostics & History":               { icon: FileCheck2,      color: "text-emerald-500" },
  "Psychometric Assessment Diagnostics":      { icon: FileCheck2,      color: "text-emerald-500" },
  "Exam Diagnostics & Analytics":             { icon: FileCheck2,      color: "text-emerald-500" },
  "Exam History":                             { icon: FileCheck2,      color: "text-emerald-500" },

  // Student / Candidate Portal - Analytics Pillar (Standardized)
  "Score Forecast":                           { icon: TrendingUp,      color: "text-emerald-500" },
  "Diagnostic Insights":                      { icon: Target,          color: "text-rose-500" },
  "University Pathways":                      { icon: Building2,       color: "text-blue-500" },
  "Leaderboard":                              { icon: Flame,           color: "text-amber-500" },
  "Achievements":                             { icon: Award,           color: "text-amber-500" },
  // Legacy Analytics labels
  "Weak Area Diagnostics":                    { icon: Target,          color: "text-rose-500" },
  "Competency Deficit & Remediation Matrix":  { icon: Target,          color: "text-rose-500" },
  "Weak Area Diagnostic Matrix":              { icon: Target,          color: "text-rose-500" },
  "Weak Areas":                               { icon: Target,          color: "text-rose-500" },
  "Daily Study Plan":                         { icon: Calendar,        color: "text-indigo-500" },
  "Personalized Daily Mastery Roadmap":       { icon: Calendar,        color: "text-indigo-500" },
  "Daily AI Study Plan":                      { icon: Calendar,        color: "text-indigo-500" },
  "Today's Study Plan":                       { icon: Calendar,        color: "text-indigo-500" },
  "University Score Predictor":               { icon: TrendingUp,      color: "text-emerald-500" },
  "Item-Response University Cutoff Forecaster": { icon: TrendingUp,     color: "text-emerald-500" },
  "AI Entrance Score Predictor":              { icon: TrendingUp,      color: "text-emerald-500" },
  "Score Predictor":                          { icon: TrendingUp,      color: "text-emerald-500" },
  "Leaderboard & Rankings":                   { icon: Flame,           color: "text-amber-500" },
  "National Merit & Percentile Standings":    { icon: Flame,           color: "text-amber-500" },
  "National Leaderboard & XP":                { icon: Flame,           color: "text-amber-500" },
  "Tertiary Faculty Cutoffs & Capacity":      { icon: Building2,       color: "text-blue-500" },
  "University Majors & Cutoffs":              { icon: Building2,       color: "text-blue-500" },
  "Departments":                              { icon: Building2,       color: "text-blue-500" },
  "Academic Milestone Honors & Badges":       { icon: Award,           color: "text-amber-500" },
  "Achievements & Badges":                    { icon: Award,           color: "text-amber-500" },
  "Achievements & XP":                        { icon: Award,           color: "text-amber-500" },

  // Identity & Preferences
  "Profile & Goals":                          { icon: User,            color: "text-slate-500" },
  "Candidate Profile & Target Goals":         { icon: User,            color: "text-slate-500" },
  "Profile & Target Goal":                    { icon: User,            color: "text-slate-500" },
  "Profile":                                  { icon: User,            color: "text-slate-500" },
  "System & Cognitive Preferences":           { icon: Settings,        color: "text-slate-500" },
  "Settings & Preferences":                   { icon: Settings,        color: "text-slate-500" },
  "Settings":                                 { icon: Settings,        color: "text-slate-500" },
};

interface NavLinkItem {
  to: string;
  label: string;
}

interface NavSection {
  title: string;
  links: NavLinkItem[];
}

interface SideNavProps {
  links: NavLinkItem[];
  sections?: NavSection[];
}

function groupLinksIntoSections(links: NavLinkItem[]): NavSection[] {
  const LEARN_LABELS = [
    "Candidate Command Center", "Dashboard",
    "Course Materials", "Lessons & Textbooks", "Curriculum Textbooks & Modular Lessons", "Digital Textbooks & Lessons", "Curriculum Lessons (AI)",
    "Smart Notes", "AI Smart Notes", "AI Conceptual Synthesis Vault", "AI Smart Notes & Vault", "AI Study Notes",
    "Learning Pathway", "Curriculum Map", "Curriculum Prerequisite Knowledge Graph", "Curriculum Knowledge Graph", "Knowledge Graph",
    "Spaced Repetition", "Study Planner",
  ];
  const PRACTICE_LABELS = [
    "Question Bank", "Adaptive Item Bank & Calibrated Drills", "Adaptive Question Bank", "Practice Drills",
    "AI Tutor", "24/7 AI Socratic Tutor", "Socratic AI Diagnostic Tutor", "24/7 Socratic AI Tutor", "Socratic AI Tutor",
    "Quiz Arena", "1v1 Quiz Battles", "Real-Time Synchronous Speed Arena", "1v1 Speed Quiz Battles", "1v1 Quiz Battle",
    "Flashcards & Spaced Review", "Spaced Retrieval Memory Engine (SRS)", "Smart Flashcards (Spaced Review)", "Spaced Review (SRS)",
  ];
  const TEST_LABELS = [
    "Mock Tests", "National Mock Exams (120-min)", "Standardized National Mock Examinations", "National Mock Exams",
    "Past Papers", "Official EUEE Past Papers", "Ministry of Education EUEE Archive (2012–2016)", "EUEE Past Papers",
    "Score Analysis", "Live Testing Room", "Exam Diagnostics & History", "Psychometric Assessment Diagnostics", "Exam Diagnostics & Analytics", "Exam History",
  ];
  const ACHIEVE_LABELS = [
    "Score Forecast", "University Score Predictor", "Item-Response University Cutoff Forecaster", "AI Entrance Score Predictor", "Score Predictor",
    "Diagnostic Insights", "Weak Area Diagnostics", "Competency Deficit & Remediation Matrix", "Weak Area Diagnostic Matrix", "Weak Areas",
    "Daily Study Plan", "Personalized Daily Mastery Roadmap", "Daily AI Study Plan", "Today's Study Plan",
    "Leaderboard", "Leaderboard & Rankings", "National Merit & Percentile Standings", "National Leaderboard & XP",
    "Achievements", "Academic Milestone Honors & Badges", "Achievements & Badges", "Achievements & XP",
    "University Pathways", "University Majors & Cutoffs", "Tertiary Faculty Cutoffs & Capacity", "Departments",
  ];

  const sections: NavSection[] = [];
  const learn = links.filter((l) => LEARN_LABELS.includes(l.label));
  const practice = links.filter((l) => PRACTICE_LABELS.includes(l.label));
  const test = links.filter((l) => TEST_LABELS.includes(l.label));
  const achieve = links.filter((l) => ACHIEVE_LABELS.includes(l.label));
  const profile = links.filter(
    (l) =>
      l.label === "Profile & Goals" ||
      l.label === "Profile" ||
      l.label === "Profile & Target Goal" ||
      l.label === "Candidate Profile & Target Goals" ||
      l.label === "Settings" ||
      l.label === "Settings & Preferences" ||
      l.label === "System & Cognitive Preferences"
  );
  const remaining = links.filter(
    (l) =>
      !LEARN_LABELS.includes(l.label) &&
      !PRACTICE_LABELS.includes(l.label) &&
      !TEST_LABELS.includes(l.label) &&
      !ACHIEVE_LABELS.includes(l.label) &&
      !profile.includes(l)
  );

  if (learn.length) sections.push({ title: "Learn", links: learn });
  if (practice.length) sections.push({ title: "Practice", links: practice });
  if (test.length) sections.push({ title: "Assessments", links: test });
  if (achieve.length) sections.push({ title: "Analytics", links: achieve });
  if (remaining.length) sections.push({ title: "Operations & Governance", links: remaining });
  if (profile.length) sections.push({ title: "Account", links: profile });

  return sections;
}

export default function SideNav({ links, sections: propSections }: SideNavProps): React.ReactElement {
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const navigate = useNavigate();
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

  const sections = propSections || groupLinksIntoSections(links);

  const toggleSection = (title: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  };

  const getIconInfo = (label: string) => {
    return ICON_MAP[label] || { icon: LayoutDashboard, color: "text-slate-400" };
  };

  return (
    <aside className="hidden lg:flex w-64 border-r border-slate-200/80 bg-white flex-col justify-between shrink-0 h-[calc(100vh-64px)] sticky top-16 left-0 overflow-y-auto select-none">
      <div className="p-4 space-y-1">
        {sections.map((section) => {
          const isCollapsed = collapsedSections.has(section.title);
          return (
            <div key={section.title} className="mb-1">
              <button
                type="button"
                onClick={() => toggleSection(section.title)}
                className="w-full flex items-center justify-between px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
              >
                <span>{section.title}</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${
                    isCollapsed ? "-rotate-90" : ""
                  }`}
                />
              </button>

              {!isCollapsed && (
                <div className="space-y-0.5">
                  {section.links.map((l) => {
                    const { icon: Icon, color } = getIconInfo(l.label);
                    return (
                      <NavLink
                        key={l.to}
                        to={l.to}
                        end={l.to === "/student" || l.to === "/parent" || l.to === "/school"}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                            isActive
                              ? "bg-slate-900 text-white shadow-sm"
                              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                          }`
                        }
                      >
                        <Icon className={`w-4 h-4 ${color}`} />
                        <span>{l.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-100 space-y-2">
        <div className="px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-100 text-[11px] text-emerald-800 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>MoE Verified Syllabus</span>
        </div>

        {isAuthenticated ? (
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-950 text-white text-xs font-semibold cursor-pointer transition-colors"
          >
            Candidate Sign In
          </button>
        )}
      </div>
    </aside>
  );
}
