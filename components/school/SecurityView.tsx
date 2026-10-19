import React, { useEffect, useState } from "react";
import {
  KeyRound,
  ShieldCheck,
  Smartphone,
  Laptop,
  Lock,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  Check,
  ShieldAlert,
  Save,
} from "lucide-react";
import useAuthStore from "../../store/authStore";
import { useToast } from "../ui/Toast";

export default function SecurityView(): React.ReactElement {
  useEffect(() => {
    document.title = "Account Security & Credentials — Finkison";
  }, []);

  const { user } = useAuthStore();
  const { showToast } = useToast();

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // 2FA state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [twoFactorMethod, setTwoFactorMethod] = useState<"totp" | "sms">("totp");
  const [copiedKey, setCopiedKey] = useState(false);

  // Sessions state
  const [revokingSessions, setRevokingSessions] = useState(false);
  const [sessions, setSessions] = useState([
    {
      id: "sess-1",
      device: "Current Browser (Chrome on Desktop)",
      location: "Addis Ababa, Ethiopia",
      ip: "197.156.103.14",
      lastActive: "Active right now",
      isCurrent: true,
      type: "laptop",
    },
    {
      id: "sess-2",
      device: "Mobile Portal (Android Chrome)",
      location: "Hawassa, Ethiopia",
      ip: "196.189.44.82",
      lastActive: "2 hours ago",
      isCurrent: false,
      type: "mobile",
    },
    {
      id: "sess-3",
      device: "Administrative Lab Terminal",
      location: "Adama, Ethiopia",
      ip: "197.156.77.21",
      lastActive: "3 days ago",
      isCurrent: false,
      type: "laptop",
    },
  ]);

  // Security Audit Log State
  const [auditLogs] = useState([
    {
      id: "log-1",
      event: "Password updated successfully",
      timestamp: "Today, 14:22 EAT",
      ip: "197.156.103.14",
      status: "Success",
    },
    {
      id: "log-2",
      event: "Two-factor authentication verified",
      timestamp: "Today, 08:30 EAT",
      ip: "197.156.103.14",
      status: "Success",
    },
    {
      id: "log-3",
      event: "New sign-in from Mobile Chrome",
      timestamp: "Yesterday, 19:14 EAT",
      ip: "196.189.44.82",
      status: "Verified",
    },
    {
      id: "log-4",
      event: "Institutional role access reviewed",
      timestamp: "4 days ago, 11:05 EAT",
      ip: "197.156.103.14",
      status: "Success",
    },
  ]);

  // Password Strength Calculation
  const hasMinLength = newPassword.length >= 8;
  const hasMixedCase = /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const strengthScore = [hasMinLength, hasMixedCase, hasNumber, hasSpecial].filter(Boolean).length;

  const handlePasswordSubmit = (e: React.FormEvent) => {
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
    setTimeout(() => {
      setUpdatingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showToast({
        type: "success",
        title: "Password Updated",
        message: "Your account credentials have been securely updated.",
      });
    }, 1000);
  };

  const handleRevokeOtherSessions = () => {
    setRevokingSessions(true);
    setTimeout(() => {
      setSessions((prev) => prev.filter((s) => s.isCurrent));
      setRevokingSessions(false);
      showToast({
        type: "success",
        title: "Sessions Terminated",
        message: "All other device sessions have been revoked successfully.",
      });
    }, 900);
  };

  const handleCopySecret = () => {
    navigator.clipboard.writeText("ET-FINK-9942-X821-SEC");
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
    showToast({
      type: "success",
      title: "Secret Key Copied",
      message: "Authenticator setup key copied to clipboard.",
    });
  };

  const handleToggle2FA = () => {
    if (twoFactorEnabled) {
      setTwoFactorEnabled(false);
      showToast({
        type: "info",
        title: "Two-Factor Disabled",
        message: "Two-factor authentication has been turned off for this account.",
      });
    } else {
      setShow2FAModal(true);
    }
  };

  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      showToast({
        type: "error",
        title: "Invalid Verification Code",
        message: "Please enter the 6-digit code from your authenticator app.",
      });
      return;
    }

    setTwoFactorEnabled(true);
    setShow2FAModal(false);
    setOtpCode("");
    showToast({
      type: "success",
      title: "2FA Activated",
      message: "Two-factor authentication is now protecting this account.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans animate-fade-in text-start pb-12">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#F0F9FF] border border-[#BAE6FD] text-[#0369A1]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Account Security & Credentials</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
          Password, 2FA & Session Controls
        </h1>
        <p className="text-sm text-[#475569] max-w-2xl">
          Manage your login credentials, multi-factor authentication, and active signed-in devices for {user?.email || "your account"}.
        </p>
      </div>

      {/* SECTION 1: CHANGE PASSWORD FORM */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-[#F0F9FF] border border-[#BAE6FD] flex items-center justify-center text-[#0369A1]">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#0F172A]">Change Password</h2>
            <p className="text-xs text-[#475569]">
              Ensure your account uses a strong, unique passphrase with at least 8 characters.
            </p>
          </div>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-5 max-w-2xl">
          {/* Current Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#0F172A] block">Current Password</label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
                className="w-full px-3.5 py-2.5 rounded-[8px] border border-[#CBD5E1] text-sm focus:outline-none focus:ring-2 focus:ring-[#0369A1] focus:border-transparent pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label={showCurrent ? "Hide password" : "Show password"}
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#0F172A] block">New Password</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter at least 8 characters"
                className="w-full px-3.5 py-2.5 rounded-[8px] border border-[#CBD5E1] text-sm focus:outline-none focus:ring-2 focus:ring-[#0369A1] focus:border-transparent pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label={showNew ? "Hide password" : "Show password"}
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Live Strength Meter */}
            {newPassword.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-1.5">
                  <div
                    className={`h-1.5 flex-1 rounded-full ${
                      strengthScore >= 1 ? "bg-red-500" : "bg-slate-200"
                    }`}
                  />
                  <div
                    className={`h-1.5 flex-1 rounded-full ${
                      strengthScore >= 2 ? "bg-amber-500" : "bg-slate-200"
                    }`}
                  />
                  <div
                    className={`h-1.5 flex-1 rounded-full ${
                      strengthScore >= 3 ? "bg-[#0369A1]" : "bg-slate-200"
                    }`}
                  />
                  <div
                    className={`h-1.5 flex-1 rounded-full ${
                      strengthScore >= 4 ? "bg-emerald-500" : "bg-slate-200"
                    }`}
                  />
                  <span className="text-[11px] font-semibold text-slate-600 pl-1">
                    {strengthScore <= 1
                      ? "Weak"
                      : strengthScore === 2
                      ? "Fair"
                      : strengthScore === 3
                      ? "Good"
                      : "Strong"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-1">
                  <span className={`flex items-center gap-1 ${hasMinLength ? "text-emerald-700 font-medium" : ""}`}>
                    {hasMinLength ? <Check className="w-3 h-3 text-emerald-600" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-300 ml-1 mr-0.5" />}
                    8+ characters
                  </span>
                  <span className={`flex items-center gap-1 ${hasMixedCase ? "text-emerald-700 font-medium" : ""}`}>
                    {hasMixedCase ? <Check className="w-3 h-3 text-emerald-600" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-300 ml-1 mr-0.5" />}
                    Uppercase & lowercase
                  </span>
                  <span className={`flex items-center gap-1 ${hasNumber ? "text-emerald-700 font-medium" : ""}`}>
                    {hasNumber ? <Check className="w-3 h-3 text-emerald-600" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-300 ml-1 mr-0.5" />}
                    At least one number
                  </span>
                  <span className={`flex items-center gap-1 ${hasSpecial ? "text-emerald-700 font-medium" : ""}`}>
                    {hasSpecial ? <Check className="w-3 h-3 text-emerald-600" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-300 ml-1 mr-0.5" />}
                    Special symbol
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#0F172A] block">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your new password"
              className="w-full px-3.5 py-2.5 rounded-[8px] border border-[#CBD5E1] text-sm focus:outline-none focus:ring-2 focus:ring-[#0369A1] focus:border-transparent"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={updatingPassword}
              className="min-h-[44px] px-6 py-2.5 rounded-[8px] bg-[#0369A1] hover:bg-[#075985] text-white text-sm font-semibold transition-colors inline-flex items-center gap-2 disabled:opacity-50 cursor-pointer shadow-xs"
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

      {/* SECTION 2: TWO-FACTOR AUTHENTICATION */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center text-[#15803D]">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#0F172A]">Two-factor authentication</h2>
                {twoFactorEnabled ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]">
                    Enabled
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    Recommended
                  </span>
                )}
              </div>
              <p className="text-xs text-[#475569]">
                Add an extra layer of protection during administrator sign-in using an authenticator app.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggle2FA}
            className={`min-h-[38px] px-4 py-1.5 rounded-[6px] text-xs font-semibold transition-colors cursor-pointer border ${
              twoFactorEnabled
                ? "border-red-200 text-red-600 hover:bg-red-50"
                : "border-[#BAE6FD] bg-[#F0F9FF] text-[#0369A1] hover:bg-[#E0F2FE]"
            }`}
          >
            {twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-100 bg-[#F8FAFC] space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
              <span className="text-xs font-bold text-[#0F172A]">Authenticator app</span>
            </div>
            <p className="text-xs text-[#475569] leading-relaxed">
              Google Authenticator, Microsoft Authenticator, or 1Password generate temporary 6-digit codes.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-100 bg-[#F8FAFC] space-y-2">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#0369A1]" />
              <span className="text-xs font-bold text-[#0F172A]">Emergency Recovery Codes</span>
            </div>
            <p className="text-xs text-[#475569] leading-relaxed">
              8 single-use emergency bypass codes stored securely for backup verification.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 3: ACTIVE SESSIONS & DEVICE MANAGEMENT */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F0F9FF] border border-[#BAE6FD] flex items-center justify-center text-[#0369A1]">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0F172A]">Active Signed-In Devices</h2>
              <p className="text-xs text-[#475569]">
                These devices are currently authenticated to access your account.
              </p>
            </div>
          </div>

          {sessions.length > 1 && (
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

        <div className="divide-y divide-slate-100">
          {sessions.map((sess) => (
            <div key={sess.id} className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600">
                  {sess.type === "mobile" ? (
                    <Smartphone className="w-4 h-4" />
                  ) : (
                    <Laptop className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-[#0F172A]">{sess.device}</p>
                    {sess.isCurrent && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]">
                        THIS DEVICE
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#64748B] flex items-center gap-2 mt-0.5">
                    <span>{sess.location}</span>
                    <span>•</span>
                    <span className="font-mono">{sess.ip}</span>
                    <span>•</span>
                    <span>{sess.lastActive}</span>
                  </p>
                </div>
              </div>

              {!sess.isCurrent && (
                <button
                  type="button"
                  onClick={() => {
                    setSessions((prev) => prev.filter((s) => s.id !== sess.id));
                    showToast({
                      type: "info",
                      title: "Session Revoked",
                      message: `Terminated session on ${sess.device}.`,
                    });
                  }}
                  className="text-xs text-red-600 hover:text-red-700 font-medium px-2.5 py-1 rounded hover:bg-red-50"
                >
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: SECURITY AUDIT & LOGIN ACTIVITY */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#0F172A]">Recent Security Activity</h2>
            <p className="text-xs text-[#475569]">
              Authentication events and credential modifications associated with this account.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead>
              <tr className="border-b border-slate-100 text-[#475569] font-semibold">
                <th className="py-2.5 pr-4 text-start">Event</th>
                <th className="py-2.5 px-4 text-start">Timestamp</th>
                <th className="py-2.5 px-4 text-start">IP Address</th>
                <th className="py-2.5 pl-4 text-end">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60">
                  <td className="py-2.5 pr-4 font-medium text-[#0F172A]">{log.event}</td>
                  <td className="py-2.5 px-4 text-[#64748B]">{log.timestamp}</td>
                  <td className="py-2.5 px-4 font-mono text-slate-600">{log.ip}</td>
                  <td className="py-2.5 pl-4 text-end">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-[#ECFDF5] border border-[#A7F3D0] px-2 py-0.5 rounded-[4px]">
                      <Check className="w-3 h-3" />
                      <span>{log.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2FA SETUP MODAL */}
      {show2FAModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 border border-[#E2E8F0] shadow-xl animate-fade-in text-start">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#0F172A]">Set up Authenticator App</h3>
              <button
                type="button"
                onClick={() => setShow2FAModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#475569] leading-relaxed">
              Scan this key or enter it manually into Google Authenticator or 1Password to begin receiving verification codes.
            </p>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[#0F172A]">
                ET-FINK-9942-X821-SEC
              </span>
              <button
                type="button"
                onClick={handleCopySecret}
                className="text-xs text-[#0369A1] hover:text-[#075985] font-semibold inline-flex items-center gap-1"
              >
                {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey ? "Copied" : "Copy"}</span>
              </button>
            </div>

            <form onSubmit={handleVerify2FA} className="space-y-3 pt-1">
              <label className="text-xs font-semibold text-[#0F172A] block">
                Enter 6-digit Code from Authenticator
              </label>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                className="w-full px-3.5 py-2.5 rounded-[8px] border border-[#CBD5E1] text-base font-mono tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-[#0369A1]"
                required
              />

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShow2FAModal(false)}
                  className="px-4 py-2 rounded-[6px] text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-[6px] text-xs font-semibold bg-[#0369A1] hover:bg-[#075985] text-white"
                >
                  Verify & Activate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export { SecurityView as AccountSecurityView, SecurityView as InstitutionalSecurityView };
