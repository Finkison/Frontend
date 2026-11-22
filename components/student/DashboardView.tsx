import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getStudentDashboard, getStudentProgress } from "../../services/studentService";
import { getPracticeHistory, startExam } from "../../services/practiceService";
import { getSchoolTasks, type StudentSchoolTask } from "../../services/schoolService";
import { getStudentAssignments } from "../../services/curriculumService";
import useAuthStore from "../../store/authStore";
import useSessionStore from "../../store/sessionStore";
import { useI18n } from "../../i18n";
import MiniLineChart from "../shared/MiniLineChart";
import ProgressBar from "../shared/ProgressBar";
import PageHeader from "../shared/PageHeader";
import PortalPage from "../shared/PortalPage";
import type { DashboardData, StudentSchoolAssignment, SubjectProgress, PracticeHistoryItem } from "../../types/student";
import {
  TrendingUp,
  ArrowRight,
  CalendarClock,
  PlayCircle,
  Loader2,
  CalendarCheck,
  CheckCircle2,
  Target,
  Sparkles,
  Zap,
  Flame,
  MessageCircle,
  BookOpen
} from "lucide-react";

export default function DashboardView(): React.ReactElement {
  const navigate = useNavigate();
  const { t, language } = useI18n();
  const authUser = useAuthStore((s) => s.user);
  const { data: dashboardData, isLoading: dashboardLoading, isError: dashboardError, refetch: refetchDashboard } = useQuery(["studentDashboard"], () => getStudentDashboard());
  const { data: progressData, isLoading: progressLoading, isError: progressError, refetch: refetchProgress } = useQuery(["studentProgress"], () => getStudentProgress());
  const { data: historyData, isLoading: historyLoading, isError: historyError, refetch: refetchHistory } = useQuery(["practiceHistory"], getPracticeHistory);
  const { data: assignmentsData, isLoading: assignmentsLoading, isError: assignmentsError, refetch: refetchAssignments } = useQuery(["studentAssignments"], getStudentAssignments);
  const { data: classworkData, isLoading: classworkLoading, isError: classworkError, refetch: refetchClasswork } = useQuery(
    ["studentClasswork"],
    getSchoolTasks,
    { enabled: Boolean(authUser?.schoolId || authUser?.isSchoolEnrolled || dashboardData?.data?.is_school_enrolled) },
  );

  const startSession = useSessionStore((s) => s.startSession);
  const [launchingAssignmentId, setLaunchingAssignmentId] = useState<string | null>(null);
  const [assignmentError, setAssignmentError] = useState(false);

  const dashboard: DashboardData = dashboardData?.data || {};
  const progress: SubjectProgress[] = progressData?.data || [];
  const history: PracticeHistoryItem[] = historyData?.data || [];

  const assignments: StudentSchoolAssignment[] = assignmentsData?.data?.assignments || [];
  const classwork: StudentSchoolTask[] = Array.isArray(classworkData?.data?.tasks) ? classworkData.data.tasks : [];
  const recordedQuestionCount = progress.reduce((total, item) => total + (Number(item.total_questions) || 0), 0);
  const recordedCorrectCount = progress.reduce((total, item) => total + (Number(item.correct_answers) || 0), 0);
  const recordedAccuracy = recordedQuestionCount > 0
    ? Math.round((recordedCorrectCount / recordedQuestionCount) * 100)
    : null;

  const handleStartAssignment = async (asg: StudentSchoolAssignment) => {
    setLaunchingAssignmentId(String(asg.id));
    setAssignmentError(false);
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
      setAssignmentError(true);
    } finally {
      setLaunchingAssignmentId(null);
    }
  };

  const candidateName = authUser?.fullName || authUser?.name || dashboard?.student_name || dashboard?.name;
  const targetScore = dashboard?.target_score;
  const attendanceRate = dashboard?.attendance_rate;
  const isEnrolledInSchool = dashboard.is_school_enrolled ?? authUser?.isSchoolEnrolled ?? Boolean(authUser?.schoolId);
  const grade = dashboard?.grade || authUser?.grade;
  const stream = dashboard?.stream || authUser?.stream;
  const learnerContext = [
    grade ? (String(grade).toLowerCase().startsWith("grade") ? String(grade) : t("studentDashboard.gradeContext", { grade })) : null,
    stream || null,
    ].filter(Boolean).join(" · ");

  const trend = useMemo(() => {
    const scores = history.slice(0, 8).map((h: PracticeHistoryItem) => h.score_percent).reverse();
    return scores;
  }, [history]);

  const pendingAssignments = assignments
    .filter((assignment) => !assignment.is_completed)
    .sort((a, b) => {
      const dueA = a.due_date ? Date.parse(a.due_date) : Number.POSITIVE_INFINITY;
      const dueB = b.due_date ? Date.parse(b.due_date) : Number.POSITIVE_INFINITY;
      return dueA - dueB;
    });
  const pendingClasswork = classwork
    .filter((task) => task.status === "Assigned" || task.status === "Overdue")
    .sort((a, b) => {
      const dueA = a.due_date ? Date.parse(a.due_date) : Number.POSITIVE_INFINITY;
      const dueB = b.due_date ? Date.parse(b.due_date) : Number.POSITIVE_INFINITY;
      return dueA - dueB;
    });
  const pendingWorkCount = pendingAssignments.length + pendingClasswork.length;
  const formatDueDate = (value?: string) => {
    if (!value) return t("studentDashboard.noDueDate");
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleDateString(language === "am" ? "am-ET" : language === "om" ? "om-ET" : "en-ET", { month: "short", day: "numeric" });
  };
  const hasProgressValues = progress.some((item) => {
    const accuracy = item.accuracy_percent ?? item.accuracy;
    return typeof accuracy === "number" && Number.isFinite(accuracy);
  });

  return (
    <PortalPage>

      <PageHeader
        title={t("studentDashboard.title")}
        description={[candidateName, learnerContext].filter(Boolean).join(" · ") || t("studentDashboard.description")}
        badge={isEnrolledInSchool ? { text: t("studentDashboard.schoolLearner"), variant: "brand" } : { text: t("studentDashboard.independentLearner"), variant: "neutral" }}
        primaryAction={{ label: t("studentDashboard.startPractice"), href: "/student/practice", icon: ArrowRight }}
      />

      {(() => {
        const nextClasswork = pendingClasswork[0];
        const nextUpAssignment = pendingAssignments[0];
        const hasNextWork = Boolean(nextClasswork || nextUpAssignment);
        return (
          <div className="rounded-2xl bg-[#FAF8F5] dark:bg-[#1C1512] border border-[#E7E0D6] dark:border-white/10 border-l-4 border-l-[#881337] p-5 sm:p-6 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide bg-[#FFF1F2] dark:bg-[#4C0519]/40 border border-[#FECDD3] dark:border-[#881337]/50 text-[#881337]">
                  <Sparkles className="w-3 h-3 text-[#881337]" />
                  <span>{nextClasswork ? t("studentDashboard.classworkDue") : nextUpAssignment ? t("studentDashboard.assignedAssessment") : t("studentDashboard.suggestedStep")}</span>
                </span>
                <span className="text-xs text-stone-500 dark:text-[#A89C90] font-medium">
                  {hasNextWork ? t("studentDashboard.fromTeacher") : t("studentDashboard.chooseSubject")}
                </span>
              </div>
              {hasNextWork && (
                <span className="text-xs font-mono text-stone-500 dark:text-[#A89C90]">
                  {(nextClasswork?.due_date || nextUpAssignment?.due_date) ? t("studentDashboard.dueDate", { date: formatDueDate(nextClasswork?.due_date || nextUpAssignment?.due_date) }) : t("studentDashboard.noDueDate")}
                </span>
              )}
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-stone-900 dark:text-[#FDFBF7] tracking-tight">
                  {nextClasswork?.title || nextUpAssignment?.exam_title || t("studentDashboard.continueLearning")}
                </h2>
                <p className="text-xs text-stone-600 dark:text-[#E7E0D6] max-w-2xl leading-relaxed">
                  {nextClasswork
                    ? t("studentDashboard.completeClasswork")
                    : nextUpAssignment
                    ? t("studentDashboard.completeAssessment")
                    : t("studentDashboard.nextStepDescription")}
                </p>
              </div>

              <div className="shrink-0">
                {nextClasswork ? (
                  <button
                    type="button"
                    onClick={() => navigate(`/student/coursework?task=${encodeURIComponent(nextClasswork.id)}`)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#881337] hover:bg-[#9F1239] active:bg-[#BE123C] text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:shadow-sm"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>{t("studentDashboard.openClasswork")}</span>
                  </button>
                ) : nextUpAssignment ? (
                  <button
                    type="button"
                    onClick={() => handleStartAssignment(nextUpAssignment)}
                    disabled={launchingAssignmentId === nextUpAssignment.id}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#881337] hover:bg-[#9F1239] active:bg-[#BE123C] text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:shadow-sm disabled:opacity-60"
                  >
                    {launchingAssignmentId === nextUpAssignment.id ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>{t("studentDashboard.launching")}</span>
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-4 h-4" />
                    <span>{t("studentDashboard.startAssessment")}</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => navigate("/student/practice")}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#881337] hover:bg-[#9F1239] active:bg-[#BE123C] text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:shadow-sm"
                  >
                    <Zap className="w-4 h-4 text-[#FBBF24]" />
                    <span>{t("studentDashboard.choosePractice")}</span>
                  </button>
                )}
              </div>
            </div>
            {assignmentError && (
              <p role="alert" className="text-sm text-rose-700 dark:text-rose-300">
                {t("studentDashboard.assignmentStartError")}
              </p>
            )}
          </div>
        );
      })()}

      <div className={`grid grid-cols-1 sm:grid-cols-2 ${isEnrolledInSchool ? "xl:grid-cols-4" : "xl:grid-cols-3"} gap-4`} role="region" aria-label={t("studentDashboard.metricsLabel")}>

        <div className="p-5 rounded-xl bg-white dark:bg-[#261E1A] border border-[#E7E0D6] dark:border-white/10 shadow-2xs hover:shadow-sm hover:border-[#881337]/30 transition-all duration-200 space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-[#A89C90]">
            <span className="font-medium">{t("studentDashboard.recordedAccuracy")}</span>
            <TrendingUp className="w-4 h-4 text-[#881337]" />
          </div>
          <div className="text-2xl font-semibold text-[#881337] tabular-nums font-mono">
            {progressLoading ? (
              <span className="text-base font-medium text-stone-400 dark:text-[#A89C90] font-sans">{t("studentDashboard.loading")}</span>
            ) : progressError ? (
              <span className="text-base font-medium text-stone-400 dark:text-[#A89C90] font-sans">{t("studentDashboard.unavailable")}</span>
            ) : recordedAccuracy !== null ? (
              <>{recordedAccuracy}<span className="text-xs font-normal text-stone-400 dark:text-[#A89C90] font-sans">%</span></>
            ) : (
              <span className="text-base font-medium text-stone-400 dark:text-[#A89C90] font-sans">{t("studentDashboard.noResultsYet")}</span>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500 dark:text-[#A89C90] pt-0.5">
            <span>{progressLoading ? t("studentDashboard.loadingAnswers") : progressError ? t("studentDashboard.practiceResultsUnavailable") : recordedAccuracy !== null ? t("studentDashboard.acrossAnswers", { count: recordedQuestionCount }) : t("studentDashboard.completeToBuildRecord")}</span>
            {progressError && <button type="button" onClick={() => void refetchProgress()} className="font-semibold text-[#881337] underline-offset-2 hover:underline dark:text-[#FBBF24]">{t("studentDashboard.tryAgain")}</button>}
          </div>
        </div>

        {!isEnrolledInSchool && <div className="p-5 rounded-xl bg-white dark:bg-[#261E1A] border border-[#E7E0D6] dark:border-white/10 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-[#A89C90]">
            <span className="font-medium">{t("studentDashboard.learningStreak")}</span>
            <Flame className="w-4 h-4 text-amber-600" aria-hidden="true" />
          </div>
          <div className="text-2xl font-semibold text-stone-900 dark:text-[#FDFBF7] tabular-nums font-mono">
            {dashboardLoading ? t("studentDashboard.loading") : dashboardError ? t("studentDashboard.unavailable") : t("studentDashboard.dayCount", { count: dashboard.streak_days ?? 0 })}
          </div>
          <span className="text-xs text-stone-500 dark:text-[#A89C90] block">{t("studentDashboard.independentActivity")}</span>
        </div>}

        {isEnrolledInSchool && <div className="p-5 rounded-xl bg-white dark:bg-[#261E1A] border border-[#E7E0D6] dark:border-white/10 shadow-2xs hover:shadow-sm hover:border-[#881337]/30 transition-all duration-200 space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-[#A89C90]">
            <span className="font-medium">{t("studentDashboard.attendanceRate")}</span>
            <CalendarCheck className="w-4 h-4 text-[#881337]" />
          </div>
          <div className="text-2xl font-semibold text-stone-900 dark:text-[#FDFBF7] tabular-nums font-mono">
            {dashboardLoading ? t("studentDashboard.loading") : dashboardError ? t("studentDashboard.unavailable") : attendanceRate !== undefined && attendanceRate !== null ? `${attendanceRate}%` : "—"}
          </div>
          <span className="text-xs text-stone-500 dark:text-[#A89C90] block">
            {dashboardLoading
              ? t("studentDashboard.loadingSchoolRecord")
              : attendanceRate !== undefined && attendanceRate !== null
                    ? t("studentDashboard.fromSchoolRecord")
              : dashboardError
              ? t("studentDashboard.attendanceUnavailable")
              : isEnrolledInSchool
              ? t("studentDashboard.awaitingSchoolSync")
              : t("studentDashboard.independentLearner")}
          </span>
        </div>}

        <div className="p-5 rounded-xl bg-white dark:bg-[#261E1A] border border-[#E7E0D6] dark:border-white/10 shadow-2xs hover:shadow-sm hover:border-[#881337]/30 transition-all duration-200 space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-[#A89C90]">
            <span className="font-medium">{t("studentDashboard.targetScore")}</span>
            <Target className="w-4 h-4 text-[#B45309]" />
          </div>
          <div className="text-2xl font-semibold text-stone-900 dark:text-[#FDFBF7] tabular-nums font-mono">
            {dashboardLoading ? (
              <span className="text-base font-medium text-stone-400 dark:text-[#A89C90] font-sans">{t("studentDashboard.loading")}</span>
            ) : dashboardError ? (
              <span className="text-base font-medium text-stone-400 dark:text-[#A89C90] font-sans">{t("studentDashboard.unavailable")}</span>
            ) : targetScore ? (
              <>{targetScore} <span className="text-xs font-normal text-stone-400 dark:text-[#A89C90] font-sans">/ 600</span></>
            ) : (
              <span className="text-base font-medium text-stone-400 dark:text-[#A89C90] font-sans">{t("studentDashboard.notSet")}</span>
            )}
          </div>
          <span className="text-xs text-stone-500 dark:text-[#A89C90] block">
            {dashboardLoading ? t("studentDashboard.loadingProfileTarget") : dashboardError ? t("studentDashboard.targetUnavailable") : targetScore ? t("studentDashboard.savedInProfile") : t("studentDashboard.setTargetInSettings")}
          </span>
          {dashboardError && <button type="button" onClick={() => void refetchDashboard()} className="text-left text-xs font-semibold text-[#881337] underline-offset-2 hover:underline dark:text-[#FBBF24]">{t("studentDashboard.tryAgain")}</button>}
        </div>

        {isEnrolledInSchool && <div className="p-5 rounded-xl bg-white dark:bg-[#261E1A] border border-[#E7E0D6] dark:border-white/10 shadow-2xs hover:shadow-sm hover:border-[#881337]/30 transition-all duration-200 space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-[#A89C90]">
            <span className="font-medium">{t("studentDashboard.pendingWork")}</span>
            <CalendarClock className="w-4 h-4 text-[#881337]" />
          </div>
          <div className="text-2xl font-semibold text-stone-900 dark:text-[#FDFBF7] tabular-nums font-mono">
            {assignmentsLoading || classworkLoading ? "…" : assignmentsError || classworkError ? "—" : pendingWorkCount}
          </div>
          <span className="text-xs text-stone-500 dark:text-[#A89C90] block">
            {assignmentsError || classworkError ? t("studentDashboard.classworkUnavailable") : t("studentDashboard.classworkAndAssessments")}
          </span>
          {(assignmentsError || classworkError) && <button type="button" onClick={() => { void refetchAssignments(); void refetchClasswork(); }} className="text-left text-xs font-semibold text-[#881337] underline-offset-2 hover:underline dark:text-[#FBBF24]">{t("studentDashboard.tryAgain")}</button>}
        </div>}

      </div>

      {isEnrolledInSchool ? <div className="rounded-2xl bg-white dark:bg-[#261E1A] border border-[#E7E0D6] dark:border-white/10 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-white/10 pb-3">
          <div>
            <h2 className="text-base font-semibold text-stone-900 dark:text-[#FDFBF7]">
              {t("studentDashboard.assignedAssessments")}
            </h2>
            <p className="text-xs text-stone-500 dark:text-[#A89C90] mt-0.5">
              {t("studentDashboard.assignedAssessmentsDescription")}
            </p>
          </div>
          <span className="text-xs font-mono tabular-nums text-stone-500 dark:text-[#A89C90] px-2 py-0.5 rounded bg-stone-100 dark:bg-[#201815]">
            {assignmentsLoading ? t("studentDashboard.loading") : assignmentsError ? t("studentDashboard.unavailable") : t("studentDashboard.pendingCount", { count: pendingAssignments.length })}
          </span>
        </div>

        {assignmentsLoading ? (
          <p role="status" className="py-8 text-center text-sm text-stone-500 dark:text-[#A89C90]">{t("studentDashboard.loadingAssignedWork")}</p>
        ) : assignmentsError ? (
          <div role="alert" className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 sm:flex-row sm:items-center sm:justify-between"><p>{t("studentDashboard.assignedWorkError")}</p><button type="button" onClick={() => void refetchAssignments()} className="min-h-9 self-start rounded-lg border border-rose-300 px-3 text-xs font-semibold hover:bg-rose-100 sm:self-auto">{t("studentDashboard.tryAgain")}</button></div>
        ) : assignments.length > 0 ? (
          <div className="space-y-3">
            {assignments.map((asg) => {
              const isCompleted = asg.is_completed;
              const isLaunching = launchingAssignmentId === String(asg.id);
              const formattedDue = formatDueDate(asg.due_date);

              return (
                <div
                  key={asg.id}
                  className="p-4 rounded-xl border border-[#E7E0D6] dark:border-white/10 bg-[#FAF8F5]/60 dark:bg-[#1C1512]/50 hover:bg-[#FAF8F5] dark:hover:bg-white/5 hover:border-[#881337]/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {asg.subject && <span className="text-xs font-semibold px-2 py-0.5 rounded bg-stone-200 dark:bg-white/10 text-stone-800 dark:text-[#FDFBF7]">{asg.subject}</span>}
                      <span className="text-xs text-stone-500 dark:text-[#A89C90]">
                        {asg.due_date ? t("studentDashboard.dueDate", { date: formattedDue }) : formattedDue}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-stone-900 dark:text-[#FDFBF7]">{asg.exam_title || t("studentDashboard.assignedExam")}</h3>
                    {asg.school_name && <p className="text-xs text-stone-600 dark:text-[#E7E0D6] line-clamp-1">{t("studentDashboard.assignedBy", { school: asg.school_name })}</p>}
                  </div>

                  <div className="shrink-0">
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-md">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{t("studentDashboard.submitted")}</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleStartAssignment(asg)}
                        disabled={isLaunching}
                        className="w-full sm:w-auto px-4 py-2 rounded-md bg-[#881337] hover:bg-[#9F1239] active:bg-[#BE123C] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                      >
                        {isLaunching ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>{t("studentDashboard.loading")}</span>
                          </>
                        ) : (
                          <>
                            <PlayCircle className="w-3.5 h-3.5" />
                            <span>{t("studentDashboard.startExam")}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-stone-500 dark:text-[#A89C90]">
            {t("studentDashboard.noAssessments")} {t("studentDashboard.noAssessmentsDescription")}
          </div>
        )}
      </div> : <section className="rounded-2xl bg-white dark:bg-[#261E1A] border border-[#E7E0D6] dark:border-white/10 p-6 shadow-2xs space-y-4" aria-labelledby="independent-learning-heading">
        <div className="border-b border-stone-100 dark:border-white/10 pb-3">
          <h2 id="independent-learning-heading" className="text-base font-semibold text-stone-900 dark:text-[#FDFBF7]">{t("studentDashboard.independentTitle")}</h2>
          <p className="mt-1 text-xs text-stone-500 dark:text-[#A89C90]">{t("studentDashboard.independentDescription")}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Link to="/student/lessons" className="group rounded-xl border border-[#E7E0D6] dark:border-white/10 p-4 transition-colors hover:border-[#881337]/40 hover:bg-[#FAF8F5] dark:hover:bg-white/5">
            <BookOpen className="h-5 w-5 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />
            <span className="mt-3 block text-sm font-semibold text-stone-900 dark:text-[#FDFBF7]">{t("studentDashboard.exploreLessons")}</span>
            <span className="mt-1 block text-xs leading-5 text-stone-500 dark:text-[#A89C90]">{t("studentDashboard.lessonDescription")}</span>
          </Link>
          <Link to="/student/practice" className="group rounded-xl border border-[#E7E0D6] dark:border-white/10 p-4 transition-colors hover:border-[#881337]/40 hover:bg-[#FAF8F5] dark:hover:bg-white/5">
            <Target className="h-5 w-5 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />
            <span className="mt-3 block text-sm font-semibold text-stone-900 dark:text-[#FDFBF7]">{t("studentDashboard.practiceSubject")}</span>
            <span className="mt-1 block text-xs leading-5 text-stone-500 dark:text-[#A89C90]">{t("studentDashboard.practiceDescription")}</span>
          </Link>
          <Link to="/student/ai-tutor" className="group rounded-xl border border-[#E7E0D6] dark:border-white/10 p-4 transition-colors hover:border-[#881337]/40 hover:bg-[#FAF8F5] dark:hover:bg-white/5">
            <MessageCircle className="h-5 w-5 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />
            <span className="mt-3 block text-sm font-semibold text-stone-900 dark:text-[#FDFBF7]">{t("studentDashboard.askTutor")}</span>
            <span className="mt-1 block text-xs leading-5 text-stone-500 dark:text-[#A89C90]">{t("studentDashboard.tutorDescription")}</span>
          </Link>
        </div>
        <Link to="/student/school-access" className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[#881337] underline-offset-4 hover:underline dark:text-[#FBBF24]">
          {t("classroomWorkflows.schoolAccess.linkAction")}<ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </section>}

      <div className="rounded-2xl bg-white dark:bg-[#261E1A] border border-[#E7E0D6] dark:border-white/10 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-white/10 pb-3">
          <div>
            <h2 className="text-base font-semibold text-stone-900 dark:text-[#FDFBF7]">
              {t("studentDashboard.subjectProgress")}
            </h2>
            <p className="text-xs text-stone-500 dark:text-[#A89C90] mt-0.5">
              {t("studentDashboard.subjectProgressDescription")}
            </p>
          </div>
          <Link to="/student/lessons" className="text-xs font-semibold text-[#881337] hover:underline">
            {t("studentDashboard.viewSyllabus")}
          </Link>
        </div>

        {progressLoading ? (
          <p role="status" className="py-8 text-center text-sm text-stone-500 dark:text-[#A89C90]">{t("studentDashboard.loadingSubjectProgress")}</p>
        ) : progressError ? (
          <div role="alert" className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 sm:flex-row sm:items-center sm:justify-between"><p>{t("studentDashboard.subjectProgressError")}</p><button type="button" onClick={() => void refetchProgress()} className="min-h-9 self-start rounded-lg border border-rose-300 px-3 text-xs font-semibold hover:bg-rose-100 sm:self-auto">{t("studentDashboard.tryAgain")}</button></div>
        ) : !hasProgressValues ? (
          <div className="rounded-xl border border-dashed border-stone-300 dark:border-white/15 bg-[#FAF8F5] dark:bg-[#1C1512] px-5 py-8 text-center">
            <p className="text-sm font-semibold text-stone-800 dark:text-[#FDFBF7]">{t("studentDashboard.subjectProgressEmpty")}</p>
            <p className="mt-1 text-xs text-stone-500 dark:text-[#A89C90]">{t("studentDashboard.subjectProgressEmptyDescription")}</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {progress.map((item: SubjectProgress) => {
            const acc = item.accuracy_percent ?? item.accuracy;
            if (typeof acc !== "number" || !Number.isFinite(acc)) return null;
            const isLow = acc < 60;
            const isMedium = acc >= 60 && acc < 75;

            return (
              <div key={item.subject} className="p-4 rounded-xl border border-[#E7E0D6] dark:border-white/10 bg-white dark:bg-[#261E1A] hover:border-[#881337]/30 hover:shadow-2xs transition-all space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-900 dark:text-[#FDFBF7]">{item.subject}</span>
                  <span className={`text-xs font-mono tabular-nums px-2 py-0.5 rounded border ${
                    isLow
                      ? "bg-rose-50 border-rose-200 text-rose-800"
                      : isMedium
                      ? "bg-amber-50 border-amber-200 text-amber-800"
                      : "bg-emerald-50 border-emerald-200 text-emerald-800"
                  }`}>
                    {acc}% • {isLow ? t("studentDashboard.needsPractice") : isMedium ? t("studentDashboard.building") : t("studentDashboard.onTrack")}
                  </span>
                </div>
                <div className="h-2 w-full bg-stone-100 dark:bg-[#201815] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isLow ? "bg-rose-600" : isMedium ? "bg-amber-600" : "bg-emerald-700"
                    }`}
                    style={{ width: `${acc}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>

      <div className="rounded-2xl bg-white dark:bg-[#261E1A] border border-[#E7E0D6] dark:border-white/10 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-white/10 pb-3">
          <div>
            <h2 className="text-base font-semibold text-stone-900 dark:text-[#FDFBF7]">
              {t("studentDashboard.scoreTrajectory")}
            </h2>
            <p className="text-xs text-stone-500 dark:text-[#A89C90] mt-0.5">
              {t("studentDashboard.scoreTrajectoryDescription")}
            </p>
          </div>
          <span className="text-xs text-stone-500 dark:text-[#A89C90] font-mono tabular-nums px-2 py-0.5 rounded bg-stone-100 dark:bg-[#201815]">
            {t("studentDashboard.recentAttempts")}
          </span>
        </div>
        {historyLoading ? (
          <p role="status" className="py-8 text-center text-sm text-stone-500 dark:text-[#A89C90]">{t("studentDashboard.loadingRecentScores")}</p>
        ) : historyError ? (
          <div role="alert" className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 sm:flex-row sm:items-center sm:justify-between"><p>{t("studentDashboard.practiceScoresError")}</p><button type="button" onClick={() => void refetchHistory()} className="min-h-9 self-start rounded-lg border border-rose-300 px-3 text-xs font-semibold hover:bg-rose-100 sm:self-auto">{t("studentDashboard.tryAgain")}</button></div>
        ) : trend.length > 0 ? (
          <div className="pt-2">
            {trend.length > 1 ? (
              <>
                <MiniLineChart points={trend} height={140} />
                <div className="mt-2 flex justify-between text-[11px] text-stone-500 dark:text-[#A89C90]">
                  <span>{t("studentDashboard.oldestShown", { score: trend[0] })}</span>
                  <span>{t("studentDashboard.latest", { score: trend[trend.length - 1] })}</span>
                </div>
              </>
            ) : (
              <div className="flex items-end justify-between gap-4 rounded-xl bg-[#FAF8F5] p-4 dark:bg-[#1C1512]">
                <div><p className="text-xs text-stone-500 dark:text-[#A89C90]">{t("studentDashboard.onePracticeResult")}</p><p className="mt-1 text-2xl font-semibold tabular-nums text-[#881337] dark:text-[#FBBF24]">{trend[0]}%</p></div>
                <p className="max-w-xs text-right text-xs leading-5 text-stone-500 dark:text-[#A89C90]">{t("studentDashboard.anotherPracticeForTrend")}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-stone-500 dark:text-[#A89C90]">
            {t("studentDashboard.noPracticeResults")}
          </div>
        )}
      </div>

    </PortalPage>
  );
}

export { DashboardView as Dashboard };
