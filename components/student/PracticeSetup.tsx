import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, BookOpen, GraduationCap, Loader2 } from "lucide-react";
import { startPractice } from "../../services/practiceService";
import { getPracticeUnits } from "../../services/curriculumService";
import useSessionStore from "../../store/sessionStore";
import useAuthStore from "../../store/authStore";
import { useI18n } from "../../i18n";
import PageHeader from "../shared/PageHeader";
import PortalPage from "../shared/PortalPage";
import useScope, {
  GRADE_9_10_CORE_COURSES,
  GRADE_9_10_NATURAL_COURSES,
  GRADE_9_10_SOCIAL_COURSES,
  SENIOR_NATURAL_SCIENCE_SUBJECTS,
  SENIOR_SOCIAL_SCIENCE_SUBJECTS,
} from "../../hooks/useScope";

type PracticeMode = "unit" | "adaptive";
type AvailablePracticeUnit = { unit: number; question_count: number };

function getSubjectGroups(grade: number, stream: string): Array<{ labelKey: string; subjects: string[] }> {
  if (grade <= 10) {
    return [
      { labelKey: "coreSubjects", subjects: GRADE_9_10_CORE_COURSES },
      { labelKey: "naturalSciences", subjects: GRADE_9_10_NATURAL_COURSES },
      { labelKey: "socialSciences", subjects: GRADE_9_10_SOCIAL_COURSES },
    ];
  }
  return [{
    labelKey: stream === "Social Science" ? "socialScienceStream" : "naturalScienceStream",
    subjects: stream === "Social Science" ? SENIOR_SOCIAL_SCIENCE_SUBJECTS : SENIOR_NATURAL_SCIENCE_SUBJECTS,
  }];
}

const subjectLabelKeys: Record<string, string> = {
  Mathematics: "mathematics",
  Physics: "physics",
  Chemistry: "chemistry",
  Biology: "biology",
  English: "english",
  Aptitude: "aptitude",
  History: "history",
  Geography: "geography",
  Economics: "economics",
  Civics: "civics",
  "Information Technology": "informationTechnology",
};

export default function PracticeSetup(): ReactElement {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useI18n();
  const startSession = useSessionStore((state) => state.startSession);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const scope = useScope();
  const requestedGrade = Number(searchParams.get("grade"));
  const initialGrade = [9, 10, 11, 12].includes(requestedGrade)
    ? requestedGrade as typeof scope.gradeLevel
    : scope.gradeLevel;
  const initialGroups = getSubjectGroups(initialGrade, scope.stream);
  const initialSubjects = initialGroups.flatMap((group) => group.subjects);
  const requestedSubject = searchParams.get("subject") || "";
  const initialSubject = initialSubjects.includes(requestedSubject)
    ? requestedSubject
    : scope.availableSubjects.find((item) => initialSubjects.includes(item)) || initialSubjects[0] || "Mathematics";
  const requestedMode = searchParams.get("mode");
  const requestedUnit = Number(searchParams.get("unit"));
  const initialMode: PracticeMode = requestedMode === "adaptive" ? "adaptive" : "unit";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<PracticeMode>(initialMode);
  const [grade, setGrade] = useState(initialGrade);
  const [subject, setSubject] = useState(initialSubject);
  const [unit, setUnit] = useState(Number.isInteger(requestedUnit) && requestedUnit > 0 ? requestedUnit : 1);
  const subjectGroups = getSubjectGroups(grade, scope.stream);
  const unitsQuery = useQuery(["practiceUnits", subject, grade], () => getPracticeUnits(subject, grade), {
    enabled: mode === "unit",
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
  const availableUnits: AvailablePracticeUnit[] = Array.isArray(unitsQuery.data?.data?.data) ? unitsQuery.data.data.data : [];

  const signInForPractice = () => {
    const query = new URLSearchParams({ grade: String(grade), subject, mode, unit: String(unit) });
    navigate("/login", {
      state: { from: { pathname: "/student/practice", search: `?${query.toString()}` } },
    });
  };

  useEffect(() => {
    if (mode !== "unit" || unitsQuery.isLoading || unitsQuery.isError || availableUnits.length === 0) return;
    if (!availableUnits.some((item) => item.unit === unit)) setUnit(availableUnits[0].unit);
  }, [mode, unitsQuery.isLoading, unitsQuery.isError, availableUnits, unit]);

  const onStart = async () => {
    if (!isAuthenticated) {
      signInForPractice();
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await startPractice({
        mode,
        subject,
        grade,
        ...(mode === "unit" ? { unit } : {}),
      });
      const data = response.data?.data || response.data || {};
      if (!data.id || !Array.isArray(data.questions) || data.questions.length === 0) {
        setError(t("practiceSetup.noQuestionsAvailable"));
        return;
      }
      startSession(data.id, data.session_type || mode, data.questions, data.duration_seconds || data.duration || 2700);
      navigate("/student/session");
    } catch {
      setError(t("practiceSetup.startError"));
    } finally {
      setLoading(false);
    }
  };

  const selectClass = "mt-1 min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-800 outline-none transition-colors focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/15 dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]";

  return (
    <PortalPage className="max-w-3xl space-y-5">
      <button type="button" onClick={() => navigate("/student")} className="inline-flex min-h-10 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:text-[#E7E0D6] dark:hover:bg-white/5 dark:hover:text-[#FDFBF7]">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />{t("practiceSetup.backToOverview")}
      </button>

      <PageHeader
        eyebrow={t("practiceSetup.eyebrow")}
        title={t("practiceSetup.title")}
        description={t("practiceSetup.description")}
        secondaryActions={[{ label: t("practiceSetup.browseExamPractice"), href: "/student/exams", icon: GraduationCap }]}
      />

      {!isAuthenticated && (
        <div className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-amber-950 dark:text-amber-100">{t("practiceSetup.signInNotice")}</p>
          <button type="button" onClick={signInForPractice} className="min-h-10 self-start rounded-lg border border-amber-300 bg-white px-3 text-xs font-semibold text-amber-950 hover:bg-amber-100 dark:bg-[#261E1A] dark:text-amber-100">{t("practiceSetup.signIn")}</button>
        </div>
      )}

      <section className="space-y-6 rounded-2xl border border-stone-200 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-[#261E1A] sm:p-6" aria-labelledby="practice-options-heading">
        <div>
          <h2 id="practice-options-heading" className="text-base font-semibold text-stone-900 dark:text-[#FDFBF7]">{t("practiceSetup.optionsTitle")}</h2>
          <p className="mt-1 text-xs text-stone-500 dark:text-[#A89C90]">{t("practiceSetup.optionsDescription")}</p>
        </div>

        {grade <= 10 && (
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs leading-5 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-100">
            {t("practiceSetup.gradeFoundations", { grade })}
          </p>
        )}

        <fieldset className="space-y-2">
          <legend className="mb-2 text-sm font-semibold text-stone-800 dark:text-[#E7E0D6]">{t("practiceSetup.modeLabel")}</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition-colors ${mode === "unit" ? "border-[#881337] bg-[#FFF1F2]/70 ring-1 ring-[#881337]/20 dark:border-[#FBBF24] dark:bg-[#4C0519]/30" : "border-stone-200 hover:bg-stone-50 dark:border-white/10 dark:hover:bg-white/5"}`}>
              <input type="radio" name="practice-mode" value="unit" checked={mode === "unit"} onChange={() => setMode("unit")} className="mt-0.5 h-4 w-4 accent-[#881337]" />
              <span className="min-w-0"><span className="block text-sm font-semibold text-stone-900 dark:text-[#FDFBF7]">{t("practiceSetup.unitMode")}</span><span className="mt-1 block text-xs leading-5 text-stone-600 dark:text-[#A89C90]">{t("practiceSetup.unitModeDescription")}</span></span>
            </label>
            <label className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition-colors ${mode === "adaptive" ? "border-[#881337] bg-[#FFF1F2]/70 ring-1 ring-[#881337]/20 dark:border-[#FBBF24] dark:bg-[#4C0519]/30" : "border-stone-200 hover:bg-stone-50 dark:border-white/10 dark:hover:bg-white/5"}`}>
              <input type="radio" name="practice-mode" value="adaptive" checked={mode === "adaptive"} onChange={() => setMode("adaptive")} className="mt-0.5 h-4 w-4 accent-[#881337]" />
              <span className="min-w-0"><span className="block text-sm font-semibold text-stone-900 dark:text-[#FDFBF7]">{t("practiceSetup.adaptiveMode")}</span><span className="mt-1 block text-xs leading-5 text-stone-600 dark:text-[#A89C90]">{t("practiceSetup.adaptiveModeDescription")}</span></span>
            </label>
          </div>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-stone-800 dark:text-[#E7E0D6]" htmlFor="practice-subject">{t("practiceSetup.subject")}
            <select id="practice-subject" value={subject} onChange={(event) => setSubject(event.target.value)} className={selectClass}>
              {subjectGroups.map((group) => <optgroup key={group.labelKey} label={t(`practiceSetup.subjectGroups.${group.labelKey}`)}>{group.subjects.map((item) => <option key={item} value={item}>{subjectLabelKeys[item] ? t(`practiceSetup.subjects.${subjectLabelKeys[item]}`) : item}</option>)}</optgroup>)}
            </select>
          </label>

          <label className="block text-sm font-semibold text-stone-800 dark:text-[#E7E0D6]" htmlFor="practice-grade">{t("practiceSetup.grade")}
            <select id="practice-grade" value={grade} onChange={(event) => {
              const nextGrade = Number(event.target.value);
              const nextGroups = getSubjectGroups(nextGrade, scope.stream);
              const nextSubjects = nextGroups.flatMap((group) => group.subjects);
              setGrade(nextGrade as typeof grade);
              if (!nextSubjects.includes(subject)) setSubject(nextSubjects[0] || "Mathematics");
            }} className={selectClass}>
              {[9, 10, 11, 12].map((value) => <option key={value} value={value}>{t("practiceSetup.gradeOption", { grade: value })}</option>)}
            </select>
          </label>
        </div>

        {mode === "unit" && (
          unitsQuery.isLoading ? (
            <p role="status" className="rounded-lg border border-stone-200 bg-stone-50 p-3 text-xs text-stone-600 dark:border-white/10 dark:bg-[#1C1512] dark:text-[#A89C90]">{t("practiceSetup.unitsLoading")}</p>
          ) : unitsQuery.isError ? (
            <div role="alert" className="flex flex-col gap-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200 sm:flex-row sm:items-center sm:justify-between"><p>{t("practiceSetup.unitsError")}</p><button type="button" onClick={() => void unitsQuery.refetch()} className="min-h-9 self-start rounded-lg border border-rose-300 px-3 font-semibold hover:bg-rose-100 sm:self-auto">{t("practiceSetup.retry")}</button></div>
          ) : availableUnits.length === 0 ? (
            <div className="rounded-lg border border-dashed border-stone-300 p-4 dark:border-white/15">
              <p className="text-sm font-semibold text-stone-800 dark:text-[#FDFBF7]">{t("practiceSetup.noUnitQuestionsTitle")}</p>
              <p className="mt-1 text-xs leading-5 text-stone-600 dark:text-[#A89C90]">{t("practiceSetup.noUnitQuestionsDescription")}</p>
            </div>
          ) : (
            <label className="block max-w-sm text-sm font-semibold text-stone-800 dark:text-[#E7E0D6]" htmlFor="practice-unit">{t("practiceSetup.unit")}
              <select id="practice-unit" value={unit} onChange={(event) => setUnit(Number(event.target.value))} className={selectClass}>
                {availableUnits.map((item) => <option key={item.unit} value={item.unit}>{t(item.question_count === 1 ? "practiceSetup.unitOptionOne" : "practiceSetup.unitOptionMany", { unit: item.unit, count: item.question_count })}</option>)}
              </select>
              <span className="mt-1 block text-xs font-normal text-stone-500 dark:text-[#A89C90]">{t("practiceSetup.availableUnitsHelp")}</span>
            </label>
          )
        )}

        {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200">{error}</div>}

        <div className="flex flex-col-reverse gap-2 border-t border-stone-100 pt-4 dark:border-white/10 sm:flex-row sm:justify-end">
          <button type="button" onClick={() => navigate("/student")} className="min-h-11 rounded-lg border border-stone-300 px-4 text-sm font-semibold text-stone-700 hover:bg-stone-50 dark:border-white/15 dark:text-[#E7E0D6] dark:hover:bg-white/5">{t("practiceSetup.cancel")}</button>
          <button type="button" onClick={() => void onStart()} disabled={loading || (mode === "unit" && (unitsQuery.isLoading || unitsQuery.isError || availableUnits.length === 0))} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#881337] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#9F1239] focus:outline-none focus:ring-2 focus:ring-[#881337] focus:ring-offset-2 disabled:cursor-wait disabled:opacity-60">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />{t("practiceSetup.starting")}</> : !isAuthenticated ? t("practiceSetup.signInToStart") : <>{t("practiceSetup.startPractice")} <ArrowRight className="h-4 w-4" aria-hidden="true" /></>}
          </button>
        </div>
      </section>
    </PortalPage>
  );
}
