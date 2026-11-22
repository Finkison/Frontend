import React, { useCallback, useEffect, useState } from "react";
import { Check, AlertCircle, Clock3, RefreshCw, X } from "lucide-react";
import { useI18n } from "../../i18n";
import { getApiErrorMessage } from "../../services/api";
import { decideSchoolJoinRequest, getClassrooms, getSchoolJoinRequests, type StudentSchoolJoinRequest } from "../../services/schoolService";
import PageHeader from "../shared/PageHeader";
import PortalPage from "../shared/PortalPage";

interface SchoolClassroomOption { id: string; name: string; grade: string; section: string }

export default function StudentJoinRequestsView(): React.ReactElement {
  const { t } = useI18n();
  const [requests, setRequests] = useState<StudentSchoolJoinRequest[]>([]);
  const [classrooms, setClassrooms] = useState<SchoolClassroomOption[]>([]);
  const [selectedClassrooms, setSelectedClassrooms] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [requestResponse, classroomResponse] = await Promise.all([getSchoolJoinRequests(), getClassrooms()]);
      setRequests(requestResponse.data?.requests || []);
      setClassrooms(Array.isArray(classroomResponse.data) ? classroomResponse.data : []);
    } catch (loadError) {
      setError(getApiErrorMessage(loadError) || t("classroomWorkflows.schoolJoinRequests.loadError"));
    } finally {
      setLoading(false);
    }
  }, [reloadKey, t]);

  useEffect(() => { void load(); }, [load]);

  const decide = async (request: StudentSchoolJoinRequest, decision: "approved" | "declined") => {
    setActionId(request.id);
    setError(null);
    setNotice(null);
    try {
      await decideSchoolJoinRequest(request.id, { decision, classroom_id: selectedClassrooms[request.id] || undefined });
      setNotice(decision === "approved" ? t("classroomWorkflows.schoolJoinRequests.approved", { name: request.student?.name || "" }) : t("classroomWorkflows.schoolJoinRequests.declined", { name: request.student?.name || "" }));
      await load();
    } catch (actionError) {
      setError(getApiErrorMessage(actionError) || t("classroomWorkflows.schoolJoinRequests.actionError"));
    } finally {
      setActionId(null);
    }
  };

  return (
    <PortalPage className="max-w-5xl space-y-6">
      <PageHeader
        eyebrow={t("classroomWorkflows.schoolJoinRequests.eyebrow")}
        title={t("classroomWorkflows.schoolJoinRequests.title")}
        description={t("classroomWorkflows.schoolJoinRequests.description")}
        secondaryActions={[{ label: t("classroomWorkflows.schoolJoinRequests.refresh"), onClick: () => setReloadKey((value) => value + 1), icon: RefreshCw, loading }]}
      />
      {error && <div role="alert" className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200 sm:flex-row sm:items-center sm:justify-between"><span className="flex items-start gap-2"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />{error}</span><button type="button" onClick={() => setReloadKey((value) => value + 1)} disabled={loading} className="min-h-9 self-start rounded-lg border border-rose-200 bg-white px-3 text-xs font-semibold text-rose-800 hover:bg-rose-100 disabled:opacity-60 dark:border-rose-900/60 dark:bg-[#261E1A] dark:text-rose-200 sm:self-auto">{t("classroomWorkflows.schoolJoinRequests.refresh")}</button></div>}
      {notice && <div role="status" aria-live="polite" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-100">{notice}</div>}
      {loading ? <div role="status" aria-live="polite" className="rounded-2xl border border-[#E7E0D6] bg-white p-9 text-center text-sm text-stone-500 dark:border-white/10 dark:bg-[#261E1A] dark:text-[#A89C90]"><RefreshCw className="mx-auto mb-3 h-5 w-5 animate-spin text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />{t("classroomWorkflows.schoolJoinRequests.loading")}</div> : requests.length === 0 ? <section className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center dark:border-white/15 dark:bg-[#261E1A]"><Clock3 className="mx-auto h-9 w-9 text-stone-300" aria-hidden="true" /><h2 className="mt-3 font-semibold text-stone-900 dark:text-[#FDFBF7]">{t("classroomWorkflows.schoolJoinRequests.emptyTitle")}</h2><p className="mt-1 text-sm text-stone-600 dark:text-[#A89C90]">{t("classroomWorkflows.schoolJoinRequests.emptyDescription")}</p></section> : <section className="space-y-4" aria-label={t("classroomWorkflows.schoolJoinRequests.title")}>
        {requests.map((request) => (
          <article key={request.id} className="rounded-2xl border border-[#E7E0D6] bg-white p-5 shadow-xs dark:border-white/10 dark:bg-[#261E1A] sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="text-base font-semibold text-stone-900 dark:text-[#FDFBF7]">{request.student?.name}</h2><span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">{t("classroomWorkflows.schoolJoinRequests.pending")}</span></div><p className="mt-1 text-sm text-stone-600 dark:text-[#A89C90]">{t("classroomWorkflows.schoolJoinRequests.studentDetails", { grade: request.student?.grade || "—", stream: request.student?.stream || "—" })}</p><p className="mt-1 text-xs text-stone-500 dark:text-[#A89C90]">{request.student?.phone}{request.student?.email ? ` · ${request.student.email}` : ""} · {new Date(request.created_at).toLocaleDateString()}</p></div>
              <div className="grid w-full gap-3 sm:grid-cols-[minmax(220px,1fr)_auto_auto] lg:max-w-2xl lg:flex-1">
                <label className="block space-y-1"><span className="text-xs font-medium text-stone-600 dark:text-[#A89C90]">{t("classroomWorkflows.schoolJoinRequests.classLabel")}</span><select value={selectedClassrooms[request.id] || ""} onChange={(event) => setSelectedClassrooms((current) => ({ ...current, [request.id]: event.target.value }))} className="min-h-10 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-800 focus:border-[#881337] focus:outline-none focus:ring-2 focus:ring-[#881337]/15 dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]"><option value="">{t("classroomWorkflows.schoolJoinRequests.noClassSelected")}</option>{classrooms.map((classroom) => <option key={classroom.id} value={classroom.id}>{classroom.name} · {classroom.grade}</option>)}</select></label>
                <button type="button" onClick={() => void decide(request, "approved")} disabled={actionId === request.id} aria-label={`${t("classroomWorkflows.schoolJoinRequests.approve")} ${request.student?.name || "student"}`} className="mt-auto inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"><Check className="h-4 w-4" aria-hidden="true" />{actionId === request.id ? t("classroomWorkflows.schoolJoinRequests.saving") : t("classroomWorkflows.schoolJoinRequests.approve")}</button>
                <button type="button" onClick={() => void decide(request, "declined")} disabled={actionId === request.id} aria-label={`${t("classroomWorkflows.schoolJoinRequests.decline")} ${request.student?.name || "student"}`} className="mt-auto inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-stone-300 px-4 text-sm font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-60 dark:border-white/15 dark:text-[#E7E0D6] dark:hover:bg-white/5"><X className="h-4 w-4" aria-hidden="true" />{t("classroomWorkflows.schoolJoinRequests.decline")}</button>
              </div>
            </div>
          </article>
        ))}
      </section>}
    </PortalPage>
  );
}
