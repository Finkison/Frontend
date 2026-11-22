import React, { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, ClipboardList, Target, TrendingUp } from "lucide-react";
import { getChildProgress } from "../../services/parentService";
import PageHeader from "../shared/PageHeader";
import PortalPage from "../shared/PortalPage";
import PortalLoading from "../shared/PortalLoading";
import { useI18n } from "../../i18n";

interface SubjectAccuracy {
  subject: string;
  accuracy: number;
}

interface ProgressActivity {
  kind: "practice" | "exam" | "classwork";
  title: string;
  subject?: string;
  status?: string;
  score_percent?: number;
  total_questions?: number;
  score?: number;
  max_score?: number;
  created_at: string;
}

const activityStatusKeys: Record<string, string> = {
  assigned: "assigned",
  overdue: "overdue",
  submitted: "submitted",
  graded: "graded",
};

export default function ChildDetailView(): React.ReactElement {
  const { t, language } = useI18n();
  const { id } = useParams();
  const navigate = useNavigate();
  const [child, setChild] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const loadChild = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      if (!id) {
        setChild(null);
        return;
      }
      const response = await getChildProgress(id);
      setChild(response.data || null);
    } catch {
      setChild(null);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { void loadChild(); }, [loadChild]);

  if (loading) {
    return <PortalPage className="max-w-4xl"><PortalLoading message={t("parentChildDetail.loading")} /></PortalPage>;
  }

  if (!child) {
    return (
      <PortalPage className="max-w-lg"><div className="space-y-4 rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-xs dark:border-white/10 dark:bg-[#261E1A]">
        <h1 className="text-xl font-semibold text-stone-900 dark:text-[#FDFBF7]">{loadError ? t("parentChildDetail.loadErrorTitle") : t("parentChildDetail.notFoundTitle")}</h1>
        <p className="text-sm text-stone-600 dark:text-[#E7E0D6]">{loadError ? t("parentChildDetail.loadErrorDescription") : t("parentChildDetail.notFoundDescription")}</p>
        <div className="flex flex-wrap justify-center gap-2">
          {loadError && <button type="button" onClick={() => void loadChild()} className="min-h-[44px] rounded-lg border border-stone-300 px-5 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-50 dark:border-white/15 dark:text-[#E7E0D6] dark:hover:bg-white/5">{t("parentChildDetail.tryAgain")}</button>}
          <button type="button" onClick={() => navigate("/parent")} className="min-h-[44px] rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-stone-800">{t("parentChildDetail.backToDashboard")}</button>
        </div>
      </div></PortalPage>
    );
  }

  const subjects: SubjectAccuracy[] = Array.isArray(child.subject_accuracy) ? child.subject_accuracy : [];
  const activity: ProgressActivity[] = Array.isArray(child.recent_activity) ? child.recent_activity : [];
  const latestScore = child.latest_exam_score;
  const latestMax = child.latest_exam_max_score;
  const gradeLabel = child.grade_display || (child.grade ? t("parentChildDetail.grade", { grade: child.grade }) : "");
  const childDescription = [
    gradeLabel,
    child.stream ? t("parentChildDetail.stream", { stream: child.stream }) : "",
    child.school ? t("parentChildDetail.school", { school: child.school }) : "",
  ].filter(Boolean).join(" · ");
  const locale = language === "am" ? "am-ET" : language === "om" ? "om-ET" : "en-ET";
  const formatDate = (value: string) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? t("parentChildDetail.dateUnavailable") : date.toLocaleString(locale, { dateStyle: "medium", timeStyle: "short" });
  };

  return (
    <PortalPage className="max-w-5xl space-y-6">
      <PageHeader
        eyebrow={t("parentChildDetail.eyebrow")}
        title={child.name}
        description={childDescription || t("parentChildDetail.description")}
        secondaryActions={[{ label: t("parentChildDetail.backToDashboard"), href: "/parent", icon: ArrowLeft }]}
      />

      <section className="space-y-6 rounded-2xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#261E1A] p-6 shadow-xs sm:p-8">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-xl border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-[#1C1512] p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-600 dark:text-[#E7E0D6]"><TrendingUp className="h-4 w-4" aria-hidden="true" />{t("parentChildDetail.latestExam")}</div>
            <p className="mt-3 text-2xl font-semibold tabular-nums text-stone-900 dark:text-[#FDFBF7]">{latestScore ?? "—"}{latestScore != null && latestMax != null && <span className="ml-1 text-sm font-normal text-stone-500 dark:text-[#A89C90]">/ {latestMax}</span>}</p>
            {latestScore == null && <p className="mt-1 text-xs text-stone-500 dark:text-[#A89C90]">{t("parentChildDetail.noExam")}</p>}
          </div>

          <div className="rounded-xl border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-[#1C1512] p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-600 dark:text-[#E7E0D6]"><BookOpen className="h-4 w-4" aria-hidden="true" />{t("parentChildDetail.practiceAccuracy")}</div>
            <p className="mt-3 text-2xl font-semibold tabular-nums text-stone-900 dark:text-[#FDFBF7]">{child.practice_accuracy == null ? "—" : `${child.practice_accuracy}%`}</p>
            {child.practice_accuracy == null && <p className="mt-1 text-xs text-stone-500 dark:text-[#A89C90]">{t("parentChildDetail.noPractice")}</p>}
          </div>

          <div className="rounded-xl border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-[#1C1512] p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-600 dark:text-[#E7E0D6]"><ClipboardList className="h-4 w-4" aria-hidden="true" />{t("parentChildDetail.questionsThisWeek")}</div>
            <p className="mt-3 text-2xl font-semibold tabular-nums text-stone-900 dark:text-[#FDFBF7]">{child.weekly_questions_solved ?? 0}</p>
          </div>

          <div className="rounded-xl border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-[#1C1512] p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-600 dark:text-[#E7E0D6]"><Target className="h-4 w-4" aria-hidden="true" />{t("parentChildDetail.personalTarget")}</div>
            <p className="mt-3 text-2xl font-semibold tabular-nums text-stone-900 dark:text-[#FDFBF7]">{child.target_score ?? "—"}</p>
          </div>

          <div className="rounded-xl border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-[#1C1512] p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-600 dark:text-[#E7E0D6]"><ClipboardList className="h-4 w-4" aria-hidden="true" />{t("parentChildDetail.pendingClasswork")}</div>
            <p className="mt-3 text-2xl font-semibold tabular-nums text-stone-900 dark:text-[#FDFBF7]">{child.pending_classwork_count ?? 0}</p>
            <p className="mt-1 text-xs text-stone-500 dark:text-[#A89C90]">{t("parentChildDetail.assignedByTeachers")}</p>
          </div>
        </div>

        <section className="space-y-3">
          <div>
            <h2 className="text-base font-semibold text-stone-900 dark:text-[#FDFBF7]">{t("parentChildDetail.focusSubjects")}</h2>
            <p className="mt-1 text-xs text-stone-600 dark:text-[#E7E0D6]">{t("parentChildDetail.focusSubjectsDescription")}</p>
          </div>
          {subjects.length === 0 ? (
            <p className="rounded-xl border border-dashed border-stone-300 dark:border-white/20 p-5 text-sm text-stone-600 dark:text-[#E7E0D6]">{t("parentChildDetail.noSubjectResults")}</p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {subjects.map((item) => {
                const accuracy = Number.isFinite(Number(item.accuracy)) ? Math.min(100, Math.max(0, Number(item.accuracy))) : 0;
                return (
                  <li key={item.subject} className="rounded-xl border border-stone-200 dark:border-white/10 p-4">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="font-semibold text-stone-900 dark:text-[#FDFBF7]">{item.subject}</span>
                      <span className="font-semibold tabular-nums text-stone-700 dark:text-[#E7E0D6]">{Math.round(accuracy)}%</span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-stone-100 dark:bg-[#201815]" role="progressbar" aria-label={t("parentChildDetail.subjectAccuracy", { subject: item.subject })} aria-valuenow={Math.round(accuracy)} aria-valuemin={0} aria-valuemax={100}>
                      <div className="h-full rounded-full bg-amber-500" style={{ width: `${accuracy}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </section>

      <section className="space-y-4 rounded-2xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#261E1A] p-6 shadow-xs sm:p-8">
        <div>
          <h2 className="text-base font-semibold text-stone-900 dark:text-[#FDFBF7]">{t("parentChildDetail.recentActivity")}</h2>
          <p className="mt-1 text-xs text-stone-600 dark:text-[#E7E0D6]">{t("parentChildDetail.recentActivityDescription")}</p>
        </div>
        {activity.length === 0 ? (
          <p className="rounded-xl border border-dashed border-stone-300 dark:border-white/20 p-5 text-sm text-stone-600 dark:text-[#E7E0D6]">{t("parentChildDetail.noActivity")}</p>
        ) : (
          <ul className="divide-y divide-stone-100">
            {activity.map((item, index) => {
              const normalizedStatus = item.status?.trim().toLowerCase();
              const statusKey = normalizedStatus ? activityStatusKeys[normalizedStatus] : undefined;
              const submittedStatus = statusKey ? t(`parentChildDetail.status.${statusKey}`) : item.status || t("parentChildDetail.submitted");
              return (
              <li key={`${item.kind}-${item.created_at}-${index}`} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div>
                  <h3 className="text-sm font-semibold text-stone-900 dark:text-[#FDFBF7]">{item.title}{item.subject ? ` · ${item.subject}` : ""}</h3>
                  <time className="mt-1 block text-xs text-stone-500 dark:text-[#A89C90]">{formatDate(item.created_at)}</time>
                </div>
                <span className="text-sm font-semibold tabular-nums text-stone-700 dark:text-[#E7E0D6]">
                  {item.kind === "exam"
                    ? (item.score == null ? t("parentChildDetail.scoreUnavailable") : `${item.score}${item.max_score == null ? "" : ` / ${item.max_score}`}`)
                    : item.kind === "classwork"
                      ? (item.score == null ? submittedStatus : `${item.score}${item.max_score == null ? "" : ` / ${item.max_score}`}`)
                      : item.score_percent == null
                        ? t("parentChildDetail.questionsCount", { count: item.total_questions ?? 0 })
                        : t("parentChildDetail.practiceResult", { percent: Math.round(item.score_percent), count: item.total_questions ?? 0 })}
                </span>
              </li>
              );
            })}
          </ul>
        )}
      </section>
    </PortalPage>
  );
}
