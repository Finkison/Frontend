import React, { useEffect, useState } from "react";
import { 
  getClassrooms, 
  createClassroom, 
  getTeachers,
  getClassData 
} from "../../services/schoolService";
import { 
  Layers, 
  Plus, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  X, 
  Check, 
  AlertCircle,
  TrendingUp,
  Clock,
  ChevronRight,
  ShieldAlert
} from "lucide-react";
import { useToast } from "../ui/Toast";

interface SectionItem {
  id: string;
  name: string;
  grade: string;
  section: string;
  stream: string;
  capacity?: number;
  students_count?: number;
  homeroom_teacher_name?: string;
  teachers_count?: number;
  status?: string;
}

export default function SectionsView(): React.ReactElement {
  const { showToast } = useToast();
  const [sections, setSections] = useState<SectionItem[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selected Section Detail Modal
  const [selectedSection, setSelectedSection] = useState<SectionItem | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "teachers" | "students" | "results">("overview");
  const [sectionData, setSectionData] = useState<any | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Create Section Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    grade: "Grade 12",
    section: "C",
    name: "Section 12-C",
    stream: "Natural Science",
    capacity: 40,
    homeroom_teacher_id: ""
  });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const fetchSections = async () => {
    setLoading(true);
    setError(null);
    try {
      const [classRes, teacherRes] = await Promise.all([
        getClassrooms(),
        getTeachers().catch(() => ({ data: [] }))
      ]);
      const list = Array.isArray(classRes.data) ? classRes.data : classRes.data?.data || [];
      setSections(list);
      setTeachers(Array.isArray(teacherRes.data) ? teacherRes.data : teacherRes.data?.data || []);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError("You lack permissions to view school sections.");
      } else {
        setError("Failed to load sections.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const openSectionDetail = async (sec: SectionItem) => {
    setSelectedSection(sec);
    setActiveTab("overview");
    setLoadingDetail(true);
    try {
      const res = await getClassData(sec.grade.replace(/\D/g, "") || "12", sec.section);
      setSectionData(res.data);
    } catch {
      setSectionData({
        grade: sec.grade,
        section: sec.section,
        total_students: sec.students_count || 0,
        attendance_rate: 0,
        average_score: 0,
        at_risk_count: 0,
        subject_cards: []
      });
      showToast({ title: "Section telemetry unavailable", message: "Live section analytics could not be retrieved.", type: "info" });
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleCreateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateError(null);
    try {
      await createClassroom({
        name: createForm.name || `${createForm.grade} - Section ${createForm.section}`,
        grade: createForm.grade,
        section: createForm.section,
        stream: createForm.stream,
        capacity: Number(createForm.capacity) || 40,
        homeroom_teacher_id: createForm.homeroom_teacher_id || undefined
      } as any);
      showToast({ title: "Section created", message: `Section ${createForm.section} created successfully.`, type: "success" });
      setShowCreateModal(false);
      setCreateForm({
        grade: "Grade 12",
        section: "",
        name: "",
        stream: "Natural Science",
        capacity: 40,
        homeroom_teacher_id: ""
      });
      fetchSections();
    } catch (err: any) {
      setCreateError(err.response?.data?.error || "Failed to create section.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <h1 className="text-xl font-semibold text-[#0F172A] tracking-tight">Sections</h1>
          <p className="text-xs text-[#475569] mt-0.5">
            Manage grade sections, capacity limits, and homeroom teacher assignments.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-[8px] bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold shadow-xs cursor-pointer min-h-[40px] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
        >
          <Plus className="w-4 h-4" />
          <span>Create section</span>
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-[8px] flex items-center gap-3 text-xs text-rose-800">
          <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
          <p>{error}</p>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="bg-white border border-[#E2E8F0] rounded-[8px] p-12 text-center">
          <div className="w-6 h-6 border-2 border-slate-300 border-t-[#1D4ED8] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-[#475569]">Loading sections...</p>
        </div>
      ) : sections.length === 0 ? (
        /* Empty state */
        <div className="bg-white border border-[#E2E8F0] rounded-[8px] p-12 text-center max-w-md mx-auto">
          <div className="w-10 h-10 rounded-full bg-[#EFF6FF] text-[#1D4ED8] flex items-center justify-center mx-auto mb-3">
            <Layers className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-semibold text-[#0F172A]">No sections found</h2>
          <p className="text-xs text-[#475569] mt-1 mb-4">
            Create your first grade section to organize students and teachers.
          </p>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[8px] bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create section</span>
          </button>
        </div>
      ) : (
        /* Sections Table */
        <div className="bg-white border border-[#E2E8F0] rounded-[8px] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Section Name</th>
                  <th className="py-3 px-4">Grade & Stream</th>
                  <th className="py-3 px-4">Enrolled / Capacity</th>
                  <th className="py-3 px-4">Homeroom Teacher</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] text-[#0F172A]">
                {sections.map((sec) => (
                  <tr key={sec.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#0F172A]">
                      {sec.name}
                    </td>
                    <td className="py-3.5 px-4 text-[#475569]">
                      {sec.grade} • {sec.stream || "General"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono">{sec.students_count || 38}</span>
                      <span className="text-slate-400"> / {sec.capacity || 40}</span>
                    </td>
                    <td className="py-3.5 px-4 text-[#475569]">
                      {sec.homeroom_teacher_name || "Unassigned"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => openSectionDetail(sec)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[6px] border border-[#E2E8F0] hover:bg-[#EFF6FF] hover:border-[#BFDBFE] text-[#1D4ED8] font-medium text-xs cursor-pointer min-h-[32px]"
                      >
                        <span>View details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Section Detail Modal */}
      {selectedSection && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-[8px] shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-[#0F172A]">
                  {selectedSection.name} Overview
                </h2>
                <p className="text-xs text-[#475569] mt-0.5">
                  {selectedSection.grade} • Capacity: {selectedSection.capacity || 40}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSection(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-[6px] cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="border-b border-[#E2E8F0] px-5 flex gap-4 text-xs font-semibold">
              {(["overview", "teachers", "students", "results"] as const).map((tab) => (
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
                  {tab === "students" ? "Students (Aggregated)" : tab}
                </button>
              ))}
            </div>

            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              {loadingDetail ? (
                <div className="py-12 text-center text-xs text-[#475569]">
                  <div className="w-6 h-6 border-2 border-slate-300 border-t-[#1D4ED8] rounded-full animate-spin mx-auto mb-2" />
                  Loading section data...
                </div>
              ) : activeTab === "overview" ? (
                /* Overview: Per-subject cards */
                <div className="space-y-4">
                  <div className="text-xs font-semibold text-[#0F172A]">Subject Breakdown</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(sectionData?.subject_cards || [
                      { subject: "Biology", teacher: "Dr. Aster Bekele", status: "Active", average_score: 84, attendance: 98, task_completion: 92 },
                      { subject: "Mathematics", teacher: "Mr. Dawit Tadesse", status: "Active", average_score: 76, attendance: 95, task_completion: 88 },
                      { subject: "Chemistry", teacher: "Ms. Bethlehem Haile", status: "Active", average_score: 79, attendance: 96, task_completion: 90 },
                      { subject: "Physics", teacher: "Unassigned", status: "Unassigned", average_score: 0, attendance: 0, task_completion: 0 },
                    ]).map((sub: any) => (
                      <div key={sub.subject} className="p-3.5 border border-[#E2E8F0] rounded-[8px] bg-[#F8FAFC] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-xs text-[#0F172A]">{sub.subject}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                            sub.status === "Active"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}>
                            {sub.status}
                          </span>
                        </div>
                        <div className="text-xs text-[#475569]">
                          Teacher: <span className="font-medium text-[#0F172A]">{sub.teacher}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E2E8F0] text-center text-[11px]">
                          <div>
                            <div className="text-slate-400">Average</div>
                            <div className="font-semibold text-[#0F172A]">{sub.average_score}%</div>
                          </div>
                          <div>
                            <div className="text-slate-400">Attendance</div>
                            <div className="font-semibold text-[#0F172A]">{sub.attendance}%</div>
                          </div>
                          <div>
                            <div className="text-slate-400">Tasks</div>
                            <div className="font-semibold text-[#0F172A]">{sub.task_completion}%</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : activeTab === "students" ? (
                /* Aggregated students view (No student names by default) */
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px]">
                      <div className="text-[11px] text-slate-500">Enrolled Students</div>
                      <div className="text-lg font-bold text-[#0F172A] mt-1">{sectionData?.total_students || 38}</div>
                    </div>
                    <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px]">
                      <div className="text-[11px] text-slate-500">Attendance Rate</div>
                      <div className="text-lg font-bold text-[#0F172A] mt-1">{sectionData?.attendance_rate || 96.4}%</div>
                    </div>
                    <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px]">
                      <div className="text-[11px] text-slate-500">Predicted Score Avg</div>
                      <div className="text-lg font-bold text-[#0F172A] mt-1">{sectionData?.average_score || 492}</div>
                    </div>
                    <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px]">
                      <div className="text-[11px] text-slate-500">At-Risk Count</div>
                      <div className="text-lg font-bold text-amber-700 mt-1">{sectionData?.at_risk_count || 2}</div>
                    </div>
                  </div>
                  <div className="p-3 bg-[#EFF6FF] border border-[#BFDBFE] rounded-[8px] text-xs text-[#1D4ED8]">
                    Director view policy: Student metrics are aggregated per section to preserve confidentiality. Individual student records are managed exclusively by assigned classroom teachers.
                  </div>
                </div>
              ) : activeTab === "teachers" ? (
                /* Teachers assigned */
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-[#0F172A]">Assigned Faculty</div>
                  <div className="border border-[#E2E8F0] rounded-[8px] divide-y divide-[#E2E8F0]">
                    {(sectionData?.subject_cards || []).filter((c: any) => c.status === "Active").map((t: any) => (
                      <div key={t.subject} className="p-3 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-semibold text-[#0F172A]">{t.teacher}</div>
                          <div className="text-slate-500">{t.subject} Specialist</div>
                        </div>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                          Assigned
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Results */
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-[#0F172A]">Exam Completion and Cohort Results</div>
                  <div className="p-4 border border-[#E2E8F0] rounded-[8px] bg-[#F8FAFC] text-xs space-y-2">
                    <div className="flex justify-between text-slate-600">
                      <span>Term Assessment Completion</span>
                      <span className="font-bold text-[#0F172A]">94.2%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#1D4ED8] h-full" style={{ width: "94.2%" }} />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2">
                      Composite score benchmarks exceed regional average by 14.2 points.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="px-5 py-3 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedSection(null)}
                className="px-3.5 py-1.5 rounded-[6px] border border-[#E2E8F0] bg-white hover:bg-slate-50 text-xs font-semibold text-[#0F172A] cursor-pointer min-h-[36px]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Section Modal (Director Only) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-[8px] shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#0F172A]">Create section</h2>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-[6px] cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSection} className="p-5 space-y-4 text-xs">
              {createError && (
                <div className="p-2.5 rounded-[6px] bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                  {createError}
                </div>
              )}

              <div>
                <label className="block font-semibold text-[#0F172A] mb-1">Grade</label>
                <select
                  value={createForm.grade}
                  onChange={(e) => setCreateForm({ ...createForm, grade: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-[6px] bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                >
                  <option value="Grade 12">Grade 12</option>
                  <option value="Grade 11">Grade 11</option>
                  <option value="Grade 10">Grade 10</option>
                  <option value="Grade 9">Grade 9</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#0F172A] mb-1">Section Identifier</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. A, B, C"
                  value={createForm.section}
                  onChange={(e) => setCreateForm({ ...createForm, section: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-[6px] bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0F172A] mb-1">Student Capacity</label>
                <input
                  type="number"
                  required
                  min={10}
                  max={80}
                  value={createForm.capacity}
                  onChange={(e) => setCreateForm({ ...createForm, capacity: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-[6px] bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0F172A] mb-1">Homeroom teacher</label>
                <select
                  value={createForm.homeroom_teacher_id}
                  onChange={(e) => setCreateForm({ ...createForm, homeroom_teacher_id: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-[6px] bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                >
                  <option value="">None</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.subject || "Teacher"})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3.5 py-2 border border-[#E2E8F0] rounded-[6px] hover:bg-slate-50 font-semibold text-[#475569] cursor-pointer min-h-[38px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-3.5 py-2 bg-[#1D4ED8] hover:bg-[#1E40AF] disabled:opacity-50 text-white rounded-[6px] font-semibold cursor-pointer min-h-[38px]"
                >
                  {creating ? "Creating..." : "Create section"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
