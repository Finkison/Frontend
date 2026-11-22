import React, { useCallback, useEffect, useState } from "react";
import { getAuditLogs } from "../../services/schoolService";
import { AlertCircle, RefreshCw, ShieldCheck } from "lucide-react";
import PageHeader from "../shared/PageHeader";
import PortalPage from "../shared/PortalPage";

interface AuditLogEntry {
  id: string;
  actor_name: string;
  actor_role: string;
  action: string;
  target_model?: string;
  target_id?: string;
  details?: Record<string, any>;
  ip_address?: string;
  timestamp: string;
}

export default function AuditLogView(): React.ReactElement {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAuditLogs();
      const list = res.data?.logs || (Array.isArray(res.data) ? res.data : []);
      setLogs(list);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError("Forbidden: Audit logs are accessible only to School Directors and Super Admins.");
      } else {
        setError("Failed to load school audit logs.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchLogs();
  }, [fetchLogs]);

  const formatTimestamp = (value: string) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "Date unavailable" : date.toLocaleString();
  };

  const formatDetails = (details?: Record<string, any>) => {
    if (!details || Object.keys(details).length === 0) return "—";
    return Object.entries(details)
      .map(([key, value]) => `${key.replace(/_/g, " ")}: ${typeof value === "object" ? JSON.stringify(value) : String(value)}`)
      .join(" · ");
  };

  return (
    <PortalPage className="space-y-6">

      <PageHeader
        title="Activity log"
        description="Review administrative changes and access events recorded for this school."
        secondaryActions={[{ label: "Refresh", onClick: () => void fetchLogs(), icon: RefreshCw, loading }]}
      />

      {error && (
        <div role="alert" className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200 sm:flex-row sm:items-center sm:justify-between">
          <span className="flex items-start gap-2"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /><span>{error}</span></span>
          <button type="button" onClick={() => void fetchLogs()} disabled={loading} className="min-h-9 self-start rounded-lg border border-rose-200 bg-white px-3 text-xs font-semibold text-rose-800 hover:bg-rose-100 disabled:opacity-60 dark:border-rose-900/60 dark:bg-[#261E1A] dark:text-rose-200 sm:self-auto">Try again</button>
        </div>
      )}

      {loading ? (
        <div role="status" aria-live="polite" className="rounded-2xl border border-[#E7E0D6] bg-white p-12 text-center dark:border-white/10 dark:bg-[#261E1A]">
          <div className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-stone-300 border-t-[#881337] dark:border-white/20 dark:border-t-[#FBBF24]" />
          <p className="text-sm text-[#5C5046] dark:text-[#E7E0D6]">Loading activity log…</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="mx-auto max-w-md rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center dark:border-white/15 dark:bg-[#261E1A]">
          <div className="w-10 h-10 rounded-full bg-[#FFF1F2] dark:bg-[#4C0519]/40 text-[#881337] flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-semibold text-[#261E1A] dark:text-[#FDFBF7]">No activity recorded yet</h2>
          <p className="mt-1 text-sm text-[#5C5046] dark:text-[#E7E0D6]">
            Administrative changes will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#261E1A] border border-[#E7E0D6] dark:border-white/10 rounded-[8px] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <caption className="sr-only">School administrative activity log</caption>
              <thead>
                <tr className="bg-[#FAF8F5] dark:bg-[#1C1512] border-b border-[#E7E0D6] dark:border-white/10 text-stone-500 dark:text-[#A89C90] font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Entity</th>
                  <th className="py-3 px-4">Details</th>
                  <th className="py-3 px-4">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E0D6] text-[#261E1A] dark:text-[#FDFBF7]">
                {logs.map((log) => (
                  <tr key={log.id} className="transition-colors hover:bg-[#FAF8F5] dark:hover:bg-white/5">
                    <td className="py-3 px-4 text-stone-500 dark:text-[#A89C90] font-mono text-[11px] whitespace-nowrap">
                      <time dateTime={log.timestamp}>{formatTimestamp(log.timestamp)}</time>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#261E1A] dark:text-[#FDFBF7]">{log.actor_name}</div>
                      <div className="text-[10px] text-stone-400 dark:text-[#A89C90]">{log.actor_role}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FFF1F2] dark:bg-[#4C0519]/40 text-[#881337] border border-[#FECDD3] dark:border-[#881337]/50">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#5C5046] dark:text-[#E7E0D6]">
                      {log.target_model || "—"}
                    </td>
                    <td className="max-w-xs truncate py-3 px-4 text-[#5C5046] dark:text-[#E7E0D6]" title={formatDetails(log.details)}>
                      {formatDetails(log.details)}
                    </td>
                    <td className="py-3 px-4 text-stone-400 dark:text-[#A89C90] font-mono text-[11px]">
                      {log.ip_address || "Not recorded"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </PortalPage>
  );
}
