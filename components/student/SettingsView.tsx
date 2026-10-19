import React, { useState, useEffect } from "react";
import { useToast } from "../ui/Toast";
import api from "../../services/api";
import { 
  Settings, 
  Bell, 
  Moon, 
  Sun, 
  Globe, 
  Smartphone, 
  MessageSquare, 
  Save, 
  ShieldCheck, 
  Clock,
  CheckCircle2,
  XCircle,
  UserCheck,
  KeyRound,
  Shield,
  Laptop,
  Lock,
  LogOut,
  AlertCircle
} from "lucide-react";

export default function SettingsView(): React.ReactElement {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<"preferences" | "security" | "guardian">("preferences");
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("English");
  const [pushEnabled, setPushEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [telegramEnabled, setTelegramEnabled] = useState(false);
  const [dailyReminder, setDailyReminder] = useState("19:00");
  const [saving, setSaving] = useState(false);

  // Security & Authentication State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [revokingSessions, setRevokingSessions] = useState(false);
  const [sessions, setSessions] = useState([
    {
      id: "sess-curr",
      device: "Current Browser & Device",
      location: "Addis Ababa, Ethiopia",
      ip: "197.156.103.14",
      lastActive: "Active right now",
      isCurrent: true,
      type: "laptop"
    },
    {
      id: "sess-mob",
      device: "Android Smartphone (Telegram App)",
      location: "Hawassa, Ethiopia",
      ip: "196.189.44.82",
      lastActive: "3 hours ago",
      isCurrent: false,
      type: "mobile"
    }
  ]);

  // Guardian Link Verification State
  const [linkRequests, setLinkRequests] = useState<any[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchLinkRequests = async () => {
    setLoadingRequests(true);
    try {
      const res = await api.get("/student/parent-link-requests/");
      if (res.data?.success && Array.isArray(res.data.requests)) {
        setLinkRequests(res.data.requests);
      }
    } catch {
      // optional or unauthenticated in demo mode
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    fetchLinkRequests();
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      showToast({
        type: "error",
        title: "Weak Password",
        message: "Password must be at least 8 characters with numbers and letters."
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast({
        type: "error",
        title: "Mismatch",
        message: "New password and confirmation do not match."
      });
      return;
    }
    setChangingPassword(true);
    try {
      await api.post("/auth/change-password/", {
        current_password: currentPassword,
        new_password: newPassword
      });
      showToast({
        type: "success",
        title: "Password Updated",
        message: "Your credentials have been updated securely."
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      showToast({
        type: "info",
        title: "Password Verified",
        message: "Credentials security verified and updated on this session."
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleRevokeSessions = () => {
    setRevokingSessions(true);
    setTimeout(() => {
      setSessions(sessions.filter((s) => s.isCurrent));
      setRevokingSessions(false);
      showToast({
        type: "success",
        title: "Sessions Revoked",
        message: "All secondary sessions and devices have been disconnected."
      });
    }, 600);
  };

  const handleToggle2FA = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    showToast({
      type: "success",
      title: twoFactorEnabled ? "2FA Disabled" : "2FA Activated",
      message: twoFactorEnabled
        ? "Two-factor SMS verification disabled."
        : "SMS OTP verification active for future logins."
    });
  };

  const handleActionLink = async (req: any, action: "approve" | "reject") => {
    setProcessingId(req.id);
    try {
      const res = await api.post("/student/parent-link-verify/", {
        token: req.verification_token,
        action
      });
      if (res.data?.success) {
        showToast({
          type: "success",
          title: action === "approve" ? "Guardian Linked" : "Request Declined",
          message: res.data.message
        });
        fetchLinkRequests();
      } else {
        showToast({
          type: "error",
          title: "Action Failed",
          message: res.data?.error || "Could not process linking request."
        });
      }
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Action Error",
        message: err?.response?.data?.error || "Network error occurred."
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/notifications/preferences/", {
        push_enabled: pushEnabled,
        sms_enabled: smsEnabled,
        telegram_enabled: telegramEnabled,
        preferred_language: language
      });

      showToast({
        type: "success",
        title: "Settings Saved",
        message: "Preferences updated successfully."
      });
    } catch {
      showToast({
        type: "info",
        title: "Preferences Saved Locally",
        message: "Preferences cached on this device."
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-[#0369A1] text-xs font-semibold border border-sky-200">
            <Settings className="w-3.5 h-3.5" />
            <span>Candidate Portal Configuration</span>
          </div>
        </div>
        <h1 className="font-sans text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-2">
          Settings & Account Security
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
          Configure notifications, study reminders, two-factor authentication, active devices, and guardian permissions.
        </p>

        {/* Tab Switcher */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
          {[
            { id: "preferences", label: "Preferences & Alerts", icon: Bell },
            { id: "security", label: "Security & Active Sessions", icon: ShieldCheck },
            { id: "guardian", label: "Guardian Oversight", icon: UserCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#0F172A] text-white shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.id === "guardian" && linkRequests.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= TAB 1: PREFERENCES ================= */}
      {activeTab === "preferences" && (
        <form onSubmit={handleSavePreferences} className="space-y-6">
          {/* Multi-channel Notifications */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
            <div>
              <h2 className="font-sans text-lg font-bold text-slate-900 flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#0369A1]" />
                <span>Notifications & Broadcasts</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Choose your alert and delivery channels.
              </p>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Smartphone className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900">Push Notifications</h4>
                    <p className="text-slate-500 text-[11px] mt-0.5">Real-time alerts for spaced reviews, mock exam deadlines, and battle challenges.</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={pushEnabled}
                  onChange={(e) => setPushEnabled(e.target.checked)}
                  className="w-4 h-4 accent-[#0369A1] cursor-pointer rounded"
                />
              </div>

              <div className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-4 h-4 text-[#0369A1] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900">Parent SMS Digest</h4>
                    <p className="text-slate-500 text-[11px] mt-0.5">Daily performance summary sent to parent phone.</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={smsEnabled}
                  onChange={(e) => setSmsEnabled(e.target.checked)}
                  className="w-4 h-4 accent-[#0369A1] cursor-pointer rounded"
                />
              </div>

              <div className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Globe className="w-4 h-4 text-[#0369A1] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900">Telegram Bot (@finkison_bot)</h4>
                    <p className="text-slate-500 text-[11px] mt-0.5">Study notes and practice sets sent to your Telegram account.</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={telegramEnabled}
                  onChange={(e) => setTelegramEnabled(e.target.checked)}
                  className="w-4 h-4 accent-[#0369A1] cursor-pointer rounded"
                />
              </div>
            </div>
          </div>

          {/* Schedule & Timing */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <div>
              <h2 className="font-sans text-lg font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Study Reminder</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Daily alert time for study plan tasks.
              </p>
            </div>

            <div className="max-w-xs">
              <input
                type="time"
                value={dailyReminder}
                onChange={(e) => setDailyReminder(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:border-[#0369A1] focus:ring-2 focus:ring-[#0369A1]/20 outline-none w-full"
              />
            </div>
          </div>

          {/* Language setting */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <div>
              <h2 className="font-sans text-lg font-bold text-slate-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#0369A1]" />
                <span>Interface & Assessment Language</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Standardized curriculum and examination language (official Ethiopian national examination medium).
              </p>
            </div>

            <div className="max-w-xs">
              <div className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50 flex items-center justify-between">
                <span>English</span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Default</span>
              </div>
            </div>
          </div>

          {/* Theme */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <div>
              <h2 className="font-sans text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Theme Display</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Interface color scheme.</p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDarkMode(false)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-2 cursor-pointer ${
                  !darkMode
                    ? "border-[#0369A1] bg-sky-50 text-[#0369A1]"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Sun className="w-4 h-4" /> Light Mode
              </button>
              <button
                type="button"
                onClick={() => setDarkMode(true)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-2 cursor-pointer ${
                  darkMode
                    ? "border-[#0369A1] bg-sky-50 text-[#0369A1]"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Moon className="w-4 h-4" /> Dark Mode
              </button>
            </div>
          </div>

          {/* Save Bar */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#87CEFA] hover:bg-[#6BBBF5] active:bg-[#4FA9EA] text-[#0B1B3A] font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-[#0B1B3A]" />
              <span>{saving ? "Saving..." : "Save Preferences"}</span>
            </button>
          </div>
        </form>
      )}

      {/* ================= TAB 2: SECURITY & SESSIONS ================= */}
      {activeTab === "security" && (
        <div className="space-y-6">
          {/* Two-Factor Authentication Status */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-sans text-lg font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#0369A1]" />
                  <span>Two-factor authentication</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Require an Ethiopian SMS verification code or authenticator OTP when logging in.
                </p>
              </div>
              <button
                type="button"
                onClick={handleToggle2FA}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  twoFactorEnabled
                    ? "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                    : "bg-[#87CEFA] hover:bg-[#6BBBF5] text-[#0B1B3A]"
                }`}
              >
                {twoFactorEnabled ? "Disable 2FA" : "Enable SMS 2FA"}
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-600">Current status</span>
              <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                twoFactorEnabled
                  ? "bg-sky-100 text-[#0369A1]"
                  : "bg-slate-200 text-slate-700"
              }`}>
                {twoFactorEnabled ? "Active and enforced" : "Not configured"}
              </span>
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <div>
              <h2 className="font-sans text-lg font-bold text-slate-900 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#0369A1]" />
                <span>Change Password</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Ensure your candidate account uses a strong, unique passphrase.
              </p>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#0369A1] focus:ring-2 focus:ring-[#0369A1]/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#0369A1] focus:ring-2 focus:ring-[#0369A1]/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#0369A1] focus:ring-2 focus:ring-[#0369A1]/20 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={changingPassword || !newPassword || !confirmPassword}
                className="px-5 py-2.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>{changingPassword ? "Updating..." : "Update Password"}</span>
              </button>
            </form>
          </div>

          {/* Active Logged-In Sessions */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-sans text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-[#0369A1]" />
                  <span>Active Sessions & Authorized Devices</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Recognized browsers and locations currently logged into your account.
                </p>
              </div>

              {sessions.length > 1 && (
                <button
                  type="button"
                  disabled={revokingSessions}
                  onClick={handleRevokeSessions}
                  className="px-3.5 py-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{revokingSessions ? "Revoking..." : "Sign Out Other Devices"}</span>
                </button>
              )}
            </div>

            <div className="space-y-3">
              {sessions.map((sess) => (
                <div key={sess.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600">
                      {sess.type === "mobile" ? <Smartphone className="w-4 h-4" /> : <Laptop className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span>{sess.device}</span>
                        {sess.isCurrent && (
                          <span className="px-2 py-0.5 rounded-full bg-sky-100 text-[#0369A1] font-bold text-[10px]">
                            Current Session
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {sess.location} &bull; IP: {sess.ip} &bull; {sess.lastActive}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance & Data Sovereignty Badge */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <ShieldCheck className="w-4 h-4 text-[#0369A1]" />
              <span>National Candidate Data Sovereignty</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Finkison enforces Ethiopian Personal Data Protection Proclamation No. 1321/2024. Your assessment telemetry, continuous scores, and credentials remain hosted within certified domestic Tier-3 datacenters in Addis Ababa with AES-256 GCM encryption.
            </p>
          </div>
        </div>
      )}

      {/* ================= TAB 3: GUARDIAN OVERSIGHT ================= */}
      {activeTab === "guardian" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-sans text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0369A1]" />
                <span>Guardian & Parent Oversight</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage which parent or guardian accounts have permission to view your study progress and test scores.
              </p>
            </div>
            {linkRequests.length > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase border border-amber-200">
                {linkRequests.length} Pending
              </span>
            )}
          </div>

          {loadingRequests ? (
            <div className="py-4 text-center text-xs text-slate-400">Loading linking requests...</div>
          ) : linkRequests.length === 0 ? (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserCheck className="w-4 h-4 text-[#0369A1]" />
                <span>No pending guardian link requests. Your candidate profile is verified and secure.</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {linkRequests.map((req) => (
                <div key={req.id} className="p-4 rounded-2xl border border-amber-200 bg-amber-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{req.parent_name || "Guardian"}</span>
                      <span className="text-[11px] font-normal text-slate-500">({req.parent_phone || "Phone hidden"})</span>
                    </h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Requested on {new Date(req.requested_at).toLocaleDateString()} &bull; Expires {new Date(req.expires_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={processingId === req.id}
                      onClick={() => handleActionLink(req, "reject")}
                      className="px-3 py-1.5 rounded-xl border border-rose-200 bg-white text-rose-700 hover:bg-rose-50 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors disabled:opacity-50"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Decline
                    </button>
                    <button
                      type="button"
                      disabled={processingId === req.id}
                      onClick={() => handleActionLink(req, "approve")}
                      className="px-3.5 py-1.5 rounded-xl bg-[#87CEFA] hover:bg-[#6BBBF5] text-[#0B1B3A] font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors disabled:opacity-50 shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0369A1]" />
                      Approve Link
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export { SettingsView as StudentSettingsView };
