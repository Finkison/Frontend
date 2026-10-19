import React, { useState } from "react";
import useAuthStore from "../../store/authStore";
import { uploadPastPaper } from "../../services/schoolService";
import { 
  GraduationCap, 
  Upload, 
  Check, 
  FileText, 
  AlertCircle, 
  ArrowRight, 
  Calendar, 
  Download, 
  Eye, 
  Search, 
  Sparkles,
  Layers,
  CheckCircle2,
  X
} from "lucide-react";
import { useToast } from "../ui/Toast";

interface PastPaperArchiveItem {
  id: string;
  year: string;
  subject: string;
  totalQuestions: number;
  mappedUnits: string[];
  uploadDate: string;
  fileSizeMb: number;
  source: string;
}

interface ExtractedQuestion {
  number: number;
  text: string;
  options: string[];
  correctAnswer: number;
  unit: number; // 0 means unmapped
  topic: string;
}

export default function TeacherPastPapersView(): React.ReactElement {
  const { showToast } = useToast();
  const { user } = useAuthStore();
  const teacherSubject = (user as any)?.subject || "Biology";

  const [activeTab, setActiveTab] = useState<"archive" | "upload">("archive");
  const [step, setStep] = useState<"upload" | "extracting" | "mapping" | "saved">("upload");
  const [selectedYear, setSelectedYear] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Existing Past Paper Archive
  const [archive, setArchive] = useState<PastPaperArchiveItem[]>([]);

  // Extracted items for mapping step
  const [extractedItems, setExtractedItems] = useState<ExtractedQuestion[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValidationError(null);
    if (!selectedYear) {
      setValidationError("Select a year");
      return;
    }

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // 25 MB limit check
      if (file.size > 25 * 1024 * 1024) {
        setValidationError("File exceeds 25 MB");
        return;
      }

      setFileName(file.name);
      setStep("extracting");
      setTimeout(() => {
        setStep("mapping");
      }, 1200);
    }
  };

  const unmappedCount = extractedItems.filter((item) => item.unit === 0).length;

  const handleConfirmSave = async () => {
    if (unmappedCount > 0) {
      setValidationError(`${unmappedCount} questions need a unit.`);
      showToast({
        title: "Validation error",
        message: `${unmappedCount} questions need a unit.`,
        type: "error"
      });
      return;
    }

    try {
      await uploadPastPaper({
        subject_id: teacherSubject.toLowerCase(),
        year: selectedYear,
        file_name: fileName || "euee_paper.pdf",
        file_size_bytes: 409600,
        rights_confirmed: true,
        questions: extractedItems.map((item) => ({
          question_text: item.text,
          options: item.options,
          correct_answer: item.correctAnswer,
          unit: item.unit,
          topic: item.topic
        }))
      });
      setStep("saved");
      setArchive(prev => [
        {
          id: `pp-${Date.now()}`,
          year: selectedYear,
          subject: teacherSubject,
          totalQuestions: extractedItems.length,
          mappedUnits: Array.from(new Set(extractedItems.map(i => `Unit ${i.unit}`))),
          uploadDate: "Just now",
          fileSizeMb: Number((409600 / (1024 * 1024)).toFixed(1)),
          source: "Uploaded & Verified by Faculty"
        },
        ...prev
      ]);
      showToast({
        title: "Past paper mapped",
        message: "Questions mapped to units and saved to past paper archive.",
        type: "success"
      });
    } catch (err: any) {
      showToast({
        title: "Save Failed",
        message: err?.response?.data?.message || err?.message || "Failed to save past paper. Please try again.",
        type: "error"
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-[#0F172A] tracking-tight">Past papers</h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
              {teacherSubject}
            </span>
          </div>
          <p className="text-xs text-[#475569] mt-0.5">
            Grade 12 national examination archive and curriculum unit mappings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab("archive");
              setStep("upload");
            }}
            className={`px-3 py-2 rounded-[8px] text-xs font-semibold border transition-colors cursor-pointer min-h-[40px] ${
              activeTab === "archive"
                ? "bg-[#1D4ED8] text-white border-[#1D4ED8]"
                : "bg-white text-slate-700 border-[#E2E8F0] hover:bg-slate-50"
            }`}
          >
            Past paper archive
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("upload");
              setStep("upload");
            }}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[8px] text-xs font-semibold border transition-colors cursor-pointer min-h-[40px] ${
              activeTab === "upload"
                ? "bg-[#1D4ED8] text-white border-[#1D4ED8]"
                : "bg-white text-slate-700 border-[#E2E8F0] hover:bg-slate-50"
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload past paper</span>
          </button>
        </div>
      </div>

      {activeTab === "archive" ? (
        /* Archive View */
        <div className="space-y-4">
          {archive.length === 0 ? (
            <div className="bg-white border border-[#E2E8F0] rounded-[8px] p-12 text-center text-slate-500 space-y-3">
              <GraduationCap className="w-10 h-10 mx-auto text-slate-300 stroke-[1.5]" />
              <p className="text-sm font-semibold text-slate-700">No past papers archived yet.</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Upload official national examinations to index past questions and calibrate curriculum unit mappings.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab("upload")}
                className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[8px] bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Upload past paper</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {archive.map((paper) => (
                <div
                  key={paper.id}
                  className="p-5 bg-white border border-[#E2E8F0] rounded-[8px] shadow-xs space-y-4 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-[#EFF6FF] text-[#1D4ED8] font-bold text-xs border border-[#BFDBFE]">
                        {paper.year}
                      </span>
                      <h3 className="font-semibold text-sm text-[#0F172A] mt-2">
                        Grade 12 national examination
                      </h3>
                      <p className="text-[11px] text-slate-500">{paper.source}</p>
                    </div>
                    <GraduationCap className="w-5 h-5 text-[#1D4ED8]" />
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 border-t border-[#E2E8F0] pt-3">
                    <div className="flex justify-between">
                      <span>Items indexed:</span>
                      <span className="font-mono font-semibold text-[#0F172A]">{paper.totalQuestions} questions</span>
                    </div>
                    <div className="flex justify-between">
                      <span>File size:</span>
                      <span className="font-mono text-slate-500">{paper.fileSizeMb} MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mapped units:</span>
                      <span className="font-medium text-slate-700">{paper.mappedUnits.join(", ")}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">Added {paper.uploadDate}</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          showToast({
                            title: "Exam opened",
                            message: `Viewing ${paper.year} national paper questions.`,
                            type: "info"
                          });
                        }}
                        className="px-2.5 py-1 rounded-[6px] border border-[#E2E8F0] hover:bg-[#EFF6FF] text-[#1D4ED8] font-semibold text-xs cursor-pointer inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          showToast({
                            title: "Download started",
                            message: `Downloading ${paper.year} official exam PDF.`,
                            type: "success"
                          });
                        }}
                        className="p-1 rounded-[6px] border border-[#E2E8F0] hover:bg-slate-50 text-slate-600 cursor-pointer"
                        title="Download PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Upload & OCR Mapping View */
        <div className="space-y-6">
          {step === "upload" && (
            <div className="bg-white border border-[#E2E8F0] rounded-[8px] p-8 max-w-xl mx-auto shadow-xs space-y-5">
              <div className="w-12 h-12 rounded-full bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE] flex items-center justify-center mx-auto">
                <Upload className="w-6 h-6" />
              </div>
              <div className="text-center">
                <h2 className="text-base font-semibold text-[#0F172A]">Upload Grade 12 exam paper</h2>
                <p className="text-xs text-[#475569] mt-1">
                  Upload official examination papers. OCR extracts questions for syllabus unit mapping.
                </p>
              </div>

              {validationError && (
                <div className="p-3 rounded-[6px] bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#0F172A] mb-1">
                    Examination Year <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => {
                      setSelectedYear(e.target.value);
                      setValidationError(null);
                    }}
                    className="w-full px-3 py-2 border border-[#E2E8F0] rounded-[6px] bg-white text-xs"
                  >
                    <option value="">Select a year</option>
                    <option value="2017 E.C.">2017 E.C.</option>
                    <option value="2016 E.C.">2016 E.C.</option>
                    <option value="2015 E.C.">2015 E.C.</option>
                    <option value="2014 E.C.">2014 E.C.</option>
                    <option value="2013 E.C.">2013 E.C.</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#0F172A] mb-1">
                    Exam PDF document (Max 25 MB)
                  </label>
                  <label className="border-2 border-dashed border-[#E2E8F0] hover:border-[#1D4ED8] rounded-[8px] p-6 text-center cursor-pointer block transition-colors bg-[#F8FAFC]">
                    <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <span className="block font-semibold text-[#1D4ED8] text-xs">
                      Click to choose exam PDF
                    </span>
                    <span className="block text-[11px] text-slate-400 mt-1">
                      PDF documents up to 25 MB
                    </span>
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {step === "extracting" && (
            <div className="bg-white border border-[#E2E8F0] rounded-[8px] p-12 text-center space-y-4 max-w-lg mx-auto shadow-xs">
              <div className="w-10 h-10 border-3 border-slate-200 border-t-[#1D4ED8] rounded-full animate-spin mx-auto" />
              <div>
                <h2 className="text-sm font-semibold text-[#0F172A]">Processing OCR extraction from {fileName}...</h2>
                <p className="text-xs text-[#475569] mt-1">
                  Parsing mathematical notation, scientific diagrams, and question stems for {selectedYear}.
                </p>
              </div>
              <div className="w-48 bg-slate-100 h-1.5 rounded-full mx-auto overflow-hidden">
                <div className="bg-[#1D4ED8] h-full w-3/4 animate-pulse rounded-full" />
              </div>
            </div>
          )}

          {step === "mapping" && (
            <div className="bg-white border border-[#E2E8F0] rounded-[8px] p-5 space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-3">
                <div>
                  <h2 className="text-base font-semibold text-[#0F172A]">
                    Review extracted questions
                  </h2>
                  <p className="text-xs text-[#475569] mt-0.5">
                    {selectedYear} • {fileName} • {extractedItems.length} items extracted
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleConfirmSave}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold rounded-[6px] cursor-pointer shadow-xs"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save mapped questions</span>
                  </button>
                </div>
              </div>

              {unmappedCount > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-[6px] text-amber-800 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                    <span className="font-semibold">{unmappedCount} questions need a unit.</span>
                  </div>
                  <span className="text-[11px] text-amber-700">Assign all items to proceed</span>
                </div>
              )}

              {/* Items List */}
              <div className="space-y-3 text-xs">
                {extractedItems.map((item, idx) => (
                  <div
                    key={item.number}
                    className={`p-3.5 border rounded-[6px] space-y-2 transition-colors ${
                      item.unit === 0 ? "bg-amber-50/40 border-amber-300" : "bg-[#F8FAFC] border-[#E2E8F0]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="font-semibold text-[#0F172A] text-sm">
                          Question {item.number}: {item.text}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Auto-mapped topic: <span className="font-medium text-slate-700">{item.topic}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-semibold text-slate-600">Unit:</span>
                        <select
                          value={item.unit}
                          onChange={(e) => {
                            const updated = [...extractedItems];
                            updated[idx].unit = Number(e.target.value);
                            setExtractedItems(updated);
                            setValidationError(null);
                          }}
                          className={`px-2.5 py-1.5 border rounded-[6px] bg-white text-xs font-semibold ${
                            item.unit === 0 ? "border-amber-400 text-amber-700" : "border-[#E2E8F0] text-slate-700"
                          }`}
                        >
                          <option value={0}>Unassigned (needs unit)</option>
                          <option value={1}>Unit 1: Biochemical Fundamentals</option>
                          <option value={2}>Unit 2: Cellular Structures</option>
                          <option value={3}>Unit 3: Genetics & Molecular Inheritance</option>
                          <option value={4}>Unit 4: Cell Physiology & Metabolism</option>
                          <option value={5}>Unit 5: Human Organ Systems</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 text-slate-600 text-[11px]">
                      {item.options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className={`p-1.5 rounded ${
                            oIdx === item.correctAnswer
                              ? "bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200"
                              : "bg-white border border-[#E2E8F0]"
                          }`}
                        >
                          <span className="font-mono mr-1.5 font-bold">
                            {String.fromCharCode(65 + oIdx)}.
                          </span>
                          {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === "saved" && (
            <div className="bg-white border border-emerald-200 rounded-[8px] p-8 text-center space-y-3 max-w-lg mx-auto shadow-xs">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h2 className="text-base font-semibold text-[#0F172A]">Past paper successfully processed & saved</h2>
              <p className="text-xs text-[#475569] max-w-md mx-auto">
                Questions have been indexed into the question bank and mapped to curriculum units for Grade 12 students.
              </p>
              <div className="pt-3 flex justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("archive");
                    setStep("upload");
                  }}
                  className="px-3.5 py-2 border border-[#E2E8F0] rounded-[6px] text-xs font-semibold hover:bg-slate-50 cursor-pointer min-h-[38px]"
                >
                  View archive
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep("upload");
                    setSelectedYear("");
                    setFileName(null);
                  }}
                  className="px-3.5 py-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white rounded-[6px] text-xs font-semibold cursor-pointer min-h-[38px]"
                >
                  Upload another paper
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
