import React, { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, FileCheck2, Loader2, Plus, Send, Sparkles } from "lucide-react";
import { approveAndPublishExam, generateStandardExam, getSubjectExamLimits, getTeacherAssignedPairs } from "../../services/schoolService";
import { useI18n } from "../../i18n";
import PageHeader from "../shared/PageHeader";
import PortalPage from "../shared/PortalPage";

type AssignedPair = {
  section_id: string | number;
  section_name?: string;
  grade?: string;
  subject_id: string | number;
  subject_name: string;
  can_publish?: boolean;
};

type GeneratedExam = {
  exam_id: string;
  title?: string;
  question_count?: number;
  duration_minutes?: number;
  total_marks?: number;
  questions: Array<{
    id?: string;
    question_text: string;
    options: string[];
    correct_answer?: number;
    explanation?: string;
    unit?: number;
    difficulty?: string;
  }>;
};

const assignmentKey = (pair: AssignedPair) => `${pair.subject_id}:${pair.section_id}`;

export default function AssessmentBuilderView(): React.ReactElement {
  const { t } = useI18n();
  const [assignments, setAssignments] = useState<AssignedPair[]>([]);
  const [subjectLimits, setSubjectLimits] = useState<Record<string, number>>({});
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedSectionIds, setSelectedSectionIds] = useState<string[]>([]);
  const [unitScope, setUnitScope] = useState<"all" | "unit">("all");
  const [unitNumber, setUnitNumber] = useState(1);
  const [questionCount, setQuestionCount] = useState(20);
  const [difficultyMix, setDifficultyMix] = useState({ easy: 30, medium: 50, hard: 20 });
  const [context, setContext] = useState("");
  const [assignmentsLoading, setAssignmentsLoading] = useState(true);
  const [assignmentsError, setAssignmentsError] = useState(false);
  const [assignmentRetryKey, setAssignmentRetryKey] = useState(0);
  const [generationError, setGenerationError] = useState("");
  const [publishingError, setPublishingError] = useState("");
  const [generating, setGenerating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [exam, setExam] = useState<GeneratedExam | null>(null);
  const [published, setPublished] = useState(false);

  useEffect(() => {
    let isCurrent = true;
    Promise.all([getTeacherAssignedPairs(), getSubjectExamLimits()])
      .then(([assignmentResponse, limitsResponse]) => {
        if (!isCurrent) return;
        const rawPairs = Array.isArray(assignmentResponse.data?.pairs) ? assignmentResponse.data.pairs : [];
        const pairs: AssignedPair[] = rawPairs.map((pair: any) => ({
          ...pair,
          section_id: String(pair.section_id),
          subject_id: String(pair.subject_id),
        }));
        setAssignments(pairs);
        setSelectedSubjectId(pairs[0] ? String(pairs[0].subject_id) : "");
        setSubjectLimits(limitsResponse.data?.limits || {});
      })
      .catch(() => {
        if (isCurrent) setAssignmentsError(true);
      })
      .finally(() => {
        if (isCurrent) setAssignmentsLoading(false);
      });
    return () => { isCurrent = false; };
  }, [assignmentRetryKey]);

  const availableSubjects = useMemo(() => {
    const byId = new Map<string, string>();
    assignments.forEach((pair) => byId.set(String(pair.subject_id), pair.subject_name));
    return Array.from(byId, ([id, name]) => ({ id, name }));
  }, [assignments]);
  const availableSections = assignments.filter((pair) => pair.subject_id === selectedSubjectId);
  const selectedSubject = availableSubjects.find((subject) => subject.id === selectedSubjectId);
  const maxQuestions = Number(subjectLimits[selectedSubjectId]) || 0;
  const selectedAssignments = availableSections.filter((pair) => selectedSectionIds.includes(String(pair.section_id)));
  const canPublish = selectedAssignments.length > 0 && selectedAssignments.every((pair) => pair.can_publish !== false);
  const getDifficultyLabel = (difficulty: string) => {
    const normalized = difficulty.toLowerCase();
    return ["easy", "medium", "hard"].includes(normalized)
      ? t(`teacherAssessmentBuilder.${normalized}`)
      : difficulty;
  };

  useEffect(() => {
    setSelectedSectionIds(availableSections[0] ? [String(availableSections[0].section_id)] : []);
    setExam(null);
    setPublished(false);
    setGenerationError("");
    setPublishingError("");
  }, [selectedSubjectId]);

  const toggleSection = (sectionId: string) => {
    setSelectedSectionIds((current) => current.includes(sectionId)
      ? current.filter((id) => id !== sectionId)
      : [...current, sectionId]);
  };

  const handleGenerate = async (event: React.FormEvent) => {
    event.preventDefault();
    setGenerationError("");
    setPublishingError("");
    setExam(null);
    setPublished(false);
    if (!selectedSubjectId || selectedSectionIds.length === 0 || maxQuestions < 1) {
      setGenerationError(t("teacherAssessmentBuilder.selectSubjectAndClass"));
      return;
    }

    setGenerating(true);
    try {
      const response = await generateStandardExam({
        subject_id: selectedSubjectId,
        section_ids: selectedSectionIds,
        scope: unitScope === "all" ? "all" : String(unitNumber),
        question_count: Math.min(Math.max(1, questionCount), maxQuestions),
        difficulty_mix: difficultyMix,
        shuffle: true,
        context: context.trim(),
        include_explanations: true,
      });
      const data = response.data?.data || response.data || {};
      if (data.success === false || !data.exam_id || !Array.isArray(data.questions)) {
        throw new Error(data.error || "generation_failed");
      }
      setExam(data as GeneratedExam);
    } catch (error: any) {
      setGenerationError(t("teacherAssessmentBuilder.generationError"));
    } finally {
      setGenerating(false);
    }
  };

  const handlePublish = async () => {
    if (!exam?.exam_id) return;
    setPublishing(true);
    setPublishingError("");
    try {
      const response = await approveAndPublishExam({ exam_id: exam.exam_id, section_ids: selectedSectionIds });
      if (response.data?.success === false) throw new Error(response.data?.error || "publish_failed");
      setPublished(true);
    } catch (error: any) {
      setPublishingError(t("teacherAssessmentBuilder.publishError"));
    } finally {
      setPublishing(false);
    }
  };

  return (
    <PortalPage className="space-y-6">
      <PageHeader
        eyebrow={t("teacherAssessmentBuilder.eyebrow")}
        title={t("teacherAssessmentBuilder.title")}
        description={t("teacherAssessmentBuilder.description")}
      />

      <div className="flex gap-3 rounded-xl border border-sky-200 bg-sky-50 p-4 text-xs leading-5 text-sky-950 dark:border-sky-900/40 dark:bg-sky-950/20 dark:text-sky-100">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <p>{t("teacherAssessmentBuilder.transparencyNote")}</p>
      </div>

      {assignmentsLoading ? (
        <div role="status" className="rounded-2xl border border-stone-200 bg-white p-8 text-center text-sm text-stone-500 dark:border-white/10 dark:bg-[#261E1A] dark:text-[#A89C90]">{t("teacherAssessmentBuilder.loadingAssignments")}</div>
      ) : assignmentsError ? (
        <div role="alert" className="flex flex-col gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200 sm:flex-row sm:items-center sm:justify-between"><p>{t("teacherAssessmentBuilder.assignmentsError")}</p><button type="button" onClick={() => { setAssignmentsError(false); setAssignmentsLoading(true); setAssignmentRetryKey((current) => current + 1); }} className="min-h-10 self-start rounded-lg border border-rose-300 px-3 text-xs font-semibold hover:bg-rose-100 sm:self-auto">{t("teacherAssessmentBuilder.retry")}</button></div>
      ) : availableSubjects.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center dark:border-white/15 dark:bg-[#261E1A]">
          <h2 className="text-base font-semibold text-stone-900 dark:text-[#FDFBF7]">{t("teacherAssessmentBuilder.assignmentRequiredTitle")}</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-stone-600 dark:text-[#E7E0D6]">{t("teacherAssessmentBuilder.assignmentRequiredDescription")}</p>
        </section>
      ) : (
        <>
          <form onSubmit={handleGenerate} className="grid gap-5 rounded-2xl border border-stone-200 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-[#261E1A] lg:grid-cols-[minmax(0,1fr)_18rem] sm:p-6">
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="exam-subject" className="text-xs font-semibold text-stone-700 dark:text-[#E7E0D6]">{t("teacherAssessmentBuilder.subject")}</label>
                  <select id="exam-subject" value={selectedSubjectId} onChange={(event) => setSelectedSubjectId(event.target.value)} className="min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-800 focus:border-[#881337] focus:outline-none focus:ring-2 focus:ring-[#881337]/20 dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]">{availableSubjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}</select>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="exam-count" className="text-xs font-semibold text-stone-700 dark:text-[#E7E0D6]">{t("teacherAssessmentBuilder.questionCount", { maximum: maxQuestions || t("teacherAssessmentBuilder.unavailable") })}</label>
                  <input id="exam-count" type="number" min={1} max={maxQuestions || undefined} value={questionCount} onChange={(event) => setQuestionCount(Number(event.target.value))} disabled={maxQuestions < 1} required className="min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-800 focus:border-[#881337] focus:outline-none focus:ring-2 focus:ring-[#881337]/20 disabled:opacity-60 dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]" />
                </div>
              </div>

              <fieldset className="space-y-2">
                <legend className="text-xs font-semibold text-stone-700 dark:text-[#E7E0D6]">{t("teacherAssessmentBuilder.assignedClasses")}</legend>
                <div className="flex flex-wrap gap-2">
                  {availableSections.map((pair) => {
                    const id = String(pair.section_id);
                    const checked = selectedSectionIds.includes(id);
                    return <label key={assignmentKey(pair)} className={`inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border px-3 text-xs font-semibold transition-colors ${checked ? "border-[#881337] bg-[#FFF1F2] text-[#881337] dark:border-[#FBBF24] dark:bg-[#4C0519]/40 dark:text-[#FBBF24]" : "border-stone-300 text-stone-600 hover:bg-stone-50 dark:border-white/15 dark:text-[#E7E0D6] dark:hover:bg-white/5"}`}><input type="checkbox" checked={checked} onChange={() => toggleSection(id)} className="h-4 w-4 accent-[#881337]" />{pair.section_name || pair.grade || t("teacherAssessmentBuilder.classLabel", { id })}</label>;
                  })}
                </div>
              </fieldset>

              <fieldset className="space-y-2">
                <legend className="text-xs font-semibold text-stone-700 dark:text-[#E7E0D6]">{t("teacherAssessmentBuilder.questionScope")}</legend>
                <div className="flex flex-wrap gap-2">
                  <label className={`inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border px-3 text-xs font-medium ${unitScope === "all" ? "border-[#881337] bg-[#FFF1F2] text-[#881337] dark:bg-[#4C0519]/40 dark:text-[#FBBF24]" : "border-stone-300 text-stone-600 dark:border-white/15 dark:text-[#E7E0D6]"}`}><input type="radio" name="exam-scope" checked={unitScope === "all"} onChange={() => setUnitScope("all")} className="accent-[#881337]" />{t("teacherAssessmentBuilder.allUnits")}</label>
                  <label className={`inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border px-3 text-xs font-medium ${unitScope === "unit" ? "border-[#881337] bg-[#FFF1F2] text-[#881337] dark:bg-[#4C0519]/40 dark:text-[#FBBF24]" : "border-stone-300 text-stone-600 dark:border-white/15 dark:text-[#E7E0D6]"}`}><input type="radio" name="exam-scope" checked={unitScope === "unit"} onChange={() => setUnitScope("unit")} className="accent-[#881337]" />{t("teacherAssessmentBuilder.oneUnit")}</label>
                  {unitScope === "unit" && <label className="inline-flex items-center gap-2 text-xs text-stone-600 dark:text-[#E7E0D6]">{t("teacherAssessmentBuilder.unitLabel")} <input type="number" min={1} max={99} value={unitNumber} onChange={(event) => setUnitNumber(Number(event.target.value))} className="min-h-10 w-20 rounded-lg border border-stone-300 bg-white px-2 text-sm text-stone-900 dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]" /></label>}
                </div>
              </fieldset>

              <fieldset className="space-y-2">
                <legend className="text-xs font-semibold text-stone-700 dark:text-[#E7E0D6]">{t("teacherAssessmentBuilder.difficultyMix")} <span className="font-normal text-stone-500">({t("teacherAssessmentBuilder.mustTotal")})</span></legend>
                <div className="grid grid-cols-3 gap-3">
                  {(["easy", "medium", "hard"] as const).map((level) => (
                    <label key={level} className="space-y-1 text-xs font-medium capitalize text-stone-600 dark:text-[#A89C90]">{t(`teacherAssessmentBuilder.${level}`)}
                      <div className="relative"><input type="number" min={0} max={100} value={difficultyMix[level]} onChange={(event) => setDifficultyMix((current) => ({ ...current, [level]: Number(event.target.value) }))} className="min-h-10 w-full rounded-lg border border-stone-300 bg-white px-3 pr-8 text-sm text-stone-900 dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs">%</span></div>
                    </label>
                  ))}
                </div>
                <p className={`text-xs ${difficultyMix.easy + difficultyMix.medium + difficultyMix.hard === 100 ? "text-stone-500 dark:text-[#A89C90]" : "text-rose-700 dark:text-rose-200"}`}>{t("teacherAssessmentBuilder.total")}: {difficultyMix.easy + difficultyMix.medium + difficultyMix.hard}%</p>
              </fieldset>

              <div className="space-y-1.5">
                <label htmlFor="exam-context" className="text-xs font-semibold text-stone-700 dark:text-[#E7E0D6]">{t("teacherAssessmentBuilder.teacherNotes")}</label>
                <textarea id="exam-context" value={context} onChange={(event) => setContext(event.target.value)} maxLength={1000} rows={3} placeholder={t("teacherAssessmentBuilder.teacherNotesPlaceholder")} className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-800 focus:border-[#881337] focus:outline-none focus:ring-2 focus:ring-[#881337]/20 dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]" />
                <p className="text-right text-[11px] text-stone-500 dark:text-[#A89C90]">{context.length}/1000</p>
              </div>
              {generationError && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200">{generationError}</p>}
              <button type="submit" disabled={generating || selectedSectionIds.length === 0 || maxQuestions < 1 || questionCount < 1 || questionCount > maxQuestions || difficultyMix.easy + difficultyMix.medium + difficultyMix.hard !== 100} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#881337] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#9F1239] disabled:cursor-wait disabled:opacity-60">{generating ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}{generating ? t("teacherAssessmentBuilder.buildingDraft") : t("teacherAssessmentBuilder.buildDraft")}</button>
            </div>

            <aside className="rounded-xl border border-stone-200 bg-[#FAF8F5] p-4 dark:border-white/10 dark:bg-[#1C1512]">
              <h2 className="text-sm font-semibold text-stone-900 dark:text-[#FDFBF7]">{t("teacherAssessmentBuilder.beforePublish")}</h2>
              <ul className="mt-3 space-y-2 text-xs leading-5 text-stone-600 dark:text-[#A89C90]"><li>{t("teacherAssessmentBuilder.confirmSelection")}</li><li>{t("teacherAssessmentBuilder.checkAnswerKey")}</li><li>{t("teacherAssessmentBuilder.draftNotAssigned")}</li></ul>
            </aside>
          </form>

          {exam && (
            <section className="space-y-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-[#261E1A] sm:p-6" aria-labelledby="exam-preview-heading">
              <header className="flex flex-col gap-3 border-b border-stone-200 pb-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
                <div><div className="inline-flex items-center gap-2 text-xs font-semibold text-[#881337] dark:text-[#FBBF24]"><FileCheck2 className="h-4 w-4" aria-hidden="true" />{t("teacherAssessmentBuilder.draftPreview")}</div><h2 id="exam-preview-heading" className="mt-1 text-lg font-semibold text-stone-900 dark:text-[#FDFBF7]">{exam.title || t("teacherAssessmentBuilder.assessmentTitle", { subject: selectedSubject?.name || t("teacherAssessmentBuilder.subject") })}</h2><p className="mt-1 text-xs text-stone-500 dark:text-[#A89C90]">{t("teacherAssessmentBuilder.assessmentMeta", { questionCount: exam.questions.length, duration: exam.duration_minutes ? t("teacherAssessmentBuilder.minutes", { count: exam.duration_minutes }) : t("teacherAssessmentBuilder.unavailable"), marks: exam.total_marks ?? t("teacherAssessmentBuilder.unavailable") })}</p></div>
                <div className="flex flex-col gap-2 sm:items-end">{published ? <span role="status" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300"><CheckCircle2 className="h-4 w-4" aria-hidden="true" />{t("teacherAssessmentBuilder.published")}</span> : <button type="button" onClick={() => void handlePublish()} disabled={publishing || exam.questions.length === 0 || !canPublish} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#881337] px-4 text-sm font-semibold text-white hover:bg-[#9F1239] disabled:cursor-not-allowed disabled:opacity-60"><Send className="h-4 w-4" aria-hidden="true" />{publishing ? t("teacherAssessmentBuilder.publishing") : t("teacherAssessmentBuilder.publishSelected")}</button>}{!published && selectedSectionIds.length === 0 && <p className="max-w-xs text-right text-xs text-amber-700 dark:text-amber-200">{t("teacherAssessmentBuilder.selectClassToPublish")}</p>}{!published && selectedAssignments.some((pair) => pair.can_publish === false) && <p className="max-w-xs text-right text-xs text-amber-700 dark:text-amber-200">{t("teacherAssessmentBuilder.substituteCannotPublish")}</p>}{publishingError && <p role="alert" className="text-xs text-rose-700 dark:text-rose-200">{publishingError}</p>}</div>
              </header>
              {exam.questions.length === 0 ? <p className="rounded-lg border border-dashed border-stone-300 p-5 text-sm text-stone-600 dark:border-white/15 dark:text-[#E7E0D6]">{t("teacherAssessmentBuilder.noMatchingQuestions")}</p> : <div className="space-y-3">{exam.questions.map((question, index) => <article key={question.id || `${index}-${question.question_text}`} className="rounded-xl border border-stone-200 p-4 dark:border-white/10"><div className="flex flex-wrap items-center gap-2 text-[11px] text-stone-500 dark:text-[#A89C90]">{question.unit != null && <span>{t("teacherAssessmentBuilder.unitLabel")} {question.unit}</span>}{question.difficulty && <span>{getDifficultyLabel(question.difficulty)}</span>}</div><h3 className="mt-2 text-sm font-semibold leading-6 text-stone-900 dark:text-[#FDFBF7]">{index + 1}. {question.question_text}</h3><ol className="mt-3 grid gap-2 sm:grid-cols-2">{question.options.map((option, optionIndex) => <li key={optionIndex} className={`rounded-lg border px-3 py-2 text-xs leading-5 ${optionIndex === question.correct_answer ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-100" : "border-stone-200 bg-[#FAF8F5] text-stone-700 dark:border-white/10 dark:bg-[#1C1512] dark:text-[#E7E0D6]"}`}><span className="mr-2 font-semibold">{String.fromCharCode(65 + optionIndex)}.</span>{option}{optionIndex === question.correct_answer && <span className="ml-2 text-[10px] font-semibold">{t("teacherAssessmentBuilder.correctAnswer")}</span>}</li>)}</ol>{question.explanation && <p className="mt-3 border-t border-stone-100 pt-3 text-xs leading-5 text-stone-600 dark:border-white/10 dark:text-[#A89C90]">{question.explanation}</p>}</article>)}</div>}
            </section>
          )}
        </>
      )}
    </PortalPage>
  );
}
