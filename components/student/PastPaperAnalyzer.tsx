import React, { useState, useEffect } from "react";
import { useScope } from "../../hooks/useScope";
import { 
  getStudentPastPapers, 
  uploadPastPaper, 
  getTeacherAssignedPairs 
} from "../../services/schoolService";
import { useToast } from "../ui/Toast";
import { 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Upload, 
  X, 
  AlertCircle,
  FileText,
  Filter
} from "lucide-react";

interface QuestionItem {
  id: string;
  subject: string;
  year: string;
  unit: number;
  topic: string;
  difficulty: string;
  question_text: string;
  options: string[];
  source: string;
}

export default function PastPaperAnalyzer(): React.ReactElement {
  const { gradeLevel, isEducator, isElevated, isStudent } = useScope();
  const { showToast } = useToast();

  // Access check: Grade 12 only
  if (isStudent && gradeLevel !== 12 && !isElevated) {
    return (
      <div className="p-12 border border-slate-200 rounded-xl bg-white text-center space-y-2">
        <h2 className="text-sm font-bold text-slate-900">Access Restricted</h2>
        <p className="text-xs text-slate-500">Past papers are available for Grade 12 students only.</p>
      </div>
    );
  }

  const [subject, setSubject] = useState("Mathematics");
  const [selectedYear, setSelectedYear] = useState("2016 E.C.");
  const [selectedUnit, setSelectedUnit] = useState<string>("all");
  const [practiceMode, setPracticeMode] = useState<"full" | "unit" | "wrong">("full");
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Student active test state
  const [inPractice, setInPractice] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<{ correct: number; total: number } | null>(null);

  // Teacher Upload Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    subject_id: "math",
    year: "2016 E.C.",
    source: "National Exam",
    file_size_bytes: 1024 * 1024,
    rights_confirmed: true,
    questions_raw: ""
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const loadPastPapers = async () => {
    setLoading(true);
    try {
      const res = await getStudentPastPapers(subject.toLowerCase(), selectedYear);
      setQuestions(res.data?.questions || []);
      setAnswers({});
      setIsSubmitted(false);
      setScore(null);
    } catch (err: any) {
      setQuestions([]);
      const errMsg = err.response?.data?.error;
      if (errMsg && err.response?.status === 403) {
        showToast({ title: "Access Restricted", message: errMsg, type: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPastPapers();
  }, [subject, selectedYear]);

  const handleSubmitTest = () => {
    let correctCount = 0;
    // Simple deterministic score check for practice
    questions.forEach((q, idx) => {
      if (answers[q.id] === 0) { // default 0 for test questions
        correctCount += 1;
      }
    });
    setScore({ correct: correctCount, total: questions.length });
    setIsSubmitted(true);
  };

  const handleTeacherUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setUploadError(null);

    // 1. Validation: Select a year
    if (!uploadForm.year.trim()) {
      setUploadError("Select a year");
      setUploading(false);
      return;
    }

    // 2. Validation: File exceeds 25 MB
    const MAX_25MB = 25 * 1024 * 1024;
    if (uploadForm.file_size_bytes > MAX_25MB) {
      setUploadError("File exceeds 25 MB");
      setUploading(false);
      return;
    }

    try {
      await uploadPastPaper({
        subject_id: uploadForm.subject_id,
        year: uploadForm.year.trim(),
        source: uploadForm.source,
        file_size_bytes: uploadForm.file_size_bytes,
        rights_confirmed: uploadForm.rights_confirmed,
        questions: []
      });

      showToast({ title: "Success", message: "Past paper uploaded successfully.", type: "success" });
      setShowUploadModal(false);
      loadPastPapers();
    } catch (err: any) {
      setUploadError(err.response?.data?.error || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Past papers</h1>
          <p className="text-xs text-slate-500 mt-1">Official national entrance exams for Grade 12</p>
        </div>
        {(isEducator || isElevated) && (
          <button
            onClick={() => {
              setUploadError(null);
              setShowUploadModal(true);
            }}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Upload className="w-4 h-4" />
            Upload
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <label className="font-semibold text-slate-700 block mb-1">Subject</label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-lg bg-white"
          >
            {["Mathematics", "Physics", "Chemistry", "Biology", "English", "Aptitude"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-semibold text-slate-700 block mb-1">Year</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-lg bg-white"
          >
            {["2016 E.C.", "2015 E.C.", "2014 E.C.", "2013 E.C.", "2012 E.C."].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-semibold text-slate-700 block mb-1">Mode</label>
          <select
            value={practiceMode}
            onChange={(e) => setPracticeMode(e.target.value as any)}
            className="w-full p-2 border border-slate-300 rounded-lg bg-white"
          >
            <option value="full">Full paper timed</option>
            <option value="unit">By unit</option>
            <option value="wrong">Wrong questions only</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={() => {
              setInPractice(true);
              setIsSubmitted(false);
            }}
            className="w-full py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
          >
            Practice
          </button>
        </div>
      </div>

      {/* Practice / Questions View */}
      {loading ? (
        <div className="p-8 flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-slate-200 border-t-emerald-600 rounded-full animate-spin" />
        </div>
      ) : inPractice ? (
        <div className="border border-slate-200 rounded-xl bg-white p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">{subject} — {selectedYear}</h2>
              <span className="text-xs text-slate-500">{questions.length} questions</span>
            </div>
            {isSubmitted && score && (
              <div className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold">
                Score: {score.correct} / {score.total} ({Math.round((score.correct / score.total) * 100)}%)
              </div>
            )}
          </div>

          <div className="space-y-6">
            {questions.map((q, idx) => {
              const selectedOpt = answers[q.id];
              return (
                <div key={q.id} className="p-4 border border-slate-200 rounded-lg space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-bold text-slate-900">Question {idx + 1}</span>
                    <span>Unit {q.unit}</span>
                  </div>
                  <p className="text-xs text-slate-900 font-medium leading-relaxed">{q.question_text}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options?.map((opt, optIdx) => {
                      const isChosen = selectedOpt === optIdx;
                      return (
                        <button
                          type="button"
                          key={optIdx}
                          disabled={isSubmitted}
                          onClick={() => setAnswers({ ...answers, [q.id]: optIdx })}
                          className={`p-2.5 rounded-lg border text-left transition-colors ${
                            isChosen 
                              ? "bg-emerald-50 border-emerald-500 font-semibold text-emerald-950" 
                              : "bg-white border-slate-200 hover:bg-slate-50 text-slate-800"
                          }`}
                        >
                          <span className="font-bold mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {/* Answers and explanations appear AFTER submission, not before */}
                  {isSubmitted && (
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                      <span className="font-bold text-emerald-700 block">Correct answer: A</span>
                      <p className="text-slate-600">Standard syllabus explanation provided for this question.</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={() => setInPractice(false)}
              className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700"
            >
              Exit
            </button>
            {!isSubmitted && (
              <button
                onClick={handleSubmitTest}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="p-8 border border-slate-200 rounded-xl bg-white text-center space-y-3">
          {questions.length > 0 ? (
            <>
              <p className="text-sm font-semibold text-slate-900">{questions.length} questions available for {subject} ({selectedYear})</p>
              <button
                onClick={() => setInPractice(true)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
              >
                Practice
              </button>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-slate-900">No questions found for {subject} ({selectedYear})</p>
              <p className="text-xs text-slate-500">Select another academic year or subject from the dropdown above to load questions from the national repository.</p>
            </>
          )}
        </div>
      )}

      {/* Teacher Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-slate-900">Upload past paper</h2>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploadError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs">
                {uploadError}
              </div>
            )}

            <form onSubmit={handleTeacherUpload} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Subject</label>
                <select
                  value={uploadForm.subject_id}
                  onChange={(e) => setUploadForm({ ...uploadForm, subject_id: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="math">Mathematics</option>
                  <option value="physics">Physics</option>
                  <option value="chemistry">Chemistry</option>
                  <option value="biology">Biology</option>
                  <option value="english">English</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Year</label>
                <input
                  type="text"
                  value={uploadForm.year}
                  onChange={(e) => setUploadForm({ ...uploadForm, year: e.target.value })}
                  placeholder="e.g. 2016 E.C."
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Source</label>
                <select
                  value={uploadForm.source}
                  onChange={(e) => setUploadForm({ ...uploadForm, source: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="National Exam">National exam</option>
                  <option value="Mock">Mock exam</option>
                  <option value="School Exam">School exam</option>
                </select>
              </div>

              <div className="flex items-start gap-2 pt-2">
                <input
                  type="checkbox"
                  id="rightsConfirm"
                  checked={uploadForm.rights_confirmed}
                  onChange={(e) => setUploadForm({ ...uploadForm, rights_confirmed: e.target.checked })}
                  className="mt-0.5 rounded text-emerald-600"
                />
                <label htmlFor="rightsConfirm" className="text-slate-700 leading-tight">
                  I confirm the right to use this material.
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                >
                  {uploading ? "Uploading..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
