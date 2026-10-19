import React, { useEffect, useState } from "react";
import useAuthStore from "../../store/authStore";
import { getTeacherAssignedPairs } from "../../services/schoolService";
import WaitingForAssignmentView from "./WaitingForAssignmentView";
import { 
  Layers, 
  Users, 
  BookOpen, 
  Check, 
  X, 
  Calendar, 
  ChevronRight, 
  AlertTriangle,
  Mail,
  Phone,
  FileCheck,
  TrendingUp,
  Plus,
  Search,
  Filter,
  BarChart2,
  Clock,
  Send,
  AlertCircle
} from "lucide-react";
import { useToast } from "../ui/Toast";

interface AssignedSection {
  id: string;
  name: string;
  grade: string;
  section: string;
  student_count: number;
  average_score: number;
}

interface StudentSubjectDetail {
  id: string;
  name: string;
  grade: string;
  section: string;
  subject_score: number;
  subject_attendance: number;
  task_completion_rate: number;
  weak_units: string[];
  topic_mastery: Record<string, number>;
  recent_submissions: { taskTitle: string; score: number; maxScore: number; date: string }[];
  parent_name: string;
  parent_phone: string;
  feedback_notes: string;
}

export default function AssignedSectionsView(): React.ReactElement {
  const { showToast } = useToast();
  const { user } = useAuthStore();
  const teacherSubject = (user as any)?.subject || "Biology";

  const [sections, setSections] = useState<AssignedSection[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected Section
  const [selectedSection, setSelectedSection] = useState<AssignedSection | null>(null);
  const [sectionTab, setSectionTab] = useState<"students" | "tasks" | "exams" | "results" | "attendance">("students");
  const [searchStudentQuery, setSearchStudentQuery] = useState("");
  const [rosterFilter, setRosterFilter] = useState<"all" | "at_risk" | "mastery">("all");

  // Selected Student Detail Modal (strictly teacher's own subject)
  const [selectedStudent, setSelectedStudent] = useState<StudentSubjectDetail | null>(null);

  // Quick message modal
  const [messageRecipient, setMessageRecipient] = useState<StudentSubjectDetail | null>(null);
  const [messageDraft, setMessageDraft] = useState("");

  // Student roster strictly in this subject
  const [studentsRoster, setStudentsRoster] = useState<StudentSubjectDetail[]>([]);

  useEffect(() => {
    getTeacherAssignedPairs()
      .then((res) => {
        const pairs = res.data?.pairs || (Array.isArray(res.data) ? res.data : []);
        setSections(pairs);
        if (pairs.length > 0) setSelectedSection(pairs[0]);
      })
      .catch(() => {
        setSections([]);
        setSelectedSection(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageDraft.trim() || !messageRecipient) return;

    showToast({
      title: "Message dispatched",
      message: `Message sent to ${messageRecipient.parent_name} regarding ${messageRecipient.name}.`,
      type: "success"
    });
    setMessageRecipient(null);
    setMessageDraft("");
  };

  if (!loading && sections.length === 0) {
    return <WaitingForAssignmentView />;
  }

  const filteredRoster = studentsRoster.filter((stu) => {
    if (rosterFilter === "at_risk" && stu.subject_score >= 50) return false;
    if (rosterFilter === "mastery" && stu.subject_score < 75) return false;
    if (searchStudentQuery.trim() && !stu.name.toLowerCase().includes(searchStudentQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const sectionAtRiskCount = studentsRoster.filter((s) => s.subject_score < 50).length;
  const sectionMasteryCount = studentsRoster.filter((s) => s.subject_score >= 75).length;

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-[#0F172A] tracking-tight">My sections</h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
              {teacherSubject}
            </span>
          </div>
          <p className="text-xs text-[#475569] mt-0.5">
            Classroom management, student profiles, and continuous performance tracking for assigned sections.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            showToast({
              title: "Task created",
              message: "Navigating to task creation workspace.",
              type: "info"
            });
          }}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-[8px] bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold shadow-xs cursor-pointer min-h-[40px]"
        >
          <Plus className="w-4 h-4" />
          <span>Assign task</span>
        </button>
      </div>

      {/* Section Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {sections.map((sec) => {
          const isSelected = selectedSection?.id === sec.id;
          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => setSelectedSection(sec)}
              className={`p-4 rounded-[8px] border text-left transition-all cursor-pointer ${
                isSelected
                  ? "border-[#1D4ED8] bg-[#EFF6FF] shadow-xs ring-1 ring-[#1D4ED8]"
                  : "border-[#E2E8F0] bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-[#0F172A]">{sec.name}</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-white border border-[#E2E8F0] text-slate-700">
                  {sec.grade}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-[#475569]">
                <span>{sec.student_count || 42} Students</span>
                <span className="font-semibold text-[#0F172A]">{sec.average_score || 84}% Mean</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Section Detail Pane */}
      {selectedSection && (
        <div className="bg-white border border-[#E2E8F0] rounded-[8px] overflow-hidden shadow-xs space-y-0">
          {/* Section Telemetry Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-[#F8FAFC] border-b border-[#E2E8F0]">
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Enrolled candidates</div>
              <div className="text-xl font-bold text-[#0F172A] mt-0.5 font-mono">
                {selectedSection.student_count || 42}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{teacherSubject} mean</div>
              <div className="text-xl font-bold text-[#1D4ED8] mt-0.5 font-mono">
                {selectedSection.average_score}%
              </div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Mastery (&ge; 75%)</div>
              <div className="text-xl font-bold text-emerald-700 mt-0.5 font-mono">
                {sectionMasteryCount} students
              </div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">At-risk (&lt; 50%)</div>
              <div className="text-xl font-bold text-rose-700 mt-0.5 font-mono">
                {sectionAtRiskCount} candidates
              </div>
            </div>
          </div>

          {/* Tabs Header */}
          <div className="px-5 border-b border-[#E2E8F0] flex gap-6 text-xs font-semibold">
            {(["students", "tasks", "exams", "results", "attendance"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setSectionTab(tab)}
                className={`py-3.5 capitalize cursor-pointer border-b-2 -mb-px transition-colors ${
                  sectionTab === tab
                    ? "border-[#1D4ED8] text-[#1D4ED8]"
                    : "border-transparent text-[#475569] hover:text-[#0F172A]"
                }`}
              >
                {tab === "students" ? "Student roster" : tab}
              </button>
            ))}
          </div>

          <div className="p-5">
            {sectionTab === "students" ? (
              /* Students Roster (Strictly this teacher's subject) */
              <div className="space-y-4">
                {/* Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
                  <div className="relative flex-1 sm:max-w-xs">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search student by name..."
                      value={searchStudentQuery}
                      onChange={(e) => setSearchStudentQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 border border-[#E2E8F0] rounded-[6px] text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#1D4ED8]"
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 font-medium">Filter cohort:</span>
                    <button
                      type="button"
                      onClick={() => setRosterFilter("all")}
                      className={`px-2.5 py-1 rounded-[6px] font-semibold cursor-pointer ${
                        rosterFilter === "all" ? "bg-[#1D4ED8] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={() => setRosterFilter("at_risk")}
                      className={`px-2.5 py-1 rounded-[6px] font-semibold cursor-pointer ${
                        rosterFilter === "at_risk" ? "bg-rose-600 text-white" : "bg-rose-50 text-rose-700 hover:bg-rose-100"
                      }`}
                    >
                      At-risk (&lt; 50%)
                    </button>
                    <button
                      type="button"
                      onClick={() => setRosterFilter("mastery")}
                      className={`px-2.5 py-1 rounded-[6px] font-semibold cursor-pointer ${
                        rosterFilter === "mastery" ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      }`}
                    >
                      Mastery (&ge; 75%)
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto border border-[#E2E8F0] rounded-[8px]">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                        <th className="py-3 px-4">Student Name</th>
                        <th className="py-3 px-4">{teacherSubject} score</th>
                        <th className="py-3 px-4">Attendance</th>
                        <th className="py-3 px-4">Task completion</th>
                        <th className="py-3 px-4">Focus areas</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0] text-[#0F172A]">
                      {filteredRoster.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                            No students match your filter criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredRoster.map((stu) => (
                          <tr key={stu.id} className="hover:bg-[#F8FAFC] transition-colors">
                            <td className="py-3 px-4">
                              <div className="font-semibold text-[#0F172A]">{stu.name}</div>
                              <div className="text-[11px] text-slate-500">{stu.grade} • {stu.section}</div>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-bold border ${
                                  stu.subject_score < 50
                                    ? "bg-rose-50 text-rose-700 border-rose-200"
                                    : stu.subject_score >= 75
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-blue-50 text-blue-700 border-blue-200"
                                }`}
                              >
                                {stu.subject_score}%
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono">
                              {stu.subject_attendance}%
                            </td>
                            <td className="py-3 px-4 font-mono">
                              {stu.task_completion_rate}%
                            </td>
                            <td className="py-3 px-4 text-[#475569]">
                              {stu.weak_units.length > 0 ? (
                                <span className="text-amber-800 text-[11px] font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                  {stu.weak_units[0]}
                                </span>
                              ) : (
                                <span className="text-emerald-700 text-[11px] font-medium">Mastery on track</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setSelectedStudent(stu)}
                                  className="px-2.5 py-1.5 rounded-[6px] border border-[#E2E8F0] hover:bg-[#EFF6FF] text-[#1D4ED8] font-semibold text-xs cursor-pointer"
                                >
                                  View profile
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setMessageRecipient(stu);
                                    setMessageDraft(`Hello ${stu.parent_name}, this is Dr. Aster concerning ${stu.name}'s progress in ${teacherSubject}. `);
                                  }}
                                  title="Contact parent"
                                  className="p-1.5 rounded-[6px] border border-[#E2E8F0] hover:bg-slate-50 text-slate-600 cursor-pointer"
                                >
                                  <Mail className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : sectionTab === "tasks" ? (
              /* Tasks Tab */
              <div className="space-y-3 text-xs">
                <div className="font-semibold text-[#0F172A]">Active Tasks & Homework for {selectedSection.name}</div>
                <div className="p-8 text-center text-slate-500 border border-[#E2E8F0] rounded-[6px] bg-[#F8FAFC]">
                  No active coursework tasks assigned to this section yet.
                </div>
              </div>
            ) : sectionTab === "exams" ? (
              /* Exams Tab */
              <div className="space-y-3 text-xs">
                <div className="font-semibold text-[#0F172A]">Exams Administered in {selectedSection.name}</div>
                <div className="p-8 text-center text-slate-500 border border-[#E2E8F0] rounded-[6px] bg-[#F8FAFC]">
                  No exams scheduled or administered for this section yet.
                </div>
              </div>
            ) : sectionTab === "results" ? (
              /* Results Tab */
              <div className="space-y-4 text-xs">
                <div className="font-semibold text-[#0F172A]">Diagnostic Results & Quartiles</div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[6px]">
                    <div className="text-slate-500 text-[11px]">Section Mean</div>
                    <div className="text-lg font-bold text-[#1D4ED8] mt-1">{selectedSection.average_score || 0}%</div>
                  </div>
                  <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[6px]">
                    <div className="text-slate-500 text-[11px]">Highest Score</div>
                    <div className="text-lg font-bold text-emerald-700 mt-1">—</div>
                  </div>
                  <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[6px]">
                    <div className="text-slate-500 text-[11px]">Lowest Score</div>
                    <div className="text-lg font-bold text-rose-700 mt-1">—</div>
                  </div>
                </div>
              </div>
            ) : (
              /* Attendance Tab */
              <div className="space-y-3 text-xs">
                <div className="font-semibold text-[#0F172A]">Subject Attendance Ledger</div>
                <p className="text-slate-500 text-[11px]">
                  Attendance tracking is active for {teacherSubject} in {selectedSection.name}.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Student Detail Modal (Strictly Own Subject Only) */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-[8px] shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold text-[#0F172A]">{selectedStudent.name}</h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
                    {teacherSubject}
                  </span>
                </div>
                <p className="text-xs text-[#475569] mt-0.5">
                  {selectedStudent.grade} • Section {selectedStudent.section}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {/* Metrics Row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[6px]">
                  <div className="text-slate-500 text-[11px]">Subject score</div>
                  <div className={`text-xl font-bold mt-1 font-mono ${
                    selectedStudent.subject_score < 50 ? "text-rose-700" : "text-[#0F172A]"
                  }`}>
                    {selectedStudent.subject_score}%
                  </div>
                </div>
                <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[6px]">
                  <div className="text-slate-500 text-[11px]">Subject attendance</div>
                  <div className="text-xl font-bold text-[#0F172A] mt-1 font-mono">
                    {selectedStudent.subject_attendance}%
                  </div>
                </div>
                <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[6px]">
                  <div className="text-slate-500 text-[11px]">Task completion</div>
                  <div className="text-xl font-bold text-[#0F172A] mt-1 font-mono">
                    {selectedStudent.task_completion_rate}%
                  </div>
                </div>
              </div>

              {/* Topic Mastery */}
              <div>
                <div className="font-semibold text-[#0F172A] mb-2">Topic mastery</div>
                <div className="space-y-2 border border-[#E2E8F0] rounded-[6px] p-3 bg-[#F8FAFC]">
                  {Object.entries(selectedStudent.topic_mastery).map(([topic, score]) => (
                    <div key={topic} className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="font-medium text-[#0F172A]">{topic}</span>
                        <span className="font-mono text-slate-700 font-bold">{score}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${score >= 75 ? "bg-[#1D4ED8]" : score >= 50 ? "bg-amber-600" : "bg-rose-600"}`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Submissions */}
              <div>
                <div className="font-semibold text-[#0F172A] mb-2">Recent submissions</div>
                <div className="space-y-1.5 border border-[#E2E8F0] rounded-[6px] p-3 bg-[#F8FAFC]">
                  {selectedStudent.recent_submissions.map((sub, i) => (
                    <div key={i} className="flex justify-between items-center text-[11px] py-1 border-b border-[#E2E8F0] last:border-b-0">
                      <div>
                        <div className="font-semibold text-[#0F172A]">{sub.taskTitle}</div>
                        <div className="text-slate-400">{sub.date}</div>
                      </div>
                      <div className="font-mono font-bold text-slate-700">
                        {sub.score}/{sub.maxScore} pts ({Math.round((sub.score / sub.maxScore) * 100)}%)
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Parent Contact Information */}
              <div>
                <div className="font-semibold text-[#0F172A] mb-1">Parent contact</div>
                <div className="p-3 border border-[#E2E8F0] rounded-[6px] flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-[#0F172A]">{selectedStudent.parent_name}</div>
                    <div className="text-slate-500 text-[11px] font-mono">{selectedStudent.parent_phone}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMessageRecipient(selectedStudent);
                      setMessageDraft(`Hello ${selectedStudent.parent_name}, this is Dr. Aster concerning ${selectedStudent.name}'s progress in ${teacherSubject}. `);
                    }}
                    className="px-2.5 py-1.5 rounded-[6px] bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE] font-semibold text-xs cursor-pointer inline-flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send message</span>
                  </button>
                </div>
              </div>

              {/* Teacher Remarks & Notes */}
              <div>
                <div className="font-semibold text-[#0F172A] mb-1">Teacher notes</div>
                <div className="p-3 border border-[#E2E8F0] rounded-[6px] bg-[#F8FAFC] text-slate-700 text-[11px] leading-relaxed">
                  {selectedStudent.feedback_notes}
                </div>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="px-3.5 py-1.5 rounded-[6px] border border-[#E2E8F0] bg-white text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Parent Quick Message Modal */}
      {messageRecipient && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-[8px] shadow-xl w-full max-w-md">
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-[#0F172A]">Direct message to parent</h2>
                <p className="text-xs text-[#475569]">{messageRecipient.parent_name} ({messageRecipient.parent_phone})</p>
              </div>
              <button
                type="button"
                onClick={() => setMessageRecipient(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#0F172A] mb-1">Message content</label>
                <textarea
                  rows={4}
                  required
                  value={messageDraft}
                  onChange={(e) => setMessageDraft(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-[6px] text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#1D4ED8]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setMessageRecipient(null)}
                  className="px-3 py-1.5 rounded-[6px] border border-[#E2E8F0] bg-white hover:bg-slate-50 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-[6px] bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-semibold cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
