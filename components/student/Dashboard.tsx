import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getStudentDashboard, getStudentProgress, getStudentAIInsights, getWeakAreas } from "../../services/studentService";
import { getPracticeHistory } from "../../services/practiceService";
import useAuthStore from "../../store/authStore";
import useScope from "../../hooks/useScope";
import MiniLineChart from "../shared/MiniLineChart";
import ScoreRing from "../shared/ScoreRing";
import ProgressBar from "../shared/ProgressBar";
import PaymentModal from "../shared/PaymentModal";
import paymentService from "../../services/paymentService";
import { DASHBOARD_DEFAULTS } from "../../constants/defaults";
import type { DashboardData, SubjectProgress, PracticeHistoryItem, AIInsights, WeakArea } from "../../types/student";
import { 
  Sparkles, 
  Flame, 
  Target, 
  TrendingUp, 
  BookOpen, 
  Swords, 
  ArrowRight, 
  Award, 
  CheckCircle2, 
  AlertTriangle,
  GraduationCap,
  Bot,
  CreditCard,
  Building2,
  CalendarClock,
  PlayCircle,
  Loader2
} from "lucide-react";
import { getStudentAssignments } from "../../services/curriculumService";
import { startExam } from "../../services/practiceService";
import useSessionStore from "../../store/sessionStore";

export default function Dashboard(): React.ReactElement {
  const navigate = useNavigate();
  const authUser = useAuthStore((s) => s.user);
  const scope = useScope();
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const { data: dashboardData } = useQuery(["studentDashboard"], getStudentDashboard);
  const { data: progressData } = useQuery(["studentProgress"], () => getStudentProgress());
  const { data: historyData } = useQuery(["practiceHistory"], getPracticeHistory);
  const { data: aiInsightsData } = useQuery(["studentAIInsights"], getStudentAIInsights);
  const { data: weakData } = useQuery(["studentWeakAreas"], getWeakAreas);
  const { data: paymentStatus, refetch: refetchPayment } = useQuery(["paymentStatus"], paymentService.status);
  const { data: assignmentsData } = useQuery(["studentAssignments"], getStudentAssignments);

  const startSession = useSessionStore((s) => s.startSession);
  const [launchingAssignmentId, setLaunchingAssignmentId] = useState<string | null>(null);

  const dashboard: DashboardData = dashboardData?.data || {};
  const progress: SubjectProgress[] = progressData?.data || [];
  const history: PracticeHistoryItem[] = historyData?.data || [];
  const aiInsights: AIInsights = aiInsightsData?.data || {};
  const weakAreas: WeakArea[] = weakData?.data || [];
  const assignments: any[] = assignmentsData?.data?.assignments || [];
  const isSubscribed = Boolean(paymentStatus?.is_subscribed || paymentStatus?.isSubscribed);

  const handleStartAssignment = async (asg: any) => {
    setLaunchingAssignmentId(asg.id);
    try {
      const res = await startExam({
        exam_id: asg.exam_id,
        assignment_id: asg.id,
      });
      const data = res.data?.data || res.data || {};
      const questions = data.questions || [];
      const sections = data.sections || [];
      const durationSeconds = data.duration || data.duration_seconds || (asg.duration_minutes ? asg.duration_minutes * 60 : 7200);

      startSession(data.id || asg.exam_id || asg.id, "national_mock", questions, durationSeconds, sections);
      navigate("/student/session");
    } catch (err) {
      console.error("Failed to start assigned exam", err);
      navigate("/student/practice");
    } finally {
      setLaunchingAssignmentId(null);
    }
  };

  const isNatural = scope.stream === "Natural Science";
  const displayWeakAreas: WeakArea[] = weakAreas.length > 0 ? weakAreas.slice(0, 3) : [
    { subject: isNatural ? "Physics" : "Economics", topic: isNatural ? "Electromagnetism & Induction" : "Macroeconomic Theory", accuracy_percent: 48 },
    { subject: "Mathematics", topic: "Coordinate Geometry & Conic Sections", accuracy_percent: 54 },
    { subject: isNatural ? "Chemistry" : "History", topic: isNatural ? "Electrochemistry & Redox Reactions" : "Modern Ethiopian State Formation", accuracy_percent: 58 }
  ];

  const candidateName = authUser?.fullName || authUser?.name || dashboard?.student_name || dashboard?.name || DASHBOARD_DEFAULTS.CANDIDATE_NAME;
  const predictedScore = dashboard?.current_predicted_score || dashboard?.predicted_score || DASHBOARD_DEFAULTS.PREDICTED_SCORE;
  const targetScore = dashboard?.target_score || DASHBOARD_DEFAULTS.TARGET_SCORE;
  const streakDays = dashboard?.streak_days ?? authUser?.streakDays ?? DASHBOARD_DEFAULTS.STREAK_DAYS;
  const nationalRank = dashboard?.national_rank ?? authUser?.nationalRank ?? DASHBOARD_DEFAULTS.NATIONAL_RANK;
  const targetUniv = dashboard?.target_university || authUser?.targetUniversity || DASHBOARD_DEFAULTS.DEFAULT_UNIVERSITY;
  const daysRemaining = dashboard?.days_until_exam || DASHBOARD_DEFAULTS.DAYS_UNTIL_EXAM;

  const trend = useMemo(() => {
    const scores = history.slice(0, 8).map((h: PracticeHistoryItem) => h.score_percent).reverse();
    return scores.length ? scores : [...DASHBOARD_DEFAULTS.TREND_FALLBACK];
  }, [history]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0F2744] via-[#143257] to-[#0F2744] p-6 sm:p-8 text-white border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold backdrop-blur-sm border border-white/15">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>National Examination Countdown: {daysRemaining} Days</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
              Welcome back, {candidateName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-2 flex-wrap">
              <span className="font-medium text-white">{scope.gradeDisplay}</span>
              <span>•</span>
              <span className="text-amber-300 font-medium">{scope.streamDisplay}</span>
              <span>•</span>
              <span className="text-amber-300 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5" /> Target: {targetUniv}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate("/student/practice")}
              aria-label="Launch practice session"
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4 text-slate-950" aria-hidden="true" />
              <span>Launch Practice</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
            <button
              onClick={() => navigate("/student/battle")}
              aria-label="Start 1v1 quiz battle"
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs font-bold backdrop-blur-sm transition-all flex items-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <Swords className="w-4 h-4 text-rose-400" aria-hidden="true" />
              <span>1v1 Quiz Battle</span>
            </button>
            <button
              onClick={() => navigate("/student/ai-tutor")}
              aria-label="Open Socratic AI tutor"
              className="px-4 py-3 rounded-2xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/30 text-xs font-bold backdrop-blur-sm transition-all flex items-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <Bot className="w-4 h-4 text-teal-400" aria-hidden="true" />
              <span>Socratic AI Tutor</span>
            </button>
            <button
              onClick={() => setPaymentModalOpen(true)}
              className={`px-4 py-3 rounded-2xl text-xs font-bold backdrop-blur-sm transition-all flex items-center gap-2 cursor-pointer active:scale-[0.98] ${
                isSubscribed
                  ? "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30"
                  : "bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/30"
              }`}
            >
              {isSubscribed ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Pro Active ({paymentStatus?.plan || "Pass"})</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 text-amber-400" />
                  <span>Upgrade to Pro (Chapa)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Institutional School Tasks & Assigned Exams */}
      {assignments.length > 0 && (
        <div className="rounded-3xl bg-white border border-blue-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold border border-blue-100">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                  <span>Assigned by Your School</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                    {assignments.filter((a: any) => !a.is_completed).length} Pending
                  </span>
                </h2>
                <p className="text-xs text-slate-500">
                  {assignments[0]?.school_name ? `${assignments[0].school_name} • ` : ""}{assignments[0]?.classroom || "Enrolled Classroom"}
                </p>
              </div>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Official Institutional Tasks</span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {assignments.map((asg: any) => {
              const isCompleted = asg.is_completed;
              const isLaunching = launchingAssignmentId === asg.id;
              const formattedDue = asg.due_date ? new Date(asg.due_date).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "Open Deadline";

              return (
                <div
                  key={asg.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isCompleted
                      ? "bg-slate-50/70 border-slate-200"
                      : "bg-gradient-to-br from-white to-blue-50/30 border-blue-200 shadow-xs hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                      {asg.subject || "All Subjects"}
                    </span>
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        {asg.score_percent !== null ? `${asg.score_percent}%` : "Completed"}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        <CalendarClock className="w-3 h-3" />
                        {formattedDue}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{asg.title}</h3>
                  {asg.description && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{asg.description}</p>
                  )}

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-medium">
                      {asg.duration_minutes ? `${asg.duration_minutes} mins` : "Timed Exam"}
                    </span>

                    {isCompleted ? (
                      <span className="text-xs font-bold text-emerald-600">Submitted</span>
                    ) : (
                      <button
                        onClick={() => handleStartAssignment(asg)}
                        disabled={isLaunching}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
                      >
                        {isLaunching ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Starting...</span>
                          </>
                        ) : (
                          <>
                            <PlayCircle className="w-3.5 h-3.5" />
                            <span>Start Test</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" role="region" aria-label="Key performance metrics">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Predicted Score</span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="font-serif text-3xl font-bold text-slate-900">{predictedScore}</span>
              <span className="text-xs text-slate-400 font-semibold">/700</span>
            </div>
            <span className="inline-block mt-1 text-[11px] font-semibold text-emerald-600">
              86% Cutoff Probability
            </span>
          </div>
          <ScoreRing score={predictedScore} target={targetScore} size={64} strokeWidth={6} label="" />
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Target Threshold</span>
            <Target className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-1">
            <div className="flex items-baseline gap-1">
              <span className="font-serif text-3xl font-bold text-amber-600">{targetScore}</span>
              <span className="text-xs text-slate-400 font-semibold">/700</span>
            </div>
            <div className="mt-2">
              <ProgressBar value={predictedScore} max={targetScore} showPercentage size="sm" color="amber" />
            </div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Consistency Streak</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-1">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-3xl font-bold text-slate-900">{streakDays}</span>
              <span className="text-xs text-slate-500 font-bold">Days Active</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Keep practice habit daily to earn 100 XP bonus</p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">National Standing</span>
            <Award className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-1">
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-slate-400">#</span>
              <span className="font-serif text-3xl font-bold text-slate-900">{nationalRank}</span>
            </div>
            <p className="text-[11px] font-semibold text-purple-600 mt-1">Top 2.5% of National Candidates</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>Recent Diagnostic Score Trajectory</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Average accuracy over recent simulated test blocks</p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-100">
                +14% Growth this Month
              </span>
            </div>

            <div className="pt-2">
              <MiniLineChart points={trend} height={150} />
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>Curriculum Subject Accuracies</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Diagnosed across 10,000+ past entrance exam questions</p>
              </div>
              <Link to="/student/weak-areas" className="text-xs font-bold text-amber-600 hover:text-amber-700">
                View Diagnostics &rarr;
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {progress.length > 0 ? (
                progress.map((item: SubjectProgress) => {
                  const acc = item.accuracy_percent ?? item.accuracy ?? 70;
                  const isMastered = acc >= 80;
                  const isLow = acc < 50;
                  const color = isMastered ? "teal" : isLow ? "rose" : "amber";

                  return (
                    <div key={item.subject} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-xs text-slate-800">{item.subject}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isMastered
                              ? "bg-emerald-100 text-emerald-800"
                              : isLow
                              ? "bg-rose-100 text-rose-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {acc}% Accuracy
                        </span>
                      </div>
                      <ProgressBar value={acc} max={100} showPercentage={false} size="sm" color={color} />
                    </div>
                  );
                })
              ) : (
                scope.availableSubjects.map((s) => (
                  <div key={s} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-xs text-slate-800">{s}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        75% Benchmark
                      </span>
                    </div>
                    <ProgressBar value={75} max={100} showPercentage={false} size="sm" color="amber" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Socratic Intervention</h4>
                <p className="text-[11px] text-amber-800 font-medium">Personalized National Exam Gain</p>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              {aiInsights.summary || "High momentum detected in Calculus and Biology. Recommended focus is focused on Electrochemistry reduction potentials to exceed 520 target threshold."}
            </p>

            <div className="p-3 rounded-2xl bg-white/80 border border-amber-200 text-xs text-slate-800 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Projected Gain: +15 Points with 40 Drills</span>
            </div>

            <button
              onClick={() => navigate("/student/practice")}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-950 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Practice Recommended Topic</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>Urgent Conceptual Gaps</span>
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-100">
                Action Required
              </span>
            </div>

            <div className="space-y-3">
              {displayWeakAreas.map((w: WeakArea, idx: number) => (
                <div key={w.id || idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="overflow-hidden pr-2">
                    <span className="text-[10px] font-bold text-amber-700 uppercase">{w.subject}</span>
                    <p className="font-semibold text-xs text-slate-800 truncate">{w.topic}</p>
                  </div>
                  <span className="text-xs font-bold text-rose-600 shrink-0">
                    {w.accuracy_percent ?? w.accuracy}%
                  </span>
                </div>
              ))}
            </div>

            <Link
              to="/student/weak-areas"
              className="block text-center text-xs font-bold text-slate-600 hover:text-slate-900 pt-1"
            >
              Inspect Complete Weak Areas Roster &rarr;
            </Link>
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onSuccess={() => refetchPayment()}
      />
    </div>
  );
}
