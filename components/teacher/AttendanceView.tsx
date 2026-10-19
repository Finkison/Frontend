import React, { useState } from "react";
import useAuthStore from "../../store/authStore";
import { 
  Check, 
  X, 
  Clock, 
  Calendar, 
  LayoutGrid, 
  List, 
  Save, 
  Users, 
  AlertCircle,
  ChevronRight,
  Filter
} from "lucide-react";
import { useToast } from "../ui/Toast";

interface AttendanceRecord {
  id: string;
  name: string;
  rollNo: number;
  status: "present" | "absent" | "late" | "excused";
  streakDays: number;
  remarks?: string;
}

export default function TeacherAttendanceView(): React.ReactElement {
  const { showToast } = useToast();
  const { user } = useAuthStore();
  const teacherSubject = (user as any)?.subject || "Biology";

  const [selectedSection, setSelectedSection] = useState("12-A");
  const [selectedPeriod, setSelectedPeriod] = useState("Period 1 (08:30 – 09:15)");
  const [attendanceDate, setAttendanceDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [statusFilter, setStatusFilter] = useState<"all" | "present" | "late" | "absent">("all");
  const [saving, setSaving] = useState(false);

  // Student roster for attendance
  const [records, setRecords] = useState<AttendanceRecord[]>([
    { id: "s-1", name: "Natnael Girma", rollNo: 1, status: "present", streakDays: 14 },
    { id: "s-2", name: "Bethlehem Alemu", rollNo: 2, status: "present", streakDays: 22 },
    { id: "s-3", name: "Yonas Tadesse", rollNo: 3, status: "present", streakDays: 18 },
    { id: "s-4", name: "Selamawit Kebede", rollNo: 4, status: "late", streakDays: 2, remarks: "Arrived at 08:42" },
    { id: "s-5", name: "Kalkidan Desta", rollNo: 5, status: "present", streakDays: 10 },
    { id: "s-6", name: "Ephrem Bekele", rollNo: 6, status: "absent", streakDays: 0, remarks: "Unexcused" },
    { id: "s-7", name: "Hanan Mohammed", rollNo: 7, status: "present", streakDays: 28 },
    { id: "s-8", name: "Robel Fikru", rollNo: 8, status: "present", streakDays: 16 },
    { id: "s-9", name: "Dawit Haile", rollNo: 9, status: "absent", streakDays: 0, remarks: "Unexcused" },
    { id: "s-10", name: "Tsion Assefa", rollNo: 10, status: "present", streakDays: 12 },
    { id: "s-11", name: "Binyam Worku", rollNo: 11, status: "present", streakDays: 15 },
    { id: "s-12", name: "Meklit Seyoum", rollNo: 12, status: "present", streakDays: 24 }
  ]);

  const setStatus = (id: string, newStatus: "present" | "absent" | "late" | "excused") => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const handleMarkAllPresent = () => {
    setRecords((prev) => prev.map((r) => ({ ...r, status: "present" })));
    showToast({
      title: "All marked present",
      message: `All ${records.length} students in Section ${selectedSection} set to present.`,
      type: "success",
    });
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      showToast({
        title: "Attendance recorded",
        message: `Attendance for Section ${selectedSection} saved.`,
        type: "success",
      });
    }, 500);
  };

  // Metrics
  const total = records.length;
  const presentCount = records.filter((r) => r.status === "present").length;
  const lateCount = records.filter((r) => r.status === "late").length;
  const absentCount = records.filter((r) => r.status === "absent").length;

  const filteredRecords = statusFilter === "all" 
    ? records 
    : records.filter((r) => r.status === statusFilter);

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans animate-fade-in text-start pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-[#0F172A] tracking-tight">Attendance</h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
              {teacherSubject}
            </span>
          </div>
          <p className="text-xs text-[#475569] mt-0.5">
            Attendance logging and period verification for assigned sections.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* 1-Click Master Action */}
          <button
            type="button"
            onClick={handleMarkAllPresent}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[8px] bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold cursor-pointer min-h-[40px] shadow-xs"
          >
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Mark all present</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-[8px] bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold shadow-xs cursor-pointer min-h-[40px] disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving..." : "Save attendance"}</span>
          </button>
        </div>
      </div>

      {/* Telemetry Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-[8px] border border-[#E2E8F0] shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-medium">Total enrolled</span>
          <div className="text-2xl font-bold font-mono text-[#0F172A]">{total}</div>
          <p className="text-[11px] text-slate-500">Section {selectedSection}</p>
        </div>

        <div className="bg-white p-4 rounded-[8px] border border-emerald-100 bg-emerald-50/20 shadow-xs space-y-1">
          <span className="text-xs text-emerald-700 font-medium">Present</span>
          <div className="text-2xl font-bold font-mono text-emerald-700">{presentCount}</div>
          <p className="text-[11px] text-emerald-600">{Math.round((presentCount / total) * 100)}% on time</p>
        </div>

        <div className="bg-white p-4 rounded-[8px] border border-amber-100 bg-amber-50/20 shadow-xs space-y-1">
          <span className="text-xs text-amber-700 font-medium">Late</span>
          <div className="text-2xl font-bold font-mono text-amber-700">{lateCount}</div>
          <p className="text-[11px] text-amber-600">Arrived after bell</p>
        </div>

        <div className="bg-white p-4 rounded-[8px] border border-rose-100 bg-rose-50/20 shadow-xs space-y-1">
          <span className="text-xs text-rose-700 font-medium">Absent</span>
          <div className="text-2xl font-bold font-mono text-rose-700">{absentCount}</div>
          <p className="text-[11px] text-rose-600">Unexcused absence</p>
        </div>
      </div>

      {/* Control & Filter Bar */}
      <div className="bg-white border border-[#E2E8F0] rounded-[8px] p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-700">Section:</span>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-200 rounded-[6px] bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
            >
              <option value="12-A">Section 12-A</option>
              <option value="12-B">Section 12-B</option>
              <option value="11-A">Section 11-A</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-700">Period:</span>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-200 rounded-[6px] bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
            >
              <option value="Period 1 (08:30 – 09:15)">Period 1 (08:30 – 09:15)</option>
              <option value="Period 3 (10:15 – 11:00)">Period 3 (10:15 – 11:00)</option>
              <option value="Period 5 (13:30 – 14:15)">Period 5 (13:30 – 14:15)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-700">Date:</span>
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-200 rounded-[6px] bg-white text-xs"
            />
          </div>
        </div>

        {/* View & Status Toggle */}
        <div className="flex items-center gap-3">
          {/* Status Filter Pills */}
          <div className="inline-flex rounded-[6px] border border-slate-200 p-0.5 bg-slate-50 text-xs">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`px-2.5 py-1 rounded-[4px] font-medium transition-colors cursor-pointer ${
                statusFilter === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              All ({total})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("absent")}
              className={`px-2.5 py-1 rounded-[4px] font-medium transition-colors cursor-pointer ${
                statusFilter === "absent" ? "bg-rose-100 text-rose-800 font-semibold" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Absent ({absentCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("late")}
              className={`px-2.5 py-1 rounded-[4px] font-medium transition-colors cursor-pointer ${
                statusFilter === "late" ? "bg-amber-100 text-amber-800 font-semibold" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Late ({lateCount})
            </button>
          </div>

          {/* View Mode Toggle: List vs Seating Grid */}
          <div className="inline-flex rounded-[6px] border border-slate-200 p-0.5 bg-slate-50">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-[4px] transition-colors cursor-pointer ${
                viewMode === "list" ? "bg-white text-[#1D4ED8] shadow-xs" : "text-slate-400"
              }`}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-[4px] transition-colors cursor-pointer ${
                viewMode === "grid" ? "bg-white text-[#1D4ED8] shadow-xs" : "text-slate-400"
              }`}
              title="Seating grid"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Attendance Interface: List View or Seating Grid */}
      {viewMode === "list" ? (
        <div className="bg-white border border-[#E2E8F0] rounded-[8px] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Streak</th>
                  <th className="py-3 px-4 text-end">Mark status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] text-[#0F172A]">
                {filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-400 text-center font-semibold">
                      {String(r.rollNo).padStart(2, "0")}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#0F172A]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center">
                          {r.name.charAt(0)}
                        </div>
                        <span>{r.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                          r.status === "present"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : r.status === "late"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        {r.status === "present" && <Check className="w-3 h-3 text-emerald-600" />}
                        {r.status === "late" && <Clock className="w-3 h-3 text-amber-600" />}
                        {r.status === "absent" && <X className="w-3 h-3 text-rose-600" />}
                        <span className="capitalize">{r.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono">
                      {r.streakDays > 0 ? `${r.streakDays} days continuous` : "Broken streak"}
                    </td>
                    <td className="py-3 px-4 text-end">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setStatus(r.id, "present")}
                          className={`px-2.5 py-1 rounded-[6px] text-xs font-semibold cursor-pointer transition-colors ${
                            r.status === "present"
                              ? "bg-emerald-600 text-white shadow-2xs"
                              : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          Present
                        </button>
                        <button
                          type="button"
                          onClick={() => setStatus(r.id, "late")}
                          className={`px-2.5 py-1 rounded-[6px] text-xs font-semibold cursor-pointer transition-colors ${
                            r.status === "late"
                              ? "bg-amber-500 text-white shadow-2xs"
                              : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          Late
                        </button>
                        <button
                          type="button"
                          onClick={() => setStatus(r.id, "absent")}
                          className={`px-2.5 py-1 rounded-[6px] text-xs font-semibold cursor-pointer transition-colors ${
                            r.status === "absent"
                              ? "bg-rose-600 text-white shadow-2xs"
                              : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Seating Grid View */
        <div className="bg-white border border-[#E2E8F0] rounded-[8px] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 border-b pb-3">
            <span>Classroom front</span>
            <span className="font-semibold text-[#1D4ED8]">Click student to cycle status</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {records.map((r) => (
              <div
                key={r.id}
                onClick={() => {
                  const nextStatus = r.status === "present" ? "absent" : r.status === "absent" ? "late" : "present";
                  setStatus(r.id, nextStatus);
                }}
                className={`p-4 rounded-[8px] border-2 transition-all cursor-pointer text-start space-y-2 select-none shadow-2xs hover:scale-101 ${
                  r.status === "present"
                    ? "bg-emerald-50/50 border-emerald-300"
                    : r.status === "late"
                    ? "bg-amber-50/50 border-amber-300"
                    : "bg-rose-50/50 border-rose-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-400">Desk {r.rollNo}</span>
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      r.status === "present" ? "bg-emerald-500" : r.status === "late" ? "bg-amber-500" : "bg-rose-500"
                    }`}
                  />
                </div>
                <div>
                  <p className="font-bold text-xs text-[#0F172A] truncate">{r.name}</p>
                  <p className="text-[11px] capitalize font-semibold mt-0.5" style={{
                    color: r.status === "present" ? "#047857" : r.status === "late" ? "#B45309" : "#BE123C"
                  }}>
                    {r.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
