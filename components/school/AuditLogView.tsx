import React, { useEffect, useState } from "react";
import { getAuditLogs } from "../../services/schoolService";
import { ShieldCheck, Clock, User, FileText, AlertCircle } from "lucide-react";
import { useToast } from "../ui/Toast";

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
  const { showToast } = useToast();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
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
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <h1 className="text-xl font-semibold text-[#0F172A] tracking-tight">Audit log</h1>
          <p className="text-xs text-[#475569] mt-0.5">
            Cryptographic ledger tracking administrative actions, access to confidential student records, and faculty reassignments.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchLogs}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-[6px] border border-[#E2E8F0] hover:bg-slate-50 text-xs font-semibold text-[#0F172A] cursor-pointer min-h-[36px]"
        >
          <span>Refresh log</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-[8px] flex items-center gap-3 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="bg-white border border-[#E2E8F0] rounded-[8px] p-12 text-center">
          <div className="w-6 h-6 border-2 border-slate-300 border-t-[#1D4ED8] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-[#475569]">Loading audit trail...</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="bg-white border border-[#E2E8F0] rounded-[8px] p-12 text-center max-w-md mx-auto">
          <div className="w-10 h-10 rounded-full bg-[#EFF6FF] text-[#1D4ED8] flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-semibold text-[#0F172A]">No audit events logged yet</h2>
          <p className="text-xs text-[#475569] mt-1">
            System actions and sensitive student record accesses will be recorded here automatically.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-[#E2E8F0] rounded-[8px] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Entity</th>
                  <th className="py-3 px-4">Details</th>
                  <th className="py-3 px-4">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] text-[#0F172A]">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#0F172A]">{log.actor_name}</div>
                      <div className="text-[10px] text-slate-400">{log.actor_role}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#475569]">
                      {log.target_model || "—"}
                    </td>
                    <td className="py-3 px-4 text-[#475569] max-w-xs truncate">
                      {log.details ? JSON.stringify(log.details) : "—"}
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                      {log.ip_address || "127.0.0.1"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
