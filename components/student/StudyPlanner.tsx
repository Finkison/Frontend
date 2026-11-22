import React, { useEffect, useState } from "react";
import { useLearningStore } from "../../store/learningStore";
import { Calendar, Clock, Target, BookOpen, Swords, Brain, CheckCircle2, Sparkles, ChevronRight, Zap } from "lucide-react";
import PortalPage from "../shared/PortalPage";

function formatMinutes(minutes: number): string {
  const total = Math.max(0, Math.floor(Number(minutes) || 0));
  const hours = Math.floor(total / 60);
  const remainder = total % 60;
  return [hours ? `${hours}h` : null, remainder ? `${remainder}m` : null].filter(Boolean).join(" ") || "0m";
}

export default function StudyPlanner() {
  const {
    todayPlan,
    planLoading,
    planError,
    fetchTodayPlan,
    generatePlan,
    completeTaskAction,
  } = useLearningStore();

  const [studyMinutes, setStudyMinutes] = useState(120);
  const [generating, setGenerating] = useState(false);
  const [completingTaskIndex, setCompletingTaskIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchTodayPlan();
  }, [fetchTodayPlan]);

  const handleGenerate = async () => {
    setGenerating(true);
    await generatePlan(studyMinutes);
    setGenerating(false);
  };

  const handleCompleteTask = async (taskIndex: number) => {
    if (!todayPlan) return;
    const task = todayPlan.tasks[taskIndex];
    if (!task || task.completed || completingTaskIndex !== null) return;
    setCompletingTaskIndex(taskIndex);
    try {
      await completeTaskAction(todayPlan.id, taskIndex, task.duration_min);
    } finally {
      setCompletingTaskIndex(null);
    }
  };

  const priorityStyles: Record<string, { bg: string; text: string; border: string }> = {
    URGENT: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
    HIGH: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
    MEDIUM: { bg: "bg-[#FFF1F2] dark:bg-[#4C0519]/40", text: "text-[#881337] dark:text-[#FBBF24]", border: "border-[#FECDD3] dark:border-[#881337]/50" },
    LOW: { bg: "bg-stone-50 dark:bg-[#1C1512]", text: "text-stone-600 dark:text-[#E7E0D6]", border: "border-stone-200 dark:border-white/10" },
  };

  const activityIcons: Record<string, React.ReactNode> = {
    spaced_review: <Brain className="w-4 h-4" />,
    weak_area_practice: <Target className="w-4 h-4" />,
    new_lesson: <BookOpen className="w-4 h-4" />,
    battle_challenge: <Swords className="w-4 h-4" />,
  };

  if (!todayPlan && !planLoading) {
    return (
      <div className="p-4 md:p-6 max-w-lg mx-auto">
        <div className="bg-white dark:bg-[#261E1A] rounded-3xl p-8 border border-stone-200 dark:border-white/10 shadow-sm text-center space-y-5">
          <div className="w-16 h-16 bg-[#FFF1F2] dark:bg-[#4C0519]/40 border border-[#FECDD3] dark:border-[#881337]/50 rounded-2xl flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8 text-[#881337] dark:text-[#FBBF24]" />
          </div>
          <h2 className="text-2xl font-bold text-stone-900 dark:text-[#FDFBF7]">
            Daily study plan
          </h2>
          <p className="text-stone-600 dark:text-[#E7E0D6] text-sm">
            A daily plan shaped by your review queue, practice history, and available study time.
          </p>

          {planError && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-left text-xs leading-5 text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200">{planError}</p>}

          <div className="space-y-3">
            <label className="text-sm font-medium text-stone-700 dark:text-[#E7E0D6] block">
              Available study time
            </label>
            <div className="flex gap-2 justify-center flex-wrap">
              {[60, 90, 120, 150, 180].map((min) => (
                <button
                  key={min}
                  onClick={() => setStudyMinutes(min)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    studyMinutes === min
                      ? "bg-[#881337] text-white shadow-sm"
                      : "bg-white dark:bg-[#261E1A] text-stone-700 dark:text-[#E7E0D6] border border-stone-200 dark:border-white/10 hover:bg-stone-50 dark:hover:bg-white/5"
                  }`}
                >
                  {formatMinutes(min)}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full py-3.5 bg-[#881337] hover:bg-[#9F1239] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            {generating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating plan...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate plan
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  if (planLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[300px]">
        <div className="text-center space-y-3">
          <Calendar className="w-10 h-10 text-[#881337] dark:text-[#FBBF24] mx-auto" />
          <p className="text-stone-600 dark:text-[#E7E0D6] text-sm">Loading your study plan...</p>
        </div>
      </div>
    );
  }

  if (!todayPlan) return null;

  const completedTasks = todayPlan.tasks.filter((t) => t.completed).length;
  const totalTasks = todayPlan.tasks.length;
  const completionPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <PortalPage className="max-w-2xl space-y-4">

      {planError && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs leading-5 text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200">{planError}</p>}

      <div className="bg-[#4C0519] rounded-2xl p-5 text-white border border-[#4C0519]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-[#E7E0D6] dark:text-[#FBBF24]" />
            <div>
              <h1 className="text-lg font-bold">Today's study plan</h1>
              <p className="text-[#E7E0D6] dark:text-[#FBBF24] text-xs">{todayPlan.date}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black">{todayPlan.days_until_euee}</p>
            <p className="text-xs text-[#E7E0D6] dark:text-[#FBBF24]">days to exam</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-white/10 rounded-xl p-2.5 text-center">
            <p className="text-xl font-black tabular-nums">{completedTasks}/{totalTasks}</p>
            <p className="text-[10px] text-[#E7E0D6] dark:text-[#FBBF24]">Tasks done</p>
          </div>
          <div className="bg-white/10 rounded-xl p-2.5 text-center">
            <p className="text-lg font-black tabular-nums sm:text-xl">{formatMinutes(todayPlan.planned_minutes)}</p>
            <p className="text-[10px] text-[#E7E0D6] dark:text-[#FBBF24]">Planned time</p>
          </div>
          <div className="bg-white/10 rounded-xl p-2.5 text-center">
            <p className="text-lg font-black tabular-nums sm:text-xl">{formatMinutes(todayPlan.actual_minutes)}</p>
            <p className="text-[10px] text-[#E7E0D6] dark:text-[#FBBF24]">Minutes marked done</p>
          </div>
        </div>

        <div className="w-full bg-white/20 rounded-full h-2 mt-3">
          <div
            className="bg-white dark:bg-[#261E1A] h-2 rounded-full transition-all duration-500"
            style={{ width: `${completionPct}%` }}
          />
        </div>
      </div>

      <div className="space-y-2.5">
        {todayPlan.tasks.map((task, idx) => {
          const style = priorityStyles[task.priority] || priorityStyles.MEDIUM;
          const icon = activityIcons[task.activity_type] || <BookOpen className="w-4 h-4" />;

          return (
            <div
              key={idx}
              className={`rounded-xl border p-4 transition-all ${
                task.completed
                  ? "bg-emerald-50 border-emerald-200 opacity-75"
                  : `${style.bg} ${style.border}`
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    task.completed ? "bg-emerald-200 text-emerald-700" : "bg-white/80 text-stone-600 dark:text-[#E7E0D6]"
                  }`}>
                    {task.completed ? <CheckCircle2 className="w-4 h-4" /> : icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold truncate ${
                      task.completed ? "text-emerald-800 line-through" : "text-stone-900 dark:text-[#FDFBF7]"
                    }`}>
                      {task.activity_label} — {task.concept_name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-stone-500 dark:text-[#A89C90]">{task.subject}</span>
                      <span className="text-[10px] text-stone-400 dark:text-[#A89C90]">·</span>
                      <span className="text-[10px] text-stone-500 dark:text-[#A89C90] flex items-center gap-0.5">
                        <Clock className="w-3 h-3" /> {task.duration_min}m
                      </span>
                      {task.mastery !== null && (
                        <>
                          <span className="text-[10px] text-stone-400 dark:text-[#A89C90]">·</span>
                          <span className="text-[10px] text-stone-500 dark:text-[#A89C90]">
                            {Math.round(task.mastery * 100)}% mastery
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {!task.completed && (
                  <button
                    onClick={() => handleCompleteTask(idx)}
                    disabled={completingTaskIndex !== null}
                    aria-label={`Mark ${task.activity_label} for ${task.concept_name} complete`}
                    className="px-3 py-1.5 bg-white dark:bg-[#261E1A] rounded-lg border border-stone-200 dark:border-white/10 text-xs font-bold text-stone-700 dark:text-[#E7E0D6] hover:bg-stone-50 dark:hover:bg-white/5 transition-all flex items-center gap-1 disabled:cursor-wait disabled:opacity-60"
                  >
                    {completingTaskIndex === idx ? "Saving…" : "Mark complete"} <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              {!task.completed && task.reason && (
                <p className="text-[10px] text-stone-500 dark:text-[#A89C90] mt-2 ml-11">
                  {task.reason}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {completionPct >= 100 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center text-emerald-900">
          <h3 className="text-sm font-semibold">Daily study schedule complete</h3>
          <p className="text-emerald-700 text-xs mt-0.5">
            {todayPlan.actual_minutes} planned minutes marked complete.
          </p>
        </div>
      )}
    </PortalPage>
  );
}
