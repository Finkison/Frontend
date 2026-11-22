import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { updateStudentProfile } from "../../services/studentService";
import { getApiErrorMessage } from "../../services/api";
import { useI18n } from "../../i18n";
import { 
  GraduationCap, 
  Sparkles, 
  BookOpen, 
  ArrowRight, 
  CheckCircle2, 
  Award,
  ChevronRight
} from "lucide-react";

interface OnboardingFlowProps {
  onComplete?: () => void;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps): React.ReactElement {
  const navigate = useNavigate();
  const { t } = useI18n();
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const gradeNum = parseInt(String(user?.grade || "").replace(/\D/g, "") || "12", 10);
  const isJunior = gradeNum <= 10;

  const [stream, setStream] = useState(isJunior ? "General Secondary" : (user?.stream || ""));
  const [targetScore, setTargetScore] = useState<number | null>(user?.targetScore ?? null);

  const handleFinish = async () => {
    if (!user) {
      setSaveError(t("studentSetup.accountError"));
      return;
    }

    setSaving(true);
    setSaveError(null);
    const savedStream = isJunior ? "General Secondary" : stream;
    try {
      await updateStudentProfile({ stream: savedStream, target_score: targetScore });
      updateUser({ stream: savedStream, targetScore });
      if (onComplete) onComplete();
      else navigate("/student");
    } catch (error: unknown) {
      setSaveError(getApiErrorMessage(error) || t("studentSetup.saveError"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#261E1A] rounded-3xl border border-stone-200 dark:border-white/10 shadow-2xl p-6 sm:p-10 max-w-2xl mx-auto">

      <div className="flex items-center justify-between pb-6 mb-8 border-b border-stone-100 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t("studentSetup.eyebrow")}</span>
          </div>
          <h2 className="font-sans text-2xl font-bold text-stone-900 dark:text-[#FDFBF7] mt-1">
            {currentStep === 1 && (isJunior ? t("studentSetup.curriculumTitle") : t("studentSetup.streamTitle"))}
            {currentStep === 2 && t("studentSetup.goalTitle")}
            {currentStep === 3 && t("studentSetup.reviewTitle")}
          </h2>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-stone-400 dark:text-[#A89C90]">{t("studentSetup.step", { current: currentStep, total: 3 })}</span>
          <div className="w-24 h-1.5 bg-stone-100 dark:bg-[#201815] rounded-full mt-1.5 overflow-hidden">
            <div 
              className="h-full bg-amber-500 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {currentStep === 1 && (
        <div className="space-y-6">
          {isJunior ? (
            <div className="p-6 rounded-2xl border border-emerald-200 bg-emerald-50/50 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 dark:text-[#FDFBF7] text-sm">
                    {t("studentSetup.gradeCurriculum", { grade: gradeNum })}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-[#E7E0D6] mt-1 leading-relaxed">
                    {t("studentSetup.juniorDescription")}
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3 pt-2 border-t border-emerald-200/60">
                <div className="bg-white/90 p-3 rounded-xl border border-emerald-100">
                  <p className="text-[11px] font-bold text-[#881337] dark:text-[#FBBF24] uppercase">{t("studentSetup.naturalSciences")}</p>
                  <p className="text-xs text-stone-600 dark:text-[#E7E0D6] mt-0.5">{t("studentSetup.naturalSubjects")}</p>
                </div>
                <div className="bg-white/90 p-3 rounded-xl border border-emerald-100">
                  <p className="text-[11px] font-bold text-amber-700 uppercase">{t("studentSetup.socialSciences")}</p>
                  <p className="text-xs text-stone-600 dark:text-[#E7E0D6] mt-0.5">{t("studentSetup.socialSubjects")}</p>
                </div>
                <div className="bg-white/90 p-3 rounded-xl border border-[#FECDD3] dark:border-[#881337]/50">
                  <p className="text-[11px] font-bold text-[#881337] uppercase">{t("studentSetup.coreFoundations")}</p>
                  <p className="text-xs text-stone-600 dark:text-[#E7E0D6] mt-0.5">{t("studentSetup.coreSubjects")}</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <p className="text-xs text-stone-500 dark:text-[#A89C90] leading-relaxed">
                {t("studentSetup.streamDescription")}
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setStream("Natural Science")}
                  className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                    stream === "Natural Science"
                      ? "border-[#881337] dark:border-[#FBBF24] bg-[#FFF1F2]/50 dark:bg-[#4C0519]/40 ring-2 ring-[#FECDD3] dark:ring-[#881337]/50"
                      : "border-stone-200 dark:border-white/10 hover:border-stone-300 hover:bg-stone-50 dark:hover:bg-white/5"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-[#FFE4E6] dark:bg-[#4C0519]/50 text-[#881337] dark:text-[#FBBF24] flex items-center justify-center mb-3">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-stone-900 dark:text-[#FDFBF7] text-sm">{t("studentSetup.naturalScience")}</h3>
                  <p className="text-xs text-stone-500 dark:text-[#A89C90] mt-1">
                    {t("studentSetup.naturalStreamDescription")}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setStream("Social Science")}
                  className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                    stream === "Social Science"
                      ? "border-amber-500 bg-amber-50/50 ring-2 ring-amber-200"
                      : "border-stone-200 dark:border-white/10 hover:border-stone-300 hover:bg-stone-50 dark:hover:bg-white/5"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                    <Award className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-stone-900 dark:text-[#FDFBF7] text-sm">{t("studentSetup.socialScience")}</h3>
                  <p className="text-xs text-stone-500 dark:text-[#A89C90] mt-1">
                    {t("studentSetup.socialStreamDescription")}
                  </p>
                </button>
              </div>
            </>
          )}

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              disabled={!isJunior && !stream}
              className="px-6 py-3 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-stone-950 text-sm flex items-center gap-2 cursor-pointer shadow"
            >
              <span>{t("studentSetup.continue")}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-6">
          <p className="text-sm leading-6 text-stone-600 dark:text-[#E7E0D6]">{t("studentSetup.goalDescription")}</p>
          <label className="flex min-h-12 items-center gap-3 rounded-xl border border-stone-200 px-4 py-3 text-sm font-medium text-stone-800 dark:border-white/10 dark:text-[#FDFBF7]">
            <input type="checkbox" checked={targetScore !== null} onChange={(event) => setTargetScore(event.target.checked ? (user?.targetScore ?? 500) : null)} className="h-4 w-4 accent-[#881337]" />
            {t("studentSetup.setGoal")}
          </label>
          {targetScore !== null ? (
            <div className="rounded-2xl border border-[#E7E0D6] bg-[#FAF8F5] p-5 dark:border-white/10 dark:bg-[#1C1512]">
              <div className="mb-2 flex items-center justify-between gap-4">
                <label htmlFor="onboarding-target-score" className="text-xs font-bold uppercase text-stone-700 dark:text-[#E7E0D6]">{t("studentSetup.targetScore")}</label>
                <span className="font-sans text-lg font-bold tabular-nums text-amber-700 dark:text-amber-300">{targetScore} / 600</span>
              </div>
              <input id="onboarding-target-score" type="range" min="250" max="600" step="5" value={targetScore} onChange={(event) => setTargetScore(Number(event.target.value))} className="w-full cursor-pointer accent-amber-500" />
              <p className="mt-2 text-xs leading-5 text-stone-500 dark:text-[#A89C90]">{t("studentSetup.goalControlHelp")}</p>
            </div>
          ) : <p className="rounded-xl bg-stone-50 px-4 py-3 text-xs leading-5 text-stone-600 dark:bg-white/5 dark:text-[#E7E0D6]">{t("studentSetup.goalOptionalHelp")}</p>}

          <div className="pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2.5 rounded-xl border border-stone-200 dark:border-white/10 text-stone-600 dark:text-[#E7E0D6] font-semibold text-xs hover:bg-stone-50 dark:hover:bg-white/5 cursor-pointer"
            >
              {t("studentSetup.back")}
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-6 py-3 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-stone-950 text-sm flex items-center gap-2 cursor-pointer shadow"
            >
              <span>{t("studentSetup.continue")}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{t("studentSetup.setupSummary")}</span>
            </div>
            <p className="text-xs text-amber-900/80 leading-relaxed">
              {targetScore !== null ? t("studentSetup.goalSummary", { score: targetScore }) : t("studentSetup.noGoalSummary")}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2.5 text-xs text-stone-700 dark:text-[#E7E0D6]">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{t("studentSetup.learningReady")}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-stone-700 dark:text-[#E7E0D6]">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{t("studentSetup.aiTutorReady")}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-stone-700 dark:text-[#E7E0D6]">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{t("studentSetup.progressSaved")}</span>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2.5 rounded-xl border border-stone-200 dark:border-white/10 text-stone-600 dark:text-[#E7E0D6] font-semibold text-xs hover:bg-stone-50 dark:hover:bg-white/5 cursor-pointer"
            >
              {t("studentSetup.back")}
            </button>
            <button
              type="button"
              onClick={() => void handleFinish()}
              disabled={saving}
              className="px-8 py-3.5 rounded-xl font-bold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-stone-950 text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer disabled:cursor-wait disabled:opacity-60"
            >
              <span>{saving ? t("studentSetup.saving") : t("studentSetup.finish")}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          {saveError && <p role="alert" className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{saveError}</p>}
        </div>
      )}
    </div>
  );
}
