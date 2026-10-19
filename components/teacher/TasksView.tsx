import React, { useState } from "react";
import useAuthStore from "../../store/authStore";
import { createSchoolTask } from "../../services/schoolService";
import { 
  ListChecks, 
  Plus, 
  Check, 
  Calendar, 
  X, 
  FileText, 
  Clock, 
  ChevronRight,
  Filter,
  CheckCircle2,
  Users
} from "lucide-react";
import { useToast } from "../ui/Toast";

// Standard 6 Task Types enforced by enterprise spec and teachingStandardization.test.ts
const ALLOWED_TASK_TYPES = [
  "Homework",
  "Quiz",
  "Reading",
  "Project",
  "Practice set",
  "Lab report"
] as const;

export default function TeacherTasksView(): React.ReactElement {
  const { showToast } = useToast();
  const { user } = useAuthStore();
  const teacherSubject = (user as any)?.subject || "Biology";

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");

  const [taskForm, setTaskForm] = useState({
    title: "",
    task_type: "Homework",
    section_ids: ["12-A"],
    due_date: "2026-10-25",
    max_marks: 20,
    instructions: ""
  });
  const [creating, setCreating] = useState(false);

  const [tasks, setTasks] = useState<any[]>([]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.title.trim()) {
      showToast({ title: "Title required", message: "Please provide a descriptive title for the task.", type: "error" });
      return;
    }

    setCreating(true);
    try {
      const res = await createSchoolTask({
        title: taskForm.title,
        task_type: taskForm.task_type,
        subject_id: teacherSubject.toLowerCase(),
        section_ids: taskForm.section_ids,
        due_date: taskForm.due_date,
        max_marks: Number(taskForm.max_marks),
        instructions: taskForm.instructions
      });
      showToast({ title: "Task dispatched", message: `Task assigned to Section ${taskForm.section_ids.join(", ")}.`, type: "success" });
      setShowCreateModal(false);
      const newTask = res.data?.task || {
        id: `t-${Date.now()}`,
        title: taskForm.title,
        type: taskForm.task_type,
        sections: taskForm.section_ids,
        dueDate: taskForm.due_date,
        submittedCount: 0,
        totalCount: 0,
        maxMarks: Number(taskForm.max_marks),
        status: "Active"
      };
      setTasks(prev => [newTask, ...prev]);
    } catch (err: any) {
      showToast({
        title: "Creation Failed",
        message: err?.response?.data?.message || err?.message || "Failed to create task. Please try again.",
        type: "error"
      });
    } finally {
      setCreating(false);
    }
  };

  const filteredTasks = filterType === "all" ? tasks : tasks.filter((t) => t.type === filterType || t.status === filterType);

  const activeCount = tasks.filter((t) => t.status === "Active").length;
  const gradedCount = tasks.filter((t) => t.status === "Graded").length;
  const avgCompletion = tasks.length > 0
    ? Math.round((tasks.reduce((acc, t) => acc + (t.submittedCount / (t.totalCount || 1)), 0) / tasks.length) * 100)
    : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans animate-fade-in text-start pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-[#0F172A] tracking-tight">Tasks</h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
              {teacherSubject}
            </span>
          </div>
          <p className="text-xs text-[#475569] mt-0.5">
            Coursework, practice sets, and lab reports for assigned sections.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-[8px] bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold shadow-xs cursor-pointer min-h-[40px]"
        >
          <Plus className="w-4 h-4" />
          <span>Create task</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-[8px] border border-[#E2E8F0] shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-medium">Total tasks</span>
          <div className="text-2xl font-bold font-mono text-[#0F172A]">{tasks.length}</div>
          <p className="text-[11px] text-slate-500">Across Term 1</p>
        </div>

        <div className="bg-white p-4 rounded-[8px] border border-blue-100 bg-blue-50/20 shadow-xs space-y-1">
          <span className="text-xs text-blue-700 font-medium">Active tasks</span>
          <div className="text-2xl font-bold font-mono text-[#1D4ED8]">{activeCount}</div>
          <p className="text-[11px] text-blue-600">Open for students</p>
        </div>

        <div className="bg-white p-4 rounded-[8px] border border-emerald-100 bg-emerald-50/20 shadow-xs space-y-1">
          <span className="text-xs text-emerald-700 font-medium">Graded tasks</span>
          <div className="text-2xl font-bold font-mono text-emerald-700">{gradedCount}</div>
          <p className="text-[11px] text-emerald-600">Marks published</p>
        </div>

        <div className="bg-white p-4 rounded-[8px] border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-medium">Completion rate</span>
          <div className="text-2xl font-bold font-mono text-slate-800">{avgCompletion}%</div>
          <p className="text-[11px] text-slate-500">Assigned sections</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border border-[#E2E8F0] rounded-[8px] p-3 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => setFilterType("all")}
            className={`px-3 py-1.5 rounded-[6px] font-semibold transition-colors cursor-pointer ${
              filterType === "all" ? "bg-[#1D4ED8] text-white shadow-2xs" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            All tasks
          </button>
          <button
            type="button"
            onClick={() => setFilterType("Active")}
            className={`px-3 py-1.5 rounded-[6px] font-semibold transition-colors cursor-pointer ${
              filterType === "Active" ? "bg-[#1D4ED8] text-white shadow-2xs" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            Active
          </button>
          <button
            type="button"
            onClick={() => setFilterType("Graded")}
            className={`px-3 py-1.5 rounded-[6px] font-semibold transition-colors cursor-pointer ${
              filterType === "Graded" ? "bg-[#1D4ED8] text-white shadow-2xs" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            Graded
          </button>
        </div>

        <span className="text-[11px] text-slate-400 font-mono">
          6 standardized task types
        </span>
      </div>

      {/* Tasks Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-[8px] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Task</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Sections</th>
                <th className="py-3 px-4">Due date</th>
                <th className="py-3 px-4">Submissions</th>
                <th className="py-3 px-4">Points</th>
                <th className="py-3 px-4 text-end">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-[#0F172A]">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No tasks yet. Create task.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((t) => {
                const completionPercent = Math.round((t.submittedCount / t.totalCount) * 100);
                return (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-semibold text-[#0F172A]">
                      <div className="space-y-0.5">
                        <p>{t.title}</p>
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${
                          t.status === "Active" ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700"
                        }`}>
                          {t.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                        {t.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium">
                      {t.sections.join(", ")}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div className="flex items-center gap-1 font-mono text-[11px]">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{t.dueDate}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="font-mono text-slate-700">{t.submittedCount}/{t.totalCount}</span>
                          <span className="font-semibold text-slate-500">{completionPercent}%</span>
                        </div>
                        <div className="w-28 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${completionPercent >= 80 ? "bg-emerald-500" : "bg-blue-500"}`}
                            style={{ width: `${completionPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {t.maxMarks} pts
                    </td>
                    <td className="py-3 px-4 text-end">
                      <button
                        type="button"
                        onClick={() => showToast({ title: "Submissions", message: `Opening submissions for ${t.title}.`, type: "info" })}
                        className="px-3 py-1.5 rounded-[6px] border border-slate-200 hover:border-[#1D4ED8] hover:bg-[#EFF6FF] text-[#1D4ED8] font-semibold text-xs cursor-pointer inline-flex items-center gap-1"
                      >
                        <span>Review</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task Creation Modal with strict 6 allowed types */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 border border-[#E2E8F0] shadow-xl animate-fade-in text-start">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">Create Subject Task</h3>
                <p className="text-xs text-slate-500">Assign coursework to student sections in {teacherSubject}.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-800 block">Task Title</label>
                <input
                  type="text"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  placeholder="E.g., Unit 4 Photosynthesis Laboratory Report"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                  required
                />
              </div>

              {/* Exact 6 Allowed Formats */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-800 block">Task Format</label>
                <select
                  value={taskForm.task_type}
                  onChange={(e) => setTaskForm({ ...taskForm, task_type: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white font-medium focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                >
                  {ALLOWED_TASK_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-800 block">Due Date</label>
                  <input
                    type="date"
                    value={taskForm.due_date}
                    onChange={(e) => setTaskForm({ ...taskForm, due_date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-800 block">Max Marks</label>
                  <input
                    type="number"
                    min={5}
                    max={100}
                    value={taskForm.max_marks}
                    onChange={(e) => setTaskForm({ ...taskForm, max_marks: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white font-mono focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800 block">Instructions & Pedagogical Guidelines</label>
                <textarea
                  rows={3}
                  value={taskForm.instructions}
                  onChange={(e) => setTaskForm({ ...taskForm, instructions: e.target.value })}
                  placeholder="Specify submission guidelines, textbook sections to review, and calculation rubrics..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {creating ? "Assigning..." : "Assign Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
