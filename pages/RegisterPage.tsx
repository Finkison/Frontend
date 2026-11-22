import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import useAuthStore from "../store/authStore";
import api, { getApiErrorMessage } from "../services/api";
import { 
  GraduationCap, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Building2, 
  Lock, 
  Phone, 
  Mail, 
  User as UserIcon, 
  ShieldCheck,
  FlaskConical,
  Scale,
  AlertCircle
} from "lucide-react";
import FinkisonLogo from "../components/shared/FinkisonLogo";
import PublicPreferences from "../components/shared/PublicPreferences";
import Reveal from "../components/motion/Reveal";

export default function RegisterPage(): React.ReactElement {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const login = useAuthStore((s) => s.login);

  const urlRole = searchParams.get("role")?.toLowerCase();
  const [roleMode, setRoleMode] = useState<"STUDENT" | "SCHOOL" | "PARENT">(
    urlRole === "school" || urlRole === "teacher"
      ? "SCHOOL"
      : urlRole === "parent"
      ? "PARENT"
      : "STUDENT"
  );
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setRoleMode(
      urlRole === "school" || urlRole === "teacher"
        ? "SCHOOL"
        : urlRole === "parent"
          ? "PARENT"
          : "STUDENT",
    );
    setStep(1);
    setError(null);
  }, [urlRole]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    stream: "Natural Science",
    grade: "Grade 12",
    region: "Addis Ababa",
    school: "",
    targetScore: 540
  });

  const [parentData, setParentData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    relationship: "Legal Guardian"
  });

  const handleParentRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/register/", {
        name: parentData.name,
        email: parentData.email.trim(),
        phone: parentData.phone,
        password: parentData.password,
        role: "PARENT",
        relationship: parentData.relationship
      });

      const data = response.data?.data || response.data;
      if (!data?.access_token && !data?.accessToken && !data?.token) {
        throw new Error(data?.message || "Invalid registration response from server.");
      }

      const user = data?.user || {
        id: data?.userId || "par-" + Date.now().toString(36),
        name: parentData.name,
        email: parentData.email,
        phone: parentData.phone,
        role: "PARENT",
        relationship: parentData.relationship
      };
      const token = data.access_token || data.accessToken || data.token;
      login(user, "PARENT", token);
      navigate("/parent");
    } catch (error: unknown) {
      setError(getApiErrorMessage(error) || "Registration failed. Please check your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string | number) => {
    setFormData((prev) => {
      const next = { ...prev };
      if (field === "targetScore") {
        if (typeof value === "number") next.targetScore = value;
        return next;
      }

      const textValue = String(value);
      switch (field) {
        case "name": next.name = textValue; break;
        case "email": next.email = textValue; break;
        case "phone": next.phone = textValue; break;
        case "password": next.password = textValue; break;
        case "stream": next.stream = textValue; break;
        case "grade": next.grade = textValue; break;
        case "region": next.region = textValue; break;
        case "school": next.school = textValue; break;
      }
      if (field === "grade") {
        const isJunior = textValue === "Grade 9" || textValue === "Grade 10";
        if (isJunior) {
          next.stream = "General Secondary";
        } else if (next.stream === "General Secondary") {
          next.stream = "Natural Science";
        }
      }
      return next;
    });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.name.trim() || !formData.email.trim()) {
        setError("Please enter your full name and email address.");
        return;
      }
    }
    setError(null);
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setError(null);
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/auth/register/", {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        grade: formData.grade,
        stream: formData.stream,
        school: formData.school,
        region: formData.region,
        role: "STUDENT",
        target_score: formData.targetScore
      });

      const data = response.data?.data || response.data;
      if (!data?.access_token && !data?.accessToken && !data?.token) {
        throw new Error(data?.message || "Invalid registration response from server.");
      }

      const user = data?.user || {
        id: data?.userId || "std-" + Date.now().toString(36),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: "STUDENT",
        grade: formData.grade,
        stream: formData.stream,
        school: formData.school,
        region: formData.region,
        targetScore: formData.targetScore,
        xpPoints: 0,
        streakDays: 0,
        nationalRank: 0
      };

      const token = data.access_token || data.accessToken || data.token;
      login(user, "STUDENT", token);
      const requestedNext = searchParams.get("next") || "";
      navigate(requestedNext.startsWith("/student") ? requestedNext : "/student");
    } catch (error: unknown) {
      setError(getApiErrorMessage(error) || "Registration failed. Please verify your details or network connection.");
    } finally {
      setLoading(false);
    }
  };

  const regions = [
    "Addis Ababa",
    "Oromia",
    "Amhara",
    "Sidama",
    "Tigray",
    "Somali",
    "Afar",
    "Benishangul-Gumuz",
    "Dire Dawa",
    "Gambela",
    "Harari",
    "Central Ethiopia",
    "South Ethiopia",
    "South West Ethiopia"
  ];

  return (
    <div className="public-dark-page relative min-h-screen bg-[#FAF8F5] dark:bg-[#1C1512] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-[#1C1512] font-sans">
      <div className="absolute right-4 top-4 z-10 sm:right-6 sm:top-6">
        <PublicPreferences variant="floating" showLanguage={false} />
      </div>
      <div className="max-w-xl w-full mx-auto space-y-6">

        <Reveal distancePx={16} delayMs={0} className="text-center space-y-2">
          <div className="inline-flex justify-center mb-1">
            <FinkisonLogo variant="horizontal" size="lg" to="/" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1C1512]">
            {roleMode === "STUDENT" 
              ? "Create student account" 
              : roleMode === "SCHOOL"
              ? "School and educator access"
              : "Register parent account"}
          </h1>
          <p className="text-xs text-[#574C43] dark:text-[#E7E0D6]">
            {roleMode === "STUDENT" 
              ? "Study curriculum topics and practise exam questions."
              : roleMode === "SCHOOL"
              ? "Request a school workspace or join with an invitation from your school administrator."
              : "Create an account, then request a secure link to your student’s profile."}
          </p>
        </Reveal>

        <Reveal distancePx={8} delayMs={60}>
          <div className="grid grid-cols-3 gap-2 p-1 rounded-[8px] bg-stone-100 dark:bg-[#201815] border border-stone-200 dark:border-white/10">
            <button
              type="button"
              aria-pressed={roleMode === "STUDENT"}
              onClick={() => {
                setRoleMode("STUDENT");
                setStep(1);
                setError(null);
              }}
              className={`py-2 px-3 rounded-[6px] text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                roleMode === "STUDENT"
                  ? "bg-white dark:bg-[#261E1A] text-[#881337] shadow-2xs border border-[#FECDD3] dark:border-[#881337]/50 font-semibold"
                  : "text-stone-600 dark:text-[#E7E0D6] hover:text-stone-900"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-[#881337]" />
              <span>Student</span>
            </button>
            <button
              type="button"
              aria-pressed={roleMode === "SCHOOL"}
              onClick={() => {
                setRoleMode("SCHOOL");
                setStep(1);
                setError(null);
              }}
              className={`py-2 px-3 rounded-[6px] text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                roleMode === "SCHOOL"
                  ? "bg-white dark:bg-[#261E1A] text-[#881337] shadow-2xs border border-[#FECDD3] dark:border-[#881337]/50 font-semibold"
                  : "text-stone-600 dark:text-[#E7E0D6] hover:text-stone-900"
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-[#881337]" />
              <span>For schools</span>
            </button>
            <button
              type="button"
              aria-pressed={roleMode === "PARENT"}
              onClick={() => {
                setRoleMode("PARENT");
                setStep(1);
                setError(null);
              }}
              className={`py-2 px-3 rounded-[6px] text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                roleMode === "PARENT"
                  ? "bg-white dark:bg-[#261E1A] text-[#881337] shadow-2xs border border-[#FECDD3] dark:border-[#881337]/50 font-semibold"
                  : "text-stone-600 dark:text-[#E7E0D6] hover:text-stone-900"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#881337]" />
              <span>Parent</span>
            </button>
          </div>
        </Reveal>

        {roleMode === "STUDENT" && (
          <Reveal distancePx={8} delayMs={100}>
            <div className="flex items-center justify-between relative px-4 py-2">
              <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-0.5 bg-stone-200 dark:bg-white/10 -z-1" />
              {[
                { num: 1, label: "Credentials" },
                { num: 2, label: "Stream" },
                { num: 3, label: "Optional school" },
                { num: 4, label: "Goal" }
              ].map((s) => (
                <div key={s.num} aria-current={step === s.num ? "step" : undefined} className="flex flex-col items-center bg-[#FAF8F5] dark:bg-[#1C1512] px-2">
                  <div 
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                      step > s.num 
                        ? "bg-[#881337] text-white shadow-2xs" 
                        : step === s.num 
                        ? "bg-[#881337] text-white ring-4 ring-[#FECDD3] font-bold" 
                        : "bg-white dark:bg-[#261E1A] border border-stone-300 dark:border-white/20 text-stone-500 dark:text-[#A89C90]"
                    }`}
                  >
                    {step > s.num ? <Check className="w-3.5 h-3.5 text-white" /> : s.num}
                  </div>
                  <span className={`text-[11px] mt-1 font-medium ${step === s.num ? "text-[#881337] font-semibold" : "text-stone-500 dark:text-[#A89C90]"}`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        <Reveal distancePx={8} delayMs={140}>
          <div className="bg-white dark:bg-[#261E1A] rounded-2xl border border-[#E8E2D9] p-6 sm:p-8 space-y-6 shadow-xs">
            {error && (
              <div 
                role="alert"
                className="p-3 rounded-[6px] bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {roleMode === "PARENT" ? (
              <form onSubmit={handleParentRegister} className="space-y-4">
                <div>
                  <label htmlFor="parent-name" className="block text-xs font-medium text-stone-700 dark:text-[#E7E0D6] mb-1">
                    Guardian full name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-stone-400 dark:text-[#A89C90] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      id="parent-name"
                      autoComplete="name"
                      required
                      value={parentData.name}
                      onChange={(e) => setParentData({ ...parentData, name: e.target.value })}
                      placeholder="Full name"
                      className="w-full pl-9 pr-3 py-2 rounded-[6px] border border-stone-300 dark:border-white/20 bg-white dark:bg-[#261E1A] text-[#1C1512] dark:text-[#FDFBF7] text-sm focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 outline-none"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="parent-phone" className="block text-xs font-medium text-stone-700 dark:text-[#E7E0D6] mb-1">
                      Phone number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-stone-400 dark:text-[#A89C90] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="tel"
                        id="parent-phone"
                        autoComplete="tel"
                        required
                        value={parentData.phone}
                        onChange={(e) => setParentData({ ...parentData, phone: e.target.value })}
                        placeholder="+251 91 123 4567"
                        className="w-full pl-9 pr-3 py-2 rounded-[6px] border border-stone-300 dark:border-white/20 bg-white dark:bg-[#261E1A] text-[#1C1512] dark:text-[#FDFBF7] text-sm focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="parent-email" className="block text-xs font-medium text-stone-700 dark:text-[#E7E0D6] mb-1">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-400 dark:text-[#A89C90] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        id="parent-email"
                        autoComplete="email"
                        required
                        value={parentData.email}
                        onChange={(e) => setParentData({ ...parentData, email: e.target.value })}
                        placeholder="guardian@example.com"
                        className="w-full pl-9 pr-3 py-2 rounded-[6px] border border-stone-300 dark:border-white/20 bg-white dark:bg-[#261E1A] text-[#1C1512] dark:text-[#FDFBF7] text-sm focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="parent-relationship" className="block text-xs font-medium text-stone-700 dark:text-[#E7E0D6] mb-1">
                      Relationship to candidate
                    </label>
                    <select
                      id="parent-relationship"
                      value={parentData.relationship}
                      onChange={(e) => setParentData({ ...parentData, relationship: e.target.value })}
                      className="w-full px-3 py-2 rounded-[6px] border border-stone-300 dark:border-white/20 bg-white dark:bg-[#261E1A] text-[#1C1512] dark:text-[#FDFBF7] text-sm focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 outline-none cursor-pointer"
                    >
                      <option value="Legal Guardian">Legal Guardian</option>
                      <option value="Mother">Mother</option>
                      <option value="Father">Father</option>
                      <option value="Sibling / Sponsor">Sibling / Sponsor</option>
                    </select>
                  </div>

                </div>

                <div>
                  <label htmlFor="parent-password" className="block text-xs font-medium text-stone-700 dark:text-[#E7E0D6] mb-1">
                    Account password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 dark:text-[#A89C90] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="password"
                      id="parent-password"
                      required
                      minLength={10}
                      autoComplete="new-password"
                      value={parentData.password}
                      onChange={(e) => setParentData({ ...parentData, password: e.target.value })}
                      placeholder="At least 10 characters"
                      className="w-full pl-9 pr-3 py-2 rounded-[6px] border border-stone-300 dark:border-white/20 bg-white dark:bg-[#261E1A] text-[#1C1512] dark:text-[#FDFBF7] text-sm focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-[6px] bg-[#881337] hover:bg-[#9F1239] active:bg-[#BE123C] text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-[#881337]"
                  >
                    <span>{loading ? "Creating account..." : "Create parent account"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            ) : roleMode === "SCHOOL" ? (
              <section className="rounded-xl border border-[#E8E2D9] bg-[#FAF8F5] dark:bg-[#201815] p-5 sm:p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-[#FECDD3]/60 p-2 text-[#881337]">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-base font-semibold text-[#1C1512] dark:text-[#FDFBF7]">School and educator access</h2>
                    <p className="text-sm leading-6 text-[#574C43] dark:text-[#E7E0D6]">
                      School workspaces are set up with the Finkison team. Teachers and school leaders join through a secure invitation from their school administrator.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    to="/contact?topic=School%20setup"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#881337] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#9F1239] focus:outline-none focus:ring-2 focus:ring-[#881337] focus:ring-offset-2"
                  >
                    Request a school setup
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/accept-invitation"
                    className="inline-flex min-h-11 items-center justify-center rounded-lg border border-stone-300 px-4 py-2.5 text-sm font-semibold text-[#1C1512] transition-colors hover:bg-white dark:border-white/20 dark:text-[#FDFBF7] dark:hover:bg-white/5"
                  >
                    Accept an invitation
                  </Link>
                </div>
              </section>
            ) : (
              /* STUDENT MULTI-STEP FLOW */
              <div>
                {step === 1 && (
                  <form onSubmit={handleNext} className="space-y-4">
                    <div>
                      <label htmlFor="student-name" className="block text-xs font-medium text-stone-700 dark:text-[#E7E0D6] mb-1">
                        Candidate full name
                      </label>
                      <div className="relative">
                        <UserIcon className="w-4 h-4 text-stone-400 dark:text-[#A89C90] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          id="student-name"
                          autoComplete="name"
                          required
                          value={formData.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          placeholder="Full name"
                          className="w-full pl-9 pr-3 py-2 rounded-[6px] border border-stone-300 dark:border-white/20 bg-white dark:bg-[#261E1A] text-[#1C1512] dark:text-[#FDFBF7] text-sm focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="student-phone" className="block text-xs font-medium text-stone-700 dark:text-[#E7E0D6] mb-1">
                          Phone number
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-stone-400 dark:text-[#A89C90] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="tel"
                            id="student-phone"
                            autoComplete="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                            placeholder="+251 91 123 4567"
                            className="w-full pl-9 pr-3 py-2 rounded-[6px] border border-stone-300 dark:border-white/20 bg-white dark:bg-[#261E1A] text-[#1C1512] dark:text-[#FDFBF7] text-sm focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="student-email" className="block text-xs font-medium text-stone-700 dark:text-[#E7E0D6] mb-1">
                          Email address
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-stone-400 dark:text-[#A89C90] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="email"
                            id="student-email"
                            autoComplete="email"
                            required
                            value={formData.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            placeholder="name@school.edu.et"
                            className="w-full pl-9 pr-3 py-2 rounded-[6px] border border-stone-300 dark:border-white/20 bg-white dark:bg-[#261E1A] text-[#1C1512] dark:text-[#FDFBF7] text-sm focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="student-password" className="block text-xs font-medium text-stone-700 dark:text-[#E7E0D6] mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-stone-400 dark:text-[#A89C90] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="password"
                          id="student-password"
                          required
                          minLength={10}
                          autoComplete="new-password"
                          value={formData.password}
                          onChange={(e) => handleChange("password", e.target.value)}
                          placeholder="At least 10 characters"
                          className="w-full pl-9 pr-3 py-2 rounded-[6px] border border-stone-300 dark:border-white/20 bg-white dark:bg-[#261E1A] text-[#1C1512] dark:text-[#FDFBF7] text-sm focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 outline-none"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-[6px] bg-[#881337] hover:bg-[#9F1239] active:bg-[#BE123C] text-white font-semibold text-sm transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-[#881337]"
                      >
                        <span>Next step</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                )}

                {step === 2 && (
                  <form onSubmit={handleNext} className="space-y-4">
                    <div>
                      <label htmlFor="student-grade" className="block text-xs font-medium text-stone-700 dark:text-[#E7E0D6] mb-1">
                        Grade level
                      </label>
                      <select
                        id="student-grade"
                        value={formData.grade}
                        onChange={(e) => handleChange("grade", e.target.value)}
                        className="w-full px-3 py-2 rounded-[6px] border border-stone-300 dark:border-white/20 bg-white dark:bg-[#261E1A] text-[#1C1512] dark:text-[#FDFBF7] text-sm focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 outline-none cursor-pointer"
                      >
                        <option value="Grade 12">Grade 12</option>
                        <option value="Grade 11">Grade 11</option>
                        <option value="Grade 10">Grade 10</option>
                        <option value="Grade 9">Grade 9</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 dark:text-[#E7E0D6] mb-2">
                        Academic curriculum stream
                      </label>

                      {formData.grade === "Grade 9" || formData.grade === "Grade 10" ? (
                        <div className="p-3.5 rounded-[8px] border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-[#1C1512] text-xs text-stone-600 dark:text-[#E7E0D6] leading-relaxed">
                          <p className="font-semibold text-[#1C1512] dark:text-[#FDFBF7] mb-1">General secondary curriculum</p>
                          Grades 9-10 share a general curriculum. Stream selection starts in Grade 11.
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            aria-pressed={formData.stream === "Natural Science"}
                            onClick={() => handleChange("stream", "Natural Science")}
                            className={`p-4 rounded-[8px] border text-left transition-colors cursor-pointer flex flex-col justify-between ${
                              formData.stream === "Natural Science"
                                ? "border-[#881337] bg-[#FFF1F2] dark:bg-[#4C0519]/40 ring-2 ring-[#881337]/20"
                                : "border-stone-200 dark:border-white/10 bg-white dark:bg-[#261E1A] hover:bg-stone-50 dark:hover:bg-white/5"
                            }`}
                          >
                            <div className="w-8 h-8 rounded-[6px] bg-[#FFF1F2] dark:bg-[#4C0519]/40 text-[#881337] flex items-center justify-center mb-2">
                              <FlaskConical className="w-4 h-4 text-[#881337]" />
                            </div>
                            <span className="text-xs font-semibold text-[#1C1512] block">Natural Science</span>
                            <span className="text-[11px] text-[#574C43] dark:text-[#E7E0D6] mt-0.5">Physics, Chemistry, Biology, Math</span>
                          </button>

                          <button
                            type="button"
                            aria-pressed={formData.stream === "Social Science"}
                            onClick={() => handleChange("stream", "Social Science")}
                            className={`p-4 rounded-[8px] border text-left transition-colors cursor-pointer flex flex-col justify-between ${
                              formData.stream === "Social Science"
                                ? "border-[#881337] bg-[#FFF1F2] dark:bg-[#4C0519]/40 ring-2 ring-[#881337]/20"
                                : "border-stone-200 dark:border-white/10 bg-white dark:bg-[#261E1A] hover:bg-stone-50 dark:hover:bg-white/5"
                            }`}
                          >
                            <div className="w-8 h-8 rounded-[6px] bg-[#FFF1F2] dark:bg-[#4C0519]/40 text-[#881337] flex items-center justify-center mb-2">
                              <Scale className="w-4 h-4 text-[#881337]" />
                            </div>
                            <span className="text-xs font-semibold text-[#1C1512] block">Social Science</span>
                            <span className="text-[11px] text-[#574C43] dark:text-[#E7E0D6] mt-0.5">History, Geography, Economics, Civics</span>
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={handleBack}
                        className="px-4 py-2 rounded-[6px] border border-[#E8E2D9] bg-white dark:bg-[#261E1A] text-[#1C1512] dark:text-[#FDFBF7] hover:bg-[#FAF8F5] dark:hover:bg-white/5 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back</span>
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-[6px] bg-[#881337] hover:bg-[#9F1239] active:bg-[#BE123C] text-white font-semibold text-sm transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-[#881337]"
                      >
                        <span>Next step</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                )}

                {step === 3 && (
                  <form onSubmit={handleNext} className="space-y-4">
                    <div>
                      <label htmlFor="student-region" className="block text-xs font-medium text-stone-700 dark:text-[#E7E0D6] mb-1">
                        Region
                      </label>
                      <select
                        id="student-region"
                        value={formData.region}
                        onChange={(e) => handleChange("region", e.target.value)}
                        className="w-full px-3 py-2 rounded-[6px] border border-stone-300 dark:border-white/20 bg-white dark:bg-[#261E1A] text-[#1C1512] dark:text-[#FDFBF7] text-sm focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 outline-none cursor-pointer"
                      >
                        {regions.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="student-school" className="block text-xs font-medium text-stone-700 dark:text-[#E7E0D6] mb-1">
                        School name <span className="font-normal text-stone-500 dark:text-[#A89C90]">(optional)</span>
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-stone-400 dark:text-[#A89C90] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          id="student-school"
                          autoComplete="organization"
                          value={formData.school}
                          onChange={(e) => handleChange("school", e.target.value)}
                          placeholder="Enter a school, or leave blank to study independently"
                          className="w-full pl-9 pr-3 py-2 rounded-[6px] border border-stone-300 dark:border-white/20 bg-white dark:bg-[#261E1A] text-[#1C1512] dark:text-[#FDFBF7] text-sm focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 outline-none"
                        />
                      </div>
                      <p className="mt-1.5 text-[11px] leading-5 text-stone-500 dark:text-[#A89C90]">
                        You can use Finkison on your own. School workspace access is added when a school administrator links your account.
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={handleBack}
                        className="px-4 py-2 rounded-[6px] border border-[#E8E2D9] bg-white dark:bg-[#261E1A] text-[#1C1512] dark:text-[#FDFBF7] hover:bg-[#FAF8F5] dark:hover:bg-white/5 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back</span>
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-[6px] bg-[#881337] hover:bg-[#9F1239] active:bg-[#BE123C] text-white font-semibold text-sm transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-[#881337]"
                      >
                        <span>Next step</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                )}

                {step === 4 && (
                  <form onSubmit={handleFinish} className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label htmlFor="target-score" className="block text-xs font-medium text-stone-700 dark:text-[#E7E0D6]">
                          Personal score goal
                        </label>
                        <span className="text-xs font-mono font-bold text-[#881337] tabular-nums">
                          {formData.targetScore} / 600
                        </span>
                      </div>
                      <input
                        id="target-score"
                        type="range"
                        min="250"
                        max="600"
                        step="5"
                        value={formData.targetScore}
                        onChange={(e) => handleChange("targetScore", parseInt(e.target.value, 10))}
                        className="w-full accent-[#881337] cursor-pointer"
                      />
                    </div>

                    <div className="p-3.5 rounded-[8px] bg-[#FFF1F2] dark:bg-[#4C0519]/40 border border-[#FECDD3] dark:border-[#881337]/50 text-xs text-[#1C1512] space-y-1">
                      <p className="font-semibold text-[#881337]">
                        Profile summary
                      </p>
                      <p className="text-[#574C43] dark:text-[#E7E0D6] leading-relaxed text-[11px]">
                        Creating a learner account for {formData.name} in {formData.grade} • {formData.stream}{formData.school ? ` at ${formData.school}` : " for independent study"}.
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={handleBack}
                        className="px-4 py-2 rounded-[6px] border border-[#E8E2D9] bg-white dark:bg-[#261E1A] text-[#1C1512] dark:text-[#FDFBF7] hover:bg-[#FAF8F5] dark:hover:bg-white/5 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back</span>
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2.5 rounded-[6px] bg-[#881337] hover:bg-[#9F1239] active:bg-[#BE123C] text-white font-semibold text-sm transition-colors flex items-center gap-2 cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-[#881337]"
                      >
                        <span>{loading ? "Completing setup..." : "Create student account"}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </Reveal>

        <Reveal distancePx={8} delayMs={180} className="text-center">
          <p className="text-xs text-stone-600 dark:text-[#E7E0D6]">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-[#881337] hover:underline">
              Sign in
            </Link>
          </p>
        </Reveal>
      </div>
    </div>
  );
}
