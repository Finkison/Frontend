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
  const [matrixData, setMatrixData] = useState<{
    academic_year: string;
    sections: Array<{ id: string; name: string; grade: string; section: string }>;
    subjects: Array<{ id: string; name: string; code: string }>;
    matrix: MatrixRow[];
    unassigned_subjects_count: number;
    teacher_workloads: TeacherWorkload[];
  } | null>(null);

  const [teachers, setTeachers] = useState<any[]>([]);

  // Assign Modal
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

  // Reassign Modal
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [reassignForm, setReassignForm] = useState({
    section_id: "",
    subject_id: "",
    current_teacher_name: "",
    new_teacher_id: ""
  });
  const [reassigning, setReassigning] = useState(false);
  const [reassignError, setReassignError] = useState<string | null>(null);

  // Bulk Assign Modal
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkSubjectId, setBulkSubjectId] = useState("");
  const [bulkAssignments, setBulkAssignments] = useState<Record<string, string>>({});
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkSummaryMessage, setBulkSummaryMessage] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [matrixRes, teacherRes] = await Promise.all([
        getAssignmentMatrix(),
        getTeachers()
      ]);
      setMatrixData(matrixRes.data);
      setTeachers(teacherRes.data?.data || teacherRes.data || []);
    } catch (err: any) {
      showToast({ title: "Error", message: "Failed to load assignment data.", type: "error" });
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
        setAssignError(errorData?.error || "Assignment failed.");
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
    } catch (err: any) {
      setReassignError(err.response?.data?.error || "Reassignment failed.");
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
    } catch (err: any) {
      showToast({ title: "Error", message: err.response?.data?.error || "Bulk assign failed.", type: "error" });
    } finally {
      setBulkLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-3 border-slate-200 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    );
  }

  const sections = matrixData?.sections || [];
  const subjects = matrixData?.subjects || [];
  const matrix = matrixData?.matrix || [];
  const unassignedCount = matrixData?.unassigned_subjects_count || 0;
  const workloads = matrixData?.teacher_workloads || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Assignments</h1>
          <p className="text-xs text-slate-500 mt-1">Manage section and subject teacher pairings</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setBulkSubjectId(subjects[0]?.id || "");
              setBulkAssignments({});
              setBulkSummaryMessage(null);
              setShowBulkModal(true);
            }}
            className="px-3.5 py-2 text-xs font-semibold rounded-[8px] bg-[#881337] hover:bg-[#9F1239] text-white transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer min-h-[38px] focus:outline-none focus:ring-2 focus:ring-[#881337]"
          >
            <Plus className="w-4 h-4" />
            <span>Bulk assign</span>
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-[8px] border border-[#E2E8F0] bg-white">
          <span className="text-xs font-medium text-slate-500 block">Academic year</span>
          <span className="text-base font-bold text-[#0F172A] mt-1 block">{matrixData?.academic_year || "2026"}</span>
        </div>
        <div className="p-4 rounded-[8px] border border-[#E2E8F0] bg-white">
          <span className="text-xs font-medium text-slate-500 block">Teacher coverage</span>
          <span className={`text-base font-bold mt-1 block ${unassignedCount > 0 ? "text-amber-700" : "text-emerald-700"}`}>
            {unassignedCount > 0 ? `${unassignedCount} section-subjects have no teacher` : "All section-subjects assigned"}
          </span>
        </div>
        <div className="p-4 rounded-[8px] border border-[#E2E8F0] bg-white">
          <span className="text-xs font-medium text-slate-500 block">Active Sections</span>
          <span className="text-base font-bold text-[#0F172A] mt-1 block">{sections.length} sections</span>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto max-h-[600px]">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 sticky top-0 z-20">
              <tr>
                <th className="p-3 font-semibold border-r border-slate-200 min-w-[160px] sticky left-0 z-30 bg-slate-100 shadow-[2px_0_6px_-2px_rgba(0,0,0,0.08)]">
                  Section & Stream
                </th>
                {subjects.map((sub) => (
                  <th key={sub.id} className="p-3 font-semibold border-r border-slate-200 min-w-[150px] bg-slate-50">
                    {sub.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {matrix.map((row) => (
                <tr key={row.section_id} className="hover:bg-slate-50/50">
                  <td className="p-3 font-medium text-slate-900 border-r border-slate-200 sticky left-0 z-10 bg-white/95 shadow-[2px_0_6px_-2px_rgba(0,0,0,0.08)]">
                    <span className="block font-semibold text-[#0F172A]">{row.section_name}</span>
                    <span className="text-[11px] text-slate-500">{row.stream}</span>
                  </td>
                  {subjects.map((sub) => {
                    const cell = row.subjects[sub.id];
                    const isAssigned = cell && cell.status === "active";
                    return (
                      <td key={sub.id} className="p-3 border-r border-slate-200 align-top">
                        {isAssigned ? (
                          <div className="flex flex-col gap-1">
                            <span className="font-semibold text-slate-800">{cell.teacher_name}</span>
                            <div className="flex flex-wrap gap-1">
                              {cell.is_substitute && (
                                <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded w-fit">
                                  Substitute
                                </span>
                              )}
                              <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">
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
                            <span className="text-slate-400 font-normal">Unassigned</span>
                            <button
                              onClick={() => handleOpenAssign(row.section_id, sub.id)}
                              className="px-2.5 py-1 text-[11px] font-semibold rounded-[6px] bg-[#FFF1F2] text-[#881337] hover:bg-[#FFE4E6] border border-[#FECDD3] w-fit cursor-pointer transition-colors"
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

      {/* Teacher Workload Table */}
      <div className="border border-slate-200 rounded-xl bg-white p-5 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 mb-3">Teacher Workload Summary</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="p-2.5 font-semibold">Teacher</th>
                <th className="p-2.5 font-semibold">Department</th>
                <th className="p-2.5 font-semibold">Sections count</th>
                <th className="p-2.5 font-semibold">Weekly periods</th>
                <th className="p-2.5 font-semibold">Workload status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {workloads.map((w) => (
                <tr key={w.teacher_id} className="hover:bg-slate-50/40">
                  <td className="p-2.5 font-medium text-slate-900">{w.name}</td>
                  <td className="p-2.5 text-slate-600">{w.department}</td>
                  <td className="p-2.5 text-slate-900 font-semibold">{w.sections_count}</td>
                  <td className="p-2.5 text-slate-900 font-semibold">{w.weekly_periods} hrs</td>
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

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-slate-900">Assign Teacher</h2>
              <button onClick={() => setShowAssignModal(false)} className="text-slate-400 hover:text-slate-600">
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
                <label className="font-semibold text-slate-700 block mb-1">Select Teacher</label>
                <select
                  value={assignForm.teacher_id}
                  onChange={(e) => setAssignForm({ ...assignForm, teacher_id: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
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
                <label htmlFor="substituteCheck" className="text-slate-700 font-medium">
                  Substitute teacher (temporary assignment)
                </label>
              </div>

              {highWorkloadConfirm && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                  <p className="font-medium text-slate-800">Do you want to confirm adding another section?</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700"
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

      {/* Reassign Modal */}
      {showReassignModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-slate-900">Reassign Teacher</h2>
              <button onClick={() => setShowReassignModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {reassignError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">
                {reassignError}
              </div>
            )}

            <div className="text-xs space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-600">
                Current teacher: <span className="font-semibold text-slate-900">{reassignForm.current_teacher_name}</span>.
                Past records remain linked to this teacher.
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">New Teacher</label>
                <select
                  value={reassignForm.new_teacher_id}
                  onChange={(e) => setReassignForm({ ...reassignForm, new_teacher_id: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.department})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => setShowReassignModal(false)}
                className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700"
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

      {/* Bulk Assign Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-2xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-slate-900">Bulk Assign</h2>
              <button onClick={() => setShowBulkModal(false)} className="text-slate-400 hover:text-slate-600">
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
                <label className="font-semibold text-slate-700 block mb-1">Select Subject</label>
                <select
                  value={bulkSubjectId}
                  onChange={(e) => setBulkSubjectId(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-medium"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-2">Assign Teacher per Section</label>
                <div className="max-h-[300px] overflow-y-auto space-y-2 border border-slate-200 rounded-lg p-3">
                  {sections.map((sec) => (
                    <div key={sec.id} className="flex items-center justify-between gap-4 p-2 bg-slate-50 rounded">
                      <span className="font-medium text-slate-900 min-w-[120px]">{sec.name}</span>
                      <select
                        value={bulkAssignments[sec.id] || ""}
                        onChange={(e) => setBulkAssignments({ ...bulkAssignments, [sec.id]: e.target.value })}
                        className="flex-1 p-2 border border-slate-300 rounded text-xs bg-white"
                      >
                        <option value="">Leave Unassigned</option>
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

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => setShowBulkModal(false)}
                className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700"
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
    </div>
  );
}
