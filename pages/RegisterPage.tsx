import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import useAuthStore from "../store/authStore";
import api from "../services/api";
import { 
  GraduationCap, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Building2, 
  MapPin, 
  Target, 
  Lock, 
  Phone, 
  Mail, 
  User as UserIcon, 
  ShieldCheck,
  FlaskConical,
  Scale,
  BookOpen,
  AlertCircle
} from "lucide-react";
import FinkisonLogo from "../components/shared/FinkisonLogo";
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

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    stream: "Natural Science",
    grade: "Grade 12",
    region: "Addis Ababa",
    school: "",
    targetUniversity: "Addis Ababa University",
    targetScore: 540
  });

  const [educatorData, setEducatorData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    school: "",
    role: "PRINCIPAL",
    department: "Administration",
    region: "Addis Ababa"
  });

  const [parentData, setParentData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    relationship: "Guardian",
    studentId: "",
    preferredLanguage: "English"
  });

  const handleParentRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/register/", {
        name: parentData.name,
        email: parentData.email || `${parentData.name.toLowerCase().replace(/\s+/g, ".")}@parent.finkison.et`,
        phone: parentData.phone,
        password: parentData.password || "Parent123Secure",
        role: "PARENT",
        relationship: parentData.relationship,
        student_id: parentData.studentId
      });

      const data = response.data?.data || response.data;
      if (!data?.token && !data?.accessToken) {
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
      const token = data.accessToken || data.token;
      login(user, "PARENT", token);
      navigate("/parent");
    } catch (err: any) {
      const msg =
        err?.userMessage ||
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Registration failed. Please check your details and try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleEducatorRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/register/", {
        name: educatorData.name,
        email: educatorData.email,
        phone: educatorData.phone,
        password: educatorData.password,
        school: educatorData.school,
        role: educatorData.role,
        stream: educatorData.department,
        region: educatorData.region
      });

      const data = response.data?.data || response.data;
      if (!data?.token && !data?.accessToken) {
        throw new Error(data?.message || "Invalid registration response from server.");
      }

      const user = data?.user || {
        id: data?.userId || "tch-" + Date.now().toString(36),
        name: educatorData.name,
        email: educatorData.email,
        phone: educatorData.phone,
        role: educatorData.role,
        school: educatorData.school
      };
      const token = data.accessToken || data.token;
      login(user, educatorData.role, token);
      navigate("/school");
    } catch (err: any) {
      const msg =
        err?.userMessage ||
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Registration failed. Please check your credentials and try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "grade") {
        const isJunior = value === "Grade 9" || value === "Grade 10";
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
        grade: formData.grade,
        stream: formData.stream,
        school: formData.school,
        region: formData.region
      });

      const data = response.data?.data || response.data;
      if (!data?.token && !data?.accessToken) {
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
        targetUniversity: formData.targetUniversity,
        xpPoints: 0,
        streakDays: 0,
        nationalRank: 0
      };

      const token = data.accessToken || data.token;
      login(user, "STUDENT", token);
      navigate("/student");
    } catch (err: any) {
      const msg =
        err?.userMessage ||
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Registration failed. Please verify your details or network connection.";
      setError(msg);
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
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-[#1C1512] font-sans">
      <div className="max-w-xl w-full mx-auto space-y-6">
        {/* Header with Logo */}
        <Reveal distancePx={16} delayMs={0} className="text-center space-y-2">
          <div className="inline-flex justify-center mb-1">
            <FinkisonLogo variant="horizontal" size="lg" to="/" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1C1512]">
            {roleMode === "STUDENT" 
              ? "Create student account" 
              : roleMode === "SCHOOL"
              ? "Register faculty account"
              : "Register parent account"}
          </h1>
          <p className="text-xs text-[#574C43]">
            {roleMode === "STUDENT" 
              ? "Access past papers, curriculum units, and score forecasts."
              : roleMode === "SCHOOL"
              ? "Assign timed assessments and monitor student performance."
              : "Monitor student progress and teacher notices."}
          </p>
        </Reveal>

        {/* Stakeholder Segment Switcher */}
        <Reveal distancePx={8} delayMs={60}>
          <div className="grid grid-cols-3 gap-2 p-1 rounded-[8px] bg-stone-100 border border-stone-200">
            <button
              type="button"
              onClick={() => {
                setRoleMode("STUDENT");
                setError(null);
              }}
              className={`py-2 px-3 rounded-[6px] text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                roleMode === "STUDENT"
                  ? "bg-white text-[#881337] shadow-2xs border border-[#FECDD3] font-semibold"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-[#881337]" />
              <span>Student</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setRoleMode("SCHOOL");
                setError(null);
              }}
              className={`py-2 px-3 rounded-[6px] text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                roleMode === "SCHOOL"
                  ? "bg-white text-[#881337] shadow-2xs border border-[#FECDD3] font-semibold"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-[#881337]" />
              <span>School / Faculty</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setRoleMode("PARENT");
                setError(null);
              }}
              className={`py-2 px-3 rounded-[6px] text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                roleMode === "PARENT"
                  ? "bg-white text-[#881337] shadow-2xs border border-[#FECDD3] font-semibold"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#881337]" />
              <span>Parent</span>
            </button>
          </div>
        </Reveal>

        {/* Multi-step progress indicator for Students */}
        {roleMode === "STUDENT" && (
          <Reveal distancePx={8} delayMs={100}>
            <div className="flex items-center justify-between relative px-4 py-2">
              <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-0.5 bg-stone-200 -z-1" />
              {[
                { num: 1, label: "Credentials" },
                { num: 2, label: "Stream" },
                { num: 3, label: "School" },
                { num: 4, label: "Target" }
              ].map((s) => (
                <div key={s.num} className="flex flex-col items-center bg-[#FAF8F5] px-2">
                  <div 
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                      step > s.num 
                        ? "bg-[#881337] text-white shadow-2xs" 
                        : step === s.num 
                        ? "bg-[#881337] text-white ring-4 ring-[#FECDD3] font-bold" 
                        : "bg-white border border-stone-300 text-stone-500"
                    }`}
                  >
                    {step > s.num ? <Check className="w-3.5 h-3.5 text-white" /> : s.num}
                  </div>
                  <span className={`text-[11px] mt-1 font-medium ${step === s.num ? "text-[#881337] font-semibold" : "text-stone-500"}`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {/* Form Card */}
        <Reveal distancePx={8} delayMs={140}>
          <div className="bg-white rounded-2xl border border-[#E8E2D9] p-6 sm:p-8 space-y-6 shadow-xs">
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
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Guardian full name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={parentData.name}
                      onChange={(e) => setParentData({ ...parentData, name: e.target.value })}
                      placeholder="Full name"
                      className="w-full pl-9 pr-3 py-2 rounded-[6px] border border-stone-300 bg-white text-[#1C1512] text-sm focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 outline-none"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Phone number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="tel"
                        required
                        value={parentData.phone}
                        onChange={(e) => setParentData({ ...parentData, phone: e.target.value })}
                        placeholder="+251 91 123 4567"
                        className="w-full pl-9 pr-3 py-2 rounded-[6px] border border-stone-300 bg-white text-[#1C1512] text-sm focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        value={parentData.email}
                        onChange={(e) => setParentData({ ...parentData, email: e.target.value })}
                        placeholder="guardian@example.com"
                        className="w-full pl-9 pr-3 py-2 rounded-[6px] border border-stone-300 bg-white text-[#1C1512] text-sm focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Relationship to candidate
                    </label>
                    <select
                      value={parentData.relationship}
                      onChange={(e) => setParentData({ ...parentData, relationship: e.target.value })}
                      className="w-full px-3 py-2 rounded-[6px] border border-stone-300 bg-white text-[#1C1512] text-sm focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 outline-none cursor-pointer"
                    >
                      <option value="Mother">Mother</option>
                      <option value="Father">Father</option>
                      <option value="Legal Guardian">Legal Guardian</option>
                      <option value="Sibling / Sponsor">Sibling / Sponsor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Candidate ID or phone
                    </label>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={parentData.studentId}
                        onChange={(e) => setParentData({ ...parentData, studentId: e.target.value })}
                        placeholder="std-001 or +251..."
                        className="w-full pl-9 pr-3 py-2 rounded-[6px] border border-stone-300 bg-white text-[#1C1512] text-sm focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Account password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={parentData.password}
                      onChange={(e) => setParentData({ ...parentData, password: e.target.value })}
                      placeholder="Create a password"
                      className="w-full pl-9 pr-3 py-2 rounded-[6px] border border-stone-300 bg-white text-[#1C1512] text-sm focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 outline-none"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-[6px] bg-[#FFF1F2] border border-[#FECDD3] text-xs text-[#1C1512] space-y-1">
                  <p className="font-semibold flex items-center gap-1.5 text-[#881337]">
                    <ShieldCheck className="w-4 h-4 text-[#881337] shrink-0" />
                    <span>Parent portal access</span>
                  </p>
                  <p className="text-[#574C43] leading-relaxed text-[11px]">
                    Receive official updates on candidate attendance, scheduled mock exams, and terminal score transcripts.
                  </p>
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
              <form onSubmit={handleEducatorRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Educator full name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={educatorData.name}
                      onChange={(e) => setEducatorData({ ...educatorData, name: e.target.value })}
                      placeholder="Full name"
                      className="w-full pl-9 pr-3 py-2 rounded-[6px] border border-stone-300 bg-white text-[#1C1512] text-sm focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 outline-none"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Institutional email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        required
                        value={educatorData.email}
                        onChange={(e) => setEducatorData({ ...educatorData, email: e.target.value })}
                        placeholder="name@school.edu.et"
                        className="w-full pl-9 pr-3 py-2 rounded-[6px] border border-stone-300 bg-white text-[#1C1512] text-sm focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Mobile phone
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="tel"
                        required
                        value={educatorData.phone}
                        onChange={(e) => setEducatorData({ ...educatorData, phone: e.target.value })}
                        placeholder="+251 91 123 4567"
                        className="w-full pl-9 pr-3 py-2 rounded-[6px] border border-stone-300 bg-white text-[#1C1512] text-sm focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={educatorData.password}
                      onChange={(e) => setEducatorData({ ...educatorData, password: e.target.value })}
                      placeholder="Create a password"
                      className="w-full pl-9 pr-3 py-2 rounded-[6px] border border-stone-300 bg-white text-[#1C1512] text-sm focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    School / preparatory institution name
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={educatorData.school}
                      onChange={(e) => setEducatorData({ ...educatorData, school: e.target.value })}
                      placeholder="e.g. Bole Secondary School"
                      className="w-full pl-9 pr-3 py-2 rounded-[6px] border border-stone-300 bg-white text-[#1C1512] text-sm focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 outline-none"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Institutional role
                    </label>
                    <select
                      value={educatorData.role}
                      onChange={(e) => setEducatorData({ ...educatorData, role: e.target.value })}
                      className="w-full px-3 py-2 rounded-[6px] border border-stone-300 bg-white text-[#1C1512] text-sm focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 outline-none cursor-pointer"
                    >
                      <option value="PRINCIPAL">Principal / School Head</option>
                      <option value="VICE_PRINCIPAL">Vice Principal / Academic Dean</option>
                      <option value="DEPARTMENT_HEAD">Department Head</option>
                      <option value="TEACHER">Subject Teacher</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Region
                    </label>
                    <select
                      value={educatorData.region}
                      onChange={(e) => setEducatorData({ ...educatorData, region: e.target.value })}
                      className="w-full px-3 py-2 rounded-[6px] border border-stone-300 bg-white text-[#1C1512] text-sm focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 outline-none cursor-pointer"
                    >
                      {regions.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-[6px] bg-[#881337] hover:bg-[#9F1239] active:bg-[#BE123C] text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-[#881337]"
                  >
                    <span>{loading ? "Registering institution..." : "Register faculty account"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            ) : (
              /* STUDENT MULTI-STEP FLOW */
              <div>
                {step === 1 && (
                  <form onSubmit={handleNext} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Candidate full name
                      </label>
                      <div className="relative">
                        <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          placeholder="Full name"
                          className="w-full pl-9 pr-3 py-2 rounded-[6px] border border-stone-300 bg-white text-[#1C1512] text-sm focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1">
                          Phone number
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                            placeholder="+251 91 123 4567"
                            className="w-full pl-9 pr-3 py-2 rounded-[6px] border border-stone-300 bg-white text-[#1C1512] text-sm focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1">
                          Email address
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            placeholder="name@school.edu.et"
                            className="w-full pl-9 pr-3 py-2 rounded-[6px] border border-stone-300 bg-white text-[#1C1512] text-sm focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={formData.password}
                          onChange={(e) => handleChange("password", e.target.value)}
                          placeholder="Create a password"
                          className="w-full pl-9 pr-3 py-2 rounded-[6px] border border-stone-300 bg-white text-[#1C1512] text-sm focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 outline-none"
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
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Grade level
                      </label>
                      <select
                        value={formData.grade}
                        onChange={(e) => handleChange("grade", e.target.value)}
                        className="w-full px-3 py-2 rounded-[6px] border border-stone-300 bg-white text-[#1C1512] text-sm focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 outline-none cursor-pointer"
                      >
                        <option value="Grade 12">Grade 12 • University Entrance</option>
                        <option value="Grade 11">Grade 11 • Preparatory Senior</option>
                        <option value="Grade 10">Grade 10 • Secondary Unified</option>
                        <option value="Grade 9">Grade 9 • Secondary Foundation</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-2">
                        Academic curriculum stream
                      </label>

                      {formData.grade === "Grade 9" || formData.grade === "Grade 10" ? (
                        <div className="p-3.5 rounded-[8px] border border-stone-200 bg-stone-50 text-xs text-stone-600 leading-relaxed">
                          <p className="font-semibold text-[#1C1512] mb-1">General secondary curriculum</p>
                          Students in Grades 9 and 10 study unified sciences and social subjects concurrently. Stream selection begins in Grade 11.
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => handleChange("stream", "Natural Science")}
                            className={`p-4 rounded-[8px] border text-left transition-colors cursor-pointer flex flex-col justify-between ${
                              formData.stream === "Natural Science"
                                ? "border-[#881337] bg-[#FFF1F2] ring-2 ring-[#881337]/20"
                                : "border-stone-200 bg-white hover:bg-stone-50"
                            }`}
                          >
                            <div className="w-8 h-8 rounded-[6px] bg-[#FFF1F2] text-[#881337] flex items-center justify-center mb-2">
                              <FlaskConical className="w-4 h-4 text-[#881337]" />
                            </div>
                            <span className="text-xs font-semibold text-[#1C1512] block">Natural Science</span>
                            <span className="text-[11px] text-[#574C43] mt-0.5">Physics, Chemistry, Biology, Math</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleChange("stream", "Social Science")}
                            className={`p-4 rounded-[8px] border text-left transition-colors cursor-pointer flex flex-col justify-between ${
                              formData.stream === "Social Science"
                                ? "border-[#881337] bg-[#FFF1F2] ring-2 ring-[#881337]/20"
                                : "border-stone-200 bg-white hover:bg-stone-50"
                            }`}
                          >
                            <div className="w-8 h-8 rounded-[6px] bg-[#FFF1F2] text-[#881337] flex items-center justify-center mb-2">
                              <Scale className="w-4 h-4 text-[#881337]" />
                            </div>
                            <span className="text-xs font-semibold text-[#1C1512] block">Social Science</span>
                            <span className="text-[11px] text-[#574C43] mt-0.5">History, Geography, Economics, Civics</span>
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={handleBack}
                        className="px-4 py-2 rounded-[6px] border border-[#E8E2D9] bg-white text-[#1C1512] hover:bg-[#FAF8F5] text-xs font-medium flex items-center gap-1.5 cursor-pointer"
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
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Region
                      </label>
                      <select
                        value={formData.region}
                        onChange={(e) => handleChange("region", e.target.value)}
                        className="w-full px-3 py-2 rounded-[6px] border border-stone-300 bg-white text-[#1C1512] text-sm focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 outline-none cursor-pointer"
                      >
                        {regions.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Preparatory / secondary school name
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          required
                          value={formData.school}
                          onChange={(e) => handleChange("school", e.target.value)}
                          placeholder="e.g. Menelik II Secondary School"
                          className="w-full pl-9 pr-3 py-2 rounded-[6px] border border-stone-300 bg-white text-[#1C1512] text-sm focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 outline-none"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={handleBack}
                        className="px-4 py-2 rounded-[6px] border border-[#E8E2D9] bg-white text-[#1C1512] hover:bg-[#FAF8F5] text-xs font-medium flex items-center gap-1.5 cursor-pointer"
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
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Target university / program
                      </label>
                      <div className="relative">
                        <Target className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          required
                          value={formData.targetUniversity}
                          onChange={(e) => handleChange("targetUniversity", e.target.value)}
                          placeholder="e.g. Addis Ababa University"
                          className="w-full pl-9 pr-3 py-2 rounded-[6px] border border-stone-300 bg-white text-[#1C1512] text-sm focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-medium text-stone-700">
                          Target score: 600-point national scale
                        </label>
                        <span className="text-xs font-mono font-bold text-[#881337] tabular-nums">
                          {formData.targetScore} / 600
                        </span>
                      </div>
                      <input
                        type="range"
                        min="300"
                        max="600"
                        step="5"
                        value={formData.targetScore}
                        onChange={(e) => handleChange("targetScore", parseInt(e.target.value, 10))}
                        className="w-full accent-[#881337] cursor-pointer"
                      />
                      <div className="flex justify-between text-[11px] text-stone-500 mt-1">
                        <span>300 baseline</span>
                        <span>450 competitive</span>
                        <span>600 top tier</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-[8px] bg-[#FFF1F2] border border-[#FECDD3] text-xs text-[#1C1512] space-y-1">
                      <p className="font-semibold text-[#881337]">
                        Profile summary
                      </p>
                      <p className="text-[#574C43] leading-relaxed text-[11px]">
                        Enrolling {formData.name} in {formData.grade} • {formData.stream} at {formData.school || "School"}.
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={handleBack}
                        className="px-4 py-2 rounded-[6px] border border-[#E8E2D9] bg-white text-[#1C1512] hover:bg-[#FAF8F5] text-xs font-medium flex items-center gap-1.5 cursor-pointer"
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

        {/* Bottom Navigation Link */}
        <Reveal distancePx={8} delayMs={180} className="text-center">
          <p className="text-xs text-stone-600">
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
