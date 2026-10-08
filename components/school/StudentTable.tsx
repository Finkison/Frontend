import React, { useEffect, useState } from "react";
import { 
  getSchoolStudents, 
  bulkUploadStudents, 
  getStudentDossier,
  transferStudent
} from "../../services/schoolService";
import { 
  Flame, 
  Search, 
  Filter, 
  GraduationCap, 
  TrendingUp, 
  ChevronRight,
  ShieldCheck,
  UserPlus,
  FileSpreadsheet,
  AlertTriangle,
  Download,
  Copy,
  CheckCircle2,
  X,
  Target,
  Award,
  BookOpen,
  Clock,
  Sparkles,
  Loader2,
  FileCheck2,
  Printer,
  ArrowRightLeft,
  FileText
} from "lucide-react";
import { useToast } from "../shared/Toast";
import TerminalReportCardModal from "./TerminalReportCardModal";

export default function StudentTable(): React.ReactElement {
  const { showToast } = useToast();
  const [students, setStudents] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [atRiskOnly, setAtRiskOnly] = useState(false);
  const [assignedOnly, setAssignedOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  // Bulk Upload Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [csvInput, setCsvInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any | null>(null);

  // Candidate Diagnostic Dossier State
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [dossier, setDossier] = useState<any | null>(null);
  const [loadingDossier, setLoadingDossier] = useState(false);

  // Credential Slips Modal State
  const [showSlipsModal, setShowSlipsModal] = useState(false);

  // Terminal Report Card State
  const [reportCardStudentId, setReportCardStudentId] = useState<string | null>(null);

  // Section Transfer Modal State
  const [transferTarget, setTransferTarget] = useState<any | null>(null);
  const [newGrade, setNewGrade] = useState("Grade 12");
  const [newSection, setNewSection] = useState("B");
  const [transferring, setTransferring] = useState(false);

  const handleOpenDossier = async (studentId: string) => {
    setSelectedStudentId(studentId);
    setLoadingDossier(true);
    try {
      const res = await getStudentDossier(studentId);
      setDossier(res.data);
    } catch (err) {
      console.error("Failed to load candidate dossier", err);
      setDossier(null);
    } finally {
      setLoadingDossier(false);
    }
  };

  const fetchStudents = (onlyAssigned = assignedOnly) => {
    setLoading(true);
    getSchoolStudents(onlyAssigned)
      .then((r) => setStudents(r.data || []))
      .catch(() => setStudents([]))
      .finally(() => setLoading(false));
  };

  const toggleAssignedOnly = () => {
    const nextVal = !assignedOnly;
    setAssignedOnly(nextVal);
    fetchStudents(nextVal);
  };

  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferTarget) return;
    setTransferring(true);
    try {
      const res = await transferStudent(transferTarget.id, {
        target_grade: newGrade,
        target_section: newSection
      });
      showToast(res.data?.message || "Candidate transferred successfully.");
      setStudents((prev) =>
        prev.map((s) =>
          s.id === transferTarget.id
            ? { ...s, grade: newGrade, section: newSection }
            : s
        )
      );
      setTransferTarget(null);
    } catch (err: any) {
      showToast(err.response?.data?.error || "Transfer failed. Please check inputs.");
    } finally {
      setTransferring(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filtered = students.filter((s) => {
    const studentName = s.user__full_name || s.name || "Student Candidate";
    const matchesSearch = studentName.toLowerCase().includes(search.toLowerCase()) || 
                          (s.id && s.id.toLowerCase().includes(search.toLowerCase())) ||
                          (s.phone && s.phone.includes(search));
    const gradeNum = typeof s.grade === "number" ? s.grade : parseInt(String(s.grade).replace(/\D/g, "") || "12");
    const matchesGrade = gradeFilter === "all" || gradeNum === Number(gradeFilter);
    const matchesAtRisk = !atRiskOnly || (s.predicted_score ?? s.predictedScore ?? 450) < 350;
    return matchesSearch && matchesGrade && matchesAtRisk;
  });

  const handleDownloadTemplate = () => {
    const template = "Full Name,Phone,Grade,Section,Stream,Email,Target Score\n" +
      "Abebe Bikila,+251911234567,Grade 12,A,Natural Science,abebe@menelik.edu,540\n" +
      "Chaltu Tolessa,+251912345678,Grade 12,A,Natural Science,chaltu@menelik.edu,580\n" +
      "Yohannes Haile,+251913456789,Grade 11,B,Natural Science,yohannes@menelik.edu,510\n";
    const blob = new Blob([template], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "finkison_student_upload_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleBulkUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvInput.trim()) {
      showToast({ type: "error", title: "Empty CSV", message: "Please enter or paste candidate CSV data." });
      return;
    }

    setUploading(true);
    try {
      const res = await bulkUploadStudents({ csv_text: csvInput.trim() });
      setUploadResult(res.data);
      showToast({
        type: "success",
        title: "Roster Ingested",
        message: res.data.message || "Candidate accounts created."
      });
      fetchStudents();
    } catch (err: any) {
      const errData = err?.response?.data;
      if (errData?.error === "license_seat_limit_exceeded") {
        showToast({
          type: "error",
          title: "Seat Quota Exceeded",
          message: errData.message || "Bulk upload exceeds school licensed capacity. Please expand seat capacity in School Settings."
        });
      } else {
        showToast({
          type: "error",
          title: "Ingestion Failed",
          message: errData?.message || errData?.error || err?.message || "Failed to parse and onboard students."
        });
      }
    } finally {
      setUploading(false);
    }
  };

  const atRiskCount = students.filter(s => (s.predicted_score ?? s.predictedScore ?? 450) < 350).length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-700 text-xs font-semibold border border-purple-500/20 mb-2">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>School Enrollment Roster</span>
            </div>
            <h1 className="font-serif text-2xl font-bold text-slate-900">
              Student Candidate Directory
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Search, filter, inspect candidate performance, and manage institutional enrollments.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowSlipsModal(true)}
              className="px-4 py-2.5 rounded-xl font-bold bg-slate-900 hover:bg-slate-800 text-white text-xs flex items-center gap-1.5 shadow transition-colors cursor-pointer shrink-0"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Export Credential Slips</span>
            </button>
            <button
              onClick={() => {
                setUploadResult(null);
                setCsvInput("");
                setShowUploadModal(true);
              }}
              className="px-4 py-2.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs flex items-center gap-1.5 shadow transition-colors cursor-pointer shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>Bulk Onboard Candidates</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              placeholder="Search candidate by name, phone or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-amber-500 outline-none"
            />
          </div>

          <div className="sm:col-span-3 relative">
            <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              aria-label="Filter by Grade"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-amber-500 outline-none bg-white cursor-pointer"
            >
              <option value="all">All Preparatory Grades</option>
              <option value="9">Grade 9 Secondary</option>
              <option value="10">Grade 10 Secondary</option>
              <option value="11">Grade 11 Preparatory</option>
              <option value="12">Grade 12 Entrance Class</option>
            </select>
          </div>

          <div className="sm:col-span-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAtRiskOnly(!atRiskOnly)}
              className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                atRiskOnly 
                  ? "bg-rose-50 border-rose-300 text-rose-700 shadow-2xs" 
                  : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
              }`}
            >
              <AlertTriangle className={`w-3.5 h-3.5 ${atRiskOnly ? "text-rose-600" : "text-amber-500"}`} />
              <span>At-Risk ({atRiskCount})</span>
            </button>

            <button
              type="button"
              onClick={toggleAssignedOnly}
              className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                assignedOnly 
                  ? "bg-purple-900 border-purple-900 text-purple-100 shadow-2xs" 
                  : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
              }`}
              title="Filter to candidates in your assigned classrooms only"
            >
              <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
              <span>{assignedOnly ? "My Classes" : "All Cohorts"}</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Loading student directory...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No students found matching your search filter.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Grade & Section</th>
                  <th className="py-3 px-4">Target Goal</th>
                  <th className="py-3 px-4">Predicted Score</th>
                  <th className="py-3 px-4">Status / Alert</th>
                  <th className="py-3 px-4">Study Streak</th>
                  <th className="py-3 px-4 text-right">Academic Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((s) => {
                  const name = s.user__full_name || s.name || "Student Candidate";
                  const predScore = s.predicted_score ?? s.predictedScore ?? 480;
                  const targetScore = s.target_score ?? 540;
                  const streak = s.streak_days ?? s.streakDays ?? 12;
                  const isAtRisk = predScore < 350;

                  return (
                    <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                            isAtRisk ? "bg-rose-100 text-rose-700 border border-rose-200" : "bg-slate-900 text-amber-400"
                          }`}>
                            {name[0]}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{name}</span>
                            <span className="text-[10px] text-slate-400">{s.phone} | ID: {s.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700">
                        <div className="flex items-center gap-1.5">
                          <span>Grade {s.grade_display || s.grade || 12}</span>
                          {s.section && (
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold text-[10px]">
                              Sec {s.section}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 block">{s.stream || "Natural Science"}</span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {targetScore} <span className="font-normal text-slate-400 text-[10px]">/ 700</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 font-bold ${
                          predScore >= 500 ? "text-emerald-600" : predScore >= 350 ? "text-amber-600" : "text-rose-600 font-extrabold"
                        }`}>
                          {predScore} / 700
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {isAtRisk ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[10px]">
                            <AlertTriangle className="w-3 h-3 text-rose-600" /> At-Risk (&lt;350)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium text-[10px]">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" /> On Track
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200/60 font-semibold text-[11px]">
                          <Flame className="w-3.5 h-3.5 text-amber-500" />
                          <span>{streak} days</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setReportCardStudentId(s.id)}
                            className="px-2.5 py-1 rounded-xl border border-slate-200 hover:border-slate-800 hover:bg-slate-900 hover:text-white text-slate-700 text-[11px] font-bold transition-all inline-flex items-center gap-1 cursor-pointer"
                            title="View official Ministry Terminal Report Card"
                          >
                            <FileText className="w-3.5 h-3.5 text-amber-500" />
                            <span className="hidden xl:inline">Report Card</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setTransferTarget(s);
                              setNewGrade(s.grade_display || s.grade || "Grade 12");
                              setNewSection(s.section || "A");
                            }}
                            className="px-2.5 py-1 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-slate-700 hover:text-blue-900 text-[11px] font-bold transition-all inline-flex items-center gap-1 cursor-pointer"
                            title="Transfer candidate to another section"
                          >
                            <ArrowRightLeft className="w-3.5 h-3.5 text-blue-600" />
                            <span className="hidden xl:inline">Transfer</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenDossier(s.id)}
                            className="px-2.5 py-1 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50 text-slate-700 hover:text-amber-900 text-[11px] font-bold transition-all inline-flex items-center gap-1 cursor-pointer"
                          >
                            <span>Dossier</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bulk Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-700 text-xs font-semibold mb-1">
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Institutional Registrar Console</span>
                </div>
                <h3 className="text-xl font-serif font-bold text-slate-900">
                  Bulk Student Candidate Ingestion
                </h3>
              </div>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!uploadResult ? (
              <form onSubmit={handleBulkUpload} className="space-y-4">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-amber-900 text-xs">
                  <div>
                    <p className="font-bold">Standard CSV Format</p>
                    <p className="text-[11px] text-amber-800">
                      Columns: Full Name, Phone, Grade, Section, Stream, Email, Target Score
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadTemplate}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Template</span>
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                    Paste Candidate CSV Data *
                  </label>
                  <textarea
                    rows={8}
                    required
                    value={csvInput}
                    onChange={(e) => setCsvInput(e.target.value)}
                    placeholder={"Full Name,Phone,Grade,Section,Stream,Email,Target Score\nSolomon Desta,+251911112233,Grade 12,A,Natural Science,solomon@school.edu,560\nTigist Bekele,+251911114455,Grade 12,B,Natural Science,tigist@school.edu,590"}
                    className="w-full font-mono text-xs p-3.5 rounded-xl border border-slate-200 focus:border-amber-500 outline-none leading-relaxed"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-5 py-2.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 text-xs shadow transition-colors cursor-pointer"
                  >
                    {uploading ? "Ingesting Roster..." : "Ingest & Generate Passwords"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-bold text-sm">Onboarding Completed Successfully!</p>
                    <p className="text-emerald-800 text-xs mt-0.5">
                      {uploadResult.processed_count} student accounts initialized for {uploadResult.school}.
                    </p>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden max-h-60 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-100 font-bold text-slate-600 text-[11px]">
                      <tr>
                        <th className="py-2.5 px-3">Candidate</th>
                        <th className="py-2.5 px-3">Classroom</th>
                        <th className="py-2.5 px-3">Phone</th>
                        <th className="py-2.5 px-3">Initial Password</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                      {uploadResult.credentials?.map((c: any) => (
                        <tr key={c.id}>
                          <td className="py-2 px-3 font-sans font-semibold text-slate-900">{c.name}</td>
                          <td className="py-2 px-3 font-sans text-slate-600">{c.classroom}</td>
                          <td className="py-2 px-3 text-slate-500">{c.phone}</td>
                          <td className="py-2 px-3 text-amber-600 font-bold">{c.initial_password}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {uploadResult.skipped && uploadResult.skipped.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs space-y-1.5">
                    <span className="font-bold text-amber-900 block">
                      Skipped Records ({uploadResult.skipped.length}) — Multi-Tenant Boundary Protected
                    </span>
                    <ul className="list-disc list-inside text-amber-800 text-[11px] space-y-0.5 max-h-24 overflow-y-auto">
                      {uploadResult.skipped.map((s: any, idx: number) => (
                        <li key={idx}>
                          <strong className="font-medium">{s.name} ({s.phone}):</strong> {s.reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-5 py-2.5 rounded-xl font-bold bg-slate-900 hover:bg-slate-800 text-white text-xs cursor-pointer"
                  >
                    Close & View Roster
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Candidate Academic Diagnostic Dossier Modal */}
      {selectedStudentId !== null && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-slate-900 text-amber-400 font-serif font-bold text-lg flex items-center justify-center shadow-xs">
                  {dossier?.name?.[0] || "S"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-serif font-bold text-slate-900">
                      {dossier?.name || "Student Candidate"}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900">
                      Grade {dossier?.grade || 12} {dossier?.section ? `Sec ${dossier.section}` : ""}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {dossier?.stream || "Natural Science"} • {dossier?.phone || "No Phone"} • ID: {selectedStudentId}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => {
                  setSelectedStudentId(null);
                  setDossier(null);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {loadingDossier ? (
              <div className="py-16 text-center space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500 mx-auto" />
                <p className="text-xs font-semibold text-slate-500">Retrieving institutional candidate dossier...</p>
              </div>
            ) : !dossier ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                Unable to load candidate dossier data.
              </div>
            ) : (
              <div className="space-y-6">
                {/* Top Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Predicted IRT</span>
                    <div className="text-2xl font-serif font-bold text-slate-900 mt-0.5">
                      {dossier.predicted_score} <span className="text-xs font-normal text-slate-400">/ 700</span>
                    </div>
                    <span className={`text-[10px] font-bold mt-1 inline-block ${dossier.predicted_score >= 350 ? "text-emerald-600" : "text-rose-600"}`}>
                      {dossier.predicted_score >= 350 ? "University Eligible" : "At-Risk Benchmark"}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Target Threshold</span>
                    <div className="text-2xl font-serif font-bold text-amber-600 mt-0.5">
                      {dossier.target_score} <span className="text-xs font-normal text-slate-400">/ 700</span>
                    </div>
                    <span className={`text-[10px] font-bold mt-1 inline-block ${dossier.cutoff_gap >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                      {dossier.cutoff_gap >= 0 ? `+${dossier.cutoff_gap} above target` : `${dossier.cutoff_gap} to cutoff`}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">National Standing</span>
                    <div className="text-2xl font-serif font-bold text-purple-700 mt-0.5">
                      #{dossier.national_rank}
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 mt-1 inline-block">
                      Top 3% Nationwide
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Consistency Habit</span>
                    <div className="text-2xl font-serif font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                      <Flame className="w-5 h-5 text-amber-500" />
                      <span>{dossier.streak_days}</span>
                      <span className="text-xs font-normal text-slate-500">Days</span>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 mt-1 inline-block">
                      {dossier.assignments_completed || 0} Tasks Completed
                    </span>
                  </div>
                </div>

                {/* Target University Placement */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50/40 border border-blue-200 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-blue-700 tracking-wider">Candidate Aspiration</span>
                      <h4 className="font-bold text-sm text-slate-900">{dossier.target_university || "Addis Ababa University (AAU)"}</h4>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-blue-800 bg-white px-3 py-1.5 rounded-xl border border-blue-200 shrink-0">
                    First-Choice Placement
                  </span>
                </div>

                {/* Subject Mastery Diagnosed */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-amber-600" />
                      <span>Curriculum Subject Mastery Diagnosed</span>
                    </h4>
                    <span className="text-[11px] text-slate-400 font-semibold">Calibrated against 10,000+ national items</span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {(dossier.subject_accuracies || []).map((sub: any) => {
                      const acc = sub.accuracy_percent;
                      const isHigh = acc >= 75;
                      const isLow = acc < 50;
                      return (
                        <div key={sub.subject} className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/70 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-900">{sub.subject}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              isHigh ? "bg-emerald-100 text-emerald-800" : isLow ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"
                            }`}>
                              {acc}% Accuracy
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                isHigh ? "bg-emerald-500" : isLow ? "bg-rose-500" : "bg-amber-500"
                              }`}
                              style={{ width: `${acc}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recent Task Submissions History */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <FileCheck2 className="w-4 h-4 text-blue-600" />
                    <span>School Assignment Submission Records ({dossier.recent_submissions?.length || 0})</span>
                  </h4>

                  {!dossier.recent_submissions || dossier.recent_submissions.length === 0 ? (
                    <p className="text-xs text-slate-400 py-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                      No institutional task submissions recorded for this student yet.
                    </p>
                  ) : (
                    <div className="overflow-x-auto rounded-2xl border border-slate-100">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-100">
                            <th className="py-2.5 px-3">Exam Benchmark</th>
                            <th className="py-2.5 px-3">Subject</th>
                            <th className="py-2.5 px-3">Score %</th>
                            <th className="py-2.5 px-3">Submitted Date</th>
                            <th className="py-2.5 px-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {dossier.recent_submissions.map((sub: any, idx: number) => (
                            <tr key={idx} className="hover:bg-slate-50/60">
                              <td className="py-2.5 px-3 font-bold text-slate-900">{sub.assignment_title}</td>
                              <td className="py-2.5 px-3 text-slate-600">{sub.subject}</td>
                              <td className="py-2.5 px-3 font-bold text-amber-600">
                                {sub.score_percent !== null ? `${sub.score_percent}%` : "—"}
                              </td>
                              <td className="py-2.5 px-3 text-slate-500">
                                {sub.submitted_at ? new Date(sub.submitted_at).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}
                              </td>
                              <td className="py-2.5 px-3">
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                  <CheckCircle2 className="w-3 h-3" /> Submitted
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Candidate Credential Slips Printable Modal */}
      {showSlipsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 print:hidden">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-amber-500" />
                <h3 className="font-serif text-lg font-bold text-slate-900">
                  Print Candidate Credential Access Slips
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer transition-colors"
                >
                  <Printer className="w-4 h-4 text-amber-400" />
                  <span>Print All Slips (PDF)</span>
                </button>
                <button 
                  onClick={() => setShowSlipsModal(false)}
                  className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-500 print:hidden">
              Distribute these slips to candidates during orientation. Students can use their phone number or student ID to access the national exam platform.
            </p>

            {/* Printable Cards Grid (4 per row on desktop, 2 per row print) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.slice(0, 50).map((s) => (
                <div 
                  key={s.id} 
                  className="p-4 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/60 space-y-2.5 print:border-solid print:border-slate-800 print:bg-white"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-slate-900" />
                      <span className="font-serif font-bold text-xs text-slate-900">FINKISON ACADEMY</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      {s.grade_display || s.gradeDisplay || `Grade ${s.grade}`}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Candidate Name</span>
                    <h4 className="font-bold text-sm text-slate-900">{s.name || s.user__full_name}</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Student ID</span>
                      <span className="font-mono font-bold text-slate-800">{s.id}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Login Identifier</span>
                      <span className="font-mono font-bold text-slate-800">{s.phone || "—"}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px]">
                    <span className="text-slate-500">Default Access PIN: <strong className="font-mono text-slate-800">Candidate123!</strong></span>
                    <span className="font-bold text-amber-600">finkison.et/login</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Official Terminal Report Card Modal */}
      <TerminalReportCardModal
        studentId={reportCardStudentId || ""}
        isOpen={Boolean(reportCardStudentId)}
        onClose={() => setReportCardStudentId(null)}
      />

      {/* Section Transfer Modal */}
      {transferTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
                  <ArrowRightLeft className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-slate-900">
                    Transfer Candidate Section
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Reallocate candidate to another preparatory class cohort.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTransferTarget(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleTransferSubmit} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Candidate:</span>
                  <strong className="text-slate-900">{transferTarget.name || transferTarget.user__full_name}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Current Placement:</span>
                  <strong className="text-slate-700">
                    {transferTarget.grade_display || transferTarget.grade} - Section {transferTarget.section}
                  </strong>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Target Grade *
                  </label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:border-blue-500 outline-none bg-white cursor-pointer"
                  >
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 11">Grade 11</option>
                    <option value="Grade 12">Grade 12</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Target Section *
                  </label>
                  <select
                    value={newSection}
                    onChange={(e) => setNewSection(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:border-blue-500 outline-none bg-white cursor-pointer"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                    <option value="D">Section D</option>
                    <option value="E">Section E</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setTransferTarget(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={transferring}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {transferring ? "Transferring..." : "Confirm Transfer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
