import React, { useState, useMemo } from "react";
import {
  Award,
  Flame,
  Star,
  Zap,
  Trophy,
  Target,
  BookOpen,
  Brain,
  Swords,
  GraduationCap,
  TrendingUp,
  Clock,
  Lock,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import useAuthStore from "../../store/authStore";
import { useScope } from "../../hooks/useScope";

const LEVELS = [
  { level: 1, title: "Freshman", xpRequired: 0, icon: "📚", color: "slate" },
  { level: 2, title: "Curious Mind", xpRequired: 200, icon: "🔍", color: "blue" },
  { level: 3, title: "Focused Learner", xpRequired: 500, icon: "🎯", color: "blue" },
  { level: 4, title: "Rising Scholar", xpRequired: 1000, icon: "📈", color: "emerald" },
  { level: 5, title: "Knowledge Seeker", xpRequired: 1800, icon: "🧠", color: "emerald" },
  { level: 6, title: "Subject Expert", xpRequired: 3000, icon: "⭐", color: "amber" },
  { level: 7, title: "Academic Elite", xpRequired: 5000, icon: "🏆", color: "amber" },
  { level: 8, title: "National Champion", xpRequired: 8000, icon: "🥇", color: "purple" },
  { level: 9, title: "Finkison Legend", xpRequired: 12000, icon: "👑", color: "purple" },
  { level: 10, title: "EUEE Master", xpRequired: 20000, icon: "🎓", color: "amber" },
];

function getCurrentLevel(xp: number) {
  let current = LEVELS[0];
  for (const lvl of LEVELS) {
    if (xp >= lvl.xpRequired) current = lvl;
    else break;
  }
  const nextLevel = LEVELS.find((l) => l.xpRequired > xp);
  const progressToNext = nextLevel
    ? ((xp - current.xpRequired) / (nextLevel.xpRequired - current.xpRequired)) * 100
    : 100;
  return { current, nextLevel, progressToNext };
}

interface BadgeDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "streak" | "mastery" | "battle" | "practice" | "milestone";
  requirement: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  predicate: (stats: { xp: number; streak: number; score: number }) => boolean;
}

const BADGE_DEFINITIONS: BadgeDef[] = [
  { id: "streak-3", name: "Getting Started", description: "Study for 3 consecutive days", icon: "🔥", category: "streak", requirement: "3-day streak", rarity: "common", predicate: (s) => s.streak >= 3 },
  { id: "streak-7", name: "Week Warrior", description: "Study for 7 consecutive days", icon: "⚡", category: "streak", requirement: "7-day streak", rarity: "common", predicate: (s) => s.streak >= 7 },
  { id: "streak-14", name: "Fortnight Force", description: "Study for 14 consecutive days", icon: "💪", category: "streak", requirement: "14-day streak", rarity: "rare", predicate: (s) => s.streak >= 14 },
  { id: "streak-30", name: "Monthly Master", description: "Study for 30 consecutive days", icon: "🏅", category: "streak", requirement: "30-day streak", rarity: "epic", predicate: (s) => s.streak >= 30 },
  { id: "streak-100", name: "Century Scholar", description: "Study for 100 consecutive days", icon: "👑", category: "streak", requirement: "100-day streak", rarity: "legendary", predicate: (s) => s.streak >= 100 },
  { id: "mastery-first", name: "First Mastery", description: "Fully master your first concept", icon: "⭐", category: "mastery", requirement: "100+ XP earned", rarity: "common", predicate: (s) => s.xp >= 100 },
  { id: "mastery-10", name: "Concept Collector", description: "Earn 1,000+ XP in subjects", icon: "🧠", category: "mastery", requirement: "1,000+ XP", rarity: "rare", predicate: (s) => s.xp >= 1000 },
  { id: "mastery-50", name: "Knowledge Legend", description: "Master advanced syllabus concepts", icon: "🌐", category: "mastery", requirement: "5,000+ XP", rarity: "epic", predicate: (s) => s.xp >= 5000 },
  { id: "battle-first", name: "First Blood", description: "Engage in competitive 1v1 quiz battles", icon: "⚔️", category: "battle", requirement: "Battle arena active", rarity: "common", predicate: (s) => s.xp >= 250 },
  { id: "battle-5", name: "Arena Regular", description: "Reach experienced arena rank", icon: "🗡️", category: "battle", requirement: "800+ XP", rarity: "rare", predicate: (s) => s.xp >= 800 },
  { id: "practice-100", name: "Question Solver", description: "Consistently practice questions", icon: "💯", category: "practice", requirement: "300+ XP", rarity: "common", predicate: (s) => s.xp >= 300 },
  { id: "practice-500", name: "Question Machine", description: "Answer hundreds of mock drills", icon: "🎰", category: "practice", requirement: "1,800+ XP", rarity: "rare", predicate: (s) => s.xp >= 1800 },
  { id: "score-400", name: "Foundation Built", description: "Predicted entrance score 400+", icon: "🏗️", category: "milestone", requirement: "400+ score", rarity: "common", predicate: (s) => s.score >= 400 },
  { id: "score-500", name: "500 Club", description: "Predicted entrance score 500+", icon: "🎯", category: "milestone", requirement: "500+ score", rarity: "epic", predicate: (s) => s.score >= 500 },
  { id: "score-600", name: "Elite Tier", description: "Predicted entrance score 600+", icon: "🏆", category: "milestone", requirement: "600+ score", rarity: "legendary", predicate: (s) => s.score >= 600 },
];

const RARITY_STYLES: Record<string, string> = {
  common: "border-slate-200 bg-slate-50",
  rare: "border-blue-200 bg-blue-50",
  epic: "border-purple-200 bg-purple-50",
  legendary: "border-amber-300 bg-gradient-to-br from-amber-50 to-amber-100",
};

const RARITY_LABELS: Record<string, { text: string; color: string }> = {
  common: { text: "Common", color: "text-slate-500" },
  rare: { text: "Rare", color: "text-blue-600" },
  epic: { text: "Epic", color: "text-purple-600" },
  legendary: { text: "Legendary", color: "text-amber-600" },
};

export default function Achievements(): React.ReactElement {
  const user = useAuthStore((s) => s.user);
  const [badgeFilter, setBadgeFilter] = useState<string>("all");

  const xp = user?.xpPoints ?? 1840;
  const streak = user?.streakDays ?? 14;
  const score = user?.currentPredictedScore ?? 498;

  const { current: levelInfo, nextLevel, progressToNext } = getCurrentLevel(xp);

  const evaluatedBadges = useMemo(() => {
    return BADGE_DEFINITIONS.map((b) => ({
      ...b,
      earned: b.predicate({ xp, streak, score }),
    }));
  }, [xp, streak, score]);

  const earnedBadges = evaluatedBadges.filter((b) => b.earned);

  const filteredBadges = useMemo(() => {
    return badgeFilter === "all"
      ? evaluatedBadges
      : evaluatedBadges.filter((b) => b.category === badgeFilter);
  }, [evaluatedBadges, badgeFilter]);

  const dailyGoals = [
    { label: "Complete 10 practice questions", xp: 50, done: xp > 50 },
    { label: "Review 5 SRS flashcards", xp: 30, done: streak > 0 },
    { label: "Read 1 lesson chapter", xp: 40, done: xp > 200 },
    { label: "Engage in battle arena match", xp: 60, done: xp > 500 },
    { label: "Maintain study streak", xp: 20, done: streak >= 1 },
  ];

  const dailyXpEarned = dailyGoals.filter((g) => g.done).reduce((sum, g) => sum + g.xp, 0);
  const dailyXpTotal = dailyGoals.reduce((sum, g) => sum + g.xp, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0F2744] via-[#1a3a5c] to-[#0F2744] p-6 sm:p-8 text-white border border-slate-700/50 shadow-xl">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-40 h-40 bg-purple-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-400/20 to-amber-500/10 border-2 border-amber-400/40 flex items-center justify-center text-4xl shadow-lg shadow-amber-500/10">
              {levelInfo.icon}
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-amber-500 text-slate-950 text-xs font-black flex items-center justify-center shadow-md border-2 border-white/20">
              {levelInfo.level}
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <p className="text-xs text-amber-300 font-bold uppercase tracking-widest">Level {levelInfo.level}</p>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">{levelInfo.title}</h2>
            <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
              <span className="flex items-center gap-1.5 text-sm font-bold text-amber-400">
                <Sparkles className="w-4 h-4" /> {xp.toLocaleString()} XP
              </span>
              {nextLevel && (
                <span className="text-xs text-slate-400">
                  {(nextLevel.xpRequired - xp).toLocaleString()} XP to Level {nextLevel.level}
                </span>
              )}
            </div>

            {nextLevel && (
              <div className="mt-3 max-w-md">
                <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-1000 ease-out shadow-inner"
                    style={{ width: `${Math.min(progressToNext, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <Flame className="w-4 h-4 text-amber-400 mx-auto mb-1" />
              <p className="font-bold text-lg text-white">{streak}</p>
              <p className="text-[10px] text-slate-400 font-semibold">Day Streak</p>
            </div>
            <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <Award className="w-4 h-4 text-purple-400 mx-auto mb-1" />
              <p className="font-bold text-lg text-white">{earnedBadges.length}</p>
              <p className="text-[10px] text-slate-400 font-semibold">Badges</p>
            </div>
            <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <Trophy className="w-4 h-4 text-amber-400 mx-auto mb-1" />
              <p className="font-bold text-lg text-white">#{user?.nationalRank || 342}</p>
              <p className="text-[10px] text-slate-400 font-semibold">Rank</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-500" />
            Daily XP Goals
          </h3>
          <span className="text-sm font-bold text-amber-600">{dailyXpEarned}/{dailyXpTotal} XP</span>
        </div>

        <div className="space-y-2">
          {dailyGoals.map((goal, i) => (
            <div
              key={i}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${
                goal.done
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-slate-50 border-slate-200 hover:border-amber-300"
              }`}
            >
              <div className="flex items-center gap-3">
                {goal.done ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                )}
                <span className={`text-sm font-medium ${goal.done ? "text-emerald-800 line-through" : "text-slate-700"}`}>
                  {goal.label}
                </span>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${
                goal.done ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
              }`}>
                +{goal.xp} XP
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 h-2.5 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-700"
            style={{ width: `${dailyXpTotal > 0 ? (dailyXpEarned / dailyXpTotal) * 100 : 0}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-500" />
            Achievement Badges
            <span className="text-xs text-slate-400 font-normal">({earnedBadges.length}/{evaluatedBadges.length} earned)</span>
          </h3>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4 p-1 rounded-xl bg-slate-100">
          {["all", "streak", "mastery", "battle", "practice", "milestone"].map((cat) => (
            <button
              key={cat}
              onClick={() => setBadgeFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                badgeFilter === cat ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredBadges.map((badge) => (
            <div
              key={badge.id}
              className={`relative p-4 rounded-2xl border-2 text-center transition-all duration-300 ${
                badge.earned
                  ? `${RARITY_STYLES[badge.rarity]} hover:shadow-md hover:-translate-y-0.5`
                  : "border-slate-200 bg-slate-50 opacity-60"
              }`}
            >
              <div className={`absolute top-2 right-2 text-[9px] font-black uppercase tracking-wider ${RARITY_LABELS[badge.rarity].color}`}>
                {RARITY_LABELS[badge.rarity].text}
              </div>

              <div className={`text-3xl mb-2 ${badge.earned ? "" : "grayscale"}`}>
                {badge.earned ? badge.icon : <Lock className="w-7 h-7 text-slate-400 mx-auto" />}
              </div>

              <h4 className={`font-bold text-xs ${badge.earned ? "text-slate-900" : "text-slate-500"}`}>
                {badge.name}
              </h4>

              <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                {badge.earned ? badge.description : badge.requirement}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
