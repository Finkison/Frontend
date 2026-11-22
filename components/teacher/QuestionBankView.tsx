import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Upload } from "lucide-react";
import { getStudentPastPapers, getTeacherAssignedPairs } from "../../services/schoolService";
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

type PastPaperQuestion = {
  id: string | number;
  subject?: string;
  year?: string;
  unit?: number;
  topic?: string;
  difficulty?: string;
  question_text: string;
  options: string[];
  source?: string;
};

const pairKey = (pair: AssignedPair) => `${pair.subject_id}:${pair.section_id}`;
const isGradeTwelve = (pair: AssignedPair) => Number(pair.grade_level) === 12 || /(?:^|\D)12(?:\D|$)/.test(String(pair.grade || pair.section_name || ""));

export default function TeacherQuestionBankView(): React.ReactElement {
  const [assignments, setAssignments] = useState<AssignedPair[]>([]);
  const [selectedPairKey, setSelectedPairKey] = useState("");
  const [questions, setQuestions] = useState<PastPaperQuestion[]>([]);
  const [query, setQuery] = useState("");
  const [assignmentsLoading, setAssignmentsLoading] = useState(true);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assignmentsError, setAssignmentsError] = useState(false);

  useEffect(() => {
    let isCurrent = true;
    getTeacherAssignedPairs()
      .then((response) => {
        if (!isCurrent) return;
        const pairs = Array.isArray(response.data?.pairs) ? response.data.pairs.filter(isGradeTwelve) : [];
        setAssignments(pairs);
        setSelectedPairKey(pairs[0] ? pairKey(pairs[0]) : "");
      })
      .catch(() => {
        if (isCurrent) setAssignmentsError(true);
      })
      .finally(() => {
        if (isCurrent) setAssignmentsLoading(false);
      });
    return () => { isCurrent = false; };
  }, []);

  const selectedPair = assignments.find((pair) => pairKey(pair) === selectedPairKey);

  useEffect(() => {
    if (!selectedPair) {
      setQuestions([]);
      return;
    }
    let isCurrent = true;
    setQuestionsLoading(true);
    setError(null);
    getStudentPastPapers(selectedPair.subject_id)
      .then((response) => {
        if (!isCurrent) return;
        const items = response.data?.questions;
        setQuestions(Array.isArray(items) ? items : []);
      })
      .catch((err: any) => {
        if (!isCurrent) return;
        setQuestions([]);
        setError(err?.response?.data?.error || "Past-paper questions could not be loaded. Try again.");
      })
      .finally(() => {
        if (isCurrent) setQuestionsLoading(false);
      });
    return () => { isCurrent = false; };
  }, [selectedPair?.subject_id]);

  const visibleQuestions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return questions;
    return questions.filter((question) => [question.question_text, question.topic, question.year, question.source]
      .some((value) => String(value || "").toLowerCase().includes(normalized)));
  }, [questions, query]);

  return (
    <PortalPage className="max-w-5xl space-y-6">
      <PageHeader
        eyebrow="Teacher resources"
        title="Grade 12 past papers"
        description="Browse past-paper questions available for your assigned Grade 12 subjects."
        primaryAction={{ label: "Manage past-paper uploads", href: "/teacher/past-papers", icon: Upload }}
      />

      {assignmentsLoading ? (
        <div role="status" className="rounded-xl border border-stone-200 bg-white p-6 text-sm text-stone-500 dark:border-white/10 dark:bg-[#261E1A] dark:text-[#A89C90]">Loading your Grade 12 assignments...</div>
      ) : assignmentsError ? (
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200">Your assignments could not be loaded. Refresh the page and try again.</div>
      ) : assignments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center dark:border-white/15 dark:bg-[#261E1A]">
          <h2 className="text-base font-semibold text-stone-900 dark:text-[#FDFBF7]">A Grade 12 assignment is required</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-stone-600 dark:text-[#E7E0D6]">Ask your administrator to assign you to a Grade 12 class.</p>
        </div>
      ) : (
        <>
          <section className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-xs dark:border-white/10 dark:bg-[#261E1A] sm:flex-row sm:items-end sm:justify-between" aria-label="Question filters">
            <div className="w-full space-y-1.5 sm:max-w-sm">
              <label htmlFor="question-bank-assignment" className="text-xs font-semibold text-stone-700 dark:text-[#E7E0D6]">Assigned subject and class</label>
              <select id="question-bank-assignment" value={selectedPairKey} onChange={(event) => setSelectedPairKey(event.target.value)} className="min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-800 focus:border-[#881337] focus:outline-none focus:ring-2 focus:ring-[#881337]/20 dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]">
                {assignments.map((pair) => <option key={pairKey(pair)} value={pairKey(pair)}>{[pair.section_name || pair.grade || `Class ${pair.section_id}`, pair.subject_name].filter(Boolean).join(" · ")}</option>)}
              </select>
            </div>
            <div className="w-full space-y-1.5 sm:max-w-sm">
              <label htmlFor="question-bank-search" className="text-xs font-semibold text-stone-700 dark:text-[#E7E0D6]">Search questions</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400 dark:text-[#A89C90]" aria-hidden="true" />
                <input id="question-bank-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search text, topic, or year" className="min-h-11 w-full rounded-lg border border-stone-300 bg-white pl-9 pr-3 text-sm text-stone-800 focus:border-[#881337] focus:outline-none focus:ring-2 focus:ring-[#881337]/20 dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]" />
              </div>
            </div>
          </section>

          {questionsLoading ? (
            <div role="status" className="rounded-2xl border border-stone-200 bg-white p-8 text-center text-sm text-stone-500 dark:border-white/10 dark:bg-[#261E1A] dark:text-[#A89C90]">Loading questions...</div>
          ) : error ? (
            <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200">{error}</div>
          ) : visibleQuestions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center dark:border-white/15 dark:bg-[#261E1A]">
              <h2 className="text-base font-semibold text-stone-900 dark:text-[#FDFBF7]">{query ? "No matching questions" : "No past-paper questions yet"}</h2>
              <p className="mt-2 text-sm text-stone-600 dark:text-[#A89C90]">{query ? "Try a different search term." : "Add mapped questions to make them available for student practice."}</p>
              {!query && <Link to="/teacher/past-papers" className="mt-4 inline-flex min-h-10 items-center justify-center rounded-lg bg-[#881337] px-4 text-sm font-semibold text-white hover:bg-[#9F1239]">Add questions</Link>}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-stone-500 dark:text-[#A89C90]">{visibleQuestions.length} question{visibleQuestions.length === 1 ? "" : "s"} available for this subject.</p>
              {visibleQuestions.map((question, index) => (
                <article key={question.id} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-[#261E1A]">
                  <div className="flex flex-wrap items-center gap-2">
                    {question.year && <span className="rounded-full bg-[#FFF1F2] px-2.5 py-1 text-[11px] font-semibold text-[#881337] dark:bg-[#4C0519]/40 dark:text-[#FBBF24]">{question.year}</span>}
                    {question.unit != null && <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-medium text-stone-600 dark:bg-[#201815] dark:text-[#E7E0D6]">Unit {question.unit}</span>}
                    {question.topic && <span className="text-xs text-stone-500 dark:text-[#A89C90]">{question.topic}</span>}
                  </div>
                  <h2 className="mt-3 text-sm font-semibold leading-6 text-stone-900 dark:text-[#FDFBF7]">{index + 1}. {question.question_text}</h2>
                  <ol className="mt-4 grid gap-2 sm:grid-cols-2" aria-label="Answer choices">
                    {question.options.map((option, optionIndex) => <li key={optionIndex} className="rounded-lg border border-stone-200 bg-[#FAF8F5] px-3 py-2 text-xs leading-5 text-stone-700 dark:border-white/10 dark:bg-[#1C1512] dark:text-[#E7E0D6]"><span className="mr-2 font-semibold text-[#881337] dark:text-[#FBBF24]">{String.fromCharCode(65 + optionIndex)}.</span>{option}</li>)}
                  </ol>
                  <p className="mt-3 text-[11px] text-stone-500 dark:text-[#A89C90]">Answer keys are not returned by the student practice question service.</p>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </PortalPage>
  );
}
