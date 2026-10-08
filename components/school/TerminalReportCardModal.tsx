import React, { useState, useEffect } from "react";
import { 
  X, 
  Printer, 
  Award, 
  Building2, 
  Calendar, 
  UserCheck, 
  CheckCircle2, 
  FileText,
  Save
} from "lucide-react";
import { getTerminalReportCard, saveReportCardRemarks } from "../../services/schoolService";

interface TerminalReportCardModalProps {
  studentId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function TerminalReportCardModal({
  studentId,
  isOpen,
  onClose
}: TerminalReportCardModalProps): React.ReactElement | null {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isEditingRemarks, setIsEditingRemarks] = useState(false);
  const [remarksText, setRemarksText] = useState("");
  const [conductGrade, setConductGrade] = useState("A (Exemplary)");
  const [savingRemarks, setSavingRemarks] = useState(false);

  useEffect(() => {
    if (isOpen && studentId) {
      setLoading(true);
      getTerminalReportCard(studentId)
        .then((res) => {
          setData(res.data);
          setRemarksText(res.data?.evaluation?.homeroom_remarks || "");
          setConductGrade(res.data?.evaluation?.conduct_grade || "A (Exemplary)");
        })
        .catch((err) => {
          console.error("Failed to load report card:", err);
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, studentId]);

  const handleSaveRemarks = async () => {
    if (!studentId) return;
    setSavingRemarks(true);
    try {
      await saveReportCardRemarks(studentId, {
        conduct_grade: conductGrade,
        remarks: remarksText
      });
      setIsEditingRemarks(false);
      if (data) {
        setData({
          ...data,
          evaluation: {
            ...data.evaluation,
            conduct_grade: conductGrade,
            homeroom_remarks: remarksText
          }
        });
      }
    } catch (err) {
      console.error("Failed to save remarks:", err);
    } finally {
      setSavingRemarks(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Top Control Bar (Hidden when printing) */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0 print:hidden">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-serif font-bold text-sm text-white">
                Official Ministry Terminal Report Card
              </h3>
              <p className="text-[10px] text-slate-400">
                FDRE Ministry of Education • Official Academic Transcript & Terminal Ledger
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Print official report card or save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report Card Sheet Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-100/50 print:p-0 print:bg-white">
          {loading ? (
            <div className="py-24 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-500">Compiling official terminal report card...</p>
            </div>
          ) : !data ? (
            <div className="py-20 text-center text-xs text-rose-500">
              Failed to load candidate transcript. Please try again.
            </div>
          ) : (
            <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-300 shadow-sm text-slate-900 space-y-6 max-w-3xl mx-auto print:border-none print:shadow-none print:p-0">
              
              {/* Official Ethiopian Ministry Header */}
              <div className="text-center space-y-1.5 border-b-2 border-slate-900 pb-5">
                <div className="flex items-center justify-center gap-2 text-slate-600 font-bold text-[11px] uppercase tracking-widest">
                  <span>Federal Democratic Republic of Ethiopia</span>
                  <span>•</span>
                  <span>Ministry of Education</span>
                </div>
                <h1 className="font-serif font-black text-2xl text-slate-950 tracking-tight uppercase">
                  {data.school.name}
                </h1>
                <p className="text-xs font-medium text-slate-600 italic">
                  &ldquo;{data.school.motto}&rdquo;
                </p>
                <div className="flex items-center justify-center gap-4 text-[11px] font-mono font-semibold text-slate-500 pt-1">
                  <span>Region: {data.school.region}</span>
                  <span>•</span>
                  <span>MoE Code: {data.school.code}</span>
                  <span>•</span>
                  <span>Academic Year: {data.school.academic_year}</span>
                </div>
                <div className="pt-2">
                  <span className="inline-block px-4 py-1 rounded-full bg-slate-900 text-amber-400 font-bold text-xs uppercase tracking-wider">
                    Official Terminal Student Report Card
                  </span>
                </div>
              </div>

              {/* Student Identification Information Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Candidate Name</span>
                  <span className="font-bold text-slate-900 text-sm">{data.student.name}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Candidate ID</span>
                  <span className="font-mono font-bold text-slate-800">{data.student.id}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Grade & Section</span>
                  <span className="font-bold text-slate-900">{data.student.grade} - Section {data.student.section}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Curricular Stream</span>
                  <span className="font-bold text-amber-700">{data.student.stream}</span>
                </div>
              </div>

              {/* Official Academic Subjects Matrix */}
              <div>
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-900 text-white font-bold text-[10px] uppercase tracking-wider">
                      <th className="p-2.5 border border-slate-800">Subject</th>
                      <th className="p-2 text-center border border-slate-800">Test (10)</th>
                      <th className="p-2 text-center border border-slate-800">Mid (20)</th>
                      <th className="p-2 text-center border border-slate-800">Asgn (10)</th>
                      <th className="p-2 text-center border border-slate-800">Final (60)</th>
                      <th className="p-2 text-center border border-slate-800 bg-slate-800">Sem 1</th>
                      <th className="p-2 text-center border border-slate-800 bg-slate-800">Sem 2</th>
                      <th className="p-2 text-center border border-slate-800 bg-amber-500 text-slate-950">Avg</th>
                      <th className="p-2 text-center border border-slate-800">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.subjects.map((sub: any, idx: number) => (
                      <tr 
                        key={sub.subject} 
                        className={`border-b border-slate-200 ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}
                      >
                        <td className="p-2.5 font-bold text-slate-900 border-x border-slate-200">
                          {sub.subject}
                        </td>
                        <td className="p-2 text-center text-slate-600 border-r border-slate-200 font-mono">
                          {sub.test1_score}
                        </td>
                        <td className="p-2 text-center text-slate-600 border-r border-slate-200 font-mono">
                          {sub.midterm_score}
                        </td>
                        <td className="p-2 text-center text-slate-600 border-r border-slate-200 font-mono">
                          {sub.assignment_score}
                        </td>
                        <td className="p-2 text-center text-slate-600 border-r border-slate-200 font-mono">
                          {sub.final_score}
                        </td>
                        <td className="p-2 text-center font-bold text-slate-800 bg-slate-100/60 border-r border-slate-200 font-mono">
                          {sub.sem1_total}
                        </td>
                        <td className="p-2 text-center font-bold text-slate-800 bg-slate-100/60 border-r border-slate-200 font-mono">
                          {sub.sem2_total}
                        </td>
                        <td className="p-2 text-center font-black text-slate-950 bg-amber-50 border-r border-slate-200 font-mono">
                          {sub.annual_average}%
                        </td>
                        <td className="p-2 text-center font-bold text-slate-900 border-r border-slate-200">
                          <span className={`px-2 py-0.5 rounded font-black text-[11px] ${
                            sub.letter_grade.startsWith("A") ? "text-emerald-700 bg-emerald-50" :
                            sub.letter_grade === "B" ? "text-blue-700 bg-blue-50" :
                            sub.letter_grade === "C" ? "text-amber-700 bg-amber-50" : "text-rose-700 bg-rose-50"
                          }`}>
                            {sub.letter_grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary Performance Ledger */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-900 text-white text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Semester 1 Average</span>
                  <span className="font-mono font-bold text-base text-white">{data.summary.sem1_average}%</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Semester 2 Average</span>
                  <span className="font-mono font-bold text-base text-white">{data.summary.sem2_average}%</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wide block">Cumulative Annual Avg</span>
                  <span className="font-mono font-black text-base text-amber-300">{data.summary.annual_average}%</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide block">Class Rank in Section</span>
                  <span className="font-mono font-bold text-base text-emerald-300">
                    Rank {data.summary.class_rank} <span className="text-xs text-slate-400 font-normal">/ {data.summary.total_students_in_class}</span>
                  </span>
                </div>
              </div>

              {/* Conduct & Attendance Records */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                    <span className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">
                      Student Conduct & Attendance
                    </span>
                    <span className="font-mono font-bold text-emerald-700">{conductGrade}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-[11px] pt-1">
                    <div>
                      <span className="text-slate-400 block text-[9px]">Total Days</span>
                      <strong className="text-slate-900">{data.evaluation.school_days}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">Present</span>
                      <strong className="text-emerald-700">{data.evaluation.days_present}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">Absences</span>
                      <strong className="text-rose-600">{data.evaluation.days_absent}</strong>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                  <span className="font-bold text-slate-900 uppercase tracking-wider text-[10px] block">
                    Institutional Promotion Status
                  </span>
                  <div className="flex items-center gap-2 pt-1">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-bold text-xs text-emerald-800">
                        {data.summary.promotion_decision}
                      </span>
                      <p className="text-[10px] text-slate-500">
                        Qualified under national secondary advancement regulations.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Homeroom Remarks */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">
                    Homeroom Teacher Evaluation Remarks
                  </span>
                  {!isEditingRemarks && (
                    <button
                      type="button"
                      onClick={() => setIsEditingRemarks(true)}
                      className="text-amber-700 hover:text-amber-800 font-bold text-[10px] print:hidden cursor-pointer"
                    >
                      Edit Remarks
                    </button>
                  )}
                </div>

                {isEditingRemarks ? (
                  <div className="space-y-2 pt-1 print:hidden">
                    <textarea
                      value={remarksText}
                      onChange={(e) => setRemarksText(e.target.value)}
                      rows={2}
                      className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleSaveRemarks}
                        disabled={savingRemarks}
                        className="px-3 py-1 bg-slate-900 text-white rounded-lg font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                      >
                        <Save className="w-3 h-3 text-amber-400" />
                        <span>{savingRemarks ? "Saving..." : "Save Remarks"}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingRemarks(false)}
                        className="px-2 py-1 text-slate-500 text-[10px]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-700 italic leading-relaxed">
                    &ldquo;{data.evaluation.homeroom_remarks}&rdquo;
                  </p>
                )}
              </div>

              {/* Official Seal and Signature Blocks */}
              <div className="pt-8 border-t-2 border-slate-900 flex items-end justify-between text-xs text-slate-700">
                <div className="text-center space-y-1">
                  <div className="w-40 border-b border-slate-900 h-8" />
                  <span className="font-bold text-[10px] uppercase text-slate-600 block">Homeroom Teacher Signature</span>
                </div>

                {/* Institutional Stamp Placeholder */}
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-amber-600/40 flex flex-col items-center justify-center text-center p-2">
                  <span className="text-[8px] font-bold text-amber-700 uppercase tracking-tight">Institutional Seal</span>
                  <span className="text-[7px] text-slate-400">Official MoE Accreditation</span>
                </div>

                <div className="text-center space-y-1">
                  <div className="w-40 border-b border-slate-900 h-8" />
                  <span className="font-bold text-[10px] uppercase text-slate-600 block">Head of School / Principal</span>
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
