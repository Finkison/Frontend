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
  Lock,
  Copy
} from "lucide-react";
import { useToast } from "../ui/Toast";
import PageHeader from "../shared/PageHeader";
import PortalPage from "../shared/PortalPage";
import PortalLoading from "../shared/PortalLoading";
import { getApiErrorMessage } from "../../services/api";

export default function PeopleView(): React.ReactElement {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"teachers" | "students" | "parents">("teachers");

  const [teachers, setTeachers] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(true);

  const [selectedTeacher, setSelectedTeacher] = useState<any | null>(null);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [invitationLink, setInvitationLink] = useState<string | null>(null);
  const [inviteForm, setInviteForm] = useState({
    email: "",
    subject: "Biology",
    section_ids: [] as string[]
  });
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  const [studentAggregates, setStudentAggregates] = useState<any | null>(null);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [atRiskList, setAtRiskList] = useState<any[] | null>(null);
  const [loadingAtRisk, setLoadingAtRisk] = useState(false);

  const [parents, setParents] = useState<any[]>([]);

  const copyInvitationLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      showToast({ title: "Invitation link copied", message: "Share the link with the invited teacher.", type: "success" });
    } catch {
      showToast({ title: "Invitation ready", message: "Copy the link from the highlighted field and share it with the teacher.", type: "info" });
    }
  };

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

      const res = await getSchoolStudents(false, true);
      const data = res.data?.data || res.data;
      setAtRiskList(Array.isArray(data?.at_risk_students) ? data.at_risk_students : Array.isArray(data) ? data : []);
      showToast({ title: "At-risk records viewed", message: "This access was recorded in the school audit log.", type: "info" });
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
      const response = await sendInvitation({
        email: inviteForm.email,
        subject: inviteForm.subject,
        section_ids: inviteForm.section_ids
      });
      const relativeLink = response.data?.acceptance_url || response.data?.invitation?.acceptance_url;
      if (relativeLink) {
        const absoluteLink = new URL(relativeLink, window.location.origin).toString();
        setInvitationLink(absoluteLink);
        await copyInvitationLink(absoluteLink);
      }
      setShowInviteModal(false);
      setInviteForm({ email: "", subject: "Biology", section_ids: [] });
      loadTeacherData();
    } catch (err) {
      setInviteError(getApiErrorMessage(err) || "Failed to send invitation.");
    } finally {
      setInviting(false);
    }
  };

  const handleResendInvite = async (id: string) => {
    try {
      const response = await resendInvitation(id);
      const relativeLink = response.data?.acceptance_url;
      if (relativeLink) {
        const absoluteLink = new URL(relativeLink, window.location.origin).toString();
        setInvitationLink(absoluteLink);
        await copyInvitationLink(absoluteLink);
      }
      loadTeacherData();
    } catch (err) {
      showToast({ title: "Error", message: getApiErrorMessage(err) || "Could not resend.", type: "error" });
    }
  };

  const handleRevokeInvite = async (id: string) => {
    try {
      await revokeInvitation(id);
      showToast({ title: "Invitation revoked", message: "Invitation has been cancelled.", type: "info" });
      loadTeacherData();
    } catch (err) {
      showToast({ title: "Error", message: getApiErrorMessage(err) || "Could not revoke.", type: "error" });
    }
  };

  return (
    <PortalPage className="space-y-6">

      <PageHeader
        title="People"
        description="Manage teachers, students, and parent access for your school."
        primaryAction={activeTab === "teachers" ? { label: "Invite teacher", onClick: () => setShowInviteModal(true), icon: Plus } : undefined}
      >
      <div className="flex gap-6 border-b border-[#E7E0D6] text-sm font-semibold dark:border-white/10">
        {(["teachers", "students", "parents"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`py-3 capitalize cursor-pointer border-b-2 -mb-px transition-colors ${
              activeTab === tab
                ? "border-[#881337] text-[#881337]"
                : "border-transparent text-[#5C5046] dark:text-[#E7E0D6] hover:text-[#261E1A] dark:hover:text-[#FDFBF7]"
            }`}
          >
            {tab === "teachers" ? "Teachers" : tab === "students" ? "Students" : "Parents"}
          </button>
        ))}
      </div>
      </PageHeader>

      {activeTab === "teachers" && (
        <div className="space-y-6">

          <div className="bg-white dark:bg-[#261E1A] border border-[#E7E0D6] dark:border-white/10 rounded-[8px] overflow-hidden shadow-xs">
            <div className="px-4 py-3 bg-[#FAF8F5] dark:bg-[#1C1512] border-b border-[#E7E0D6] dark:border-white/10 flex items-center justify-between">
              <h2 className="text-xs font-semibold text-[#261E1A] dark:text-[#FDFBF7] uppercase tracking-wider">
                Teachers
              </h2>
              <span className="text-xs text-stone-500 dark:text-[#A89C90]">{teachers.length} teachers</span>
            </div>

            {loadingTeachers ? (
              <PortalLoading message="Loading teachers…" className="rounded-none border-0 shadow-none" />
            ) : teachers.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#5C5046] dark:text-[#E7E0D6]">
                No teachers yet. Invite a teacher to begin.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FAF8F5] dark:bg-[#1C1512] border-b border-[#E7E0D6] dark:border-white/10 text-stone-500 dark:text-[#A89C90] font-semibold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4">Name & Email</th>
                      <th className="py-3 px-4">Subject</th>
                      <th className="py-3 px-4">Sections</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7E0D6] text-[#261E1A] dark:text-[#FDFBF7]">
                    {teachers.map((t) => {
                      const sectionsCount = t.sections_count ?? (t.assigned_classrooms || []).length;
                      const status = t.status || (sectionsCount === 0 ? "Unassigned" : "Active");
                      return (
                        <tr key={t.id} className="hover:bg-[#FAF8F5] dark:hover:bg-white/5 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-semibold text-[#261E1A] dark:text-[#FDFBF7]">{t.name}</div>
                            <div className="text-[11px] text-stone-400 dark:text-[#A89C90]">{t.email}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#FFF1F2] dark:bg-[#4C0519]/40 text-[#881337] border border-[#FECDD3] dark:border-[#881337]/50">
                              {t.subject || t.department || "Unassigned"}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-[#5C5046] dark:text-[#E7E0D6]">
                            {sectionsCount > 0 ? `${sectionsCount} classes` : "None"}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                              status === "Active"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : status === "Unassigned"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-stone-100 dark:bg-[#201815] text-stone-600 dark:text-[#E7E0D6] border-stone-200 dark:border-white/10"
                            }`}>
                              {status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedTeacher(t)}
                              className="px-2.5 py-1.5 rounded-[6px] border border-[#E7E0D6] dark:border-white/10 hover:bg-[#FFF1F2] dark:hover:bg-[#4C0519]/50 hover:border-[#FECDD3] text-[#881337] font-medium text-xs cursor-pointer min-h-[32px]"
                            >
                              View workload
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

          {invitations.length > 0 && (
            <div className="bg-white dark:bg-[#261E1A] border border-[#E7E0D6] dark:border-white/10 rounded-[8px] overflow-hidden shadow-xs">
              <div className="px-4 py-3 bg-[#FAF8F5] dark:bg-[#1C1512] border-b border-[#E7E0D6] dark:border-white/10 flex items-center justify-between">
                <h2 className="text-xs font-semibold text-[#261E1A] dark:text-[#FDFBF7] uppercase tracking-wider">
                  Invitations
                </h2>
                <span className="text-xs text-stone-500 dark:text-[#A89C90]">{invitations.filter((inv) => inv.status === "pending").length} pending</span>
              </div>
              {invitationLink && (
                <div className="flex flex-col gap-3 border-b border-[#E7E0D6] bg-[#FFFBEB] p-4 dark:border-white/10 dark:bg-amber-950/20 sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-stone-800 dark:text-[#FDFBF7]">Invitation link</p>
                    <input
                      readOnly
                      aria-label="Teacher invitation link"
                      value={invitationLink}
                      onFocus={(event) => event.currentTarget.select()}
                      className="mt-1 min-h-9 w-full rounded-md border border-stone-300 bg-white px-2 text-xs text-stone-700 dark:border-white/20 dark:bg-[#201815] dark:text-[#E7E0D6]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => copyInvitationLink(invitationLink)}
                    className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md border border-stone-300 bg-white px-3 text-xs font-semibold text-stone-700 hover:bg-stone-50 dark:border-white/20 dark:bg-[#261E1A] dark:text-[#FDFBF7]"
                  >
                    <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                    Copy link
                  </button>
                </div>
              )}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FAF8F5] dark:bg-[#1C1512] border-b border-[#E7E0D6] dark:border-white/10 text-stone-500 dark:text-[#A89C90] font-semibold uppercase tracking-wider text-[11px]">
                      <th className="py-2.5 px-4">Email</th>
                      <th className="py-2.5 px-4">Role</th>
                      <th className="py-2.5 px-4">Target Subject</th>
                      <th className="py-2.5 px-4">Created</th>
                      <th className="py-2.5 px-4">Status</th>
                      <th className="py-2.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7E0D6]">
                    {invitations.map((inv) => (
                      <tr key={inv.id} className="hover:bg-[#FAF8F5] dark:hover:bg-white/5">
                        <td className="py-3 px-4 font-semibold text-[#261E1A] dark:text-[#FDFBF7]">{inv.email}</td>
                        <td className="py-3 px-4 text-[#5C5046] dark:text-[#E7E0D6]">{inv.role}</td>
                        <td className="py-3 px-4 text-[#5C5046] dark:text-[#E7E0D6]">{inv.subject || "Not assigned"}</td>
                        <td className="py-3 px-4 text-stone-400 dark:text-[#A89C90]">
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
                            className="px-2 py-1 text-stone-600 dark:text-[#E7E0D6] hover:text-stone-900 border border-stone-200 dark:border-white/10 rounded hover:bg-stone-50 dark:hover:bg-white/5 text-[11px] cursor-pointer"
                          >
                            Refresh link
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

      {activeTab === "students" && (
        <div className="space-y-6">
          <div className="p-4 bg-[#FFF1F2] dark:bg-[#4C0519]/40 border border-[#FECDD3] dark:border-[#881337]/50 rounded-[8px] flex items-center justify-between gap-4">
            <div>
              <div className="font-semibold text-xs text-[#881337]">
                Student progress
              </div>
              <p className="text-[11px] text-stone-600 dark:text-[#E7E0D6] mt-0.5">
                Review progress by class. Detailed learner records require audit access.
              </p>
            </div>
            <button
              type="button"
              onClick={loadAtRiskStudents}
              disabled={loadingAtRisk}
              className="shrink-0 px-3 py-1.5 rounded-[6px] border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold cursor-pointer min-h-[36px]"
            >
              {loadingAtRisk ? "Checking access..." : "View students needing support"}
            </button>
          </div>

          <div className="bg-white dark:bg-[#261E1A] border border-[#E7E0D6] dark:border-white/10 rounded-[8px] overflow-hidden shadow-xs">
            <div className="px-4 py-3 bg-[#FAF8F5] dark:bg-[#1C1512] border-b border-[#E7E0D6] dark:border-white/10">
              <h2 className="text-xs font-semibold text-[#261E1A] dark:text-[#FDFBF7] uppercase tracking-wider">
                Class overview
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FAF8F5] dark:bg-[#1C1512] border-b border-[#E7E0D6] dark:border-white/10 text-stone-500 dark:text-[#A89C90] font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Section</th>
                    <th className="py-3 px-4">Grade</th>
                    <th className="py-3 px-4">Students</th>
                    <th className="py-3 px-4">Average score</th>
                    <th className="py-3 px-4">Needs support</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7E0D6] text-[#261E1A] dark:text-[#FDFBF7]">
                  {loadingStudents ? (
                    <tr><td colSpan={5} className="py-8 text-center text-stone-500 dark:text-[#A89C90]">Loading section data…</td></tr>
                  ) : studentAggregates?.sections?.length ? (
                    studentAggregates.sections.map((section: any) => (
                      <tr key={section.section_id || `${section.grade}-${section.section}`} className="hover:bg-[#FAF8F5] dark:hover:bg-white/5">
                        <td className="py-3 px-4 font-semibold text-[#261E1A] dark:text-[#FDFBF7]">{section.name || `Section ${section.section}`}</td>
                        <td className="py-3 px-4 text-[#5C5046] dark:text-[#E7E0D6]">{section.grade}</td>
                        <td className="py-3 px-4 font-mono">{section.student_count ?? 0}</td>
                        <td className="py-3 px-4 font-mono">{section.average_score ?? "—"}</td>
                        <td className="py-3 px-4 font-mono text-amber-700 font-semibold">{section.at_risk_count ?? 0}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={5} className="py-8 text-center text-stone-500 dark:text-[#A89C90]">No section data yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {atRiskList && (
            <div className="bg-white dark:bg-[#261E1A] border border-amber-200 rounded-[8px] overflow-hidden shadow-xs">
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
                    <tr className="bg-[#FAF8F5] dark:bg-[#1C1512] border-b border-[#E7E0D6] dark:border-white/10 text-stone-500 dark:text-[#A89C90] font-semibold uppercase tracking-wider text-[11px]">
                      <th className="py-2.5 px-4">Student Name</th>
                      <th className="py-2.5 px-4">Grade & Section</th>
                      <th className="py-2.5 px-4">Score</th>
                      <th className="py-2.5 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7E0D6]">
                    {atRiskList.length === 0 ? (
                      <tr><td colSpan={4} className="py-8 text-center text-stone-500 dark:text-[#A89C90]">No students are below their goal.</td></tr>
                    ) : atRiskList.map((stu) => (
                      <tr key={stu.id} className="hover:bg-[#FAF8F5] dark:hover:bg-white/5">
                        <td className="py-3 px-4 font-semibold text-[#261E1A] dark:text-[#FDFBF7]">{stu.name}</td>
                        <td className="py-3 px-4 text-[#5C5046] dark:text-[#E7E0D6]">{stu.grade} - {stu.section}</td>
                        <td className="py-3 px-4 font-mono text-rose-700 font-semibold">{stu.predicted_score}</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            Needs support
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

      {activeTab === "parents" && (
        <div className="bg-white dark:bg-[#261E1A] border border-[#E7E0D6] dark:border-white/10 rounded-[8px] overflow-hidden shadow-xs">
          <div className="px-4 py-3 bg-[#FAF8F5] dark:bg-[#1C1512] border-b border-[#E7E0D6] dark:border-white/10">
            <h2 className="text-xs font-semibold text-[#261E1A] dark:text-[#FDFBF7] uppercase tracking-wider">
              Parent contacts
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF8F5] dark:bg-[#1C1512] border-b border-[#E7E0D6] dark:border-white/10 text-stone-500 dark:text-[#A89C90] font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Parent Name</th>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4">Linked Children</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E0D6] text-[#261E1A] dark:text-[#FDFBF7]">
                {parents.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-stone-400 dark:text-[#A89C90]">
                      No parent contacts.
                    </td>
                  </tr>
                ) : (
                  parents.map((p) => (
                    <tr key={p.id} className="hover:bg-[#FAF8F5] dark:hover:bg-white/5">
                      <td className="py-3 px-4 font-semibold text-[#261E1A] dark:text-[#FDFBF7]">{p.name}</td>
                      <td className="py-3 px-4 text-[#5C5046] dark:text-[#E7E0D6]">
                        <div>{p.email}</div>
                        <div className="text-[11px] text-stone-400 dark:text-[#A89C90]">{p.phone}</div>
                      </td>
                      <td className="py-3 px-4 text-[#5C5046] dark:text-[#E7E0D6]">
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

      {selectedTeacher && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#261E1A] border border-[#E7E0D6] dark:border-white/10 rounded-[8px] shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E7E0D6] dark:border-white/10 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-[#261E1A] dark:text-[#FDFBF7]">{selectedTeacher.name}</h2>
                <p className="text-xs text-[#5C5046] dark:text-[#E7E0D6]">{selectedTeacher.subject} Specialist</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTeacher(null)}
                className="p-1 text-stone-400 dark:text-[#A89C90] hover:text-stone-600 rounded cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4 text-xs">
              <div className="rounded-lg border border-[#E7E0D6] dark:border-white/10 bg-[#FAF8F5] dark:bg-[#1C1512] p-4">
                <h3 className="font-semibold text-[#261E1A] dark:text-[#FDFBF7]">
                  Assigned classes ({selectedTeacher.sections_count ?? (selectedTeacher.assigned_classrooms || []).length})
                </h3>
                {selectedTeacher.assigned_classrooms?.length ? (
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {selectedTeacher.assigned_classrooms.map((section: string) => (
                      <li key={section} className="rounded-full border border-stone-200 dark:border-white/10 bg-white dark:bg-[#261E1A] px-2.5 py-1 text-stone-700 dark:text-[#E7E0D6]">{section}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-stone-600 dark:text-[#E7E0D6]">No class assignments yet.</p>
                )}
              </div>
              <p className="text-[11px] text-stone-500 dark:text-[#A89C90]">
                Current class assignments for this teacher.
              </p>
            </div>
            <div className="px-5 py-3 border-t border-[#E7E0D6] dark:border-white/10 bg-[#FAF8F5] dark:bg-[#1C1512] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedTeacher(null)}
                className="px-3.5 py-1.5 rounded-[6px] border border-[#E7E0D6] dark:border-white/10 bg-white dark:bg-[#261E1A] text-xs font-semibold cursor-pointer min-h-[36px]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#261E1A] border border-[#E7E0D6] dark:border-white/10 rounded-[8px] shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E7E0D6] dark:border-white/10 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#261E1A] dark:text-[#FDFBF7]">Invite teacher</h2>
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="p-1 text-stone-400 dark:text-[#A89C90] hover:text-stone-600 rounded cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
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

              <div>
                <label className="block font-semibold text-[#261E1A] dark:text-[#FDFBF7] mb-1">Email</label>
                <input
                  type="email"
                  required
                  placeholder="teacher@school.edu.et"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E7E0D6] dark:border-white/10 rounded-[6px] bg-white dark:bg-[#261E1A] text-xs focus:outline-none focus:ring-2 focus:ring-[#881337]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#261E1A] dark:text-[#FDFBF7] mb-1">Subject</label>
                <select
                  value={inviteForm.subject}
                  onChange={(e) => setInviteForm({ ...inviteForm, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E7E0D6] dark:border-white/10 rounded-[6px] bg-white dark:bg-[#261E1A] text-xs focus:outline-none focus:ring-2 focus:ring-[#881337]"
                >
                  <option value="Biology">Biology</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="English">English</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#261E1A] dark:text-[#FDFBF7] mb-1">Classes</label>
                <div className="max-h-32 overflow-y-auto border border-[#E7E0D6] dark:border-white/10 rounded-[6px] p-2 space-y-1 bg-white dark:bg-[#261E1A]">
                  {classrooms.map((c) => {
                    const isChecked = inviteForm.section_ids.includes(c.id);
                    return (
                      <label key={c.id} className="flex items-center gap-2 cursor-pointer text-xs p-1 hover:bg-stone-50 dark:hover:bg-white/5 rounded">
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
                          className="rounded text-[#881337] focus:ring-[#881337]"
                        />
                        <span>{c.name || `${c.grade} - ${c.section}`}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#E7E0D6] dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-3.5 py-2 border border-[#E7E0D6] dark:border-white/10 rounded-[6px] hover:bg-stone-50 dark:hover:bg-white/5 font-semibold text-[#5C5046] dark:text-[#E7E0D6] cursor-pointer min-h-[38px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviting}
                  className="px-3.5 py-2 bg-[#881337] hover:bg-[#9F1239] disabled:opacity-50 text-white rounded-[6px] font-semibold cursor-pointer min-h-[38px]"
                >
                  {inviting ? "Sending invitation..." : "Send invitation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PortalPage>
  );
}
