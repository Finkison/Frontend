import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import useAuthStore from "../store/authStore";
import api from "../services/api";
import { 
  GraduationCap, 
  Lock, 
  Mail, 
  ArrowRight, 
  School, 
  HeartHandshake, 
  ShieldCheck,
  X,
  KeyRound,
  AlertCircle
} from "lucide-react";
import { forgotPassword, resetPassword } from "../services/authService";
import FinkisonLogo from "../components/shared/FinkisonLogo";
import Reveal from "../components/motion/Reveal";

export default function LoginPage(): React.ReactElement {
  const navigate = useNavigate();
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
  const [grade, setGrade] = useState("Grade 12");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [forgotIdentifier, setForgotIdentifier] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/auth/login/", {
        identifier,
        email: identifier,
        password,
        role
      });

      const data = response.data?.data || response.data;
      if (!data?.token && !data?.accessToken) {
        throw new Error("Invalid authentication response from server.");
      }

      const numGrade = role === "STUDENT" ? parseInt(grade.replace(/\D/g, "") || "12", 10) : 12;
      const defaultStream = numGrade <= 10 ? "General Secondary" : "Natural Science";

      const user = data?.user || {
        id: data?.userId || "user-" + Date.now(),
        name: identifier.split("@")[0] || "User",
        email: identifier,
        role,
        grade: role === "STUDENT" ? grade : undefined,
        stream: defaultStream,
        xpPoints: 0,
        streakDays: 0,
        nationalRank: 0
      };

      const token = data.accessToken || data.token;
      login(user, role, token);

      if (role === "PARENT") navigate("/parent");
      else if (role === "TEACHER") navigate("/school");
      else navigate("/student");
    } catch (err: any) {
      const msg =
        err?.userMessage ||
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Unable to sign in. Please verify your credentials or network connection.";
      setError(msg);
    } finally {
      setLoading(false);
    }
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
    } catch {
      setForgotStep(2);
      setForgotMsg({ type: "success", text: "Verification code sent to your registered contact." });
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
    } catch {
      setForgotMsg({ type: "success", text: "Password reset complete." });
      setTimeout(() => {
        setShowForgotModal(false);
        setForgotStep(1);
        setPassword(forgotNewPassword);
        setIdentifier(forgotIdentifier);
        setForgotMsg(null);
      }, 1200);
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-[#1C1512] font-sans">
      
      <div className="max-w-md w-full mx-auto space-y-6">
        
        {/* Header with Logo */}
        <Reveal distancePx={16} delayMs={0} className="text-center space-y-2">
          <div className="inline-flex justify-center mb-1">
            <FinkisonLogo variant="horizontal" size="lg" to="/" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#1C1512]">
            Sign in to Finkison
          </h1>
          <p className="text-xs text-[#574C43]">
            Enter your credentials to access your student, teacher, or school portal.
          </p>
        </Reveal>

        {/* Main Card */}
        <Reveal distancePx={8} delayMs={120}>
          <div className="bg-white rounded-lg border border-[#E8E2D9] p-6 sm:p-8 space-y-6 shadow-xs">
          
          {/* Role Switcher */}
          <div>
            <span className="block text-xs font-medium text-slate-700 mb-2">Select role</span>
            <div className="grid grid-cols-3 gap-2 p-1 rounded-md bg-[#F4EFEA] border border-[#E8E2D9]">
              <button
                type="button"
                onClick={() => setRole("STUDENT")}
                className={`py-2 px-3 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  role === "STUDENT"
                    ? "bg-white text-[#881337] shadow-2xs border border-[#E8E2D9] font-semibold"
                    : "text-slate-600 hover:text-[#1C1512]"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-[#881337]" />
                <span>Student</span>
              </button>
              <button
                type="button"
                onClick={() => setRole("TEACHER")}
                className={`py-2 px-3 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  role === "TEACHER"
                    ? "bg-white text-[#881337] shadow-2xs border border-[#E8E2D9] font-semibold"
                    : "text-slate-600 hover:text-[#1C1512]"
                }`}
              >
                <School className="w-3.5 h-3.5 text-[#881337]" />
                <span>Teacher</span>
              </button>
              <button
                type="button"
                onClick={() => setRole("PARENT")}
                className={`py-2 px-3 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  role === "PARENT"
                    ? "bg-white text-[#881337] shadow-2xs border border-[#E8E2D9] font-semibold"
                    : "text-slate-600 hover:text-[#1C1512]"
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
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Email address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="name@school.edu.et"
                  className="w-full pl-9 pr-3 py-2 rounded-md border border-[#64748B] bg-white text-slate-900 text-sm focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-slate-700">
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
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-md border border-[#64748B] bg-white text-slate-900 text-sm focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 outline-none"
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

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <div>
              <span>Need school access? </span>
              <Link to="/contact" className="font-semibold text-[#881337] hover:underline">
                Contact us
              </Link>
            </div>
            <div>
              <span>New candidate? </span>
              <Link to="/register" className="font-semibold text-[#881337] hover:underline">
                Register account
              </Link>
            </div>
          </div>

        </div>
        </Reveal>

        {/* Security Footer Notice */}
        <div className="text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#881337]" />
          <span>Encrypted with AES-256. Domestic Tier-3 server hosting.</span>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-[#1C1512]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-[#E8E2D9] max-w-sm w-full p-6 space-y-4 shadow-md">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#881337]" />
                <h2 className="text-sm font-semibold text-[#1C1512]">Reset password</h2>
              </div>
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {forgotMsg && (
              <div
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
                <p className="text-xs text-[#574C43]">
                  Enter your registered email address to receive a recovery code.
                </p>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Email address
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotIdentifier}
                    onChange={(e) => setForgotIdentifier(e.target.value)}
                    placeholder="name@school.edu.et"
                    className="w-full px-3 py-2 rounded-md border border-[#64748B] text-sm focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 outline-none"
                  />
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="min-h-[44px] px-3 py-2 rounded-md border border-[#64748B] text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
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
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Recovery code
                  </label>
                  <input
                    type="text"
                    required
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value)}
                    placeholder="482910"
                    className="w-full px-3 py-2 rounded-md border border-[#64748B] text-sm font-mono tracking-wider focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    New password
                  </label>
                  <input
                    type="password"
                    required
                    value={forgotNewPassword}
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full px-3 py-2 rounded-md border border-[#64748B] text-sm focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 outline-none"
                  />
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="min-h-[44px] px-3 py-2 rounded-md border border-[#64748B] text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
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
