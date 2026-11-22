import React, { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Download, Plus, Trash2, Upload } from "lucide-react";
import {
  downloadSchoolPastPaperFile,
  getSchoolPastPaperUploads,
  getTeacherAssignedPairs,
  uploadPastPaperQuestionSet,
} from "../../services/schoolService";
import { useToast } from "../ui/Toast";
import PageHeader from "../shared/PageHeader";
import PortalPage from "../shared/PortalPage";

type AssignedPair = {
  section_id: string | number;
  section_name?: string;
  grade?: string;
  grade_level?: number;
  subject_id: string;
  subject_name: string;
};

type PaperQuestion = {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  unit: number;
  topic: string;
};

type PastPaperUpload = {
  id: string;
  subject: string;
  year: string;
  source: string;
  file_name: string;
  file_size_bytes: number;
  has_source_file: boolean;
  uploaded_by: string;
  created_at: string;
};

const pairKey = (pair: AssignedPair) => `${pair.subject_id}:${pair.section_id}`;
const createQuestion = (): PaperQuestion => ({
  id: `${Date.now()}-${Math.random()}`,
  text: "",
  options: ["", "", "", ""],
  correctAnswer: 0,
  unit: 0,
  topic: "",
});

function isGradeTwelve(pair: AssignedPair): boolean {
  return Number(pair.grade_level) === 12 || /(?:^|\D)12(?:\D|$)/.test(String(pair.grade || pair.section_name || ""));
}

export default function TeacherPastPapersView(): React.ReactElement {
  const { showToast } = useToast();
  const [assignedPairs, setAssignedPairs] = useState<AssignedPair[]>([]);
  const [assignmentsLoading, setAssignmentsLoading] = useState(true);
  const [assignmentsError, setAssignmentsError] = useState(false);
  const [selectedPairKey, setSelectedPairKey] = useState("");
  const [year, setYear] = useState("");
  const [source, setSource] = useState("");
  const [rightsConfirmed, setRightsConfirmed] = useState(false);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [questions, setQuestions] = useState<PaperQuestion[]>([createQuestion()]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [recentUploads, setRecentUploads] = useState<PastPaperUpload[]>([]);
  const [uploadsLoading, setUploadsLoading] = useState(true);
  const [uploadsError, setUploadsError] = useState(false);

  const loadRecentUploads = async () => {
    try {
      const response = await getSchoolPastPaperUploads();
      setRecentUploads(Array.isArray(response.data?.uploads) ? response.data.uploads : []);
      setUploadsError(false);
    } catch {
      setUploadsError(true);
    } finally {
      setUploadsLoading(false);
    }
  };

  useEffect(() => {
    let isCurrent = true;
    getTeacherAssignedPairs()
      .then((response) => {
        if (!isCurrent) return;
        const pairs = Array.isArray(response.data?.pairs) ? response.data.pairs : [];
        const eligiblePairs = pairs.filter(isGradeTwelve);
        setAssignedPairs(eligiblePairs);
        setSelectedPairKey(eligiblePairs[0] ? pairKey(eligiblePairs[0]) : "");
      })
      .catch(() => {
        if (isCurrent) setAssignmentsError(true);
      })
      .finally(() => {
        if (isCurrent) setAssignmentsLoading(false);
      });
    return () => { isCurrent = false; };
  }, []);

  useEffect(() => {
    void loadRecentUploads();
  }, []);

  const selectedPair = assignedPairs.find((pair) => pairKey(pair) === selectedPairKey);

  const updateQuestion = (id: string, update: (question: PaperQuestion) => PaperQuestion) => {
    setQuestions((current) => current.map((question) => question.id === id ? update(question) : question));
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSavedMessage(null);

    if (!selectedPair) {
      setError("Choose a Grade 12 class and subject assigned to you.");
      return;
    }
    if (!rightsConfirmed) {
      setError("Confirm that you have permission to share these questions with students.");
      return;
    }
    if (sourceFile && sourceFile.size > 25 * 1024 * 1024) {
      setError("The source PDF must be 25 MB or smaller.");
      return;
    }
    if (sourceFile && !sourceFile.name.toLowerCase().endsWith(".pdf")) {
      setError("Choose a PDF source file.");
      return;
    }
    if (questions.some((question) => !question.text.trim() || question.options.some((option) => !option.trim()) || question.unit < 1)) {
      setError("Complete each question, all four answer choices, and its curriculum unit before saving.");
      return;
    }

    setSaving(true);
    try {
      const response = await uploadPastPaperQuestionSet({
        subject_id: selectedPair.subject_id,
        year: year.trim(),
        source: source.trim(),
        rights_confirmed: true,
        source_file: sourceFile,
        questions: questions.map((question) => ({
          question_text: question.text.trim(),
          options: question.options.map((option) => option.trim()),
          correct_answer: question.correctAnswer,
          unit: question.unit,
          topic: question.topic.trim() || "Entrance Revision",
          marks: 1,
        })),
      });
      if (response.data?.success === false) throw new Error(response.data?.error || "The question set could not be saved.");
      const message = response.data?.message || `Saved ${questions.length} questions to the student past-paper bank.`;
      setSavedMessage(message);
      showToast({ title: "Past-paper material saved", message, type: "success" });
      await loadRecentUploads();
    } catch (err: any) {
      const message = err?.response?.data?.error || err?.response?.data?.message || err?.message || "The question set could not be saved. Try again.";
      setError(message);
      showToast({ title: "Save failed", message, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const startAnotherSet = () => {
    setYear("");
    setSource("");
    setRightsConfirmed(false);
    setSourceFile(null);
    setQuestions([createQuestion()]);
    setError(null);
    setSavedMessage(null);
  };

  return (
    <PortalPage className="max-w-4xl space-y-6">
      <PageHeader
        eyebrow="Grade 12 question bank"
        title="Add past-paper questions"
        description="Enter questions and map each one to a unit for your Grade 12 students."
      />

      <div className="flex gap-3 rounded-xl border border-stone-200 bg-white p-4 text-sm text-stone-700 dark:border-white/10 dark:bg-[#261E1A] dark:text-[#E7E0D6]">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />
        <p className="text-xs leading-5">Add questions, answer choices, and a curriculum unit. A source PDF is optional.</p>
      </div>

      {assignmentsLoading ? (
        <div role="status" className="rounded-xl border border-stone-200 bg-white p-6 text-sm text-stone-500 dark:border-white/10 dark:bg-[#261E1A] dark:text-[#A89C90]">Loading your Grade 12 assignments...</div>
      ) : assignmentsError ? (
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200">Your teaching assignments could not be loaded. Refresh the page and try again.</div>
      ) : assignedPairs.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center dark:border-white/15 dark:bg-[#261E1A]">
          <h2 className="text-base font-semibold text-stone-900 dark:text-[#FDFBF7]">A Grade 12 assignment is required</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-stone-600 dark:text-[#E7E0D6]">Ask your administrator to assign you to a Grade 12 subject before adding questions.</p>
        </section>
      ) : (
        <form onSubmit={handleSave} className="space-y-5">
          <section className="space-y-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-[#261E1A] sm:p-6" aria-labelledby="paper-details-heading">
            <div>
              <h2 id="paper-details-heading" className="text-base font-semibold text-stone-900 dark:text-[#FDFBF7]">Question set details</h2>
              <p className="mt-1 text-xs text-stone-500 dark:text-[#A89C90]">Choose the assigned subject and provide the paper year and source.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="past-paper-assignment" className="text-xs font-semibold text-stone-800 dark:text-[#E7E0D6]">Grade 12 assignment</label>
                <select id="past-paper-assignment" value={selectedPairKey} onChange={(event) => setSelectedPairKey(event.target.value)} required className="min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-800 focus:border-[#881337] focus:outline-none focus:ring-2 focus:ring-[#881337]/20 dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]">
                  {assignedPairs.map((pair) => (
                    <option key={pairKey(pair)} value={pairKey(pair)}>
                      {[pair.section_name || pair.grade || `Class ${pair.section_id}`, pair.subject_name].filter(Boolean).join(" · ")}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="past-paper-year" className="text-xs font-semibold text-stone-800 dark:text-[#E7E0D6]">Exam year</label>
                <input id="past-paper-year" value={year} onChange={(event) => setYear(event.target.value)} placeholder="e.g. 2017 E.C." required className="min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-800 placeholder:text-stone-400 focus:border-[#881337] focus:outline-none focus:ring-2 focus:ring-[#881337]/20 dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]" />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="past-paper-source" className="text-xs font-semibold text-stone-800 dark:text-[#E7E0D6]">Source or paper title</label>
                <input id="past-paper-source" value={source} onChange={(event) => setSource(event.target.value)} placeholder="e.g. National entrance examination" required className="min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-800 placeholder:text-stone-400 focus:border-[#881337] focus:outline-none focus:ring-2 focus:ring-[#881337]/20 dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="past-paper-source-file" className="text-xs font-semibold text-stone-800 dark:text-[#E7E0D6]">Source PDF <span className="font-normal text-stone-500 dark:text-[#A89C90]">(optional)</span></label>
                <input id="past-paper-source-file" type="file" accept="application/pdf,.pdf" onChange={(event) => setSourceFile(event.target.files?.[0] || null)} className="block min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700 file:mr-3 file:rounded-md file:border-0 file:bg-stone-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold dark:border-white/15 dark:bg-[#1C1512] dark:text-[#E7E0D6] dark:file:bg-white/10" />
                <p className="text-xs leading-5 text-stone-500 dark:text-[#A89C90]">PDF only, up to 25 MB. Students do not see the source file.</p>
              </div>
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-[#261E1A] sm:p-6" aria-labelledby="paper-questions-heading">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 id="paper-questions-heading" className="text-base font-semibold text-stone-900 dark:text-[#FDFBF7]">Questions</h2>
                <p className="mt-1 text-xs text-stone-500 dark:text-[#A89C90]">Add the question, four choices, answer, and unit mapping.</p>
              </div>
              <button type="button" onClick={() => setQuestions((current) => [...current, createQuestion()])} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-stone-300 px-3 text-xs font-semibold text-stone-700 transition-colors hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#881337] dark:border-white/15 dark:text-[#E7E0D6] dark:hover:bg-white/5">
                <Plus className="h-4 w-4" aria-hidden="true" /> Add question
              </button>
            </div>

            <div className="space-y-4">
              {questions.map((question, index) => (
                <article key={question.id} className="space-y-4 rounded-xl border border-stone-200 bg-[#FAF8F5] p-4 dark:border-white/10 dark:bg-[#1C1512] sm:p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-stone-900 dark:text-[#FDFBF7]">Question {index + 1}</h3>
                    {questions.length > 1 && <button type="button" onClick={() => setQuestions((current) => current.filter((item) => item.id !== question.id))} aria-label={`Remove question ${index + 1}`} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2 text-xs font-medium text-rose-700 hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-600 dark:text-rose-200 dark:hover:bg-rose-950/30"><Trash2 className="h-4 w-4" aria-hidden="true" />Remove</button>}
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor={`question-text-${question.id}`} className="text-xs font-semibold text-stone-700 dark:text-[#E7E0D6]">Question text</label>
                    <textarea id={`question-text-${question.id}`} rows={3} value={question.text} onChange={(event) => updateQuestion(question.id, (item) => ({ ...item, text: event.target.value }))} required className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-800 focus:border-[#881337] focus:outline-none focus:ring-2 focus:ring-[#881337]/20 dark:border-white/15 dark:bg-[#261E1A] dark:text-[#FDFBF7]" />
                  </div>
                  <fieldset className="space-y-3">
                    <legend className="text-xs font-semibold text-stone-700 dark:text-[#E7E0D6]">Answer choices</legend>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="space-y-1">
                          <label htmlFor={`question-${question.id}-option-${optionIndex}`} className="text-[11px] font-medium text-stone-500 dark:text-[#A89C90]">Choice {String.fromCharCode(65 + optionIndex)}</label>
                          <input id={`question-${question.id}-option-${optionIndex}`} value={option} onChange={(event) => updateQuestion(question.id, (item) => ({ ...item, options: item.options.map((value, itemIndex) => itemIndex === optionIndex ? event.target.value : value) }))} required className="min-h-10 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-800 focus:border-[#881337] focus:outline-none focus:ring-2 focus:ring-[#881337]/20 dark:border-white/15 dark:bg-[#261E1A] dark:text-[#FDFBF7]" />
                        </div>
                      ))}
                    </div>
                  </fieldset>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="space-y-1">
                      <label htmlFor={`question-${question.id}-answer`} className="text-xs font-semibold text-stone-700 dark:text-[#E7E0D6]">Correct choice</label>
                      <select id={`question-${question.id}-answer`} value={question.correctAnswer} onChange={(event) => updateQuestion(question.id, (item) => ({ ...item, correctAnswer: Number(event.target.value) }))} className="min-h-10 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-800 focus:border-[#881337] focus:outline-none focus:ring-2 focus:ring-[#881337]/20 dark:border-white/15 dark:bg-[#261E1A] dark:text-[#FDFBF7]">{question.options.map((_, optionIndex) => <option key={optionIndex} value={optionIndex}>Choice {String.fromCharCode(65 + optionIndex)}</option>)}</select>
                    </div>
                    <div className="space-y-1">
                      <label htmlFor={`question-${question.id}-unit`} className="text-xs font-semibold text-stone-700 dark:text-[#E7E0D6]">Curriculum unit</label>
                      <input id={`question-${question.id}-unit`} type="number" min={1} max={99} value={question.unit || ""} onChange={(event) => updateQuestion(question.id, (item) => ({ ...item, unit: Number(event.target.value) || 0 }))} required placeholder="Unit number" className="min-h-10 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-800 focus:border-[#881337] focus:outline-none focus:ring-2 focus:ring-[#881337]/20 dark:border-white/15 dark:bg-[#261E1A] dark:text-[#FDFBF7]" />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor={`question-${question.id}-topic`} className="text-xs font-semibold text-stone-700 dark:text-[#E7E0D6]">Topic <span className="font-normal text-stone-500">(optional)</span></label>
                      <input id={`question-${question.id}-topic`} value={question.topic} onChange={(event) => updateQuestion(question.id, (item) => ({ ...item, topic: event.target.value }))} className="min-h-10 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-800 focus:border-[#881337] focus:outline-none focus:ring-2 focus:ring-[#881337]/20 dark:border-white/15 dark:bg-[#261E1A] dark:text-[#FDFBF7]" />
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-stone-200 p-3 dark:border-white/10">
              <input type="checkbox" checked={rightsConfirmed} onChange={(event) => setRightsConfirmed(event.target.checked)} required className="mt-0.5 h-4 w-4 accent-[#881337]" />
              <span className="text-xs leading-5 text-stone-700 dark:text-[#E7E0D6]">I have permission to share these questions with students.</span>
            </label>
          </section>

          {error && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200">{error}</p>}
          {savedMessage && <div role="status" className="flex gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-100"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /><div><p className="font-semibold">Past-paper material saved</p><p className="mt-1 text-xs leading-5">{savedMessage}</p><button type="button" onClick={startAnotherSet} className="mt-3 min-h-9 rounded-lg px-2 text-xs font-semibold underline">Add another question set</button></div></div>}

          {!savedMessage && <div className="flex flex-col gap-3 border-t border-stone-200 pt-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-stone-500 dark:text-[#A89C90]">Each question is saved with one mark and its selected unit.</p>
            <button type="submit" disabled={saving || !selectedPair} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#881337] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#9F1239] focus:outline-none focus:ring-2 focus:ring-[#881337] disabled:cursor-wait disabled:opacity-60">
              <Upload className="h-4 w-4" aria-hidden="true" />{saving ? "Saving questions..." : `Save ${questions.length} question${questions.length === 1 ? "" : "s"}`}
            </button>
          </div>}
        </form>
      )}

      <section aria-labelledby="past-paper-history-heading" className="space-y-3">
        <div>
          <h2 id="past-paper-history-heading" className="text-base font-semibold text-stone-900 dark:text-[#FDFBF7]">Recent school past-paper material</h2>
          <p className="mt-1 text-xs text-stone-500 dark:text-[#A89C90]">Visible to educators in your active school.</p>
        </div>
        {uploadsLoading ? (
          <div role="status" className="rounded-xl border border-stone-200 bg-white p-4 text-sm text-stone-500 dark:border-white/10 dark:bg-[#261E1A] dark:text-[#A89C90]">Loading recent material…</div>
        ) : uploadsError ? (
          <div role="alert" className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200 sm:flex-row sm:items-center sm:justify-between">
            <span>School past-paper history could not be loaded.</span>
            <button type="button" onClick={() => void loadRecentUploads()} className="min-h-9 rounded-lg border border-rose-300 px-3 text-xs font-semibold hover:bg-rose-100 dark:border-rose-800 dark:hover:bg-rose-900/30">Try again</button>
          </div>
        ) : recentUploads.length === 0 ? (
          <div className="rounded-xl border border-dashed border-stone-300 bg-white p-5 text-sm text-stone-500 dark:border-white/15 dark:bg-[#261E1A] dark:text-[#A89C90]">No past-paper material has been added by your school yet.</div>
        ) : (
          <ul className="divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white dark:divide-white/10 dark:border-white/10 dark:bg-[#261E1A]">
            {recentUploads.slice(0, 10).map((item) => (
              <li key={item.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-stone-900 dark:text-[#FDFBF7]">{item.subject} · {item.year}</p>
                  <p className="mt-1 text-xs text-stone-500 dark:text-[#A89C90]">{item.source} · added by {item.uploaded_by}</p>
                </div>
                {item.has_source_file && (
                  <button type="button" onClick={() => void downloadSchoolPastPaperFile(item.id, item.file_name)} className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-stone-300 px-3 text-xs font-semibold text-stone-700 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#881337] dark:border-white/15 dark:text-[#E7E0D6] dark:hover:bg-white/5">
                    <Download className="h-4 w-4" aria-hidden="true" /> Download source PDF
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </PortalPage>
  );
}
