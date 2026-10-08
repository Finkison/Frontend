import React from "react";
import SideNav from "../shared/SideNav";
import { useScope } from "../../hooks/useScope";
import OfflineSyncBadge from "../shared/OfflineSyncBadge";
import { Search } from "lucide-react";

export default function StudentLayout({ children }: { children: React.ReactNode }): React.ReactElement {
  const scope = useScope();

  const learnLinks = [
    { to: "/student", label: "Dashboard" },
    { to: "/student/lessons", label: "Course Materials" },
    { to: "/student/notes", label: "Smart Notes" },
    { to: "/student/knowledge-map", label: "Learning Pathway" },
    { to: "/student/spaced-review", label: "Spaced Repetition" },
    { to: "/student/study-plan", label: "Study Planner" },
  ];

  const practiceLinks = [
    { to: "/student/practice", label: "Question Bank" },
    { to: "/student/ai-tutor", label: "AI Tutor" },
    ...(scope.canAccessBattleArena
      ? [{ to: "/student/battle", label: "Quiz Arena" }]
      : []),
  ];

  const testLinks = [
    { to: "/student/exams", label: "Mock Tests" },
    ...(scope.canAccessPastPapers
      ? [{ to: "/student/past-papers", label: "Past Papers" }]
      : []),
    { to: "/student/exam-history", label: "Score Analysis" },
  ];

  const achieveLinks = [
    ...(scope.canAccessScorePredictor
      ? [{ to: "/student/score", label: "Score Predictor" }]
      : []),
    { to: "/student/weak-areas", label: "Knowledge Gaps" },
    ...(scope.canAccessDepartments
      ? [{ to: "/student/departments", label: "University Pathways" }]
      : []),
    { to: "/student/leaderboard", label: "Leaderboard" },
    { to: "/student/achievements", label: "Achievements" },
  ];

  const accountLinks = [
    { to: "/student/profile", label: "Profile & Goals" },
    { to: "/student/settings", label: "Settings" },
  ];

  const sections = [
    {
      title: "Learn",
      links: learnLinks,
    },
    {
      title: "Practice",
      links: practiceLinks,
    },
    {
      title: "Assessments",
      links: testLinks,
    },
    {
      title: "Analytics",
      links: achieveLinks,
    },
    {
      title: "Account",
      links: accountLinks,
    },
  ];

  const allLinks = [
    ...learnLinks,
    ...practiceLinks,
    ...testLinks,
    ...achieveLinks,
    ...accountLinks,
  ];

  return (
    <div className="flex w-full min-h-[calc(100vh-64px)] bg-slate-50">
      <SideNav links={allLinks} sections={sections} />
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[10px] font-bold tracking-wide">
              {scope.gradeDisplay}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-semibold">
              {scope.stream}
            </span>
            {scope.gradeLevel >= 11 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold">
                EUEE Prep Mode
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <OfflineSyncBadge />
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(
                  new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true })
                );
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-800 text-[10px] font-semibold transition-colors cursor-pointer shadow-2xs"
              title="Quick search across national curriculum (Ctrl+K)"
            >
              <Search className="w-3 h-3 text-slate-400" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="text-[9px] font-mono px-1 py-0.2 rounded bg-slate-100 text-slate-500 border border-slate-200">
                Ctrl+K
              </kbd>
            </button>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
