import React, { useCallback, useEffect, useState } from "react";
import { ArrowRight, Building2, Clock3, GraduationCap, RefreshCw, XCircle } from "lucide-react";
import { useI18n } from "../../i18n";
import { getApiErrorMessage } from "../../services/api";
import { cancelStudentSchoolJoinRequest, getStudentSchoolJoinRequests, requestStudentSchoolJoin, type StudentSchoolJoinRequest } from "../../services/schoolService";
import useAuthStore from "../../store/authStore";
import PageHeader from "../shared/PageHeader";
import PortalPage from "../shared/PortalPage";

export default function SchoolAccessView(): React.ReactElement {
  const { t } = useI18n();
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const [schoolCode, setSchoolCode] = useState("");
  const [requests, setRequests] = useState<StudentSchoolJoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getStudentSchoolJoinRequests();
      const nextRequests = response.data?.requests || [];
      setRequests(nextRequests);
      const approvedRequest = nextRequests.find((request) => request.status === "approved");
      if (approvedRequest) {
        updateUser({ schoolId: approvedRequest.school.id, school: approvedRequest.school.name, isSchoolEnrolled: true });
      }
    } catch (loadError) {
      setError(getApiErrorMessage(loadError) || t("classroomWorkflows.schoolAccess.loadError"));
    } finally {
      setLoading(false);
    }
  }, [t, updateUser]);

  useEffect(() => { void loadRequests(); }, [loadRequests]);

  const submitRequest = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!schoolCode.trim()) return;
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      const response = await requestStudentSchoolJoin(schoolCode.trim());
      setNotice(response.data?.message || t("classroomWorkflows.schoolAccess.requestSent"));
      setSchoolCode("");
      await loadRequests();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError) || t("classroomWorkflows.schoolAccess.requestError"));
    } finally {
      setSaving(false);
    }
  };

  const cancelRequest = async (requestId: string) => {
    setCancellingId(requestId);
    setError(null);
    try {
      await cancelStudentSchoolJoinRequest(requestId);
      await loadRequests();
    } catch (cancelError) {
      setError(getApiErrorMessage(cancelError) || t("classroomWorkflows.schoolAccess.cancelError"));
    } finally {
      setCancellingId(null);
    }
  };

  const activeRequest = requests.find((request) => request.status === "pending");
  const isEnrolled = Boolean(user?.schoolId || user?.isSchoolEnrolled);

  return (
    <PortalPage className="max-w-3xl space-y-6">
      <PageHeader
        title={t("classroomWorkflows.schoolAccess.title")}
        description={t("classroomWorkflows.schoolAccess.description")}
        secondaryActions={[{ label: t("classroomWorkflows.learningResources.retry"), onClick: () => void loadRequests(), icon: RefreshCw, loading }]}
      />

      {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200">{error}</div>}
      {notice && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-100">{notice}</div>}

      {isEnrolled ? (
        <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900/40 dark:bg-emerald-950/20">
          <div className="flex items-start gap-3"><GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700 dark:text-emerald-300" aria-hidden="true" /><div><h2 className="font-semibold text-emerald-950 dark:text-emerald-100">{t("classroomWorkflows.schoolAccess.linkedTitle")}</h2><p className="mt-1 text-sm leading-6 text-emerald-900 dark:text-emerald-100/90">{t("classroomWorkflows.schoolAccess.linkedDescription", { school: user?.school || t("classroomWorkflows.schoolAccess.yourSchool") })}</p></div></div>
        </section>
      ) : (
        <section className="rounded-2xl border border-[#E7E0D6] bg-white p-6 shadow-xs dark:border-white/10 dark:bg-[#261E1A] sm:p-7">
          <div className="flex items-start gap-3"><Building2 className="mt-0.5 h-5 w-5 shrink-0 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" /><div><h2 className="font-semibold text-stone-900 dark:text-[#FDFBF7]">{t("classroomWorkflows.schoolAccess.requestTitle")}</h2><p className="mt-1 text-sm leading-6 text-stone-600 dark:text-[#A89C90]">{t("classroomWorkflows.schoolAccess.requestDescription")}</p></div></div>
          <form onSubmit={(event) => void submitRequest(event)} className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="block flex-1 space-y-1.5"><span className="text-sm font-medium text-stone-700 dark:text-[#E7E0D6]">{t("classroomWorkflows.schoolAccess.schoolCode")}</span><input value={schoolCode} onChange={(event) => setSchoolCode(event.target.value.toUpperCase())} maxLength={50} autoComplete="off" required placeholder={t("classroomWorkflows.schoolAccess.schoolCodePlaceholder")} className="min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm uppercase tracking-wide text-stone-900 outline-none focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/15 dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]" /></label>
            <button type="submit" disabled={saving || loading || Boolean(activeRequest)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#881337] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#9F1239] disabled:cursor-not-allowed disabled:opacity-60">{saving ? t("classroomWorkflows.schoolAccess.sending") : t("classroomWorkflows.schoolAccess.sendRequest")}<ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
          </form>
          <p className="mt-3 text-xs leading-5 text-stone-500 dark:text-[#A89C90]">{t("classroomWorkflows.schoolAccess.approvalNote")}</p>
        </section>
      )}

      <section className="rounded-2xl border border-[#E7E0D6] bg-white p-6 shadow-xs dark:border-white/10 dark:bg-[#261E1A]">
        <div className="flex items-center justify-between gap-3"><div><h2 className="font-semibold text-stone-900 dark:text-[#FDFBF7]">{t("classroomWorkflows.schoolAccess.historyTitle")}</h2><p className="mt-1 text-xs text-stone-500 dark:text-[#A89C90]">{t("classroomWorkflows.schoolAccess.historyDescription")}</p></div><Clock3 className="h-5 w-5 text-stone-400" aria-hidden="true" /></div>
        {loading ? <p role="status" className="mt-5 text-sm text-stone-500 dark:text-[#A89C90]">{t("classroomWorkflows.schoolAccess.loading")}</p> : requests.length === 0 ? <p className="mt-5 rounded-xl border border-dashed border-stone-300 px-4 py-8 text-center text-sm text-stone-500 dark:border-white/15 dark:text-[#A89C90]">{t("classroomWorkflows.schoolAccess.empty")}</p> : (
          <ul className="mt-5 divide-y divide-[#E7E0D6] dark:divide-white/10">
            {requests.map((request) => (
              <li key={request.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                <div><p className="font-semibold text-stone-900 dark:text-[#FDFBF7]">{request.school.name}</p><p className="mt-0.5 text-xs text-stone-500 dark:text-[#A89C90]">{request.school.region} · {new Date(request.created_at).toLocaleDateString()}</p>{request.review_note && <p className="mt-1 text-xs text-stone-600 dark:text-[#E7E0D6]">{request.review_note}</p>}</div>
                <div className="flex items-center gap-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${request.status === "approved" ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200" : request.status === "declined" ? "bg-rose-50 text-rose-800 dark:bg-rose-950/30 dark:text-rose-200" : request.status === "pending" ? "bg-amber-50 text-amber-800 dark:bg-amber-950/30 dark:text-amber-200" : "bg-stone-100 text-stone-700 dark:bg-white/10 dark:text-[#E7E0D6]"}`}>{t(`classroomWorkflows.schoolAccess.status.${request.status}`)}</span>{request.status === "pending" && <button type="button" disabled={cancellingId === request.id} onClick={() => void cancelRequest(request.id)} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-stone-300 px-3 text-xs font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-60 dark:border-white/15 dark:text-[#E7E0D6] dark:hover:bg-white/5"><XCircle className="h-3.5 w-3.5" aria-hidden="true" />{cancellingId === request.id ? t("classroomWorkflows.schoolAccess.cancelling") : t("classroomWorkflows.schoolAccess.cancel")}</button>}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </PortalPage>
  );
}
