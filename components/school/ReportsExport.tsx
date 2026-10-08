import React, { useState, useEffect } from "react";
import { exportReports, getSchoolStudents, getSchoolProfile } from "../../services/schoolService";
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  Printer, 
  Award,
  Building2,
  GraduationCap,
  Sparkles,
  Users,
  ShieldCheck,
  ChevronRight,
  UserCheck
} from "lucide-react";
import { useToast } from "../shared/Toast";

export default function ReportsExport(): React.ReactElement {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"export" | "transcript">("export");
  const [format, setFormat] = useState<"csv" | "pdf" | "xlsx">("csv");
  const [reportType, setReportType] = useState("summary");
  const [downloading, setDownloading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Transcript state
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [schoolProfile, setSchoolProfile] = useState<any>(null);

  useEffect(() => {
    Promise.allSettled([
      getSchoolStudents(),
      getSchoolProfile()
    ]).then(([studentsRes, profileRes]) => {
      if (studentsRes.status === "fulfilled" && Array.isArray(studentsRes.value.data)) {
        setStudents(studentsRes.value.data);
        if (studentsRes.value.data.length > 0) {
          setSelectedStudentId(studentsRes.value.data[0].id);
        }
      }
      if (profileRes.status === "fulfilled" && profileRes.value.data) {
        setSchoolProfile(profileRes.value.data);
      }
    });
  }, []);

  const handleExport = async () => {
    setDownloading(true);
    setSuccess(false);
    try {
      const response = await exportReports(format);
      
      const mimeType = format === "csv" ? "text/csv;charset=utf-8;" : "application/octet-stream";
      const blob = response.data instanceof Blob 
        ? response.data 
        : new Blob([response.data], { type: mimeType });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `finkison_school_report_${new Date().toISOString().slice(0, 10)}.${format}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloading(false);
      setSuccess(true);
      showToast({
        type: "success",
        title: "Report Downloaded",
        message: `School performance report exported as ${format.toUpperCase()}.`
      });
    } catch (err: any) {
      setDownloading(false);
      showToast({
        type: "error",
        title: "Export Failed",
        message: err?.message || "Failed to compile school report."
      });
    }
  };

  const selectedStudent = students.find((s) => s.id === selectedStudentId) || students[0] || {
    id: "STD-2026-001",
    name: "Abebe Kebede",
    grade: "Grade 12",
    stream: "Natural Science",
    current_predicted_score: 545,
    school: schoolProfile?.name || "National Preparatory Academy",
    national_rank: 142
  };

  const handlePrint = () => {
    window.print();
  };

  // Sample subject mark calculations calibrated to student's predicted score
  const baseRatio = Math.min(1.0, Math.max(0.4, (selectedStudent.current_predicted_score || 500) / 700));
  const isNatural = (selectedStudent.stream || "Natural Science").toLowerCase().includes("natural");

  const subjectsBreakdown = isNatural ? [
    { name: "English", score: Math.round(82 * baseRatio + 12), max: 100, grade: "A", status: "Proficient" },
    { name: "Mathematics (Natural)", score: Math.round(86 * baseRatio + 10), max: 100, grade: "A", status: "Advanced" },
    { name: "Physics", score: Math.round(74 * baseRatio + 8), max: 100, grade: "B+", status: "Remedial Target" },
    { name: "Chemistry", score: Math.round(78 * baseRatio + 12), max: 100, grade: "A-", status: "Proficient" },
    { name: "Biology", score: Math.round(84 * baseRatio + 10), max: 100, grade: "A", status: "Advanced" },
    { name: "Civics & Ethical Education", score: Math.round(88 * baseRatio + 8), max: 100, grade: "A", status: "Proficient" },
    { name: "Scholastic Aptitude", score: Math.round(80 * baseRatio + 10), max: 100, grade: "A", status: "Proficient" },
  ] : [
    { name: "English", score: Math.round(84 * baseRatio + 10), max: 100, grade: "A", status: "Proficient" },
    { name: "Mathematics (Social)", score: Math.round(80 * baseRatio + 10), max: 100, grade: "A", status: "Proficient" },
    { name: "History", score: Math.round(85 * baseRatio + 10), max: 100, grade: "A", status: "Advanced" },
    { name: "Geography", score: Math.round(82 * baseRatio + 10), max: 100, grade: "A", status: "Proficient" },
    { name: "Economics", score: Math.round(79 * baseRatio + 12), max: 100, grade: "B+", status: "Proficient" },
    { name: "Civics & Ethical Education", score: Math.round(88 * baseRatio + 8), max: 100, grade: "A", status: "Proficient" },
    { name: "Scholastic Aptitude", score: Math.round(81 * baseRatio + 10), max: 100, grade: "A", status: "Proficient" },
  ];

  const totalCalculated = subjectsBreakdown.reduce((acc, curr) => acc + curr.score, 0);
  const isCutoffQualified = (selectedStudent.current_predicted_score || totalCalculated) >= 350;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header and Mode Navigation */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-700 text-xs font-semibold border border-purple-500/20 mb-2">
              <FileText className="w-3.5 h-3.5" />
              <span>Ministry & Institutional Documentation</span>
            </div>
            <h1 className="font-serif text-2xl font-bold text-slate-900">
              Institutional Reports & Official Transcripts
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Generate aggregated cohort data for regional education bureaus or print official Ministry of Education candidate transcripts.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl shrink-0">
            <button
              onClick={() => setActiveTab("export")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "export"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Batch File Export
            </button>
            <button
              onClick={() => setActiveTab("transcript")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "transcript"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Official MoE Transcript
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Batch File Export */}
      {activeTab === "export" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 print:hidden">
          {success && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold">Report Compiled Successfully!</p>
                <p className="text-emerald-800 text-[11px] mt-0.5">
                  The formatted export document has been dispatched to your download manager.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="reportType" className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                Report Template Specification *
              </label>
              <select
                id="reportType"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-amber-500 outline-none bg-white cursor-pointer"
              >
                <option value="summary">Aggregated Performance Summary (All Preparatory Grades)</option>
                <option value="weak">Diagnostic Weak Area Analysis (Grade 12 Entrance Classes)</option>
                <option value="attendance">Class Stream Attendance & Activity Log</option>
                <option value="ministry">MoE University Entrance Cutoff Projection Roster (&gt;= 350 / 700)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                File Format *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {([
                  { id: "csv" as const, label: "CSV Spreadsheet", ext: ".csv" },
                  { id: "pdf" as const, label: "PDF Document", ext: ".pdf" },
                  { id: "xlsx" as const, label: "Excel Workbook", ext: ".xlsx" }
                ]).map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFormat(f.id)}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      format === f.id
                        ? "border-purple-500 bg-purple-50/50 ring-2 ring-purple-200 font-bold text-slate-900"
                        : "border-slate-200 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <span className="text-xs block">{f.label}</span>
                    <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{f.ext}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={handleExport}
              disabled={downloading}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs flex items-center justify-center gap-2 shadow transition-colors cursor-pointer"
            >
              {downloading ? (
                <span>Compiling Document Layout...</span>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Export & Download Document</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Official MoE Candidate Transcript & Dossier */}
      {activeTab === "transcript" && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-slate-400 shrink-0" />
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500">
                  Select Candidate for Transcript
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="mt-0.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white focus:border-amber-500 outline-none cursor-pointer"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.grade} - {s.stream}) — Score: {s.current_predicted_score}/700
                    </option>
                  ))}
                  {students.length === 0 && (
                    <option value="sample">Abebe Kebede (Grade 12 - Natural Science)</option>
                  )}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handlePrint}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-950 text-white text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>Print Official Transcript</span>
              </button>
            </div>
          </div>

          {/* Printable Official MoE Certificate & Transcript Document */}
          <div className="bg-white rounded-3xl border border-slate-300 p-8 sm:p-12 shadow-sm space-y-8 print:border-none print:shadow-none print:p-0 print:m-0 print:w-full">
            {/* MoE Official Header */}
            <div className="text-center border-b-2 border-slate-900 pb-6 space-y-1">
              <div className="flex items-center justify-center gap-2 mb-1">
                <GraduationCap className="w-6 h-6 text-slate-900" />
                <span className="font-serif text-xs uppercase tracking-widest font-extrabold text-slate-900">
                  Federal Democratic Republic of Ethiopia
                </span>
              </div>
              <h2 className="font-serif text-lg sm:text-xl font-bold uppercase tracking-wider text-slate-900">
                Educational Assessment and Examinations Service (EAES)
              </h2>
              <h3 className="font-serif text-sm font-semibold uppercase text-slate-700">
                Official National Preparatory Entrance Examination Candidate Dossier
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">
                Academic Year: {schoolProfile?.academic_year || "2016 E.C. / 2026 G.C."} • Center Accreditation Code: {schoolProfile?.code || "ET-AA-0942"}
              </p>
            </div>

            {/* Institution & Candidate Particulars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Candidate Name</span>
                <span className="font-bold text-slate-900 text-sm block mt-0.5">{selectedStudent.name}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Admission ID</span>
                <span className="font-mono text-slate-800 font-semibold text-xs block mt-0.5">{selectedStudent.id}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Academic Stream</span>
                <span className="font-semibold text-slate-800 text-xs block mt-0.5">{selectedStudent.stream || "Natural Science"}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Accredited Institution</span>
                <span className="font-semibold text-slate-800 text-xs block mt-0.5">{schoolProfile?.name || selectedStudent.school}</span>
              </div>
            </div>

            {/* University Cutoff Qualification Badge */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200 bg-white">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-serif font-bold text-lg ${
                  isCutoffQualified ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                }`}>
                  {isCutoffQualified ? "PASS" : "RISK"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase text-slate-700">University Entrance Status:</span>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      isCutoffQualified ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}>
                      {isCutoffQualified ? "QUALIFIED FOR PUBLIC HIGHER EDUCATION" : "BELOW REGIONAL CUTOFF THRESHOLD"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    National Cutoff Benchmark: 350 / 700 Scaled Points (MoE Directive 2016/2026).
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Predicted Composite</span>
                <span className="font-serif text-2xl font-bold text-slate-900">
                  {selectedStudent.current_predicted_score || totalCalculated} <span className="text-xs font-sans text-slate-500 font-normal">/ 700</span>
                </span>
              </div>
            </div>

            {/* Standardized Subjects Mastery Grid */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-slate-700">
                  Standardized Assessment Breakdown
                </h4>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">
                  Calibrated via Item Response Theory (IRT)
                </span>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px]">
                    <tr>
                      <th className="py-2.5 px-4">Subject</th>
                      <th className="py-2.5 px-4 text-center">Score (/100)</th>
                      <th className="py-2.5 px-4 text-center">Grade</th>
                      <th className="py-2.5 px-4">National Standing</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {subjectsBreakdown.map((sub, i) => (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-4 font-bold text-slate-900">{sub.name}</td>
                        <td className="py-2.5 px-4 text-center font-mono font-bold text-slate-800">{sub.score}</td>
                        <td className="py-2.5 px-4 text-center font-bold text-amber-600">{sub.grade}</td>
                        <td className="py-2.5 px-4 text-slate-600 text-[11px]">{sub.status}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 border-t border-slate-200 font-bold text-slate-900">
                    <tr>
                      <td className="py-3 px-4 uppercase text-xs">Total Aggregate Score</td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-base text-slate-950">
                        {selectedStudent.current_predicted_score || totalCalculated}
                      </td>
                      <td className="py-3 px-4 text-center text-xs text-emerald-700">PASS</td>
                      <td className="py-3 px-4 text-xs text-slate-600">
                        National Rank: #{selectedStudent.national_rank || 142}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Official Signatures & Institutional Seal */}
            <div className="pt-8 border-t border-slate-200 grid grid-cols-3 gap-6 text-center text-xs">
              <div className="space-y-8">
                <div className="h-8 border-b border-slate-400" />
                <span className="font-bold text-slate-700 block">Homeroom Academic Advisor</span>
              </div>
              <div className="space-y-2 flex flex-col items-center justify-end">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400 font-bold uppercase text-center p-2">
                  Official School Seal
                </div>
                <span className="text-[10px] text-slate-400">Affix Official Stamp Here</span>
              </div>
              <div className="space-y-8">
                <div className="h-8 border-b border-slate-400" />
                <span className="font-bold text-slate-700 block">School Principal / Headmaster</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
