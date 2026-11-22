import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "../../i18n";
import { useScope } from "../../hooks/useScope";
import { completePractice, startPractice } from "../../services/practiceService";
import { getStudentPastPaperYears, getStudentPastPapers } from "../../services/schoolService";
import MathText from "../shared/MathText";
import PortalPage from "../shared/PortalPage";

type QuestionOption = string | {
  label?: string;
  text?: string;
  text_en?: string;
  index?: number;
};

interface QuestionItem {
  id: string | number;
  subject?: string;
  year?: string;
  unit: number;
  topic?: string;
  difficulty?: string;
  question_text?: string;
  questionText?: string;
  question?: string;
  options: QuestionOption[];
  source?: string;
  explanations?: Record<string, string>;
  explanation_en?: string;
  explanation_am?: string;
  explanation_or?: string;
  correct_answer?: number | string;
  correctAnswer?: number | string;
  correct_label?: string;
  selected_answer?: number | string | null;
  is_correct?: boolean;
}

interface PracticeResult {
  score_percent: number;
  correct_count: number;
  total_questions: number;
  questions: QuestionItem[];
}

function getOptionText(option: QuestionOption): string {
  return typeof option === "string" ? option : option.text || option.text_en || "";
}

function getOptionIndex(option: QuestionOption, fallbackIndex: number): number {
  return typeof option === "string" ? fallbackIndex : option.index ?? fallbackIndex;
}

function getAnswerIndex(answer: number | string | undefined): number | undefined {
  if (answer === undefined) return undefined;
  if (typeof answer === "number") return answer;
  const labelIndex = ["A", "B", "C", "D", "E"].indexOf(answer.toUpperCase());
  if (labelIndex >= 0) return labelIndex;
  const parsed = Number(answer);
  return Number.isInteger(parsed) ? parsed : undefined;
}

export default function PastPaperAnalyzer(): React.ReactElement {
  const { gradeLevel, isElevated, isStudent } = useScope();
  const { t, language } = useI18n();
  const isRestricted = isStudent && gradeLevel !== 12 && !isElevated;

  const [subject, setSubject] = useState("Mathematics");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("all");
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [sessionQuestions, setSessionQuestions] = useState<QuestionItem[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [practiceResult, setPracticeResult] = useState<PracticeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inPractice, setInPractice] = useState(false);
  const [error, setError] = useState("");
  const practiceStartedAt = useRef<number | null>(null);
  const listRequestId = useRef(0);

  const subjectLabel = t(`pastPaper.subjects.${subject.toLowerCase()}`);
  const practiceQuestions = useMemo(
    () => inPractice
      ? sessionQuestions
      : selectedUnit === "all"
        ? questions
        : questions.filter((question) => String(question.unit) === selectedUnit),
    [inPractice, questions, selectedUnit, sessionQuestions],
  );
  const answeredCount = practiceQuestions.filter((question) => answers[String(question.id)] !== undefined).length;
  const units = useMemo(
    () => Array.from(new Set(questions.map((question) => question.unit))).sort((a, b) => a - b),
    [questions],
  );
  const resultByQuestionId = useMemo(
    () => new Map((practiceResult?.questions || []).map((question) => [String(question.id), question])),
    [practiceResult],
  );

  const loadPastPapers = useCallback(async () => {
    if (isRestricted) return;
    const requestId = ++listRequestId.current;
    setLoading(true);
    setError("");
    try {
      const yearsResponse = await getStudentPastPaperYears(subject.toLowerCase());
      if (requestId !== listRequestId.current) return;
      const years: string[] = yearsResponse.data?.years || [];
      setAvailableYears(years);
      const yearToLoad = years.includes(selectedYear) ? selectedYear : years[0] || "";
      if (yearToLoad !== selectedYear) {
        setSelectedYear(yearToLoad);
        setQuestions([]);
        return;
      }
      if (!yearToLoad) {
        setQuestions([]);
        setSelectedUnit("all");
        setPracticeResult(null);
        setSessionQuestions([]);
        setSessionId(null);
        setInPractice(false);
        return;
      }
      const response = await getStudentPastPapers(subject.toLowerCase(), yearToLoad);
      if (requestId !== listRequestId.current) return;
      setQuestions(response.data?.questions || []);
      setAnswers({});
      setSelectedUnit("all");
      setPracticeResult(null);
      setSessionQuestions([]);
      setSessionId(null);
      setInPractice(false);
    } catch {
      if (requestId !== listRequestId.current) return;
      setAvailableYears([]);
      setQuestions([]);
      setError(t("pastPaper.loadError"));
    } finally {
      if (requestId === listRequestId.current) setLoading(false);
    }
  }, [isRestricted, selectedYear, subject, t]);

  useEffect(() => {
    void loadPastPapers();
    return () => { listRequestId.current += 1; };
  }, [loadPastPapers]);

  const handleStartPractice = async () => {
    setIsStarting(true);
    setError("");
    try {
      const response = await startPractice({
        subject,
        grade: 12,
        mode: "past_paper",
        past_exam_year: selectedYear,
        ...(selectedUnit === "all" ? {} : { past_paper_unit: Number(selectedUnit) }),
      });
      const data = response.data?.data || response.data || {};
      if (!data.id || !Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error("No questions are available for this selection.");
      }
      setSessionId(String(data.id));
      setSessionQuestions(data.questions);
      setAnswers({});
      setPracticeResult(null);
      setInPractice(true);
      practiceStartedAt.current = Date.now();
    } catch {
      setError(t("pastPaper.startError"));
    } finally {
      setIsStarting(false);
    }
  };

  const handleCompletePractice = async () => {
    if (!sessionId || answeredCount !== practiceQuestions.length || practiceQuestions.length === 0) {
      setError(t("pastPaper.answerAll"));
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      const timeSpent = practiceStartedAt.current === null
        ? 0
        : Math.max(0, Math.floor((Date.now() - practiceStartedAt.current) / 1000));
      const response = await completePractice({
        session_id: sessionId,
        time_spent: timeSpent,
        answers: Object.fromEntries(
          practiceQuestions.map((question) => [String(question.id), answers[String(question.id)]]),
        ),
      });
      const data = response.data?.data || response.data || {};
      setPracticeResult(data);
    } catch {
      setError(t("pastPaper.submitError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const exitPractice = () => {
    setInPractice(false);
    setSessionId(null);
    setSessionQuestions([]);
    setAnswers({});
    setPracticeResult(null);
    practiceStartedAt.current = null;
    setError("");
  };

  if (isRestricted) {
    return (
      <div className="space-y-2 rounded-xl border border-stone-200 bg-white p-12 text-center dark:border-white/10 dark:bg-stone-900">
        <h2 className="text-sm font-bold text-stone-900 dark:text-white">{t("pastPaper.accessTitle")}</h2>
        <p className="text-xs text-stone-500 dark:text-stone-400">{t("pastPaper.accessDescription")}</p>
      </div>
    );
  }

  return (
    <PortalPage className="space-y-6">
      <header className="border-b border-stone-200 pb-5 dark:border-white/10">
        <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-white">{t("pastPaper.title")}</h1>
        <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">{t("pastPaper.description")}</p>
      </header>

      {error && <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-200">{error}</div>}

      <section aria-label={t("pastPaper.filters")} className="grid grid-cols-1 gap-4 rounded-xl border border-stone-200 bg-white p-4 text-sm dark:border-white/10 dark:bg-stone-900 sm:grid-cols-4">
        <div>
          <label htmlFor="past-paper-subject" className="mb-1 block text-xs font-semibold text-stone-700 dark:text-stone-200">{t("pastPaper.subject")}</label>
          <select id="past-paper-subject" value={subject} disabled={inPractice || loading || isStarting} onChange={(event) => setSubject(event.target.value)} className="min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 dark:border-white/20 dark:bg-stone-900">
            {["Mathematics", "Physics", "Chemistry", "Biology", "English", "Aptitude"].map((item) => <option key={item} value={item}>{t(`pastPaper.subjects.${item.toLowerCase()}`)}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="past-paper-year" className="mb-1 block text-xs font-semibold text-stone-700 dark:text-stone-200">{t("pastPaper.year")}</label>
          <select id="past-paper-year" value={selectedYear} disabled={inPractice || loading || isStarting || availableYears.length === 0} onChange={(event) => setSelectedYear(event.target.value)} className="min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 dark:border-white/20 dark:bg-stone-900">
            {availableYears.length === 0
              ? <option value="">{t("pastPaper.noYears")}</option>
              : availableYears.map((year) => <option key={year} value={year}>{year}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="past-paper-unit" className="mb-1 block text-xs font-semibold text-stone-700 dark:text-stone-200">{t("pastPaper.unit")}</label>
          <select id="past-paper-unit" value={selectedUnit} disabled={inPractice || loading || isStarting} onChange={(event) => setSelectedUnit(event.target.value)} className="min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 dark:border-white/20 dark:bg-stone-900">
            <option value="all">{t("pastPaper.allUnits")}</option>
            {units.map((unit) => <option key={unit} value={String(unit)}>{t("pastPaper.unitOption", { unit })}</option>)}
          </select>
        </div>
        <div className="flex items-end">
          <button type="button" disabled={loading || isStarting || inPractice || questions.length === 0} onClick={() => void handleStartPractice()} className="min-h-11 w-full rounded-lg bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50">
            {isStarting ? t("pastPaper.starting") : t("pastPaper.start")}
          </button>
        </div>
      </section>

      {loading ? (
        <div role="status" className="flex items-center justify-center p-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-stone-200 border-t-primary dark:border-white/10" />
          <span className="sr-only">{t("pastPaper.loading")}</span>
        </div>
      ) : inPractice ? (
        <section className="space-y-6 rounded-xl border border-stone-200 bg-white p-5 dark:border-white/10 dark:bg-stone-900 sm:p-6">
          <div className="flex flex-col gap-3 border-b border-stone-200 pb-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-bold text-stone-900 dark:text-white">{subjectLabel} · {selectedYear}</h2>
              <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">{t("pastPaper.count", { count: practiceQuestions.length, answered: answeredCount })}</p>
            </div>
            {practiceResult && (
              <div className="rounded-lg bg-emerald-50 px-4 py-2 text-right dark:bg-emerald-950/30" role="status">
                <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-100">{t("pastPaper.practiceComplete")}</p>
                <p className="text-lg font-bold text-emerald-800 dark:text-emerald-200">{t("pastPaper.score")}: {practiceResult.score_percent}%</p>
                <p className="text-xs text-emerald-800 dark:text-emerald-200">{practiceResult.correct_count}/{practiceResult.total_questions}</p>
              </div>
            )}
          </div>

          <div className="space-y-5">
            {practiceQuestions.map((question, questionIndex) => {
              const questionId = String(question.id);
              const selectedOption = answers[questionId];
              const result = resultByQuestionId.get(questionId);
              const resultAnswer = result ? getAnswerIndex(result.correct_answer ?? result.correctAnswer) : undefined;
              const explanation = result?.explanations?.[language]
                || (language === "am" ? result?.explanation_am : language === "om" ? result?.explanation_or : result?.explanation_en)
                || result?.explanation_en;
              return (
                <article key={questionId} className="space-y-4 rounded-lg border border-stone-200 p-4 dark:border-white/10 sm:p-5">
                  <div className="flex items-center justify-between gap-3 text-xs text-stone-500 dark:text-stone-400">
                    <span className="font-bold text-stone-900 dark:text-white">{t("pastPaper.question", { number: questionIndex + 1 })}</span>
                    <span>{t("pastPaper.unitOption", { unit: question.unit })}</span>
                  </div>
                  <p className="text-sm font-medium leading-6 text-stone-900 dark:text-white"><MathText text={question.question_text || question.questionText || question.question || ""} /></p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {question.options?.map((option, optionPosition) => {
                      const optionIndex = getOptionIndex(option, optionPosition);
                      const isSelected = selectedOption === optionIndex;
                      const isCorrectOption = result && resultAnswer === optionIndex;
                      const isIncorrectSelection = result && isSelected && result.is_correct === false;
                      const style = isCorrectOption
                        ? "border-emerald-500 bg-emerald-50 text-emerald-950 dark:bg-emerald-950/30 dark:text-emerald-100"
                        : isIncorrectSelection
                          ? "border-rose-400 bg-rose-50 text-rose-950 dark:bg-rose-950/30 dark:text-rose-100"
                          : isSelected
                            ? "border-primary bg-brand-tint font-semibold text-primary dark:bg-primary/20 dark:text-white"
                            : "border-stone-200 bg-white text-stone-800 hover:bg-stone-50 dark:border-white/10 dark:bg-stone-900 dark:text-white dark:hover:bg-white/5";
                      return (
                        <button key={`${questionId}-${optionIndex}`} type="button" disabled={Boolean(practiceResult) || isSubmitting} onClick={() => setAnswers((current) => ({ ...current, [questionId]: optionIndex }))} className={`min-h-11 rounded-lg border p-3 text-left text-sm transition-colors disabled:cursor-default ${style}`}>
                          <span className="mr-2 font-bold">{String.fromCharCode(65 + optionIndex)}.</span><MathText text={getOptionText(option)} />
                        </button>
                      );
                    })}
                  </div>
                  {result && (
                    <div className={`space-y-2 rounded-lg border p-3 text-sm ${result.is_correct ? "border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-100" : "border-rose-200 bg-rose-50 text-rose-950 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-100"}`}>
                      <p className="font-semibold">{result.is_correct ? t("pastPaper.correct") : t("pastPaper.incorrect")}</p>
                      {resultAnswer !== undefined && <p>{t("pastPaper.correctAnswer")}: {String.fromCharCode(65 + resultAnswer)}. <MathText text={getOptionText(question.options[resultAnswer] ?? "")} /></p>}
                      {explanation && <p className="leading-6"><MathText text={explanation} /></p>}
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          <div className="flex flex-col-reverse justify-end gap-3 border-t border-stone-200 pt-4 dark:border-white/10 sm:flex-row">
            <button type="button" onClick={exitPractice} disabled={isSubmitting} className="min-h-11 rounded-lg border border-stone-300 px-4 text-sm font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-50 dark:border-white/15 dark:text-stone-200 dark:hover:bg-white/5">{t("pastPaper.exit")}</button>
            {!practiceResult && (
              <button type="button" disabled={isSubmitting || answeredCount !== practiceQuestions.length || practiceQuestions.length === 0} onClick={() => void handleCompletePractice()} className="min-h-11 rounded-lg bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50">
                {isSubmitting ? t("pastPaper.submitting") : t("pastPaper.submitAnswers")}
              </button>
            )}
          </div>
        </section>
      ) : (
        <section className="space-y-3 rounded-xl border border-stone-200 bg-white p-6 text-center dark:border-white/10 dark:bg-stone-900">
          {questions.length > 0 ? (
            <>
              <p className="text-sm font-semibold text-stone-900 dark:text-white">{t("pastPaper.available", { count: practiceQuestions.length, subject: subjectLabel, year: selectedYear })}</p>
              <p className="text-sm text-stone-600 dark:text-stone-400">{t("pastPaper.startDescription")}</p>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-stone-900 dark:text-white">{t("pastPaper.emptyTitle", { subject: subjectLabel, year: selectedYear || t("pastPaper.noYears") })}</p>
              <p className="text-sm text-stone-600 dark:text-stone-400">{t("pastPaper.emptyDescription")}</p>
            </>
          )}
        </section>
      )}
    </PortalPage>
  );
}
