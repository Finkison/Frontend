import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  KeyRound,
  ShieldCheck,
  Smartphone,
  Laptop,
  LogOut,
  AlertCircle,
  Clock,
  Check,
  Eye,
  EyeOff,
  RefreshCw,
  Save,
} from "lucide-react";
import PortalPage from "../shared/PortalPage";
import useAuthStore from "../../store/authStore";
import { useToast } from "../ui/Toast";
import { changeSchoolPassword, getAccountSessions, getAuditLogs, revokeAccountSession, revokeSchoolSessions, type AccountSession } from "../../services/schoolService";
import PageHeader from "../shared/PageHeader";

export default function SecurityView(): React.ReactElement {
  useEffect(() => {
    document.title = "Account Security & Credentials — Finkison";
  }, []);

  const { user } = useAuthStore();
  const logout = useAuthStore((state) => state.logout);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const [revokingSessions, setRevokingSessions] = useState(false);
  const [sessions, setSessions] = useState<AccountSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [sessionsError, setSessionsError] = useState("");
  const [revokingSessionId, setRevokingSessionId] = useState<string | null>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [auditLoading, setAuditLoading] = useState(true);
  const [auditError, setAuditError] = useState("");

  const loadAuditLogs = useCallback(async () => {
    setAuditLoading(true);
    setAuditError("");
    try {
      const res = await getAuditLogs();
      const logs = res.data?.logs || res.data?.results || (Array.isArray(res.data) ? res.data : []);
      setAuditLogs(logs.map((l: any, idx: number) => ({
        id: l.id || `log-${idx}`,
        event: l.action || l.event || "System access",
        timestamp: l.timestamp || l.created_at || "Recent",
        ip: l.ip_address || "Not recorded",
        status: l.severity === "ERROR" ? "Failed" : "Recorded",
      })));
    } catch (error: any) {
      setAuditLogs([]);
      setAuditError(error?.response?.status === 403
        ? "Security activity is available to school administrators only."
        : "Security activity could not be loaded.");
    } finally {
      setAuditLoading(false);
    }
  }, []);

  const loadSessions = useCallback(async () => {
    setSessionsLoading(true);
    setSessionsError("");
    try {
      const response = await getAccountSessions();
      const items = Array.isArray(response.data?.sessions) ? response.data.sessions : [];
      setSessions(items);
      if (items.length > 0 && !items.some((session) => session.is_current)) {
        setSessionsError("Sign in again to identify this device before managing other sessions.");
      }
    } catch (error: any) {
      setSessions([]);
      setSessionsError(error?.response?.data?.error || "Active sessions could not be loaded.");
    } finally {
      setSessionsLoading(false);
    }
  }, []);

  const refreshSecurityData = useCallback(async () => {
    await Promise.all([loadAuditLogs(), loadSessions()]);
  }, [loadAuditLogs, loadSessions]);

  useEffect(() => {
    void refreshSecurityData();
  }, [refreshSecurityData]);

  /*
   * Session and activity information are independently loaded so one unavailable
   * endpoint does not hide the other security control.
   */
  useEffect(() => {
    return () => undefined;
  }, []);

  /*
   * Keep the existing page title for browser history and assistive technology.
   */
  useEffect(() => {
    document.title = "Account Security & Credentials — Finkison";
  }, []);

  /* Legacy request logic intentionally replaced by the dedicated loaders above. */
  /*
    getAuditLogs()
      .then((res) => {
        const logs = res.data?.logs || res.data?.results || (Array.isArray(res.data) ? res.data : []);
        setAuditLogs(logs.map((l: any, idx: number) => ({
          id: l.id || `log-${idx}`,
          event: l.action || l.event || "System access",
          timestamp: l.timestamp || l.created_at || "Recent",
          ip: l.ip_address || "Not recorded",
          status: l.severity === "ERROR" ? "Failed" : "Recorded",
        })));
      })
      .catch((error: any) => setAuditError(error?.response?.status === 403
        ? "Security activity is available to school administrators only."
        : "Security activity could not be loaded."));
    getAccountSessions()
      .then((response) => {
        const items = Array.isArray(response.data?.sessions) ? response.data.sessions : [];
        setSessions(items);
        if (items.length > 0 && !items.some((session) => session.is_current)) {
          setSessionsError("Sign in again to identify this device before managing other sessions.");
        }
      })
      .catch((error: any) => setSessionsError(error?.response?.data?.error || "Active sessions could not be loaded."))
      .finally(() => setSessionsLoading(false));
  */

  // Password Strength Calculation
  const hasMinLength = newPassword.length >= 8;
  const hasMixedCase = /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const strengthScore = [hasMinLength, hasMixedCase, hasNumber, hasSpecial].filter(Boolean).length;

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast({
        type: "error",
        title: "Current Password Required",
        message: "Please enter your current administrator password to confirm changes.",
      });
      return;
    }

    if (newPassword.length < 8) {
      showToast({
        type: "error",
        title: "Weak Password",
        message: "Password must be at least 8 characters long.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast({
        type: "error",
        title: "Passwords Do Not Match",
        message: "The new password and confirmation password do not match.",
      });
      return;
    }

    setUpdatingPassword(true);
    try {
      await changeSchoolPassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showToast({
        type: "success",
        title: "Password Updated",
        message: "Your password changed. Sign in again with your new password.",
      });
      logout();
      navigate("/login?password=updated", { replace: true });
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Update Failed",
        message: err?.userMessage || err?.response?.data?.message || "Failed to update password. Please check your credentials.",
      });
    } finally {
      setUpdatingPassword(false);
    }
  };

  const refreshSessions = loadSessions;

  const handleRevokeOtherSessions = async () => {
    setRevokingSessions(true);
    try {
      const response = await revokeSchoolSessions();
      await refreshSessions();
      showToast({
        type: "success",
        title: "Sessions Terminated",
        message: response.data?.message || "Other device sessions have been revoked.",
      });
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Revocation Failed",
        message: err?.userMessage || err?.response?.data?.message || "Unable to revoke active sessions.",
      });
    } finally {
      setRevokingSessions(false);
    }
  };

  const handleRevokeSession = async (session: AccountSession) => {
    setRevokingSessionId(session.token_id);
    try {
      await revokeAccountSession(session.token_id);
      setSessions((current) => current.filter((item) => item.token_id !== session.token_id));
      showToast({ type: "success", title: "Session revoked", message: "That device can no longer refresh its sign-in." });
    } catch (error: any) {
      showToast({ type: "error", title: "Could not revoke session", message: error?.response?.data?.error || "Try again." });
    } finally {
      setRevokingSessionId(null);
    }
  };

  return (
    <PortalPage className="max-w-4xl space-y-8 animate-fade-in text-start">

      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#FFF1F2] dark:bg-[#4C0519]/40 border border-[#FECDD3] dark:border-[#881337]/50 text-[#881337]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Account Security & Credentials</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#261E1A] dark:text-[#FDFBF7]">
          Password & session controls
        </h1>
        <p className="text-sm text-[#5C5046] dark:text-[#E7E0D6] max-w-2xl">
          Manage your password and signed-in devices for {user?.email || "your account"}.
        </p>
      </div>

      <div className="bg-white dark:bg-[#261E1A] rounded-2xl border border-[#E7E0D6] dark:border-white/10 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-stone-100 dark:border-white/10 pb-4">
          <div className="w-10 h-10 rounded-xl bg-[#FFF1F2] dark:bg-[#4C0519]/40 border border-[#FECDD3] dark:border-[#881337]/50 flex items-center justify-center text-[#881337]">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#261E1A] dark:text-[#FDFBF7]">Change Password</h2>
            <p className="text-xs text-[#5C5046] dark:text-[#E7E0D6]">
              Ensure your account uses a strong, unique passphrase with at least 8 characters.
            </p>
          </div>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-5 max-w-2xl">

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#261E1A] dark:text-[#FDFBF7] block">Current Password</label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
                className="w-full px-3.5 py-2.5 rounded-[8px] border border-[#D5CBC0] text-sm focus:outline-none focus:ring-2 focus:ring-[#881337] focus:border-transparent pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-[#A89C90] hover:text-stone-600"
                aria-label={showCurrent ? "Hide password" : "Show password"}
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#261E1A] dark:text-[#FDFBF7] block">New Password</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter at least 8 characters"
                className="w-full px-3.5 py-2.5 rounded-[8px] border border-[#D5CBC0] text-sm focus:outline-none focus:ring-2 focus:ring-[#881337] focus:border-transparent pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-[#A89C90] hover:text-stone-600"
                aria-label={showNew ? "Hide password" : "Show password"}
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {newPassword.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-1.5">
                  <div
                    className={`h-1.5 flex-1 rounded-full ${
                      strengthScore >= 1 ? "bg-red-500" : "bg-stone-200 dark:bg-white/10"
                    }`}
                  />
                  <div
                    className={`h-1.5 flex-1 rounded-full ${
                      strengthScore >= 2 ? "bg-amber-500" : "bg-stone-200 dark:bg-white/10"
                    }`}
                  />
                  <div
                    className={`h-1.5 flex-1 rounded-full ${
                      strengthScore >= 3 ? "bg-[#881337]" : "bg-stone-200 dark:bg-white/10"
                    }`}
                  />
                  <div
                    className={`h-1.5 flex-1 rounded-full ${
                      strengthScore >= 4 ? "bg-emerald-500" : "bg-stone-200 dark:bg-white/10"
                    }`}
                  />
                  <span className="text-[11px] font-semibold text-stone-600 dark:text-[#E7E0D6] pl-1">
                    {strengthScore <= 1
                      ? "Weak"
                      : strengthScore === 2
                      ? "Fair"
                      : strengthScore === 3
                      ? "Good"
                      : "Strong"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-500 dark:text-[#A89C90] pt-1">
                  <span className={`flex items-center gap-1 ${hasMinLength ? "text-emerald-700 font-medium" : ""}`}>
                    {hasMinLength ? <Check className="w-3 h-3 text-emerald-600" /> : <span className="w-1.5 h-1.5 rounded-full bg-stone-300 ml-1 mr-0.5" />}
                    8+ characters
                  </span>
                  <span className={`flex items-center gap-1 ${hasMixedCase ? "text-emerald-700 font-medium" : ""}`}>
                    {hasMixedCase ? <Check className="w-3 h-3 text-emerald-600" /> : <span className="w-1.5 h-1.5 rounded-full bg-stone-300 ml-1 mr-0.5" />}
                    Uppercase & lowercase
                  </span>
                  <span className={`flex items-center gap-1 ${hasNumber ? "text-emerald-700 font-medium" : ""}`}>
                    {hasNumber ? <Check className="w-3 h-3 text-emerald-600" /> : <span className="w-1.5 h-1.5 rounded-full bg-stone-300 ml-1 mr-0.5" />}
                    At least one number
                  </span>
                  <span className={`flex items-center gap-1 ${hasSpecial ? "text-emerald-700 font-medium" : ""}`}>
                    {hasSpecial ? <Check className="w-3 h-3 text-emerald-600" /> : <span className="w-1.5 h-1.5 rounded-full bg-stone-300 ml-1 mr-0.5" />}
                    Special symbol
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#261E1A] dark:text-[#FDFBF7] block">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your new password"
              className="w-full px-3.5 py-2.5 rounded-[8px] border border-[#D5CBC0] text-sm focus:outline-none focus:ring-2 focus:ring-[#881337] focus:border-transparent"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={updatingPassword}
              className="min-h-[44px] px-6 py-2.5 rounded-[8px] bg-[#881337] hover:bg-[#9F1239] text-white text-sm font-semibold transition-colors inline-flex items-center gap-2 disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {updatingPassword ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Updating password...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/40 dark:bg-amber-950/20">
        <div className="flex items-start gap-3"><AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-300" aria-hidden="true" /><div><h2 className="text-sm font-semibold text-amber-950 dark:text-amber-100">Two-step verification</h2><p className="mt-1 text-xs leading-5 text-amber-900 dark:text-amber-200">Not available for school accounts yet. Use a unique password and review signed-in devices.</p></div></div>
      </div>

      <div className="bg-white dark:bg-[#261E1A] rounded-2xl border border-[#E7E0D6] dark:border-white/10 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 dark:border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF1F2] dark:bg-[#4C0519]/40 border border-[#FECDD3] dark:border-[#881337]/50 flex items-center justify-center text-[#881337]">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#261E1A] dark:text-[#FDFBF7]">Active Signed-In Devices</h2>
              <p className="text-xs text-[#5C5046] dark:text-[#E7E0D6]">
                These devices are currently authenticated to access your account.
              </p>
            </div>
          </div>

          {!sessionsLoading && !sessionsError && sessions.filter((session) => !session.is_current).length > 0 && (
            <button
              type="button"
              onClick={handleRevokeOtherSessions}
              disabled={revokingSessions}
              className="min-h-[38px] px-3.5 py-1.5 rounded-[6px] text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50 transition-colors inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{revokingSessions ? "Revoking..." : "Sign Out Other Devices"}</span>
            </button>
          )}
        </div>

        {sessionsLoading ? <p role="status" className="py-6 text-sm text-stone-500 dark:text-[#A89C90]">Loading active sessions…</p>
          : sessionsError ? <p role="alert" className="py-6 text-sm text-rose-700 dark:text-rose-200">{sessionsError}</p>
            : sessions.length === 0 ? <p className="py-6 text-sm text-stone-500 dark:text-[#A89C90]">No active sessions.</p>
              : <div className="divide-y divide-stone-100 dark:divide-white/10">
          {sessions.map((sess) => {
            const userAgent = sess.device_info?.user_agent || "Device details unavailable";
            const isMobile = /android|iphone|ipad|mobile/i.test(userAgent);
            const browserName = /edg\//i.test(userAgent) ? "Microsoft Edge" : /firefox\//i.test(userAgent) ? "Firefox" : /chrome\//i.test(userAgent) ? "Chrome" : /safari\//i.test(userAgent) ? "Safari" : "Browser session";
            const createdAt = sess.created_at ? new Date(sess.created_at * 1000).toLocaleString() : "Sign-in time unavailable";
            return <div key={sess.token_id} className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-stone-50 dark:bg-[#1C1512] border border-stone-200 dark:border-white/10 flex items-center justify-center text-stone-600 dark:text-[#E7E0D6]">
                  {isMobile ? (
                    <Smartphone className="w-4 h-4" />
                  ) : (
                    <Laptop className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-[#261E1A] dark:text-[#FDFBF7]">{browserName}{isMobile ? " on mobile" : ""}</p>
                    {sess.is_current && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]">
                        THIS DEVICE
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#A89C90] flex items-center gap-2 mt-0.5">
                    <span>Signed in {createdAt}</span>
                    <span>•</span>
                    <span className="font-mono">{sess.device_info?.ip || "IP unavailable"}</span>
                    <span>•</span>
                    <span>{sess.expires_at ? `Expires ${new Date(sess.expires_at * 1000).toLocaleString()}` : "Expiry unavailable"}</span>
                  </p>
                </div>
              </div>

              {!sess.is_current && (
                <button
                  type="button"
                  onClick={() => void handleRevokeSession(sess)}
                  disabled={revokingSessionId === sess.token_id}
                  className="min-h-9 rounded-lg px-3 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60 dark:text-red-300"
                >
                  {revokingSessionId === sess.token_id ? "Revoking…" : "Revoke"}
                </button>
              )}
            </div>;
          })}
        </div>}
      </div>

      <div className="bg-white dark:bg-[#261E1A] rounded-2xl border border-[#E7E0D6] dark:border-white/10 shadow-xs p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3 border-b border-stone-100 dark:border-white/10 pb-4">
          <div className="w-10 h-10 rounded-xl bg-stone-50 dark:bg-[#1C1512] border border-stone-200 dark:border-white/10 flex items-center justify-center text-stone-700 dark:text-[#E7E0D6]">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#261E1A] dark:text-[#FDFBF7]">Recent Security Activity</h2>
            <p className="text-xs text-[#5C5046] dark:text-[#E7E0D6]">
              Authentication events and credential modifications associated with this account.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead>
              <tr className="border-b border-stone-100 dark:border-white/10 text-[#5C5046] dark:text-[#E7E0D6] font-semibold">
                <th className="py-2.5 pr-4 text-start">Event</th>
                <th className="py-2.5 px-4 text-start">Timestamp</th>
                <th className="py-2.5 px-4 text-start">IP Address</th>
                <th className="py-2.5 pl-4 text-end">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {auditError && <tr><td colSpan={4} className="py-4 text-center text-xs text-stone-500 dark:text-[#A89C90]">{auditError}</td></tr>}
              {!auditError && auditLogs.length === 0 && <tr><td colSpan={4} className="py-4 text-center text-xs text-stone-500 dark:text-[#A89C90]">No security activity yet.</td></tr>}
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-stone-50/60">
                  <td className="py-2.5 pr-4 font-medium text-[#261E1A] dark:text-[#FDFBF7]">{log.event}</td>
                  <td className="py-2.5 px-4 text-[#A89C90]">{log.timestamp}</td>
                  <td className="py-2.5 px-4 font-mono text-stone-600 dark:text-[#E7E0D6]">{log.ip}</td>
                  <td className="py-2.5 pl-4 text-end">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-[4px] ${log.status === "Failed" ? "text-rose-700 bg-rose-50 border border-rose-200" : "text-stone-700 bg-stone-100 border border-stone-200 dark:bg-white/5 dark:text-[#E7E0D6] dark:border-white/10"}`}>
                      <span>{log.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </PortalPage>
  );
}

export { SecurityView as AccountSecurityView, SecurityView as InstitutionalSecurityView };
