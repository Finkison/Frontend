import React, { useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import useAuthStore from "../store/authStore";
import api, { getApiErrorMessage } from "../services/api";
import { 
  GraduationCap, 
  Lock, 
  Mail, 
  ArrowRight, 
  School, 
  HeartHandshake, 
  X,
  KeyRound,
  AlertCircle
} from "lucide-react";
import { forgotPassword, resetPassword } from "../services/authService";
import FinkisonLogo from "../components/shared/FinkisonLogo";
import PublicPreferences from "../components/shared/PublicPreferences";
import Reveal from "../components/motion/Reveal";

export default function LoginPage(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const login = useAuthStore((s) => s.login);

  const urlRole = searchParams.get("role")?.toLowerCase();
  const [role, setRole] = useState<"STUDENT" | "TEACHER" | "PARENT">(
    urlRole === "teacher" || urlRole === "school"
      ? "TEACHER"
      : urlRole === "parent"
      ? "PARENT"
      : "STUDENT"
  );
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [forgotIdentifier, setForgotIdentifier] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const signInWithCredentials = async (
    selectedRole: "STUDENT" | "TEACHER" | "PARENT",
    selectedIdentifier: string,
    selectedPassword: string,
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/auth/login/", {
        identifier: selectedIdentifier,
        email: selectedIdentifier,
        password: selectedPassword,
        role: selectedRole
      });

      const data = response.data?.data || response.data;
      if (!data?.access_token && !data?.accessToken && !data?.token) {
        throw new Error("Invalid authentication response from server.");
      }

      const user = data?.user;
      if (!user || typeof user !== "object") {
        throw new Error("Your account profile could not be loaded. Please try again.");
      }

      const token = data.access_token || data.accessToken || data.token;
      const userRole = String(data?.user?.role || user.role || selectedRole).toUpperCase();
      login({ ...user, role: userRole }, userRole, token);
      const requestedNext = searchParams.get("next") || "";
      const from = (location.state as { from?: { pathname?: string; search?: string; hash?: string } } | null)?.from;
      const returnPath = requestedNext || (from?.pathname ? `${from.pathname}${from.search || ""}${from.hash || ""}` : "");
      if (userRole === "PARENT") navigate("/parent");
      else if (userRole === "TEACHER") navigate("/teacher");
      else if (["PRINCIPAL", "SCHOOL_ADMIN", "ADMIN", "SUPER_ADMIN"].includes(userRole)) navigate("/school");
      else navigate(returnPath.startsWith("/student") ? returnPath : "/student");
    } catch (error: unknown) {
      setError(getApiErrorMessage(error) || "Unable to sign in. Please verify your credentials or network connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void signInWithCredentials(role, identifier, password);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotIdentifier.trim()) return;
    setForgotLoading(true);
    setForgotMsg(null);
    try {
      const res = await forgotPassword({ identifier: forgotIdentifier.trim() });
      if (res.data?.success) {
        setForgotStep(2);
        setForgotMsg({
          type: "success",
          text: res.data.message || "A verification code has been sent to your registered contact."
        });
        if (res.data.otp_simulated) {
          setForgotOtp(res.data.otp_simulated);
        }
      } else {
        setForgotMsg({ type: "error", text: res.data?.error || "Could not send verification code." });
      }
    } catch (error: unknown) {
      setForgotMsg({
        type: "error",
        text: getApiErrorMessage(error) || "Could not send verification code. Please check your connection."
      });
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotOtp.trim() || !forgotNewPassword.trim()) return;
    setForgotLoading(true);
    setForgotMsg(null);
    try {
      const res = await resetPassword({
        identifier: forgotIdentifier.trim(),
        otp: forgotOtp.trim(),
        new_password: forgotNewPassword.trim()
      });
      if (res.data?.success) {
        setForgotMsg({ type: "success", text: "Password reset complete." });
        setTimeout(() => {
          setShowForgotModal(false);
          setForgotStep(1);
          setPassword(forgotNewPassword);
          setIdentifier(forgotIdentifier);
          setForgotMsg(null);
        }, 1200);
      } else {
        setForgotMsg({ type: "error", text: res.data?.error || "Reset failed." });
      }
    } catch (error: unknown) {
      setForgotMsg({
        type: "error",
        text: getApiErrorMessage(error) || "Password reset failed. Please verify the code and retry."
      });
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="public-dark-page relative min-h-screen bg-[#FAF8F5] dark:bg-[#1C1512] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-[#1C1512] font-sans">
      <div className="absolute right-4 top-4 z-10 sm:right-6 sm:top-6">
        <PublicPreferences variant="floating" showLanguage={false} />
      </div>

      <div className="max-w-md w-full mx-auto space-y-6">

        <Reveal distancePx={16} delayMs={0} className="text-center space-y-2">
          <div className="inline-flex justify-center mb-1">
            <FinkisonLogo variant="horizontal" size="lg" to="/" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#1C1512]">
            Sign in to Finkison
          </h1>
        </Reveal>

        <Reveal distancePx={8} delayMs={120}>
          <div className="bg-white dark:bg-[#261E1A] rounded-lg border border-[#E8E2D9] p-6 sm:p-8 space-y-6 shadow-xs">

          <div>
            <span className="block text-xs font-medium text-stone-700 dark:text-[#E7E0D6] mb-2">Account type</span>
            <div role="group" aria-label="Account type" className="grid grid-cols-3 gap-2 p-1 rounded-md bg-[#F4EFEA] dark:bg-[#201815] border border-[#E8E2D9]">
              <button
                type="button"
                onClick={() => setRole("STUDENT")}
                aria-pressed={role === "STUDENT"}
                className={`min-h-[44px] py-2 px-3 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  role === "STUDENT"
                    ? "bg-white dark:bg-[#261E1A] text-[#881337] shadow-2xs border border-[#E8E2D9] font-semibold"
                    : "text-stone-600 dark:text-[#E7E0D6] hover:text-[#261E1A] dark:hover:text-[#FDFBF7]"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-[#881337]" />
                <span>Student</span>
              </button>
              <button
                type="button"
                onClick={() => setRole("TEACHER")}
                aria-pressed={role === "TEACHER"}
                className={`min-h-[44px] py-2 px-3 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  role === "TEACHER"
                    ? "bg-white dark:bg-[#261E1A] text-[#881337] shadow-2xs border border-[#E8E2D9] font-semibold"
                    : "text-stone-600 dark:text-[#E7E0D6] hover:text-[#261E1A] dark:hover:text-[#FDFBF7]"
                }`}
              >
                <School className="w-3.5 h-3.5 text-[#881337]" />
                <span>Teacher</span>
              </button>
              <button
                type="button"
                onClick={() => setRole("PARENT")}
                aria-pressed={role === "PARENT"}
                className={`min-h-[44px] py-2 px-3 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  role === "PARENT"
                    ? "bg-white dark:bg-[#261E1A] text-[#881337] shadow-2xs border border-[#E8E2D9] font-semibold"
                    : "text-stone-600 dark:text-[#E7E0D6] hover:text-[#261E1A] dark:hover:text-[#FDFBF7]"
                }`}
              >
                <HeartHandshake className="w-3.5 h-3.5 text-[#881337]" />
                <span>Parent</span>
              </button>
            </div>
          </div>

          {error && (
            <div 
              role="alert"
              className="p-3 rounded-md bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2"
              style={{
                animation: "fadeIn 150ms cubic-bezier(0.2, 0, 0, 1) forwards"
              }}
            >
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-xs font-medium text-stone-700 dark:text-[#E7E0D6] mb-1">
                Email address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 dark:text-[#A89C90] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  id="login-email"
                  required
                  autoComplete="username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="name@school.edu.et"
                  className="w-full pl-9 pr-3 py-2 rounded-md border border-[#A89C90] bg-white dark:bg-[#261E1A] text-stone-900 dark:text-[#FDFBF7] text-sm focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="login-password" className="block text-xs font-medium text-stone-700 dark:text-[#E7E0D6]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotIdentifier(identifier);
                    setForgotStep(1);
                    setForgotMsg(null);
                    setShowForgotModal(true);
                  }}
                  className="text-xs text-[#881337] hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 dark:text-[#A89C90] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  id="login-password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-md border border-[#A89C90] bg-white dark:bg-[#261E1A] text-stone-900 dark:text-[#FDFBF7] text-sm focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[44px] py-2.5 px-4 rounded-md bg-[#FBBF24] hover:bg-[#F59E0B] active:bg-[#D97706] text-[#1C1512] font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#881337] focus:ring-offset-2"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-stone-100 dark:border-white/10 flex items-center justify-between text-xs text-stone-600 dark:text-[#E7E0D6]">
            <div>
              <span>Need school access? </span>
              <Link to="/contact" className="font-semibold text-[#881337] hover:underline">
                Contact us
              </Link>
            </div>
            <div>
              <span>New here? </span>
              <Link to="/register" className="font-semibold text-[#881337] hover:underline">
                Create account
              </Link>
            </div>
          </div>

        </div>
        </Reveal>

      </div>

      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-[#1C1512]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-password-title"
            onKeyDown={(e) => { if (e.key === "Escape") setShowForgotModal(false); }}
            className="bg-white dark:bg-[#261E1A] rounded-lg border border-[#E8E2D9] max-w-sm w-full p-6 space-y-4 shadow-md"
          >

            <div className="flex items-center justify-between border-b border-stone-100 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#881337]" />
                <h2 id="reset-password-title" className="text-sm font-semibold text-[#1C1512]">Reset password</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="text-stone-400 dark:text-[#A89C90] hover:text-stone-600 cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {forgotMsg && (
              <div
                role={forgotMsg.type === "error" ? "alert" : "status"}
                className={`p-2.5 rounded-md text-xs border ${
                  forgotMsg.type === "success"
                    ? "bg-emerald-50 border-emerald-200 text-[#15803D]"
                    : "bg-red-50 border-red-200 text-red-800"
                }`}
              >
                {forgotMsg.text}
              </div>
            )}

            {forgotStep === 1 ? (
              <form onSubmit={handleSendOtp} className="space-y-3">
                <p className="text-xs text-[#574C43] dark:text-[#E7E0D6]">
                  Enter your registered email address to receive a recovery code.
                </p>
                <div>
                  <label htmlFor="forgot-email" className="block text-xs font-medium text-stone-700 dark:text-[#E7E0D6] mb-1">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="forgot-email"
                    required
                    autoFocus
                    autoComplete="username"
                    value={forgotIdentifier}
                    onChange={(e) => setForgotIdentifier(e.target.value)}
                    placeholder="name@school.edu.et"
                    className="w-full px-3 py-2 rounded-md border border-[#A89C90] text-sm focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 outline-none"
                  />
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="min-h-[44px] px-3 py-2 rounded-md border border-[#A89C90] text-xs font-medium text-stone-700 dark:text-[#E7E0D6] hover:bg-stone-50 dark:hover:bg-white/5 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="min-h-[44px] px-4 py-2 rounded-md bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1C1512] text-xs font-semibold transition-colors cursor-pointer disabled:opacity-60 focus:ring-2 focus:ring-[#881337]"
                  >
                    {forgotLoading ? "Sending..." : "Send code"}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-3">
                <div>
                  <label htmlFor="forgot-code" className="block text-xs font-medium text-stone-700 dark:text-[#E7E0D6] mb-1">
                    Recovery code
                  </label>
                  <input
                    type="text"
                    id="forgot-code"
                    required
                    autoFocus
                    autoComplete="one-time-code"
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value)}
                    placeholder="482910"
                    className="w-full px-3 py-2 rounded-md border border-[#A89C90] text-sm font-mono tracking-wider focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="forgot-new-password" className="block text-xs font-medium text-stone-700 dark:text-[#E7E0D6] mb-1">
                    New password
                  </label>
                  <input
                    type="password"
                    id="forgot-new-password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={forgotNewPassword}
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full px-3 py-2 rounded-md border border-[#A89C90] text-sm focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 outline-none"
                  />
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="min-h-[44px] px-3 py-2 rounded-md border border-[#A89C90] text-xs font-medium text-stone-700 dark:text-[#E7E0D6] hover:bg-stone-50 dark:hover:bg-white/5 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="min-h-[44px] px-4 py-2 rounded-md bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1C1512] text-xs font-semibold transition-colors cursor-pointer disabled:opacity-60 focus:ring-2 focus:ring-[#881337]"
                  >
                    {forgotLoading ? "Saving..." : "Save password"}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
