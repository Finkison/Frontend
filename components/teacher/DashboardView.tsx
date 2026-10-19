import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { getTeacherAssignedPairs } from "../../services/schoolService";
import WaitingForAssignmentView from "./WaitingForAssignmentView";
import { 
  Layers, 
  FileCheck, 
  Clock, 
  TrendingUp, 
  Plus, 
  CheckCircle2, 
  ArrowRight,
  BookOpen,
  ChevronRight,
  CalendarCheck,
  Calendar,
  AlertTriangle,
  ListChecks,
  Sparkles,
  Users,
  MessageSquare,
  Check
} from "lucide-react";

export default function TeacherDashboard(): React.ReactElement {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const subject = (user as any)?.subject || "Biology";

  const [loading, setLoading] = useState(true);
  const [assignedSections, setAssignedSections] = useState<any[]>([]);
  const [examsToGradeCount] = useState(2);
  const [upcomingExamsCount] = useState(1);
  const [classAverage, setClassAverage] = useState<number | null>(79.4);

  // Today's Teaching Schedule & Routine
  const [todaySchedule, setTodaySchedule] = useState([
    {
      period: 1,
      time: "08:30 – 09:15",
      gradeSection: "12-A",
      room: "Science Lab 2",
      topic: "Unit 4.2 Glycolysis & Substrate Phosphorylation",
      attendanceMarked: true,
      attendanceRate: 96,
      studentCount: 38
    },
    {
      period: 3,
      time: "10:15 – 11:00",
      gradeSection: "12-B",
      room: "Room 14",
      topic: "Unit 4.3 Citric Acid Cycle Energy Accounting",
      attendanceMarked: false,
      attendanceRate: null,
      studentCount: 36
    },
    {
      period: 5,
      time: "13:30 – 14:15",
      gradeSection: "11-A",
      room: "Room 08",
      topic: "Unit 3 Mendelian Genetics Dihybrid Crosses",
      attendanceMarked: false,
      attendanceRate: null,
      studentCount: 42
    }
  ]);

  // Grading Queue with actionable states
  const [gradingQueue] = useState([
    {
      id: "gq-1",
      title: "Unit 4 Cell Physiology Practical Assessment",
      section: "Section 12-A",
      submittedCount: 36,
      totalCount: 38,
      dueDate: "Today, 17:00",
      urgent: true,
      type: "Practical exam"
    },
    {
      id: "gq-2",
      title: "Unit 3 Genetics Monohybrid Cross Exercises",
      section: "Section 12-B",
      submittedCount: 32,
      totalCount: 36,
      dueDate: "Tomorrow",
      urgent: false,
      type: "Homework"
    }
  ]);

  // Priority Candidates for Intervention (< 50% Threshold)
  const [atRiskStudents] = useState([
    {
      id: "s-4",
      name: "Selamawit Kebede",
      section: "12-A",
      currentScore: 46,
      gapTopic: "Unit 3 Genetic Probability & Pedigrees",
      attendance: "84%"
    },
    {
      id: "s-9",
      name: "Dawit Haile",
      section: "12-B",
      currentScore: 48,
      gapTopic: "Unit 4 Redox Reactions in Mitochondria",
      attendance: "81%"
    }
  ]);

  useEffect(() => {
    getTeacherAssignedPairs()
      .then((res) => {
        const pairs = res.data?.pairs || (Array.isArray(res.data) ? res.data : []);
        setAssignedSections(pairs.length > 0 ? pairs : [
          { id: "sec-12a", name: "Section 12-A", section: "12-A", student_count: 38, average: 81.2 },
          { id: "sec-12b", name: "Section 12-B", section: "12-B", student_count: 36, average: 77.6 }
        ]);
        if (pairs.length > 0) {
          const validAverages = pairs.filter((p: any) => typeof p.average === "number");
          if (validAverages.length > 0) {
            const avg = validAverages.reduce((acc: number, cur: any) => acc + cur.average, 0) / validAverages.length;
            setClassAverage(Math.round(avg * 10) / 10);
          }
        }
      })
      .catch(() => {
        setAssignedSections([
          { id: "sec-12a", name: "Section 12-A", section: "12-A", student_count: 38, average: 81.2 },
          { id: "sec-12b", name: "Section 12-B", section: "12-B", student_count: 36, average: 77.6 }
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (!loading && assignedSections.length === 0) {
    return <WaitingForAssignmentView />;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans animate-fade-in text-start pb-12">
      {/* 1. Header & Quick Actions Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-[#0F172A] tracking-tight">
              Dashboard
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
              {subject}
            </span>
          </div>
          <p className="text-xs text-[#475569] mt-0.5">
            Daily schedule, pending grading, and student performance for your assigned sections.
          </p>
        </div>

        {/* Action Group */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => navigate("attendance")}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[8px] border border-[#CBD5E1] bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs cursor-pointer min-h-[38px]"
          >
            <CalendarCheck className="w-3.5 h-3.5 text-[#1D4ED8]" />
            <span>Take attendance</span>
          </button>

          <button
            type="button"
            onClick={() => navigate("tasks")}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[8px] border border-[#CBD5E1] bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs cursor-pointer min-h-[38px]"
          >
            <ListChecks className="w-3.5 h-3.5 text-slate-600" />
            <span>Create task</span>
          </button>

          <button
            type="button"
            onClick={() => navigate("ai-assistant")}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-[8px] bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold shadow-xs cursor-pointer min-h-[38px] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
          >
            <Plus className="w-4 h-4" />
            <span>Generate exam</span>
          </button>
        </div>
      </div>

      {/* 2. Today's Period Timeline & Teaching Routine */}
      <div className="bg-white rounded-[8px] border border-[#E2E8F0] p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#1D4ED8]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
              Today's schedule
            </h2>
          </div>
          <span className="text-[11px] font-mono font-medium text-slate-500">
            3 scheduled periods
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {todaySchedule.map((item) => (
            <div
              key={item.period}
              className={`p-3.5 rounded-[8px] border bg-white transition-all text-start flex flex-col justify-between ${
                item.attendanceMarked
                  ? "border-emerald-200 shadow-2xs"
                  : "border-[#E2E8F0] shadow-xs"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#0F172A]">
                    Period {item.period} • Section {item.gradeSection}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    {item.time}
                  </span>
                </div>
                <p className="text-[11px] text-[#475569] truncate">
                  {item.topic}
                </p>
                <div className="text-[10px] text-slate-400 font-mono">
                  {item.room} • {item.studentCount} students
                </div>
              </div>

              <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                {item.attendanceMarked ? (
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Attendance: {item.attendanceRate}%</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => navigate("attendance")}
                    className="text-xs font-semibold text-[#1D4ED8] hover:underline cursor-pointer inline-flex items-center gap-1"
                  >
                    <span>Mark attendance</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => navigate("lessons")}
                  className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  View lesson
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Exactly 4 Standard Telemetry Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Assigned Sections */}
        <div className="bg-white p-4 rounded-[8px] border border-[#E2E8F0] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">My sections</span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-[#0F172A] tabular-nums font-mono">
            {assignedSections.length}
          </div>
          <div className="text-[11px] text-slate-500">
            Active sections
          </div>
        </div>

        {/* Metric 2: Exams to Grade */}
        <div className="bg-white p-4 rounded-[8px] border border-[#E2E8F0] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">Exams to grade</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-700 tabular-nums font-mono">
            {examsToGradeCount}
          </div>
          <div className="text-[11px] text-amber-700 font-medium">
            Awaiting evaluation
          </div>
        </div>

        {/* Metric 3: Upcoming Exams */}
        <div className="bg-white p-4 rounded-[8px] border border-[#E2E8F0] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">Upcoming exams</span>
            <FileCheck className="w-4 h-4 text-[#1D4ED8]" />
          </div>
          <div className="text-2xl font-bold text-[#0F172A] tabular-nums font-mono">
            {upcomingExamsCount}
          </div>
          <div className="text-[11px] text-slate-500">
            Scheduled this month
          </div>
        </div>

        {/* Metric 4: Class Average */}
        <div className="bg-white p-4 rounded-[8px] border border-[#E2E8F0] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">Class average</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-[#0F172A] tabular-nums font-mono">
            {classAverage !== null ? `${classAverage}%` : "—"}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium">
            Across all sections
          </div>
        </div>
      </div>

      {/* 4. Two-Column Workspace: Grading Queue & Intervention Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Grading Queue (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-[8px] border border-[#E2E8F0] shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#0F172A]">
                Grading queue
              </h2>
              <p className="text-xs text-[#475569] mt-0.5">
                Pending student submissions requiring teacher review.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("gradebook")}
              className="text-xs font-semibold text-[#1D4ED8] hover:underline cursor-pointer"
            >
              Open gradebook
            </button>
          </div>

          <div className="divide-y divide-[#E2E8F0]">
            {gradingQueue.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between gap-4 hover:bg-[#F8FAFC] transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-[6px] flex items-center justify-center shrink-0 mt-0.5 ${
                    item.urgent
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]"
                  }`}>
                    <FileCheck className="w-4.5 h-4.5" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-[#0F172A]">
                      {item.title}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#475569]">
                      <span className="font-semibold text-slate-700">{item.section}</span>
                      <span>•</span>
                      <span>{item.submittedCount}/{item.totalCount} submitted</span>
                      <span>•</span>
                      <span className={item.urgent ? "text-amber-700 font-semibold" : "text-slate-500"}>
                        Due {item.dueDate}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1.5">
                      <div
                        className="h-full bg-[#1D4ED8] rounded-full"
                        style={{ width: `${Math.round((item.submittedCount / item.totalCount) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("gradebook")}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[6px] bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold cursor-pointer shrink-0 shadow-xs"
                >
                  <span>Grade</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Pedagogical Intervention Radar (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-[8px] border border-[#E2E8F0] shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <h2 className="text-sm font-bold text-[#0F172A]">
                At-risk candidates
              </h2>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
              At risk
            </span>
          </div>

          <div className="p-4 space-y-3">
            <p className="text-xs text-[#475569]">
              Students performing below the 50% passing threshold.
            </p>

            <div className="space-y-2.5">
              {atRiskStudents.map((student) => (
                <div
                  key={student.id}
                  className="p-3 rounded-[6px] border border-rose-100 bg-rose-50/40 space-y-1.5 text-xs text-start"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#0F172A]">
                      {student.name} • Section {student.section}
                    </span>
                    <span className="font-mono font-bold text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded text-[11px]">
                      {student.currentScore}%
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600">
                    Focus area: <strong className="text-slate-800">{student.gapTopic}</strong>
                  </p>

                  <div className="pt-2 flex items-center justify-between border-t border-rose-200/50 text-[11px]">
                    <span className="text-slate-500">Attendance: {student.attendance}</span>
                    <button
                      type="button"
                      onClick={() => navigate("messages")}
                      className="text-xs font-semibold text-[#1D4ED8] hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>Contact guardian</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
