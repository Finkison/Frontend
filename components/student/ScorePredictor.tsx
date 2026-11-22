import React, { useCallback, useEffect, useState } from "react";
import { AlertCircle, BookOpen, Save, Target, TrendingUp } from "lucide-react";
import { getScoreTrajectory, updateStudentProfile } from "../../services/studentService";
import { useToast } from "../ui/Toast";
import { useI18n } from "../../i18n";
import PageHeader from "../shared/PageHeader";
import PortalPage from "../shared/PortalPage";

export default function ScorePredictor(): React.ReactElement {
  const { showToast } = useToast();
  const { t } = useI18n();
  const [predictedScore, setPredictedScore] = useState<number | null>(null);
  const [targetScore, setTargetScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [savingTarget, setSavingTarget] = useState(false);

  const loadOverview = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const response = await getScoreTrajectory();
      const data = response.data || {};
      setPredictedScore(data.has_score_evidence === true && typeof data.current_predicted_score === "number" ? data.current_predicted_score : null);
      setTargetScore(data.has_custom_target === true && typeof data.target_score === "number" ? data.target_score : null);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOverview();
  }, [loadOverview]);

  const handleSaveGoal = async () => {
    if (targetScore === null || !Number.isFinite(targetScore) || targetScore < 250 || targetScore > 600) return;
    setSavingTarget(true);
    try {
      await updateStudentProfile({ target_score: targetScore });
      showToast({ type: "success", title: t("scoreOverview.goalSaved"), message: t("scoreOverview.goalSavedMessage") });
    } catch (error: any) {
      showToast({ type: "error", title: t("scoreOverview.goalSaveFailed"), message: error?.response?.data?.error || t("scoreOverview.goalSaveFailedMessage") });
    } finally {
      setSavingTarget(false);
    }
  };

  const targetGap = predictedScore !== null && targetScore !== null ? targetScore - predictedScore : null;
  const targetProgress = predictedScore !== null && targetScore !== null && targetScore > 0
    ? Math.max(0, Math.min(100, Math.round((predictedScore / targetScore) * 100)))
    : null;

  return (
    <PortalPage className="max-w-5xl space-y-6">
      <PageHeader
        eyebrow={t("scoreOverview.eyebrow")}
        title={t("scoreOverview.title")}
        description={t("scoreOverview.description")}
      />

      {loadError ? (
        <section role="alert" className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <div className="flex-1"><p className="font-semibold">{t("scoreOverview.loadErrorTitle")}</p><p className="mt-1 text-xs">{t("scoreOverview.loadErrorDescription")}</p><button type="button" onClick={() => void loadOverview()} className="mt-3 inline-flex min-h-9 items-center rounded-lg border border-rose-400 px-3 text-xs font-semibold hover:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-500 dark:border-rose-700 dark:hover:bg-rose-900/30">{t("scoreOverview.retry")}</button></div>
        </section>
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-3" aria-label={t("scoreOverview.summaryLabel")}>
            <article className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-[#261E1A]">
              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-[#A89C90]"><span>{t("scoreOverview.estimateLabel")}</span><TrendingUp className="h-4 w-4 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" /></div>
              <p className="mt-4 font-mono text-3xl font-semibold tabular-nums text-stone-900 dark:text-[#FDFBF7]">{loading ? "…" : predictedScore ?? <span className="font-sans text-base font-medium text-stone-500 dark:text-[#A89C90]">{t("scoreOverview.noEstimate")}</span>}</p>
              <p className="mt-2 text-xs text-stone-500 dark:text-[#A89C90]">{t("scoreOverview.estimateSource")}</p>
            </article>

            <article className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-xs dark:border-amber-900/40 dark:bg-amber-950/20">
              <div className="flex items-center justify-between text-xs text-amber-900 dark:text-amber-100"><span>{t("scoreOverview.targetLabel")}</span><Target className="h-4 w-4" aria-hidden="true" /></div>
              <p className="mt-4 font-mono text-3xl font-semibold tabular-nums text-stone-900 dark:text-[#FDFBF7]">{loading ? "…" : targetScore ?? <span className="font-sans text-base font-medium text-stone-600 dark:text-[#A89C90]">{t("scoreOverview.notSet")}</span>}</p>
              <p className="mt-2 text-xs text-amber-900/80 dark:text-amber-100/80">{t("scoreOverview.targetHint")}</p>
            </article>

            <article className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-[#261E1A]">
              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-[#A89C90]"><span>{t("scoreOverview.gapLabel")}</span><Target className="h-4 w-4 text-stone-400 dark:text-[#A89C90]" aria-hidden="true" /></div>
              <p className="mt-4 font-mono text-3xl font-semibold tabular-nums text-stone-900 dark:text-[#FDFBF7]">{loading ? "…" : targetGap === null ? "—" : targetGap <= 0 ? t("scoreOverview.goalReached") : targetGap}</p>
              <p className="mt-2 text-xs text-stone-500 dark:text-[#A89C90]">{targetGap !== null && targetGap > 0 ? t("scoreOverview.gapDescription") : t("scoreOverview.gapBasis")}</p>
            </article>
          </section>

          <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_19rem]">
            <article className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-[#261E1A] sm:p-6">
              <h2 className="text-base font-semibold text-stone-900 dark:text-[#FDFBF7]">{t("scoreOverview.progressTitle")}</h2>
              <p className="mt-1 text-xs leading-5 text-stone-500 dark:text-[#A89C90]">{t("scoreOverview.progressDescription")}</p>
              {targetProgress === null ? (
                <p className="mt-6 rounded-lg border border-dashed border-stone-300 p-4 text-sm text-stone-600 dark:border-white/15 dark:text-[#E7E0D6]">{t("scoreOverview.progressEmpty")}</p>
              ) : (
                <div className="mt-6">
                  <div className="flex items-end justify-between gap-3"><span className="text-3xl font-semibold tabular-nums text-[#881337] dark:text-[#FBBF24]">{targetProgress}%</span><span className="text-xs text-stone-500 dark:text-[#A89C90]">{t("scoreOverview.towardTarget")}</span></div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-stone-100 dark:bg-[#1C1512]" role="progressbar" aria-label={t("scoreOverview.progressLabel")} aria-valuemin={0} aria-valuemax={100} aria-valuenow={targetProgress}><div className="h-full rounded-full bg-[#881337] transition-[width] dark:bg-[#FBBF24]" style={{ width: `${targetProgress}%` }} /></div>
                  <div className="mt-2 flex justify-between text-[11px] text-stone-500 dark:text-[#A89C90]"><span>{t("scoreOverview.estimateValue", { score: predictedScore })}</span><span>{t("scoreOverview.targetValue", { score: targetScore })}</span></div>
                </div>
              )}
            </article>

            <article className="rounded-2xl border border-stone-200 bg-[#FAF8F5] p-5 dark:border-white/10 dark:bg-[#1C1512]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#881337] dark:bg-white/10 dark:text-[#FBBF24]"><BookOpen className="h-5 w-5" aria-hidden="true" /></div>
              <h2 className="mt-4 text-sm font-semibold text-stone-900 dark:text-[#FDFBF7]">{t("scoreOverview.scopeTitle")}</h2>
              <p className="mt-2 text-xs leading-5 text-stone-600 dark:text-[#E7E0D6]">{t("scoreOverview.scopeDescription")}</p>
            </article>
          </section>

          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-[#261E1A] sm:p-6" aria-labelledby="score-goal-heading">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-md"><h2 id="score-goal-heading" className="text-base font-semibold text-stone-900 dark:text-[#FDFBF7]">{t("scoreOverview.updateTarget")}</h2><p className="mt-1 text-xs leading-5 text-stone-500 dark:text-[#A89C90]">{t("scoreOverview.updateTargetDescription")}</p></div>
              <form onSubmit={(event) => { event.preventDefault(); void handleSaveGoal(); }} className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="space-y-1"><label htmlFor="target-score" className="text-xs font-semibold text-stone-700 dark:text-[#E7E0D6]">{t("scoreOverview.targetInputLabel")}</label><input id="target-score" type="number" min={250} max={600} step={1} value={targetScore ?? ""} onChange={(event) => setTargetScore(event.target.value === "" ? null : Number(event.target.value))} disabled={loading || loadError} className="min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-900 focus:border-[#881337] focus:outline-none focus:ring-2 focus:ring-[#881337]/20 disabled:opacity-60 dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7] sm:w-40" /></div>
                <button type="submit" disabled={savingTarget || loading || loadError || targetScore === null || !Number.isFinite(targetScore) || targetScore < 250 || targetScore > 600} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#881337] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#9F1239] focus:outline-none focus:ring-2 focus:ring-[#881337] disabled:cursor-wait disabled:opacity-60"><Save className="h-4 w-4" aria-hidden="true" />{savingTarget ? t("scoreOverview.saving") : t("scoreOverview.saveTarget")}</button>
              </form>
            </div>
          </section>
        </>
      )}
    </PortalPage>
  );
}
