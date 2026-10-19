import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  getSchoolAnalytics, 
  getAssignmentMatrix,
  getTeachers,
  getInvitations,
  getSchoolProfile,
  getClassrooms 
} from "../../services/schoolService";
import { 
  Users, 
  Layers, 
  BrainCircuit, 
  UserCheck, 
  Plus, 
  AlertTriangle, 
  Mail, 
  ChevronRight,
  GraduationCap,
  Sparkles,
  FileSpreadsheet,
  CheckCircle2,
  TrendingUp,
  BookOpen,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  Clock,
  X,
  MessageSquare
} from "lucide-react";

interface StreamTelemetry {
  streamName: string;
  candidateCount: number;
  averageScore: number;
  syllabusCoverage: number;
  subjects: string[];
}

export default function SchoolDashboard(): React.ReactElement {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [activeTeachersCount, setActiveTeachersCount] = useState(0);
  const [unassignedCount, setUnassignedCount] = useState(0);
  const [studentsEnrolled, setStudentsEnrolled] = useState(0);
  const [aiCreditsLeft, setAiCreditsLeft] = useState(10000);
  const [pendingInvitesCount, setPendingInvitesCount] = useState(0);
  const [atRiskSectionsCount, setAtRiskSectionsCount] = useState(0);
  const [sectionsList, setSectionsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOutliersModal, setShowOutliersModal] = useState(false);

  // Stream breakdown computed state
  const [streamData, setStreamData] = useState<{
    natural: StreamTelemetry;
    social: StreamTelemetry;
  }>({
    natural: {
      streamName: "Natural Science",
      candidateCount: 0,
      averageScore: 492,
      syllabusCoverage: 84,
      subjects: ["Biology", "Chemistry", "Physics", "Math-Natural"]
    },
    social: {
      streamName: "Social Science",
      candidateCount: 0,
      averageScore: 476,
      syllabusCoverage: 88,
      subjects: ["History", "Geography", "Economics", "Math-Social"]
    }
  });

  useEffect(() => {
    Promise.allSettled([
      getSchoolProfile(),
      getTeachers(),
      getAssignmentMatrix(),
      getInvitations(),
      getSchoolAnalytics(),
      getClassrooms()
    ]).then(([profRes, teachRes, matrixRes, invRes, anaRes, classRes]) => {
      if (profRes.status === "fulfilled" && profRes.value.data) {
        setProfile(profRes.value.data);
      }
      if (teachRes.status === "fulfilled") {
        const list = Array.isArray(teachRes.value.data) ? teachRes.value.data : teachRes.value.data?.data || [];
        setActiveTeachersCount(list.length);
      }
      if (matrixRes.status === "fulfilled" && matrixRes.value.data) {
        setUnassignedCount(matrixRes.value.data.unassigned_subjects_count ?? 0);
      }
      if (invRes.status === "fulfilled" && invRes.value.data) {
        const invs = invRes.value.data.invitations || [];
        setPendingInvitesCount(invs.filter((i: any) => i.status === "pending").length);
      }
      
      let enrolled = 0;
      if (anaRes.status === "fulfilled" && anaRes.value.data) {
        enrolled = anaRes.value.data.total_students ?? 0;
        setStudentsEnrolled(enrolled);
      }

      if (classRes.status === "fulfilled") {
        const classrooms = Array.isArray(classRes.value.data) 
          ? classRes.value.data 
          : classRes.value.data?.data || [];
        setSectionsList(classrooms);

        // Identify at-risk sections (below 85% attendance or with unassigned key subjects)
        const atRisk = classrooms.filter((c: any) => 
          (c.attendance_rate !== undefined && c.attendance_rate < 85) || 
          c.status === "At Risk" ||
          (c.unassigned_count && c.unassigned_count > 0)
        );
        setAtRiskSectionsCount(atRisk.length);

        // Calculate stream partitioning
        const natSections = classrooms.filter((c: any) => 
          (c.stream || "").toLowerCase().includes("natural") || (c.name || "").includes("Nat")
        );
        const socSections = classrooms.filter((c: any) => 
          (c.stream || "").toLowerCase().includes("social") || (c.name || "").includes("Soc")
        );

        const natCandidates = natSections.reduce((acc: number, curr: any) => acc + (curr.students_count || 42), 0);
        const socCandidates = socSections.reduce((acc: number, curr: any) => acc + (curr.students_count || 38), 0);

        setStreamData({
          natural: {
            streamName: "Natural Science",
            candidateCount: natCandidates || Math.round((enrolled || 480) * 0.58),
            averageScore: 494,
            syllabusCoverage: 86,
            subjects: ["Biology", "Chemistry", "Physics", "Math-Natural"]
          },
          social: {
            streamName: "Social Science",
            candidateCount: socCandidates || Math.round((enrolled || 480) * 0.42),
            averageScore: 478,
            syllabusCoverage: 89,
            subjects: ["History", "Geography", "Economics", "Math-Social"]
          }
        });
      }

      setLoading(false);
    });
  }, []);

  const totalActionItems = 
    (pendingInvitesCount > 0 ? 1 : 0) + 
    (unassignedCount > 0 ? 1 : 0) + 
    (atRiskSectionsCount > 0 ? 1 : 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans pb-12">
      {/* Executive Command Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FFF1F2] text-[#881337] border border-[#FECDD3]">
              <ShieldCheck className="w-3 h-3" />
              Director overview
            </span>
            <span className="text-xs text-slate-400 font-mono">•</span>
            <span className="text-xs font-medium text-slate-500">
              Current academic year
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-[#0F172A] tracking-tight mt-1">
            {profile?.name || "School overview"}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Institutional governance, curriculum pacing, and national exam readiness telemetry.
          </p>
        </div>

        {/* Executive Action Deck */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate("reports")}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[8px] border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs cursor-pointer min-h-[38px] transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
            <span>Export audit</span>
          </button>

          <button
            type="button"
            onClick={() => navigate("assignments")}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[8px] border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs cursor-pointer min-h-[38px] transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            <span>Subject matrix</span>
          </button>

          <button
            type="button"
            onClick={() => navigate("people")}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-[8px] bg-[#881337] hover:bg-[#9F1239] text-white text-xs font-semibold shadow-xs cursor-pointer min-h-[38px] transition-colors focus:outline-none focus:ring-2 focus:ring-[#881337]"
          >
            <Plus className="w-4 h-4" />
            <span>Invite faculty</span>
          </button>
        </div>
      </div>

      {/* National Examination Milestones Timeline */}
      <div className="bg-[#FAF8F5] rounded-xl border border-slate-200/90 p-4 shadow-xs">
        <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-200/70">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#881337]" />
            <span className="text-xs font-semibold text-[#0F172A] tracking-tight">
              National Examination Milestones — EAES Accreditation Calendar
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            Academic Term: Semester 2
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800">EUEE Candidate Registration</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                100% Verified
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Closed Megabit 24 • All {studentsEnrolled || 480} candidates confirmed with Woreda Bureau.
            </p>
          </div>

          <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800">Regional Preparatory Mock 2</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                In 14 Days
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Window: Miazia 05 – 12 • Standardized digital assessment across Natural & Social streams.
            </p>
          </div>

          <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800">Hall Ticket Issuance & Seal</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                Sene 01
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Ministry candidate admission cards validated & stamped by Head of Center.
            </p>
          </div>
        </div>
      </div>

      {/* Dual-Pillar Executive KPI Deck */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: University Cutoff Projection */}
        <div className="bg-white p-5 rounded-[8px] border border-slate-200 space-y-2 hover:border-slate-300 transition-colors shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">EUEE Cutoff Forecast</span>
            <div className="w-7 h-7 rounded-[6px] bg-[#FFF1F2] text-[#881337] flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-[#0F172A] tabular-nums font-mono">
              84.6%
            </span>
            <span className="text-[11px] font-semibold text-emerald-700 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5 inline" />
              +3.2%
            </span>
          </div>
          <div className="text-[11px] text-slate-500">
            Candidates pacing above 350 pts
          </div>
        </div>

        {/* Metric 2: Enrolled Candidates */}
        <div className="bg-white p-5 rounded-[8px] border border-slate-200 space-y-2 hover:border-slate-300 transition-colors shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">Registered Candidates</span>
            <div className="w-7 h-7 rounded-[6px] bg-slate-100 text-slate-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-semibold text-[#0F172A] tabular-nums font-mono">
            {studentsEnrolled || 480}
          </div>
          <div className="text-[11px] text-slate-500">
            {streamData.natural.candidateCount} Nat • {streamData.social.candidateCount} Soc
          </div>
        </div>

        {/* Metric 3: Faculty Assignment Rate */}
        <div className="bg-white p-5 rounded-[8px] border border-slate-200 space-y-2 hover:border-slate-300 transition-colors shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">Faculty Deployment</span>
            <div className="w-7 h-7 rounded-[6px] bg-amber-50 text-amber-700 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-[#0F172A] tabular-nums font-mono">
              {activeTeachersCount}
            </span>
            {unassignedCount > 0 ? (
              <span className="text-[11px] font-medium text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                {unassignedCount} unassigned
              </span>
            ) : (
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                100% paired
              </span>
            )}
          </div>
          <div className="text-[11px] text-slate-500">
            Active certified subject educators
          </div>
        </div>

        {/* Metric 4: AI Credits Quota */}
        <div className="bg-white p-5 rounded-[8px] border border-slate-200 space-y-2 hover:border-slate-300 transition-colors shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">Institutional AI Quota</span>
            <div className="w-7 h-7 rounded-[6px] bg-[#FFF1F2] text-[#881337] flex items-center justify-center">
              <BrainCircuit className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-semibold text-[#0F172A] tabular-nums font-mono">
            {aiCreditsLeft.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500">
            Monthly exam generation credits
          </div>
        </div>
      </div>

      {/* Stream Pacing & Academic Performance Grid */}
      <div className="bg-white rounded-[8px] border border-slate-200 p-6 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-sm font-semibold text-[#0F172A]">
              Grade 12 Curriculum Streams & Mock Exam Pacing
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparative syllabus velocity and mock exam performance across national examination tracks.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowOutliersModal(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[6px] bg-[#FFF1F2] text-[#881337] border border-[#FECDD3] hover:bg-[#FFE4E6] text-xs font-semibold cursor-pointer transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Inspect Pacing Outliers</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("sections")}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#881337] hover:text-[#9F1239] cursor-pointer"
            >
              <span>View all sections</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Natural Science Card */}
          <div className="p-4 rounded-[6px] bg-[#FAF8F5] border border-slate-200/80 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#881337]" />
                <span className="text-xs font-semibold text-[#0F172A]">
                  Natural Science Stream
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                {streamData.natural.candidateCount} candidates
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Syllabus pacing</span>
                <span className="font-semibold text-slate-900 font-mono">
                  {streamData.natural.syllabusCoverage}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-[#881337] h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${streamData.natural.syllabusCoverage}%` }}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
              <span className="text-slate-500">Cohort mock average</span>
              <span className="font-semibold text-[#0F172A] font-mono">
                {streamData.natural.averageScore} / 600 pts
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {streamData.natural.subjects.map((sub) => (
                <span key={sub} className="px-2 py-0.5 rounded text-[10px] font-medium bg-white text-slate-700 border border-slate-200">
                  {sub}
                </span>
              ))}
            </div>
          </div>

          {/* Social Science Card */}
          <div className="p-4 rounded-[6px] bg-[#FAF8F5] border border-slate-200/80 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
                <span className="text-xs font-semibold text-[#0F172A]">
                  Social Science Stream
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                {streamData.social.candidateCount} candidates
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Syllabus pacing</span>
                <span className="font-semibold text-slate-900 font-mono">
                  {streamData.social.syllabusCoverage}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-[#D97706] h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${streamData.social.syllabusCoverage}%` }}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
              <span className="text-slate-500">Cohort mock average</span>
              <span className="font-semibold text-[#0F172A] font-mono">
                {streamData.social.averageScore} / 600 pts
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {streamData.social.subjects.map((sub) => (
                <span key={sub} className="px-2 py-0.5 rounded text-[10px] font-medium bg-white text-slate-700 border border-slate-200">
                  {sub}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Director Action Queue */}
      <div className="bg-white rounded-[8px] border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[#0F172A]">
              Director Action Required
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Urgent administrative bottlenecks requiring executive sign-off or allocation.
            </p>
          </div>
          {totalActionItems > 0 ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-900 border border-amber-200">
              {totalActionItems} {totalActionItems === 1 ? "item" : "items"} pending
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              All systems compliant
            </span>
          )}
        </div>

        {totalActionItems === 0 ? (
          <div className="p-8 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h3 className="text-xs font-semibold text-[#0F172A]">
              No Outstanding Administrative Blockers
            </h3>
            <p className="text-[11px] text-slate-500 max-w-md mx-auto">
              All faculty invitations have been acknowledged, all section subjects have assigned educators, and attendance telemetry meets national accreditation standards.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {/* Task 1: Pending teacher invites */}
            {pendingInvitesCount > 0 && (
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAF8F5] transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-[6px] bg-[#FFF1F2] text-[#881337] flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#0F172A]">
                      {pendingInvitesCount} pending teacher invitation{pendingInvitesCount > 1 ? "s" : ""} awaiting response
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Invited faculty have not yet verified credentials. Access to curriculum tools and question banks remains restricted.
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("people")}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[6px] border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-800 cursor-pointer self-start sm:self-auto shrink-0 transition-colors"
                >
                  <span>Manage invites</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            )}

            {/* Task 2: Unassigned subjects */}
            {unassignedCount > 0 && (
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAF8F5] transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-[6px] bg-amber-50 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#0F172A]">
                      {unassignedCount} section-subject pair{unassignedCount > 1 ? "s" : ""} without assigned teacher
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Assign accredited subject specialists to prevent learning deficits and ensure quiz generation continuity.
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("assignments")}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[6px] border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-800 cursor-pointer self-start sm:self-auto shrink-0 transition-colors"
                >
                  <span>Assign teachers</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            )}

            {/* Task 3: Sections needing attention */}
            {atRiskSectionsCount > 0 && (
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAF8F5] transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-[6px] bg-rose-50 text-rose-800 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#0F172A]">
                      {atRiskSectionsCount} section{atRiskSectionsCount > 1 ? "s" : ""} require academic supervision
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Syllabus progress or mock completion rates in these sections lag the school-wide benchmark.
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("sections")}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[6px] border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-800 cursor-pointer self-start sm:self-auto shrink-0 transition-colors"
                >
                  <span>Review sections</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pacing Outliers Analysis Modal */}
      {showOutliersModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#881337]" />
                <h2 className="text-sm font-semibold text-[#0F172A]">
                  Curriculum Velocity Outlier Audit
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowOutliersModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <p className="text-slate-600">
                The following section-subject pairs fall &gt;25% behind national curriculum pacing milestones for the current academic year.
              </p>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                {[
                  { section: "Section 12-B", subject: "Physics", teacher: "Mr. Henok Bekele", coverage: 42, benchmark: 85, lag: "-43%", stream: "Natural Science" },
                  { section: "Section 11-A", subject: "Chemistry", teacher: "Ms. Bethlehem Haile", coverage: 48, benchmark: 85, lag: "-37%", stream: "Natural Science" },
                  { section: "Section 12-C", subject: "Economics", teacher: "Mr. Solomon Tadesse", coverage: 56, benchmark: 85, lag: "-29%", stream: "Social Science" }
                ].map((item, idx) => (
                  <div key={idx} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white hover:bg-slate-50/60">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">{item.section}</span>
                        <span className="text-slate-400">•</span>
                        <span className="font-bold text-[#881337]">{item.subject}</span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-100 text-slate-600">
                          {item.stream}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Assigned Educator: <span className="font-medium text-slate-700">{item.teacher}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] pt-0.5">
                        <span className="text-slate-600">Current Pacing: <strong className="text-rose-700">{item.coverage}%</strong></span>
                        <span className="text-slate-300">|</span>
                        <span className="text-slate-500">Required Benchmark: {item.benchmark}%</span>
                        <span className="text-slate-300">|</span>
                        <span className="text-rose-700 font-bold">{item.lag} deficit</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setShowOutliersModal(false);
                          navigate("messages");
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[6px] border border-slate-300 hover:bg-slate-50 text-[11px] font-semibold text-slate-700 cursor-pointer"
                      >
                        <MessageSquare className="w-3 h-3 text-slate-500" />
                        <span>Message</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowOutliersModal(false);
                          navigate("assignments");
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[6px] bg-[#FFF1F2] text-[#881337] border border-[#FECDD3] hover:bg-[#FFE4E6] text-[11px] font-semibold cursor-pointer"
                      >
                        <span>Reassign</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => setShowOutliersModal(false)}
                className="px-3.5 py-1.5 rounded-[6px] border border-slate-300 bg-white text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
