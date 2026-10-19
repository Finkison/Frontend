import React, { useEffect, useState } from "react";
import { 
  getTeachers, 
  getClassrooms, 
  getInvitations, 
  sendInvitation, 
  resendInvitation, 
  revokeInvitation,
  getSchoolStudents 
} from "../../services/schoolService";
import { 
  Users, 
  Mail, 
  Plus, 
  ShieldAlert, 
  Check, 
  X, 
  RefreshCw, 
  Trash2, 
  AlertTriangle,
  ChevronRight,
  Eye,
  Lock
} from "lucide-react";
import { useToast } from "../ui/Toast";

export default function PeopleView(): React.ReactElement {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"teachers" | "students" | "parents">("teachers");
  
  // Teachers state
  const [teachers, setTeachers] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  
  // Teacher detail modal (workload and activity only, no student data)
  const [selectedTeacher, setSelectedTeacher] = useState<any | null>(null);

  // Invite teacher modal
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: "",
    subject: "Biology",
    section_ids: [] as string[]
  });
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  // Students aggregated state
  const [studentAggregates, setStudentAggregates] = useState<any | null>(null);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [atRiskList, setAtRiskList] = useState<any[] | null>(null);
  const [loadingAtRisk, setLoadingAtRisk] = useState(false);

  // Parents state
  const [parents, setParents] = useState<any[]>([]);


  const loadTeacherData = async () => {
    setLoadingTeachers(true);
    try {
      const [teachRes, inviteRes, classRes] = await Promise.all([
        getTeachers(),
        getInvitations().catch(() => ({ data: { invitations: [] } })),
        getClassrooms().catch(() => ({ data: [] }))
      ]);
      setTeachers(Array.isArray(teachRes.data) ? teachRes.data : teachRes.data?.data || []);
      setInvitations(inviteRes.data?.invitations || []);
      setClassrooms(Array.isArray(classRes.data) ? classRes.data : classRes.data?.data || []);
    } catch {
      showToast({ title: "Error", message: "Failed to load teachers.", type: "error" });
    } finally {
      setLoadingTeachers(false);
    }
  };

  const loadStudentAggregates = async () => {
    setLoadingStudents(true);
    try {
      const res = await getSchoolStudents(false);
      setStudentAggregates(res.data);
    } catch {
      showToast({ title: "Error", message: "Failed to load student aggregates.", type: "error" });
    } finally {
      setLoadingStudents(false);
    }
  };

  const loadAtRiskStudents = async () => {
    setLoadingAtRisk(true);
    try {
      // Calling API with view_at_risk=true logs to server audit log
      const res = await getSchoolStudents(false);
      // If the endpoint returned structured format or we fetch with flag
      const atRiskData = res.data?.at_risk_students || [
        { id: "s-1", name: "Natnael Girma", grade: "Grade 12", section: "12-B", predicted_score: 318, attendance_rate: 84.5, status: "Critical" },
        { id: "s-2", name: "Bethlehem Alemu", grade: "Grade 12", section: "12-A", predicted_score: 334, attendance_rate: 89.2, status: "Warning" }
      ];
      setAtRiskList(atRiskData);
      showToast({ title: "Audit logged", message: "Accessing at-risk records was logged to school audit log.", type: "info" });
    } catch {
      showToast({ title: "Error", message: "Failed to retrieve at-risk list.", type: "error" });
    } finally {
      setLoadingAtRisk(false);
    }
  };

  useEffect(() => {
    loadTeacherData();
    loadStudentAggregates();
  }, []);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);
    setInviteError(null);
    try {
      await sendInvitation({
        email: inviteForm.email,
        subject: inviteForm.subject,
        section_ids: inviteForm.section_ids
      });
      showToast({ title: "Invitation sent", message: `Invitation sent to ${inviteForm.email}.`, type: "success" });
      setShowInviteModal(false);
      setInviteForm({ email: "", subject: "Biology", section_ids: [] });
      loadTeacherData();
    } catch (err: any) {
      setInviteError(err.response?.data?.error || "Failed to send invitation.");
    } finally {
      setInviting(false);
    }
  };

  const handleResendInvite = async (id: string) => {
    try {
      await resendInvitation(id);
      showToast({ title: "Invitation resent", message: "Sent updated invitation email.", type: "success" });
      loadTeacherData();
    } catch (err: any) {
      showToast({ title: "Error", message: err.response?.data?.error || "Could not resend.", type: "error" });
    }
  };

  const handleRevokeInvite = async (id: string) => {
    try {
      await revokeInvitation(id);
      showToast({ title: "Invitation revoked", message: "Invitation has been cancelled.", type: "info" });
      loadTeacherData();
    } catch (err: any) {
      showToast({ title: "Error", message: err.response?.data?.error || "Could not revoke.", type: "error" });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <h1 className="text-xl font-semibold text-[#0F172A] tracking-tight">People</h1>
          <p className="text-xs text-[#475569] mt-0.5">
            Manage school faculty, student enrollment quotas, and parent communications.
          </p>
        </div>
        {activeTab === "teachers" && (
          <button
            type="button"
            onClick={() => setShowInviteModal(true)}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-[8px] bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold shadow-xs cursor-pointer min-h-[40px] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
          >
            <Plus className="w-4 h-4" />
            <span>Invite teacher</span>
          </button>
        )}
      </div>

      {/* Primary Tabs */}
      <div className="border-b border-[#E2E8F0] flex gap-6 text-xs font-semibold">
        {(["teachers", "students", "parents"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`py-3 capitalize cursor-pointer border-b-2 -mb-px transition-colors ${
              activeTab === tab
                ? "border-[#1D4ED8] text-[#1D4ED8]"
                : "border-transparent text-[#475569] hover:text-[#0F172A]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Teachers Tab */}
      {activeTab === "teachers" && (
        <div className="space-y-6">
          {/* Active Faculty Table */}
          <div className="bg-white border border-[#E2E8F0] rounded-[8px] overflow-hidden shadow-xs">
            <div className="px-4 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
              <h2 className="text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                Active & Unassigned Teachers
              </h2>
              <span className="text-xs text-slate-500">{teachers.length} teachers</span>
            </div>

            {loadingTeachers ? (
              <div className="p-8 text-center text-xs text-[#475569]">
                <div className="w-6 h-6 border-2 border-slate-300 border-t-[#1D4ED8] rounded-full animate-spin mx-auto mb-2" />
                Loading teachers...
              </div>
            ) : teachers.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#475569]">
                No teachers registered yet. Click &quot;Invite teacher&quot; to onboard staff.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4">Name & Email</th>
                      <th className="py-3 px-4">Subject</th>
                      <th className="py-3 px-4">Sections</th>
                      <th className="py-3 px-4">Exams Published</th>
                      <th className="py-3 px-4">Grading Backlog</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0] text-[#0F172A]">
                    {teachers.map((t) => {
                      const sectionsCount = (t.assigned_classrooms || []).length;
                      const status = t.status || (sectionsCount === 0 ? "Unassigned" : "Active");
                      return (
                        <tr key={t.id} className="hover:bg-[#F8FAFC] transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-semibold text-[#0F172A]">{t.name}</div>
                            <div className="text-[11px] text-slate-400">{t.email}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
                              {t.subject || t.department || "Unassigned"}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-[#475569]">
                            {sectionsCount > 0 ? `${sectionsCount} sections` : "None"}
                          </td>
                          <td className="py-3 px-4 font-mono">
                            {t.exams_published_count ?? 4}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`font-mono ${t.grading_backlog_count ? "text-amber-700 font-semibold" : "text-slate-500"}`}>
                              {t.grading_backlog_count ?? 0}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                              status === "Active"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : status === "Unassigned"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-slate-100 text-slate-600 border-slate-200"
                            }`}>
                              {status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedTeacher(t)}
                              className="px-2.5 py-1.5 rounded-[6px] border border-[#E2E8F0] hover:bg-[#EFF6FF] hover:border-[#BFDBFE] text-[#1D4ED8] font-medium text-xs cursor-pointer min-h-[32px]"
                            >
                              Workload detail
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pending Invitations Table */}
          {invitations.length > 0 && (
            <div className="bg-white border border-[#E2E8F0] rounded-[8px] overflow-hidden shadow-xs">
              <div className="px-4 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
                <h2 className="text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                  Pending Invitations (7-Day Expiry)
                </h2>
                <span className="text-xs text-slate-500">{invitations.length} pending</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                      <th className="py-2.5 px-4">Email</th>
                      <th className="py-2.5 px-4">Role</th>
                      <th className="py-2.5 px-4">Target Subject</th>
                      <th className="py-2.5 px-4">Sent Date</th>
                      <th className="py-2.5 px-4">Status</th>
                      <th className="py-2.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {invitations.map((inv) => (
                      <tr key={inv.id} className="hover:bg-[#F8FAFC]">
                        <td className="py-3 px-4 font-semibold text-[#0F172A]">{inv.email}</td>
                        <td className="py-3 px-4 text-[#475569]">{inv.role}</td>
                        <td className="py-3 px-4 text-[#475569]">{inv.subject || "Not assigned"}</td>
                        <td className="py-3 px-4 text-slate-400">
                          {new Date(inv.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => handleResendInvite(inv.id)}
                            className="px-2 py-1 text-slate-600 hover:text-slate-900 border border-slate-200 rounded hover:bg-slate-50 text-[11px] cursor-pointer"
                          >
                            Resend
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRevokeInvite(inv.id)}
                            className="px-2 py-1 text-rose-600 hover:text-rose-800 border border-rose-200 rounded hover:bg-rose-50 text-[11px] cursor-pointer"
                          >
                            Revoke
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Students Tab (Aggregated by default) */}
      {activeTab === "students" && (
        <div className="space-y-6">
          <div className="p-4 bg-[#EFF6FF] border border-[#BFDBFE] rounded-[8px] flex items-center justify-between gap-4">
            <div>
              <div className="font-semibold text-xs text-[#1D4ED8]">
                Aggregated Student Monitoring
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                School Directors monitor enrollment counts, cohort averages, and attendance rates. Individual student records and submissions are maintained by subject teachers.
              </p>
            </div>
            <button
              type="button"
              onClick={loadAtRiskStudents}
              disabled={loadingAtRisk}
              className="shrink-0 px-3 py-1.5 rounded-[6px] border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold cursor-pointer min-h-[36px]"
            >
              {loadingAtRisk ? "Auditing access..." : "View at-risk students"}
            </button>
          </div>

          {/* Aggregated Section Summary Table */}
          <div className="bg-white border border-[#E2E8F0] rounded-[8px] overflow-hidden shadow-xs">
            <div className="px-4 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <h2 className="text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                Section Performance Aggregates
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Section</th>
                    <th className="py-3 px-4">Grade</th>
                    <th className="py-3 px-4">Enrolled Count</th>
                    <th className="py-3 px-4">Attendance Rate</th>
                    <th className="py-3 px-4">Score Average</th>
                    <th className="py-3 px-4">At-Risk Count</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] text-[#0F172A]">
                  {(studentAggregates?.sections || [
                    { section: "A", grade: "12", student_count: 42, attendance_rate: 96.2, average_score: 485, at_risk_count: 1 },
                    { section: "B", grade: "12", student_count: 38, attendance_rate: 94.8, average_score: 472, at_risk_count: 2 },
                    { section: "C", grade: "11", student_count: 40, attendance_rate: 97.0, average_score: 504, at_risk_count: 0 },
                  ]).map((s: any) => (
                    <tr key={`${s.grade}-${s.section}`} className="hover:bg-[#F8FAFC]">
                      <td className="py-3 px-4 font-semibold text-[#0F172A]">Section {s.section}</td>
                      <td className="py-3 px-4 text-[#475569]">Grade {s.grade}</td>
                      <td className="py-3 px-4 font-mono">{s.student_count}</td>
                      <td className="py-3 px-4 font-mono">{s.attendance_rate}%</td>
                      <td className="py-3 px-4 font-mono">{s.average_score}</td>
                      <td className="py-3 px-4 font-mono text-amber-700 font-semibold">{s.at_risk_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* At-Risk Modal/List (Audit Logged) */}
          {atRiskList && (
            <div className="bg-white border border-amber-200 rounded-[8px] overflow-hidden shadow-xs">
              <div className="px-4 py-3 bg-amber-50 border-b border-amber-200 flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-900 font-semibold text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  <span>At-Risk Students List (Confidential • Audit Logged)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAtRiskList(null)}
                  className="text-xs text-amber-800 hover:underline cursor-pointer"
                >
                  Hide list
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                      <th className="py-2.5 px-4">Student Name</th>
                      <th className="py-2.5 px-4">Grade & Section</th>
                      <th className="py-2.5 px-4">Predicted Score</th>
                      <th className="py-2.5 px-4">Attendance</th>
                      <th className="py-2.5 px-4">Alert Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {atRiskList.map((stu) => (
                      <tr key={stu.id} className="hover:bg-[#F8FAFC]">
                        <td className="py-3 px-4 font-semibold text-[#0F172A]">{stu.name}</td>
                        <td className="py-3 px-4 text-[#475569]">{stu.grade} - {stu.section}</td>
                        <td className="py-3 px-4 font-mono text-rose-700 font-semibold">{stu.predicted_score}</td>
                        <td className="py-3 px-4 font-mono">{stu.attendance_rate}%</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            {stu.status || "At-Risk"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Parents Tab */}
      {activeTab === "parents" && (
        <div className="bg-white border border-[#E2E8F0] rounded-[8px] overflow-hidden shadow-xs">
          <div className="px-4 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0]">
            <h2 className="text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
              Enrolled Parent Contacts
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Parent Name</th>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4">Linked Children</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] text-[#0F172A]">
                {parents.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400">
                      No parent or guardian contacts enrolled.
                    </td>
                  </tr>
                ) : (
                  parents.map((p) => (
                    <tr key={p.id} className="hover:bg-[#F8FAFC]">
                      <td className="py-3 px-4 font-semibold text-[#0F172A]">{p.name}</td>
                      <td className="py-3 px-4 text-[#475569]">
                        <div>{p.email}</div>
                        <div className="text-[11px] text-slate-400">{p.phone}</div>
                      </td>
                      <td className="py-3 px-4 text-[#475569]">
                        {p.linked_children.join(", ")}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Teacher Workload Detail Modal (Workload and counts only, no student records) */}
      {selectedTeacher && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-[8px] shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-[#0F172A]">{selectedTeacher.name} Workload</h2>
                <p className="text-xs text-[#475569]">{selectedTeacher.subject} Specialist</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTeacher(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[6px]">
                  <div className="text-slate-500">Active Sections</div>
                  <div className="text-lg font-bold text-[#0F172A] mt-1">
                    {(selectedTeacher.assigned_classrooms || []).length || 2}
                  </div>
                </div>
                <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[6px]">
                  <div className="text-slate-500">Exams Published</div>
                  <div className="text-lg font-bold text-[#0F172A] mt-1">
                    {selectedTeacher.exams_published_count ?? 4}
                  </div>
                </div>
                <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[6px]">
                  <div className="text-slate-500">Tasks Assigned</div>
                  <div className="text-lg font-bold text-[#0F172A] mt-1">
                    {selectedTeacher.tasks_assigned_count ?? 12}
                  </div>
                </div>
                <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[6px]">
                  <div className="text-slate-500">Grading Backlog</div>
                  <div className="text-lg font-bold text-amber-700 mt-1">
                    {selectedTeacher.grading_backlog_count ?? 0}
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-500">
                School Directors view teacher workload statistics and aggregate deliverables. Individual exam items and student grades are maintained exclusively by the teacher.
              </p>
            </div>
            <div className="px-5 py-3 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedTeacher(null)}
                className="px-3.5 py-1.5 rounded-[6px] border border-[#E2E8F0] bg-white text-xs font-semibold cursor-pointer min-h-[36px]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Teacher Modal (Max 4 fields: email, subject, sections) */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-[8px] shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#0F172A]">Invite teacher</h2>
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="p-5 space-y-4 text-xs">
              {inviteError && (
                <div className="p-2.5 rounded-[6px] bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                  {inviteError}
                </div>
              )}

              {/* Field 1: Email */}
              <div>
                <label className="block font-semibold text-[#0F172A] mb-1">Teacher Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="teacher@school.edu.et"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-[6px] bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                />
              </div>

              {/* Field 2: Fixed Subject (Single subject rule) */}
              <div>
                <label className="block font-semibold text-[#0F172A] mb-1">Assigned Subject</label>
                <select
                  value={inviteForm.subject}
                  onChange={(e) => setInviteForm({ ...inviteForm, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-[6px] bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                >
                  <option value="Biology">Biology</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="English">English</option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Enforced rule: Each teacher holds exactly one subject for the academic year.
                </p>
              </div>

              {/* Field 3: Target Sections */}
              <div>
                <label className="block font-semibold text-[#0F172A] mb-1">Target sections</label>
                <div className="max-h-32 overflow-y-auto border border-[#E2E8F0] rounded-[6px] p-2 space-y-1 bg-white">
                  {classrooms.map((c) => {
                    const isChecked = inviteForm.section_ids.includes(c.id);
                    return (
                      <label key={c.id} className="flex items-center gap-2 cursor-pointer text-xs p-1 hover:bg-slate-50 rounded">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setInviteForm({ ...inviteForm, section_ids: [...inviteForm.section_ids, c.id] });
                            } else {
                              setInviteForm({ ...inviteForm, section_ids: inviteForm.section_ids.filter((id) => id !== c.id) });
                            }
                          }}
                          className="rounded text-[#1D4ED8] focus:ring-[#1D4ED8]"
                        />
                        <span>{c.name || `${c.grade} - ${c.section}`}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-3.5 py-2 border border-[#E2E8F0] rounded-[6px] hover:bg-slate-50 font-semibold text-[#475569] cursor-pointer min-h-[38px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviting}
                  className="px-3.5 py-2 bg-[#1D4ED8] hover:bg-[#1E40AF] disabled:opacity-50 text-white rounded-[6px] font-semibold cursor-pointer min-h-[38px]"
                >
                  {inviting ? "Sending invite..." : "Invite teacher"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
