import React, { useEffect, useState } from "react";
import { 
  getAssignmentMatrix, 
  assignTeacher, 
  reassignTeacher, 
  bulkAssignTeachers, 
  getTeachers, 
  getClassrooms 
} from "../../services/schoolService";
import { useToast } from "../ui/Toast";
import PageHeader from "../shared/PageHeader";
import PortalPage from "../shared/PortalPage";
import PortalLoading from "../shared/PortalLoading";
import PortalError from "../shared/PortalError";
import { getApiErrorMessage } from "../../services/api";
import { 
  Users, 
  BookOpen, 
  Check, 
  AlertTriangle, 
  ArrowRight, 
  X, 
  Layers, 
  Clock, 
  ShieldAlert, 
  RefreshCw,
  Plus
} from "lucide-react";

interface SubjectAssignment {
  assignment_id: string | null;
  teacher_id: string | null;
  teacher_name: string;
  status: string;
  is_substitute: boolean;
  start_date?: string;
  end_date?: string;
}

interface MatrixRow {
  section_id: string;
  section_name: string;
  grade: string;
  section: string;
  stream: string;
  subjects: Record<string, SubjectAssignment>;
}

interface TeacherWorkload {
  teacher_id: string;
  name: string;
  department: string;
  sections_count: number;
  weekly_periods: number;
  is_overloaded: boolean;
  overload_warning?: string;
}

export default function AssignmentsView(): React.ReactElement {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [matrixData, setMatrixData] = useState<{
    academic_year: string;
    sections: Array<{ id: string; name: string; grade: string; section: string }>;
    subjects: Array<{ id: string; name: string; code: string }>;
    matrix: MatrixRow[];
    unassigned_subjects_count: number;
    teacher_workloads: TeacherWorkload[];
  } | null>(null);

  const [teachers, setTeachers] = useState<any[]>([]);

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignForm, setAssignForm] = useState({
    section_id: "",
    subject_id: "",
    teacher_id: "",
    is_substitute: false,
    end_date: ""
  });
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState<string | null>(null);
  const [highWorkloadConfirm, setHighWorkloadConfirm] = useState(false);
  const [workloadWarningMessage, setWorkloadWarningMessage] = useState<string | null>(null);

  const [showReassignModal, setShowReassignModal] = useState(false);
  const [reassignForm, setReassignForm] = useState({
    section_id: "",
    subject_id: "",
    current_teacher_name: "",
    new_teacher_id: ""
  });
  const [reassigning, setReassigning] = useState(false);
  const [reassignError, setReassignError] = useState<string | null>(null);

  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkSubjectId, setBulkSubjectId] = useState("");
  const [bulkAssignments, setBulkAssignments] = useState<Record<string, string>>({});
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkSummaryMessage, setBulkSummaryMessage] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [matrixRes, teacherRes] = await Promise.all([
        getAssignmentMatrix(),
        getTeachers()
      ]);
      setMatrixData(matrixRes.data);
      setTeachers(teacherRes.data?.data || teacherRes.data || []);
    } catch (err) {
      setLoadError(getApiErrorMessage(err) || "Failed to load assignment data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAssign = (sectionId: string, subjectId: string) => {
    setAssignForm({
      section_id: sectionId,
      subject_id: subjectId,
      teacher_id: teachers[0]?.id || "",
      is_substitute: false,
      end_date: ""
    });
    setAssignError(null);
    setWorkloadWarningMessage(null);
    setHighWorkloadConfirm(false);
    setShowAssignModal(true);
  };

  const handleOpenReassign = (sectionId: string, subjectId: string, currentTeacherName: string) => {
    setReassignForm({
      section_id: sectionId,
      subject_id: subjectId,
      current_teacher_name: currentTeacherName,
      new_teacher_id: teachers[0]?.id || ""
    });
    setReassignError(null);
    setShowReassignModal(true);
  };

  const submitAssign = async () => {
    setAssigning(true);
    setAssignError(null);
    try {
      await assignTeacher({
        section_id: assignForm.section_id,
        subject_id: assignForm.subject_id,
        teacher_id: assignForm.teacher_id,
        is_substitute: assignForm.is_substitute,
        end_date: assignForm.end_date || undefined,
        confirm_high_workload: highWorkloadConfirm
      });
      showToast({ title: "Success", message: "Teacher assigned successfully.", type: "success" });
      setShowAssignModal(false);
      loadData();
    } catch (err: any) {
      const errorData = err.response?.data;
      if (errorData?.requires_confirmation) {
        setWorkloadWarningMessage(errorData.message);
        setHighWorkloadConfirm(true);
      } else {
        setAssignError(getApiErrorMessage(err) || "Assignment failed.");
      }
    } finally {
      setAssigning(false);
    }
  };

  const submitReassign = async () => {
    setReassigning(true);
    setReassignError(null);
    try {
      await reassignTeacher({
        section_id: reassignForm.section_id,
        subject_id: reassignForm.subject_id,
        new_teacher_id: reassignForm.new_teacher_id
      });
      showToast({ title: "Success", message: "Teacher reassigned successfully.", type: "success" });
      setShowReassignModal(false);
      loadData();
    } catch (err) {
      setReassignError(getApiErrorMessage(err) || "Reassignment failed.");
    } finally {
      setReassigning(false);
    }
  };

  const submitBulkAssign = async () => {
    if (!bulkSubjectId) {
      showToast({ title: "Error", message: "Select a subject first.", type: "error" });
      return;
    }
    setBulkLoading(true);
    try {
      const payloadItems = Object.entries(bulkAssignments)
        .filter(([_, teacherId]) => Boolean(teacherId))
        .map(([sectionId, teacherId]) => ({
          section_id: sectionId,
          teacher_id: teacherId
        }));

      const res = await bulkAssignTeachers({
        subject_id: bulkSubjectId,
        assignments: payloadItems
      });

      setBulkSummaryMessage(res.data.validation_summary);
      showToast({ title: "Success", message: res.data.message, type: "success" });
      loadData();
    } catch (err) {
      showToast({ title: "Error", message: getApiErrorMessage(err) || "Bulk assign failed.", type: "error" });
    } finally {
      setBulkLoading(false);
    }
  };

  if (loading) {
    return (
      <PortalPage className="max-w-6xl"><PortalLoading message="Loading teaching assignments…" /></PortalPage>
    );
  }
  if (loadError) {
    return (
      <PortalPage className="max-w-6xl">
        <PortalError message={loadError} actionLabel="Retry" onAction={() => void loadData()} />
      </PortalPage>
    );
  }

  const sections = matrixData?.sections || [];
  const subjects = matrixData?.subjects || [];
  const matrix = matrixData?.matrix || [];
  const unassignedCount = matrixData?.unassigned_subjects_count || 0;
  const workloads = matrixData?.teacher_workloads || [];

  return (
    <PortalPage className="space-y-6">

      <PageHeader
        title="Teaching assignments"
        description="Match teachers and subjects to each class."
        primaryAction={{
          label: "Assign in bulk",
          onClick: () => {
            setBulkSubjectId(subjects[0]?.id || "");
            setBulkAssignments({});
            setBulkSummaryMessage(null);
            setShowBulkModal(true);
          },
          icon: Plus,
        }}
        secondaryActions={[{ label: "Refresh", onClick: loadData, icon: RefreshCw, loading }]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-[8px] border border-[#E7E0D6] dark:border-white/10 bg-white dark:bg-[#261E1A]">
          <span className="text-xs font-medium text-stone-500 dark:text-[#A89C90] block">Academic year</span>
          <span className="text-base font-bold text-[#261E1A] dark:text-[#FDFBF7] mt-1 block">{matrixData?.academic_year || "2026"}</span>
        </div>
        <div className="p-4 rounded-[8px] border border-[#E7E0D6] dark:border-white/10 bg-white dark:bg-[#261E1A]">
          <span className="text-xs font-medium text-stone-500 dark:text-[#A89C90] block">Teacher coverage</span>
          <span className={`text-base font-bold mt-1 block ${unassignedCount > 0 ? "text-amber-700" : "text-emerald-700"}`}>
            {unassignedCount > 0 ? `${unassignedCount} classes need a teacher` : "All classes staffed"}
          </span>
        </div>
        <div className="p-4 rounded-[8px] border border-[#E7E0D6] dark:border-white/10 bg-white dark:bg-[#261E1A]">
          <span className="text-xs font-medium text-stone-500 dark:text-[#A89C90] block">Classes</span>
          <span className="text-base font-bold text-[#261E1A] dark:text-[#FDFBF7] mt-1 block">{sections.length}</span>
        </div>
      </div>

      <div className="border border-stone-200 dark:border-white/10 rounded-xl bg-white dark:bg-[#261E1A] overflow-hidden shadow-xs">
        <div className="overflow-x-auto max-h-[600px]">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-stone-50 dark:bg-[#1C1512] text-stone-700 dark:text-[#E7E0D6] border-b border-stone-200 dark:border-white/10 sticky top-0 z-20">
              <tr>
                <th className="p-3 font-semibold border-r border-stone-200 dark:border-white/10 min-w-[160px] sticky left-0 z-30 bg-stone-100 dark:bg-[#201815] shadow-[2px_0_6px_-2px_rgba(0,0,0,0.08)]">
                  Class & stream
                </th>
                {subjects.map((sub) => (
                  <th key={sub.id} className="p-3 font-semibold border-r border-stone-200 dark:border-white/10 min-w-[150px] bg-stone-50 dark:bg-[#1C1512]">
                    {sub.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {matrix.map((row) => (
                <tr key={row.section_id} className="hover:bg-stone-50/50">
                  <td className="p-3 font-medium text-stone-900 dark:text-[#FDFBF7] border-r border-stone-200 dark:border-white/10 sticky left-0 z-10 bg-white/95 shadow-[2px_0_6px_-2px_rgba(0,0,0,0.08)]">
                    <span className="block font-semibold text-[#261E1A] dark:text-[#FDFBF7]">{row.section_name}</span>
                    <span className="text-[11px] text-stone-500 dark:text-[#A89C90]">{row.stream}</span>
                  </td>
                  {subjects.map((sub) => {
                    const cell = row.subjects[sub.id];
                    const isAssigned = cell && cell.status === "active";
                    return (
                      <td key={sub.id} className="p-3 border-r border-stone-200 dark:border-white/10 align-top">
                        {isAssigned ? (
                          <div className="flex flex-col gap-1">
                            <span className="font-semibold text-stone-800 dark:text-[#FDFBF7]">{cell.teacher_name}</span>
                            <div className="flex flex-wrap gap-1">
                              {cell.is_substitute && (
                                <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded w-fit">
                                  Substitute
                                </span>
                              )}
                              <span className="text-[9px] bg-stone-100 dark:bg-[#201815] text-stone-600 dark:text-[#E7E0D6] px-1.5 py-0.2 rounded font-medium">
                                Specialist
                              </span>
                            </div>
                            <button
                              onClick={() => handleOpenReassign(row.section_id, sub.id, cell.teacher_name)}
                              className="text-[11px] text-[#881337] hover:text-[#9F1239] hover:underline text-left mt-1 cursor-pointer font-medium"
                            >
                              Reassign
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-1.5">
                            <span className="text-stone-400 dark:text-[#A89C90] font-normal">Unassigned</span>
                            <button
                              onClick={() => handleOpenAssign(row.section_id, sub.id)}
                              className="px-2.5 py-1 text-[11px] font-semibold rounded-[6px] bg-[#FFF1F2] dark:bg-[#4C0519]/40 text-[#881337] hover:bg-[#FFE4E6] dark:hover:bg-[#4C0519]/60 border border-[#FECDD3] dark:border-[#881337]/50 w-fit cursor-pointer transition-colors"
                            >
                              Assign
                            </button>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="border border-stone-200 dark:border-white/10 rounded-xl bg-white dark:bg-[#261E1A] p-5 shadow-xs">
        <h2 className="text-sm font-bold text-stone-900 dark:text-[#FDFBF7] mb-3">Teacher workload</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 dark:bg-[#1C1512] text-stone-700 dark:text-[#E7E0D6] border-b border-stone-200 dark:border-white/10">
              <tr>
                <th className="p-2.5 font-semibold">Teacher</th>
                <th className="p-2.5 font-semibold">Department</th>
                <th className="p-2.5 font-semibold">Classes</th>
                <th className="p-2.5 font-semibold">Weekly periods</th>
                <th className="p-2.5 font-semibold">Workload status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {workloads.map((w) => (
                <tr key={w.teacher_id} className="hover:bg-stone-50/40">
                  <td className="p-2.5 font-medium text-stone-900 dark:text-[#FDFBF7]">{w.name}</td>
                  <td className="p-2.5 text-stone-600 dark:text-[#E7E0D6]">{w.department}</td>
                  <td className="p-2.5 text-stone-900 dark:text-[#FDFBF7] font-semibold">{w.sections_count}</td>
                  <td className="p-2.5 text-stone-900 dark:text-[#FDFBF7] font-semibold">{w.weekly_periods} hrs</td>
                  <td className="p-2.5">
                    {w.is_overloaded ? (
                      <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px] font-medium border border-amber-200">
                        <AlertTriangle className="w-3 h-3" />
                        {w.overload_warning}
                      </span>
                    ) : (
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-medium border border-emerald-200">
                        Optimal
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAssignModal && (
        <div className="fixed inset-0 bg-stone-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#261E1A] rounded-xl border border-stone-200 dark:border-white/10 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-white/10 pb-3">
              <h2 className="text-base font-bold text-stone-900 dark:text-[#FDFBF7]">Assign teacher</h2>
              <button onClick={() => setShowAssignModal(false)} className="text-stone-400 dark:text-[#A89C90] hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {assignError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">
                {assignError}
              </div>
            )}

            {workloadWarningMessage && (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
                {workloadWarningMessage}
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-stone-700 dark:text-[#E7E0D6] block mb-1">Teacher</label>
                <select
                  value={assignForm.teacher_id}
                  onChange={(e) => setAssignForm({ ...assignForm, teacher_id: e.target.value })}
                  className="w-full p-2.5 border border-stone-300 dark:border-white/20 rounded-lg text-xs"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="substituteCheck"
                  checked={assignForm.is_substitute}
                  onChange={(e) => setAssignForm({ ...assignForm, is_substitute: e.target.checked })}
                  className="rounded text-emerald-600"
                />
                <label htmlFor="substituteCheck" className="text-stone-700 dark:text-[#E7E0D6] font-medium">
                  Temporary substitute
                </label>
              </div>

              {highWorkloadConfirm && (
                <div className="p-3 bg-stone-50 dark:bg-[#1C1512] border border-stone-200 dark:border-white/10 rounded-lg text-xs">
                  <p className="font-medium text-stone-800 dark:text-[#FDFBF7]">This teacher is above the recommended workload. Continue?</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-stone-200 dark:border-white/10">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-3 py-2 text-xs font-semibold rounded-lg border border-stone-200 dark:border-white/10 hover:bg-stone-50 dark:hover:bg-white/5 text-stone-700 dark:text-[#E7E0D6]"
              >
                Cancel
              </button>
              <button
                onClick={submitAssign}
                disabled={assigning}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
              >
                {assigning ? "Assigning..." : highWorkloadConfirm ? "Confirm" : "Assign"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showReassignModal && (
        <div className="fixed inset-0 bg-stone-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#261E1A] rounded-xl border border-stone-200 dark:border-white/10 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-white/10 pb-3">
              <h2 className="text-base font-bold text-stone-900 dark:text-[#FDFBF7]">Reassign teacher</h2>
              <button onClick={() => setShowReassignModal(false)} className="text-stone-400 dark:text-[#A89C90] hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {reassignError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">
                {reassignError}
              </div>
            )}

            <div className="text-xs space-y-3">
              <div className="p-3 bg-stone-50 dark:bg-[#1C1512] rounded-lg border border-stone-200 dark:border-white/10 text-stone-600 dark:text-[#E7E0D6]">
                Current teacher: <span className="font-semibold text-stone-900 dark:text-[#FDFBF7]">{reassignForm.current_teacher_name}</span>.
                Past records stay with the previous teacher.
              </div>

              <div>
                <label className="font-semibold text-stone-700 dark:text-[#E7E0D6] block mb-1">New teacher</label>
                <select
                  value={reassignForm.new_teacher_id}
                  onChange={(e) => setReassignForm({ ...reassignForm, new_teacher_id: e.target.value })}
                  className="w-full p-2.5 border border-stone-300 dark:border-white/20 rounded-lg text-xs"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.department})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-stone-200 dark:border-white/10">
              <button
                onClick={() => setShowReassignModal(false)}
                className="px-3 py-2 text-xs font-semibold rounded-lg border border-stone-200 dark:border-white/10 hover:bg-stone-50 dark:hover:bg-white/5 text-stone-700 dark:text-[#E7E0D6]"
              >
                Cancel
              </button>
              <button
                onClick={submitReassign}
                disabled={reassigning}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
              >
                {reassigning ? "Saving..." : "Reassign"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showBulkModal && (
        <div className="fixed inset-0 bg-stone-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#261E1A] rounded-xl border border-stone-200 dark:border-white/10 shadow-xl max-w-2xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-white/10 pb-3">
              <h2 className="text-base font-bold text-stone-900 dark:text-[#FDFBF7]">Assign by subject</h2>
              <button onClick={() => setShowBulkModal(false)} className="text-stone-400 dark:text-[#A89C90] hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {bulkSummaryMessage && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                {bulkSummaryMessage}
              </div>
            )}

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-stone-700 dark:text-[#E7E0D6] block mb-1">Subject</label>
                <select
                  value={bulkSubjectId}
                  onChange={(e) => setBulkSubjectId(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 dark:border-white/20 rounded-lg text-xs font-medium"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-stone-700 dark:text-[#E7E0D6] block mb-2">Teacher for each class</label>
                <div className="max-h-[300px] overflow-y-auto space-y-2 border border-stone-200 dark:border-white/10 rounded-lg p-3">
                  {sections.map((sec) => (
                    <div key={sec.id} className="flex items-center justify-between gap-4 p-2 bg-stone-50 dark:bg-[#1C1512] rounded">
                      <span className="font-medium text-stone-900 dark:text-[#FDFBF7] min-w-[120px]">{sec.name}</span>
                      <select
                        value={bulkAssignments[sec.id] || ""}
                        onChange={(e) => setBulkAssignments({ ...bulkAssignments, [sec.id]: e.target.value })}
                        className="flex-1 p-2 border border-stone-300 dark:border-white/20 rounded text-xs bg-white dark:bg-[#261E1A]"
                      >
                        <option value="">Leave unassigned</option>
                        {teachers.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-stone-200 dark:border-white/10">
              <button
                onClick={() => setShowBulkModal(false)}
                className="px-3 py-2 text-xs font-semibold rounded-lg border border-stone-200 dark:border-white/10 hover:bg-stone-50 dark:hover:bg-white/5 text-stone-700 dark:text-[#E7E0D6]"
              >
                Cancel
              </button>
              <button
                onClick={submitBulkAssign}
                disabled={bulkLoading}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
              >
                {bulkLoading ? "Saving..." : "Save assignments"}
              </button>
            </div>
          </div>
        </div>
      )}
    </PortalPage>
  );
}
