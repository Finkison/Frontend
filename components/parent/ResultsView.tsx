import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, FileSpreadsheet, Loader2, TrendingUp } from "lucide-react";
import { getChildren } from "../../services/parentService";
import PageHeader from "../shared/PageHeader";
import PortalPage from "../shared/PortalPage";
import { useI18n } from "../../i18n";

type LinkedStudent = {
  id: string | number;
  user__full_name?: string;
  name?: string;
  grade_display?: string;
  grade?: string | number;
  stream?: string;
  latest_exam_score?: number | null;
  latest_exam_max_score?: number | null;
  target_score?: number | null;
  pending_classwork_count?: number;
};

export default function ParentResultsView(): React.ReactElement {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [children, setChildren] = useState<LinkedStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadChildren = useCallback(() => {
    setLoading(true);
    setError(false);
    getChildren()
      .then((response) => {
        const payload = response.data;
        setChildren(Array.isArray(payload) ? payload : []);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadChildren(); }, [loadChildren]);

  return (
    <PortalPage className="max-w-5xl space-y-6">
      <PageHeader
        eyebrow={t("parentResults.eyebrow")}
        title={t("parentResults.title")}
        description={t("parentResults.description")}
      />

      {loading ? (
        <div role="status" className="rounded-2xl border border-stone-200 bg-white p-8 text-center text-sm text-stone-500 dark:border-white/10 dark:bg-[#261E1A] dark:text-[#A89C90]"><Loader2 className="mx-auto mb-3 h-5 w-5 animate-spin" aria-hidden="true" />{t("parentResults.loading")}</div>
      ) : error ? (
        <section className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center dark:border-rose-900/40 dark:bg-rose-950/20">
          <p role="alert" className="text-sm text-rose-800 dark:text-rose-200">{t("parentResults.loadError")}</p>
          <button type="button" onClick={loadChildren} className="mt-3 min-h-11 rounded-lg bg-[#881337] px-4 py-2 text-sm font-semibold text-white hover:bg-[#9F1239] focus:outline-none focus:ring-2 focus:ring-[#881337] focus:ring-offset-2 dark:focus:ring-[#FBBF24] dark:focus:ring-offset-[#1C1512]">{t("parentResults.tryAgain")}</button>
        </section>
      ) : children.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center dark:border-white/15 dark:bg-[#261E1A]">
          <FileSpreadsheet className="mx-auto h-8 w-8 text-stone-300 dark:text-stone-600" aria-hidden="true" />
          <h2 className="text-base font-semibold text-stone-900 dark:text-[#FDFBF7]">{t("parentResults.noStudentsTitle")}</h2>
          <p className="mt-1 text-sm text-stone-600 dark:text-[#E7E0D6]">{t("parentResults.noStudentsDescription")}</p>
          <button type="button" onClick={() => navigate("/parent/children")} className="mt-4 min-h-11 rounded-lg bg-[#881337] px-4 py-2 text-sm font-semibold text-white hover:bg-[#9F1239] focus:outline-none focus:ring-2 focus:ring-[#881337] focus:ring-offset-2 dark:focus:ring-[#FBBF24] dark:focus:ring-offset-[#1C1512]">{t("parentResults.manageLinks")}</button>
        </section>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {children.map((child) => {
            const score = child.latest_exam_score;
            const name = child.user__full_name || child.name || t("parentResults.studentFallback");
            const grade = child.grade_display || (child.grade ? t("parentResults.grade", { grade: child.grade }) : t("parentResults.gradeNotSet"));
            return (
              <article key={child.id} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-[#261E1A]">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="truncate text-base font-semibold text-stone-900 dark:text-[#FDFBF7]">{name}</h2>
                    <p className="mt-1 text-xs text-stone-500 dark:text-[#A89C90]">
                      {grade}
                      {child.stream ? ` · ${child.stream}` : ""}
                    </p>
                  </div>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF1F2] text-[#881337] dark:bg-[#4C0519]/40 dark:text-[#FBBF24]">
                    <TrendingUp className="h-5 w-5" aria-hidden="true" />
                  </span>
                </div>
                <div className="mt-6 flex items-end justify-between gap-4 border-t border-stone-100 pt-4 dark:border-white/10">
                  <div>
                    <p className="text-xs text-stone-500 dark:text-[#A89C90]">{t("parentResults.latestExamScore")}</p>
                    <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-stone-900 dark:text-[#FDFBF7]">
                      {score !== null && score !== undefined ? <>{score}{child.latest_exam_max_score ? <span className="ml-1 text-sm font-normal text-stone-400">/ {child.latest_exam_max_score}</span> : null}</> : <span className="font-sans text-sm font-medium text-stone-500 dark:text-[#A89C90]">{t("parentResults.noScore")}</span>}
                    </p>
                    {child.target_score ? <p className="mt-1 text-xs text-stone-500 dark:text-[#A89C90]">{t("parentResults.personalGoal", { score: child.target_score })}</p> : null}
                    <p className="mt-1 text-xs text-stone-500 dark:text-[#A89C90]">{t("parentResults.pendingClasswork", { count: child.pending_classwork_count ?? 0 })}</p>
                  </div>
                  <button type="button" onClick={() => navigate(`/parent/child/${child.id}`)} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-[#881337] hover:bg-[#FFF1F2] focus:outline-none focus:ring-2 focus:ring-[#881337] dark:text-[#FBBF24] dark:hover:bg-white/5">
                    {t("parentResults.viewProgress")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </PortalPage>
  );
}
