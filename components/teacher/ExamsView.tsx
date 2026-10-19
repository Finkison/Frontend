import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { 
  FileCheck, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  Check, 
  Eye, 
  BarChart2, 
  Download, 
  Copy, 
  Calendar, 
  AlertCircle, 
  X, 
  Sparkles,
  Layers,
  ArrowUpRight
} from "lucide-react";
import { useToast } from "../ui/Toast";

interface ExamItem {
  id: string;
  title: string;
  unit: string;
  sections: string[];
  questionsCount: number;
  durationMins: number;
  totalMarks: number;
  status: "Published" | "Pending Review" | "Draft" | "Archived";
  classAverage: number | null;
  highestScore: number | null;
  lowestScore: number | null;
  submissionCount: number;
  totalEnrolled: number;
  scheduledDate: string;
  scoreBuckets: { label: string; count: number; percentage: number; color: string }[];
  toughQuestions: { number: number; text: string; correctRate: number }[];
}

export default function TeacherExamsView(): React.ReactElement {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuthStore();
  const teacherSubject = (user as any)?.subject || "Biology";

  const [activeTab, setActiveTab] = useState<"all" | "published" | "pending" | "draft">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSectionFilter, setSelectedSectionFilter] = useState("all");
  const [selectedExamForAnalytics, setSelectedExamForAnalytics] = useState<ExamItem | null>(null);

  const [exams, setExams] = useState<ExamItem[]>([]);

  const handleDuplicateExam = (exam: ExamItem) => {
    const duplicated: ExamItem = {
      ...exam,
      id: `ex-${Date.now()}`,
      title: `${exam.title} - Copy`,
      status: "Draft",
      classAverage: null,
      highestScore: null,
      lowestScore: null,
      submissionCount: 0,
      scheduledDate: "TBD",
      scoreBuckets: [],
      toughQuestions: []
    };
    setExams([duplicated, ...exams]);
    showToast({
      title: "Exam duplicated",
      message: `Created duplicate draft "${duplicated.title}".`,
      type: "success"
    });
  };

  const handlePublishExam = (id: string) => {
    setExams(exams.map((ex) => (ex.id === id ? { ...ex, status: "Published" as const } : ex)));
    showToast({
      title: "Exam published",
      message: "The assessment is now active and scheduled for assigned sections.",
      type: "success"
    });
  };

  const filteredExams = exams.filter((ex) => {
    if (activeTab === "published" && ex.status !== "Published") return false;
    if (activeTab === "pending" && ex.status !== "Pending Review") return false;
    if (activeTab === "draft" && ex.status !== "Draft") return false;
    if (selectedSectionFilter !== "all" && !ex.sections.includes(selectedSectionFilter)) return false;
    if (searchQuery.trim() && !ex.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const totalExams = exams.length;
  const publishedCount = exams.filter((e) => e.status === "Published").length;
  const pendingCount = exams.filter((e) => e.status === "Pending Review").length;
  const gradedExams = exams.filter((e) => e.classAverage !== null);
  const overallAvg = gradedExams.length > 0
    ? (gradedExams.reduce((acc, curr) => acc + (curr.classAverage || 0), 0) / gradedExams.length).toFixed(1)
    : "—";

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-[#0F172A] tracking-tight">Exams</h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
              {teacherSubject}
            </span>
          </div>
          <p className="text-xs text-[#475569] mt-0.5">
            Subject mocks, diagnostics, item discrimination, and published exams.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate("/teacher/question-bank")}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-[8px] border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-slate-700 text-xs font-semibold shadow-xs cursor-pointer min-h-[40px]"
          >
            <Layers className="w-4 h-4 text-slate-500" />
            <span>Question bank</span>
          </button>
          <button
            type="button"
            onClick={() => navigate("/teacher/ai-assistant")}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-[8px] bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold shadow-xs cursor-pointer min-h-[40px]"
          >
            <Plus className="w-4 h-4" />
            <span>Generate exam</span>
          </button>
        </div>
      </div>

      {/* Telemetry Metric Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-[#E2E8F0] rounded-[8px] shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total exams</div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#0F172A] font-mono">{totalExams}</span>
            <span className="text-xs text-slate-500 font-medium">{teacherSubject} curriculum</span>
          </div>
        </div>
        <div className="p-4 bg-white border border-[#E2E8F0] rounded-[8px] shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Published & active</div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-700 font-mono">{publishedCount}</span>
            <span className="text-xs text-emerald-600 font-medium">Live on portals</span>
          </div>
        </div>
        <div className="p-4 bg-white border border-[#E2E8F0] rounded-[8px] shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Pending review</div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-amber-700 font-mono">{pendingCount}</span>
            <span className="text-xs text-amber-600 font-medium">Awaiting approval</span>
          </div>
        </div>
        <div className="p-4 bg-white border border-[#E2E8F0] rounded-[8px] shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Class average</div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#1D4ED8] font-mono">{overallAvg}%</span>
            <span className="text-xs text-blue-600 font-medium">Across all sections</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 border border-[#E2E8F0] rounded-[8px] shadow-xs text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(["all", "published", "pending", "draft"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-[6px] font-semibold transition-colors cursor-pointer capitalize whitespace-nowrap ${
                activeTab === tab
                  ? "bg-[#1D4ED8] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab === "all" ? "All exams" : tab === "pending" ? "Pending review" : tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search exam title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-[#E2E8F0] rounded-[6px] text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#1D4ED8]"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 shrink-0 font-medium">Section:</span>
            <select
              value={selectedSectionFilter}
              onChange={(e) => setSelectedSectionFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-[#E2E8F0] rounded-[6px] bg-white text-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#1D4ED8]"
            >
              <option value="all">All sections</option>
              <option value="12-A">Section 12-A</option>
              <option value="12-B">Section 12-B</option>
            </select>
          </div>
        </div>
      </div>

      {/* Exams Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-[8px] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Exam title & unit</th>
                <th className="py-3 px-4">Target sections</th>
                <th className="py-3 px-4">Items / Time</th>
                <th className="py-3 px-4">Submissions</th>
                <th className="py-3 px-4">Class average</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-[#0F172A]">
              {filteredExams.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                    No exams found matching your current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredExams.map((ex) => (
                  <tr key={ex.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#0F172A]">{ex.title}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>{ex.unit}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {ex.scheduledDate}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {ex.sections.map((sec) => (
                          <span
                            key={sec}
                            className="px-2 py-0.5 rounded-[4px] bg-[#EFF6FF] text-[#1D4ED8] font-semibold text-[10px] border border-[#BFDBFE]"
                          >
                            {sec}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <div>{ex.questionsCount} items • {ex.totalMarks} pts</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {ex.durationMins} mins
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {ex.status === "Published" ? (
                        <div>
                          <span className="font-mono font-semibold text-[#0F172A]">
                            {ex.submissionCount}/{ex.totalEnrolled}
                          </span>
                          <div className="w-20 bg-slate-100 h-1 rounded-full mt-1 overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full rounded-full"
                              style={{ width: `${(ex.submissionCount / ex.totalEnrolled) * 100}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Not started</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {ex.classAverage !== null ? (
                        <div className="flex items-center gap-1.5">
                          <span className={`font-mono font-bold text-xs ${
                            ex.classAverage >= 75 ? "text-emerald-700" : ex.classAverage >= 50 ? "text-blue-700" : "text-rose-700"
                          }`}>
                            {ex.classAverage}%
                          </span>
                          <span className="text-[10px] text-slate-500">
                            • High: {ex.highestScore}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          ex.status === "Published"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : ex.status === "Pending Review"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : ex.status === "Draft"
                            ? "bg-slate-100 text-slate-700 border-slate-200"
                            : "bg-slate-50 text-slate-500 border-slate-200"
                        }`}
                      >
                        {ex.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {ex.classAverage !== null && (
                          <button
                            type="button"
                            onClick={() => setSelectedExamForAnalytics(ex)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[6px] border border-[#E2E8F0] hover:bg-[#EFF6FF] text-[#1D4ED8] font-semibold text-xs cursor-pointer"
                          >
                            <BarChart2 className="w-3.5 h-3.5" />
                            <span>Analytics</span>
                          </button>
                        )}
                        {ex.status === "Pending Review" && (
                          <button
                            type="button"
                            onClick={() => handlePublishExam(ex.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[6px] bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-semibold text-xs cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Publish</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDuplicateExam(ex)}
                          title="Duplicate exam template"
                          className="p-1.5 rounded-[6px] border border-[#E2E8F0] hover:bg-slate-50 text-slate-600 cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
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

      {/* Analytics & Item Discrimination Modal */}
      {selectedExamForAnalytics && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-[8px] shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold text-[#0F172A]">{selectedExamForAnalytics.title}</h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Graded & Finalized
                  </span>
                </div>
                <p className="text-xs text-[#475569] mt-0.5">
                  Performance distribution, section comparisons, and challenging questions diagnostic.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedExamForAnalytics(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-5 text-xs">
              {/* Telemetry Row */}
              <div className="grid grid-cols-4 gap-3">
                <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[6px]">
                  <div className="text-[11px] text-slate-500">Mean score</div>
                  <div className="text-xl font-bold text-[#1D4ED8] mt-0.5 font-mono">
                    {selectedExamForAnalytics.classAverage}%
                  </div>
                </div>
                <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[6px]">
                  <div className="text-[11px] text-slate-500">Highest score</div>
                  <div className="text-xl font-bold text-emerald-700 mt-0.5 font-mono">
                    {selectedExamForAnalytics.highestScore}%
                  </div>
                </div>
                <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[6px]">
                  <div className="text-[11px] text-slate-500">Lowest score</div>
                  <div className="text-xl font-bold text-rose-700 mt-0.5 font-mono">
                    {selectedExamForAnalytics.lowestScore}%
                  </div>
                </div>
                <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[6px]">
                  <div className="text-[11px] text-slate-500">Submissions</div>
                  <div className="text-xl font-bold text-[#0F172A] mt-0.5 font-mono">
                    {selectedExamForAnalytics.submissionCount}/{selectedExamForAnalytics.totalEnrolled}
                  </div>
                </div>
              </div>

              {/* Score Distribution Breakdown */}
              <div>
                <h3 className="font-semibold text-[#0F172A] mb-2.5">Score distribution</h3>
                <div className="space-y-2 border border-[#E2E8F0] rounded-[6px] p-4 bg-[#F8FAFC]">
                  {selectedExamForAnalytics.scoreBuckets.map((bucket) => (
                    <div key={bucket.label} className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="font-medium text-[#0F172A]">{bucket.label}</span>
                        <span className="font-mono text-slate-600 font-semibold">
                          {bucket.count} students ({bucket.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${bucket.color}`}
                          style={{ width: `${bucket.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Toughest Questions Item Discrimination */}
              {selectedExamForAnalytics.toughQuestions.length > 0 && (
                <div>
                  <h3 className="font-semibold text-[#0F172A] mb-2">Challenging questions</h3>
                  <div className="space-y-2">
                    {selectedExamForAnalytics.toughQuestions.map((q) => (
                      <div
                        key={q.number}
                        className="p-3 border border-amber-200 bg-amber-50/50 rounded-[6px] flex items-center justify-between gap-4"
                      >
                        <div className="space-y-0.5">
                          <div className="font-semibold text-[#0F172A]">
                            Question {q.number}: {q.text}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Concept review recommended.
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-100 text-rose-700">
                            {q.correctRate}% accuracy
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  showToast({
                    title: "Report exported",
                    message: "Downloaded comprehensive diagnostic report for examination.",
                    type: "success"
                  });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] border border-[#E2E8F0] bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export report</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedExamForAnalytics(null)}
                className="px-3.5 py-1.5 rounded-[6px] border border-[#E2E8F0] bg-white hover:bg-slate-50 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
