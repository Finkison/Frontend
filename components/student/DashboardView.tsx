import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getStudentDashboard, getStudentProgress, getStudentAIInsights, getWeakAreas } from "../../services/studentService";
import { getPracticeHistory, startExam } from "../../services/practiceService";
import { getStudentAssignments } from "../../services/curriculumService";
import useAuthStore from "../../store/authStore";
import useScope from "../../hooks/useScope";
import useSessionStore from "../../store/sessionStore";
import MiniLineChart from "../shared/MiniLineChart";
import ProgressBar from "../shared/ProgressBar";
import { DASHBOARD_DEFAULTS } from "../../constants/defaults";
import type { DashboardData, SubjectProgress, PracticeHistoryItem, WeakArea } from "../../types/student";
import { 
  TrendingUp, 
  ArrowRight, 
  CalendarClock,
  PlayCircle,
  Loader2,
  CalendarCheck,
  CheckCircle2,
  FileText
} from "lucide-react";

export default function DashboardView(): React.ReactElement {
  const navigate = useNavigate();
  const authUser = useAuthStore((s) => s.user);
  const scope = useScope();

  const { data: dashboardData } = useQuery(["studentDashboard"], getStudentDashboard);
  const { data: progressData } = useQuery(["studentProgress"], () => getStudentProgress());
  const { data: historyData } = useQuery(["practiceHistory"], getPracticeHistory);
  const { data: assignmentsData } = useQuery(["studentAssignments"], getStudentAssignments);

  const startSession = useSessionStore((s) => s.startSession);
  const [launchingAssignmentId, setLaunchingAssignmentId] = useState<string | null>(null);

  const dashboard: DashboardData = dashboardData?.data || {};
  const progress: SubjectProgress[] = progressData?.data || [];
  const history: PracticeHistoryItem[] = historyData?.data || [];
  
  const assignments: any[] = assignmentsData?.data?.assignments || [];

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

  const candidateName = authUser?.fullName || authUser?.name || dashboard?.student_name || dashboard?.name || "Candidate";
  const predictedScore = dashboard?.current_predicted_score || dashboard?.predicted_score;
  const targetScore = dashboard?.target_score;
  const attendanceRate = dashboard?.attendance_rate;
  const isEnrolledInSchool = Boolean((authUser as any)?.school_id || (authUser as any)?.schoolId);

  const trend = useMemo(() => {
    const scores = history.slice(0, 8).map((h: PracticeHistoryItem) => h.score_percent).reverse();
    return scores;
  }, [history]);

  const pendingAssignments = assignments.filter((a: any) => !a.is_completed);

  return (
    <div className="space-y-8 max-w-6xl mx-auto font-sans">
      
      {/* Standard Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Student overview
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {candidateName} • {scope.gradeDisplay} • {scope.streamDisplay}
          </p>
        </div>
        <div>
          {/* Exactly One Primary Action */}
          <button
            onClick={() => navigate("/student/practice")}
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-[#87CEFA] hover:bg-[#6BBBF5] text-[#0B1B3A] text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <span>Start practice</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Part 1 Limit: Exactly 4 Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" role="region" aria-label="Key performance metrics">
        
        <div className="p-5 rounded-lg bg-white border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Predicted score</span>
            <TrendingUp className="w-4 h-4 text-[#0369A1]" />
          </div>
          <div className="text-2xl font-semibold text-[#0369A1] tabular-nums font-mono">
            {predictedScore ? (
              <>{predictedScore} <span className="text-xs font-normal text-slate-400 font-sans">/ 600</span></>
            ) : (
              <span className="text-base font-medium text-slate-400 font-sans">Pending</span>
            )}
          </div>
          <span className="text-[11px] text-slate-500 block">
            {predictedScore ? "Calibrated entrance model" : "Requires diagnostic session"}
          </span>
        </div>

        <div className="p-5 rounded-lg bg-white border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Attendance rate</span>
            <CalendarCheck className="w-4 h-4 text-[#0369A1]" />
          </div>
          <div className="text-2xl font-semibold text-slate-900 tabular-nums font-mono">
            {attendanceRate !== undefined && attendanceRate !== null ? `${attendanceRate}%` : "—"}
          </div>
          <span className="text-[11px] text-slate-500 block">
            {attendanceRate !== undefined && attendanceRate !== null
              ? "Term 1 homeroom record"
              : isEnrolledInSchool
              ? "Awaiting school sync"
              : "Self-paced candidate"}
          </span>
        </div>

        <div className="p-5 rounded-lg bg-white border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Target score</span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-semibold text-slate-900 tabular-nums font-mono">
            {targetScore ? (
              <>{targetScore} <span className="text-xs font-normal text-slate-400 font-sans">/ 600</span></>
            ) : (
              <span className="text-base font-medium text-slate-400 font-sans">Not set</span>
            )}
          </div>
          <span className="text-[11px] text-slate-500 block">
            {targetScore ? "Admissions threshold" : "Set in profile settings"}
          </span>
        </div>

        <div className="p-5 rounded-lg bg-white border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Pending tasks</span>
            <CalendarClock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-semibold text-slate-900 tabular-nums font-mono">
            {pendingAssignments.length}
          </div>
          <span className="text-[11px] text-slate-500 block">
            Assignments due this week
          </span>
        </div>

      </div>

      {/* Part 1 Limit: One Task List (Assigned School Tasks) */}
      <div className="rounded-lg bg-white border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Assigned tasks
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Assessments assigned by your classroom instructors.
            </p>
          </div>
          <span className="text-xs font-mono tabular-nums text-slate-500">
            {pendingAssignments.length} pending
          </span>
        </div>

        {assignments.length > 0 ? (
          <div className="space-y-3">
            {assignments.map((asg: any) => {
              const isCompleted = asg.is_completed;
              const isLaunching = launchingAssignmentId === asg.id;
              const formattedDue = asg.due_date ? new Date(asg.due_date).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "Open";

              return (
                <div
                  key={asg.id}
                  className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                        {asg.subject || "Subject"}
                      </span>
                      <span className="text-xs text-slate-500">
                        Due {formattedDue}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900">{asg.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-1">{asg.description}</p>
                  </div>

                  <div className="shrink-0">
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-md">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Submitted</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleStartAssignment(asg)}
                        disabled={isLaunching}
                        className="w-full sm:w-auto px-4 py-2 rounded-md bg-[#0369A1] hover:bg-[#0284C7] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                      >
                        {isLaunching ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Loading...</span>
                          </>
                        ) : (
                          <>
                            <PlayCircle className="w-3.5 h-3.5" />
                            <span>Start exam</span>
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
          <div className="text-center py-8 text-xs text-slate-500">
            No assignments due today. All coursework is up to date.
          </div>
        )}
      </div>

      {/* Curriculum Subject Mastery Section */}
      <div className="rounded-lg bg-white border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Subject accuracy
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Mastery diagnosed across curriculum test sets.
            </p>
          </div>
          <Link to="/student/classes" className="text-xs font-semibold text-[#0369A1] hover:underline">
            View syllabus
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(progress.length > 0 ? progress : [
            { subject: "Mathematics", accuracy_percent: 78 },
            { subject: "Physics", accuracy_percent: 54 },
            { subject: "Chemistry", accuracy_percent: 68 },
            { subject: "Biology", accuracy_percent: 82 },
            { subject: "English", accuracy_percent: 84 },
            { subject: "Aptitude", accuracy_percent: 61 }
          ]).map((item: any) => {
            const acc = item.accuracy_percent ?? item.accuracy ?? 70;
            const isLow = acc < 60;
            const isMedium = acc >= 60 && acc < 75;

            return (
              <div key={item.subject} className="p-4 rounded-lg border border-slate-200 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-900">{item.subject}</span>
                  <span className={`text-[11px] font-mono tabular-nums px-2 py-0.5 rounded border ${
                    isLow 
                      ? "bg-red-50 border-red-200 text-red-800" 
                      : isMedium 
                      ? "bg-amber-50 border-amber-200 text-amber-800" 
                      : "bg-emerald-50 border-emerald-200 text-emerald-800"
                  }`}>
                    {acc}%
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      isLow ? "bg-red-600" : isMedium ? "bg-amber-600" : "bg-emerald-700"
                    }`}
                    style={{ width: `${acc}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Diagnostic Trajectory */}
      <div className="rounded-lg bg-white border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Score trajectory
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Average score percentage across recent mock exam attempts.
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono tabular-nums">
            Recent 8 tests
          </span>
        </div>
        {trend.length > 0 ? (
          <div className="pt-2">
            <MiniLineChart points={trend} height={140} />
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-500">
            No mock exam attempts recorded yet. Complete your first practice test to track your score trajectory.
          </div>
        )}
      </div>

    </div>
  );
}

export { DashboardView as Dashboard };
