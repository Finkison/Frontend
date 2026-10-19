import React, { useEffect, useState } from "react";
import { useLearningStore } from "../../store/learningStore";
import { Calendar, Clock, Target, BookOpen, Swords, Brain, CheckCircle2, Sparkles, ChevronRight, Zap } from "lucide-react";

export default function StudyPlanner() {
  const {
    todayPlan,
    planLoading,
    fetchTodayPlan,
    generatePlan,
    completeTaskAction,
  } = useLearningStore();

  const [studyMinutes, setStudyMinutes] = useState(120);
  const [generating, setGenerating] = useState(false);

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
    await completeTaskAction(todayPlan.id, taskIndex, task.duration_min);
  };

  const priorityStyles: Record<string, { bg: string; text: string; border: string }> = {
    URGENT: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
    HIGH: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
    MEDIUM: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
    LOW: { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200" },
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
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center space-y-5">
          <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            Daily study plan
          </h2>
          <p className="text-slate-600 text-sm">
            Custom study plan tailored to your weak areas and national exam schedule.
          </p>

          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700 block">
              Available study time
            </label>
            <div className="flex gap-2 justify-center flex-wrap">
              {[60, 90, 120, 150, 180].map((min) => (
                <button
                  key={min}
                  onClick={() => setStudyMinutes(min)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    studyMinutes === min
                      ? "bg-[#1D4ED8] text-white shadow-sm"
                      : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {min < 60 ? `${min}m` : `${min / 60}h${min % 60 ? ` ${min % 60}m` : ""}`}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full py-3.5 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
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
          <Calendar className="w-10 h-10 text-blue-600 mx-auto" />
          <p className="text-slate-600 text-sm">Loading your study plan...</p>
        </div>
      </div>
    );
  }

  if (!todayPlan) return null;

  const completedTasks = todayPlan.tasks.filter((t) => t.completed).length;
  const totalTasks = todayPlan.tasks.length;
  const completionPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="bg-[#0B1B3A] rounded-2xl p-5 text-white border border-blue-950">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-blue-300" />
            <div>
              <h1 className="text-lg font-bold">Today's study plan</h1>
              <p className="text-blue-200 text-xs">{todayPlan.date}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black">{todayPlan.days_until_euee}</p>
            <p className="text-xs text-blue-200">days to EUEE</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-white/10 rounded-xl p-2.5 text-center">
            <p className="text-xl font-black">{completionPct}%</p>
            <p className="text-[10px] text-blue-200">Completed</p>
          </div>
          <div className="bg-white/10 rounded-xl p-2.5 text-center">
            <p className="text-xl font-black">{todayPlan.predicted_score}</p>
            <p className="text-[10px] text-blue-200">Predicted</p>
          </div>
          <div className="bg-white/10 rounded-xl p-2.5 text-center">
            <p className="text-xl font-black">{todayPlan.target_score}</p>
            <p className="text-[10px] text-blue-200">Target</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-white/20 rounded-full h-2 mt-3">
          <div
            className="bg-white h-2 rounded-full transition-all duration-500"
            style={{ width: `${completionPct}%` }}
          />
        </div>
      </div>

      {/* Task list */}
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
                    task.completed ? "bg-emerald-200 text-emerald-700" : "bg-white/80 text-slate-600"
                  }`}>
                    {task.completed ? <CheckCircle2 className="w-4 h-4" /> : icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold truncate ${
                      task.completed ? "text-emerald-800 line-through" : "text-slate-900"
                    }`}>
                      {task.activity_label} — {task.concept_name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-slate-500">{task.subject}</span>
                      <span className="text-[10px] text-slate-400">·</span>
                      <span className="text-[10px] text-slate-500 flex items-center gap-0.5">
                        <Clock className="w-3 h-3" /> {task.duration_min}m
                      </span>
                      {task.mastery !== null && (
                        <>
                          <span className="text-[10px] text-slate-400">·</span>
                          <span className="text-[10px] text-slate-500">
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
                    className="px-3 py-1.5 bg-white rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-1"
                  >
                    Start <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              {!task.completed && task.reason && (
                <p className="text-[10px] text-slate-500 mt-2 ml-11">
                  {task.reason}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Session completion banner */}
      {completionPct >= 100 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center text-emerald-900">
          <h3 className="text-sm font-semibold">Daily study schedule complete</h3>
          <p className="text-emerald-700 text-xs mt-0.5">
            {todayPlan.actual_minutes} minutes recorded across syllabus tasks.
          </p>
        </div>
      )}
    </div>
  );
}
