import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Award, BookOpen, Brain, CheckCircle2, Crown, Flame, GraduationCap, Lock, RefreshCw, Search, Sparkles, Star, Target, TrendingUp, Trophy, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getStudentDashboard, getStudentProgress } from "../../services/studentService";
import useAuthStore from "../../store/authStore";
import PageHeader from "../shared/PageHeader";
import PortalPage from "../shared/PortalPage";

const LEVELS: Array<{ level: number; title: string; xpRequired: number; icon: LucideIcon }> = [
  { level: 1, title: "Getting started", xpRequired: 0, icon: BookOpen },
  { level: 2, title: "Curious mind", xpRequired: 200, icon: Search },
  { level: 3, title: "Focused learner", xpRequired: 500, icon: Target },
  { level: 4, title: "Consistent learner", xpRequired: 1000, icon: TrendingUp },
  { level: 5, title: "Knowledge builder", xpRequired: 1800, icon: Brain },
  { level: 6, title: "Subject explorer", xpRequired: 3000, icon: Star },
  { level: 7, title: "Dedicated scholar", xpRequired: 5000, icon: Trophy },
  { level: 8, title: "Advanced learner", xpRequired: 8000, icon: Award },
  { level: 9, title: "Finkison guide", xpRequired: 12000, icon: Crown },
  { level: 10, title: "Exam candidate", xpRequired: 20000, icon: GraduationCap },
];

const XP_MILESTONES: Array<{ id: string; name: string; xpRequired: number; icon: LucideIcon }> = [
  { id: "xp-200", name: "First steps", xpRequired: 200, icon: Flame },
  { id: "xp-500", name: "Building momentum", xpRequired: 500, icon: Zap },
  { id: "xp-1000", name: "Steady practice", xpRequired: 1000, icon: Target },
  { id: "xp-1800", name: "Committed learner", xpRequired: 1800, icon: Brain },
  { id: "xp-3000", name: "Learning builder", xpRequired: 3000, icon: BookOpen },
  { id: "xp-5000", name: "Strong progress", xpRequired: 5000, icon: Star },
  { id: "xp-8000", name: "High achiever", xpRequired: 8000, icon: Trophy },
  { id: "xp-12000", name: "Knowledge explorer", xpRequired: 12000, icon: Award },
  { id: "xp-20000", name: "XP master", xpRequired: 20000, icon: Crown },
];

function getLevel(xp: number) {
  let current = LEVELS[0];
  for (const level of LEVELS) {
    if (xp >= level.xpRequired) current = level;
    else break;
  }
  const next = LEVELS.find((level) => level.xpRequired > xp);
  const progress = next
    ? Math.min(100, Math.max(0, ((xp - current.xpRequired) / (next.xpRequired - current.xpRequired)) * 100))
    : 100;
  return { current, next, progress };
}

export default function Achievements(): React.ReactElement {
  const user = useAuthStore((state) => state.user);
  const dashboardQuery = useQuery(["studentDashboard"], () => getStudentDashboard());
  const progressQuery = useQuery(["studentProgress"], () => getStudentProgress());
  const profile = dashboardQuery.data?.data || {};
  const xpValue = profile.xp_points ?? user?.xpPoints;
  const parsedXp = Number(xpValue);
  const hasXp = xpValue !== undefined && xpValue !== null && Number.isFinite(parsedXp);
  const xp = hasXp ? parsedXp : 0;
  const { current: level, next: nextLevel, progress: levelProgress } = getLevel(xp);
  const milestones = useMemo(() => XP_MILESTONES.map((item) => ({ ...item, met: hasXp && xp >= item.xpRequired })), [hasXp, xp]);
  const metMilestones = milestones.filter((item) => item.met).length;
  const subjectProgress: Array<{ total_questions?: number }> = Array.isArray(progressQuery.data?.data) ? progressQuery.data.data : [];
  const recordedAnswers = subjectProgress.reduce((total, item) => total + (Number(item.total_questions) || 0), 0);

  return (
    <PortalPage className="max-w-5xl space-y-6">
      <PageHeader
        eyebrow="Learning progress"
        title="Levels and milestones"
        description="Track your XP, level, and learning milestones."
      />

      {dashboardQuery.isError && (
        <div role="alert" className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200 sm:flex-row sm:items-center sm:justify-between">
          <p>XP could not be refreshed. Your last saved value is shown.</p>
          <button type="button" onClick={() => void dashboardQuery.refetch()} className="inline-flex min-h-9 items-center gap-2 self-start rounded-lg border border-rose-300 px-3 text-xs font-semibold hover:bg-rose-100 sm:self-auto"><RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />Try again</button>
        </div>
      )}

      <section className="relative overflow-hidden rounded-2xl border border-[#881337]/50 bg-gradient-to-r from-[#4C0519] via-[#881337] to-[#4C0519] p-5 text-white shadow-sm sm:p-7" aria-labelledby="current-level-heading">
        <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-amber-400/10 blur-3xl" aria-hidden="true" />
        <div className="relative grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-amber-300/30 bg-white/10 text-amber-200">
              <level.icon className="h-8 w-8" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-200">{hasXp ? `Level ${level.level}` : "XP unavailable"}</p>
              <h2 id="current-level-heading" className="mt-1 text-xl font-bold sm:text-2xl">{hasXp ? level.title : "Your level will appear here"}</h2>
              <p className="mt-1 text-sm text-white/80">{hasXp ? `${xp.toLocaleString()} XP` : "Refresh to see your progress."}</p>
            </div>
          </div>
          <div className="min-w-44 rounded-xl border border-white/10 bg-white/5 p-4 sm:text-right">
            <p className="text-xs text-white/70">{nextLevel ? "Next level" : "Highest level reached"}</p>
            <p className="mt-1 text-sm font-semibold">{hasXp ? (nextLevel ? `${Math.max(0, nextLevel.xpRequired - xp).toLocaleString()} XP to Level ${nextLevel.level}` : "Level path complete") : "Not available"}</p>
          </div>
          {hasXp && nextLevel && (
            <div className="sm:col-span-2">
              <div className="mb-1.5 flex justify-between text-[11px] text-white/75"><span>Level progress</span><span>{Math.round(levelProgress)}%</span></div>
              <div className="h-2 overflow-hidden rounded-full bg-white/15" role="progressbar" aria-label="Progress to next level" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(levelProgress)}>
                <div className="h-full rounded-full bg-amber-300 transition-[width]" style={{ width: `${levelProgress}%` }} />
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3" aria-label="Learning milestone summary">
        <article className="rounded-xl border border-stone-200 bg-white p-4 dark:border-white/10 dark:bg-[#261E1A]">
          <div className="flex items-center gap-2 text-xs font-medium text-stone-500 dark:text-[#A89C90]"><Sparkles className="h-4 w-4 text-amber-500" aria-hidden="true" />Current XP</div>
          <p className="mt-3 text-2xl font-semibold tabular-nums text-stone-900 dark:text-[#FDFBF7]">{dashboardQuery.isLoading && !hasXp ? "Loading" : hasXp ? xp.toLocaleString() : "Unavailable"}</p>
          <p className="mt-1 text-[11px] text-stone-500 dark:text-[#A89C90]">Saved on your student profile</p>
        </article>
        <article className="rounded-xl border border-stone-200 bg-white p-4 dark:border-white/10 dark:bg-[#261E1A]">
          <div className="flex items-center gap-2 text-xs font-medium text-stone-500 dark:text-[#A89C90]"><BookOpen className="h-4 w-4 text-[#881337]" aria-hidden="true" />Recorded answers</div>
          <p className="mt-3 text-2xl font-semibold tabular-nums text-stone-900 dark:text-[#FDFBF7]">{progressQuery.isLoading ? "Loading" : progressQuery.isError ? "Unavailable" : recordedAnswers.toLocaleString()}</p>
          <p className="mt-1 text-[11px] text-stone-500 dark:text-[#A89C90]">Across completed practice and exams</p>
          {progressQuery.isError && <button type="button" onClick={() => void progressQuery.refetch()} className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#881337] hover:underline dark:text-[#FBBF24]"><RefreshCw className="h-3 w-3" aria-hidden="true" />Try again</button>}
        </article>
        <article className="rounded-xl border border-stone-200 bg-white p-4 dark:border-white/10 dark:bg-[#261E1A]">
          <div className="flex items-center gap-2 text-xs font-medium text-stone-500 dark:text-[#A89C90]"><Trophy className="h-4 w-4 text-amber-600" aria-hidden="true" />Thresholds met now</div>
          <p className="mt-3 text-2xl font-semibold tabular-nums text-stone-900 dark:text-[#FDFBF7]">{hasXp ? `${metMilestones}/${milestones.length}` : "Unavailable"}</p>
          <p className="mt-1 text-[11px] text-stone-500 dark:text-[#A89C90]">Met at your current XP balance</p>
        </article>
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-[#261E1A] sm:p-6" aria-labelledby="xp-milestones-heading">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2 border-b border-stone-100 pb-4 dark:border-white/10">
          <div>
            <h2 id="xp-milestones-heading" className="text-base font-semibold text-stone-900 dark:text-[#FDFBF7]">XP milestones</h2>
            <p className="mt-1 text-xs text-stone-500 dark:text-[#A89C90]">These markers show which thresholds your current XP balance meets.</p>
          </div>
          <span className="text-xs font-medium text-stone-500 dark:text-[#A89C90]">{hasXp ? `${metMilestones} of ${milestones.length} currently met` : "XP unavailable"}</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {milestones.map((milestone) => {
            const Icon = milestone.icon;
            const remaining = Math.max(0, milestone.xpRequired - xp);
            return (
              <article key={milestone.id} className={`flex items-center gap-3 rounded-xl border p-4 ${milestone.met ? "border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-950/20" : "border-stone-200 bg-stone-50 dark:border-white/10 dark:bg-[#1C1512]"}`}>
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${milestone.met ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200" : "bg-white text-stone-400 dark:bg-white/5 dark:text-[#A89C90]"}`}>
                  {milestone.met ? <Icon className="h-5 w-5" aria-hidden="true" /> : <Lock className="h-4 w-4" aria-hidden="true" />}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-stone-900 dark:text-[#FDFBF7]">{milestone.name}</h3>
                <p className="mt-0.5 text-xs text-stone-500 dark:text-[#A89C90]">{milestone.met ? `${milestone.xpRequired.toLocaleString()} XP threshold met` : hasXp ? `${remaining.toLocaleString()} XP to go` : "XP progress unavailable"}</p>
                </div>
                {milestone.met && <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-300" aria-label="Currently met" />}
              </article>
            );
          })}
        </div>
      </section>
    </PortalPage>
  );
}
