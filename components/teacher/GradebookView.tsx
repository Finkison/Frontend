import React, { useState } from "react";
import useAuthStore from "../../store/authStore";
import { saveGradeEntries } from "../../services/schoolService";
import { 
  FileSpreadsheet, 
  Download, 
  Save, 
  Search, 
  Filter, 
  AlertTriangle, 
  Check, 
  ChevronRight,
  TrendingUp,
  Award,
  Layers,
  Sparkles
} from "lucide-react";
import { useToast } from "../ui/Toast";

interface GradeRow {
  student_id: string;
  rollNo: number;
  name: string;
  quiz_score: number;       // 15%
  lab_score: number;        // 20%
  midterm_score: number;    // 25%
  final_exam_score: number; // 40%
  composite_score: number;  // 100%
  is_synced: boolean;
}

export default function TeacherGradebookView(): React.ReactElement {
  const { showToast } = useToast();
  const { user } = useAuthStore();
  const teacherSubject = (user as any)?.subject || "Biology";

  const [selectedSection, setSelectedSection] = useState("12-A");
  const [selectedTerm, setSelectedTerm] = useState("Term 1: Continuous assessment");
  const [searchQuery, setSearchQuery] = useState("");
  const [saving, setSaving] = useState(false);

  // Roster continuous assessment data
  const [gradeRows, setGradeRows] = useState<GradeRow[]>([]);

  const updateStudentScore = (
    id: string, 
    field: "quiz_score" | "lab_score" | "midterm_score" | "final_exam_score", 
    value: number
  ) => {
    setGradeRows((prev) =>
      prev.map((row) => {
        if (row.student_id !== id) return row;
        const updated = { ...row, [field]: value };
        // Dynamic continuous weighted recalculation
        const composite = Math.round(
          updated.quiz_score + 
          updated.lab_score + 
          updated.midterm_score + 
          updated.final_exam_score
        );
        return { ...updated, composite_score: composite, is_synced: false };
      })
    );
  };

  const handleFillEmptyZeros = () => {
    setGradeRows((prev) =>
      prev.map((r) => ({
        ...r,
        quiz_score: r.quiz_score || 0,
        lab_score: r.lab_score || 0,
        midterm_score: r.midterm_score || 0,
        final_exam_score: r.final_exam_score || 0,
        is_synced: false,
      }))
    );
    showToast({
      title: "Scores adjusted",
      message: "Empty grade entries populated with 0.",
      type: "info",
    });
  };

  const handleExportCSV = () => {
    const headers = ["Roll", "Student Name", "Quiz 15%", "Lab 20%", "Midterm 25%", "Final 40%", "Total Score"];
    const rows = gradeRows.map((r) => [
      r.rollNo,
      `"${r.name}"`,
      r.quiz_score,
      r.lab_score,
      r.midterm_score,
      r.final_exam_score,
      r.composite_score,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Gradebook_${teacherSubject}_${selectedSection}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast({
      title: "Transcript exported",
      message: `Gradebook downloaded for Section ${selectedSection}.`,
      type: "success",
    });
  };

  const handleSaveGrades = async () => {
    setSaving(true);
    try {
      const entries = gradeRows.map((r) => ({
        student_id: r.student_id,
        name: r.name,
        score: r.composite_score,
      }));
      await saveGradeEntries(entries);
      showToast({
        title: "Grades saved",
        message: "Continuous assessment records saved.",
        type: "success",
      });
    } catch (err: any) {
      showToast({
        title: "Save Failed",
        message: err?.response?.data?.message || err?.message || "Failed to save grades. Please try again.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  // Telemetry Calculations
  const totalStudents = gradeRows.length;
  const averageScore = totalStudents > 0
    ? Math.round(gradeRows.reduce((acc, r) => acc + r.composite_score, 0) / totalStudents)
    : 0;
  const passingStudents = gradeRows.filter((r) => r.composite_score >= 50).length;
  const passingRate = totalStudents > 0
    ? Math.round((passingStudents / totalStudents) * 100)
    : 0;
  const distinctionStudents = gradeRows.filter((r) => r.composite_score >= 75).length;
  const filteredRows = gradeRows.filter((r) => r.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans animate-fade-in text-start pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-[#0F172A] tracking-tight">Gradebook</h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
              {teacherSubject}
            </span>
          </div>
          <p className="text-xs text-[#475569] mt-0.5">
            Continuous assessment ledger, weighted evaluations, and term records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[8px] border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer min-h-[40px] shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={handleSaveGrades}
            disabled={saving}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-[8px] bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold shadow-xs cursor-pointer min-h-[40px] disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving..." : "Save grades"}</span>
          </button>
        </div>
      </div>

      {/* Summary Telemetry */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-[8px] border border-[#E2E8F0] shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-medium">Class average</span>
          <div className="text-2xl font-bold font-mono text-[#0F172A]">{averageScore}%</div>
          <p className="text-[11px] text-slate-500 font-medium">Section {selectedSection}</p>
        </div>

        <div className="bg-white p-4 rounded-[8px] border border-[#E2E8F0] shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-medium">Passing rate</span>
          <div className="text-2xl font-bold font-mono text-emerald-700">{passingRate}%</div>
          <p className="text-[11px] text-slate-500">{passingStudents} of {totalStudents} passing</p>
        </div>

        <div className="bg-white p-4 rounded-[8px] border border-[#E2E8F0] shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-medium">Distinction</span>
          <div className="text-2xl font-bold font-mono text-blue-700">{distinctionStudents}</div>
          <p className="text-[11px] text-slate-500">&ge; 75% standing</p>
        </div>

        <div className="bg-white p-4 rounded-[8px] border border-rose-100 bg-rose-50/20 shadow-xs space-y-1">
          <span className="text-xs text-rose-700 font-medium">At risk</span>
          <div className="text-2xl font-bold font-mono text-rose-700">{totalStudents - passingStudents}</div>
          <p className="text-[11px] text-rose-600 font-medium">&lt; 50% passing threshold</p>
        </div>
      </div>

      {/* Control Strip */}
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
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-700">Term:</span>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-200 rounded-[6px] bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
            >
              <option value="Term 1: Continuous assessment">Term 1: Continuous assessment</option>
              <option value="Term 2: Mid-year diagnostic">Term 2: Mid-year diagnostic</option>
              <option value="National EUEE Mock Exam">National mock exam</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleFillEmptyZeros}
            className="text-xs text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded border border-slate-200 bg-slate-50 cursor-pointer"
          >
            Fill empty with 0
          </button>
          <span className="text-[11px] text-slate-400">
            Weights: 15% Quiz, 20% Lab, 25% Midterm, 40% Final
          </span>
        </div>
      </div>

      {/* Spreadsheet Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-[8px] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4 text-center">Quiz 15%</th>
                <th className="py-3 px-4 text-center">Lab 20%</th>
                <th className="py-3 px-4 text-center">Midterm 25%</th>
                <th className="py-3 px-4 text-center">Final 40%</th>
                <th className="py-3 px-4 text-center font-bold text-[#0F172A]">Total</th>
                <th className="py-3 px-4 text-end">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-[#0F172A]">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No student grade records found for this section.
                  </td>
                </tr>
              ) : (
                filteredRows.map((r) => {
                  const isAtRisk = r.composite_score < 50;
                const isDistinction = r.composite_score >= 75;

                return (
                  <tr key={r.student_id} className={`hover:bg-slate-50/70 transition-colors ${
                    isAtRisk ? "bg-rose-50/30" : ""
                  }`}>
                    <td className="py-3 px-4 font-mono text-slate-400 text-center font-semibold">
                      {String(r.rollNo).padStart(2, "0")}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#0F172A]">
                      {r.name}
                    </td>

                    {/* Quiz 1 Input */}
                    <td className="py-2.5 px-3 text-center">
                      <input
                        type="number"
                        min={0}
                        max={15}
                        value={r.quiz_score}
                        onChange={(e) => updateStudentScore(r.student_id, "quiz_score", Number(e.target.value))}
                        className="w-14 text-center py-1 border border-slate-200 rounded-[4px] font-mono text-xs focus:ring-1 focus:ring-[#1D4ED8]"
                      />
                    </td>

                    {/* Lab Work Input */}
                    <td className="py-2.5 px-3 text-center">
                      <input
                        type="number"
                        min={0}
                        max={20}
                        value={r.lab_score}
                        onChange={(e) => updateStudentScore(r.student_id, "lab_score", Number(e.target.value))}
                        className="w-14 text-center py-1 border border-slate-200 rounded-[4px] font-mono text-xs focus:ring-1 focus:ring-[#1D4ED8]"
                      />
                    </td>

                    {/* Midterm Input */}
                    <td className="py-2.5 px-3 text-center">
                      <input
                        type="number"
                        min={0}
                        max={25}
                        value={r.midterm_score}
                        onChange={(e) => updateStudentScore(r.student_id, "midterm_score", Number(e.target.value))}
                        className="w-14 text-center py-1 border border-slate-200 rounded-[4px] font-mono text-xs focus:ring-1 focus:ring-[#1D4ED8]"
                      />
                    </td>

                    {/* Final Exam Input */}
                    <td className="py-2.5 px-3 text-center">
                      <input
                        type="number"
                        min={0}
                        max={40}
                        value={r.final_exam_score}
                        onChange={(e) => updateStudentScore(r.student_id, "final_exam_score", Number(e.target.value))}
                        className="w-14 text-center py-1 border border-slate-200 rounded-[4px] font-mono text-xs focus:ring-1 focus:ring-[#1D4ED8]"
                      />
                    </td>

                    {/* Calculated Composite Score */}
                    <td className="py-3 px-4 text-center">
                      <span className={`font-mono font-bold text-xs ${
                        isAtRisk ? "text-rose-700" : isDistinction ? "text-[#1D4ED8]" : "text-[#0F172A]"
                      }`}>
                        {r.composite_score}%
                      </span>
                    </td>

                    {/* Standing Pill */}
                    <td className="py-3 px-4 text-end">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        isDistinction
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : isAtRisk
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}>
                        {isDistinction ? "Distinction" : isAtRisk ? "At risk" : "Passing"}
                      </span>
                    </td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
