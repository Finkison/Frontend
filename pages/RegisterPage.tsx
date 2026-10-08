import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import api from "../services/api";
import { 
  GraduationCap, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles, 
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
  BookOpen
} from "lucide-react";

export default function RegisterPage(): React.ReactElement {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [roleMode, setRoleMode] = useState<"STUDENT" | "SCHOOL" | "PARENT">("STUDENT");
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
    school: "Menelik II Secondary School",
    targetUniversity: "Addis Ababa University (AAU)",
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
        password: parentData.password || "Parent123!Secure",
        role: "PARENT",
        relationship: parentData.relationship,
        student_id: parentData.studentId
      });

      const data = response.data;
      const user = data?.data?.user || {
        id: "par-new",
        name: parentData.name,
        email: parentData.email,
        phone: parentData.phone,
        role: "PARENT",
        relationship: parentData.relationship
      };
      const token = data?.data?.accessToken || data?.data?.token || `finkison_jwt_${Date.now()}`;
      login(user, "PARENT", token);
      navigate("/parent");
    } catch (err: any) {
      const fallbackUser = {
        id: "par-new",
        name: parentData.name,
        email: parentData.email,
        phone: parentData.phone,
        role: "PARENT",
        relationship: parentData.relationship
      };
      login(fallbackUser, "PARENT", "demo-token");
      navigate("/parent");
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

      const data = response.data;
      const user = data?.data?.user || {
        id: "tch-new",
        name: educatorData.name,
        email: educatorData.email,
        phone: educatorData.phone,
        role: educatorData.role,
        school: educatorData.school
      };
      const token = data?.data?.accessToken || data?.data?.token || `finkison_jwt_${Date.now()}`;
      login(user, educatorData.role, token);
      navigate("/school");
    } catch (err: any) {
      const user = {
        id: "tch-new",
        name: educatorData.name,
        email: educatorData.email,
        phone: educatorData.phone,
        role: educatorData.role,
        school: educatorData.school
      };
      login(user, educatorData.role, "demo-token");
      navigate("/school");
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
        setError("Please enter your name and email address.");
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

      const data = response.data;
      const user = data?.data?.user || {
        id: "std-new",
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
        xpPoints: 100,
        streakDays: 1,
        nationalRank: 450
      };

      const token = data?.data?.accessToken || `finkison_jwt_${Date.now()}`;
      login(user, "STUDENT", token);
      navigate("/student");
    } catch (err: any) {
      const user = {
        id: "std-new",
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
        xpPoints: 100,
        streakDays: 1,
        nationalRank: 450
      };
      login(user, "STUDENT", "demo-token");
      navigate("/student");
    } finally {
      setLoading(false);
    }
  };

  const autofillDemo = () => {
    setFormData({
      name: "Kalkidan Bekele",
      phone: "+251911456789",
      email: "kalkidan.b@finkison.et",
      password: "password123",
      stream: "Natural Science",
      grade: "Grade 12",
      region: "Addis Ababa",
      school: "Bole Secondary School",
      targetUniversity: "Addis Ababa University (AAU) - Medicine",
      targetScore: 560
    });
    setStep(2);
  };

  const regions = [
    "Addis Ababa",
    "Oromia",
    "Amhara",
    "Sidama",
    "Tigray",
    "Somali",
    "Dire Dawa",
    "Southern Ethiopia",
    "Central Ethiopia",
    "South West Ethiopia",
    "Benishangul-Gumuz",
    "Afar",
    "Gambella",
    "Harari"
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-amber-500/30 flex items-center justify-center shadow">
              <GraduationCap className="w-6 h-6 text-amber-400" />
            </div>
            <span className="font-serif font-bold text-2xl text-slate-900 tracking-tight">FINKISON</span>
          </Link>
          <h2 className="mt-4 font-serif text-3xl font-bold text-slate-900">
            {roleMode === "STUDENT" 
              ? "Create Your Candidate Account" 
              : roleMode === "SCHOOL" 
              ? "Register School or Educator Account"
              : "Register Guardian & Parent Account"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {roleMode === "STUDENT" 
              ? "Join the national platform to access verified exam questions, AI tutoring, and rank analytics."
              : roleMode === "SCHOOL"
              ? "Deploy Finkison institutional diagnostics, assign custom benchmark exams, and track student cohort readiness."
              : "Track candidate practice hours, monitor national entrance readiness, and receive direct teacher updates."}
          </p>
        </div>

        {/* Stakeholder Segment Switcher */}
        <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-slate-200/80 mb-6">
          <button
            type="button"
            onClick={() => {
              setRoleMode("STUDENT");
              setError(null);
            }}
            className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 ${
              roleMode === "STUDENT"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <GraduationCap className="w-4 h-4 text-amber-500" />
            <span className="truncate">Candidate</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setRoleMode("SCHOOL");
              setError(null);
            }}
            className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 ${
              roleMode === "SCHOOL"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Building2 className="w-4 h-4 text-purple-600" />
            <span className="truncate">School / Faculty</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setRoleMode("PARENT");
              setError(null);
            }}
            className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 ${
              roleMode === "PARENT"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="truncate">Guardian</span>
          </button>
        </div>

        {/* Multi-step progress indicator for Students */}
        {roleMode === "STUDENT" && (
          <div className="mb-8 flex items-center justify-between relative px-6">
            <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 -z-1"></div>
            {[
              { num: 1, label: "Profile" },
              { num: 2, label: "Stream" },
              { num: 3, label: "School" },
              { num: 4, label: "Target" }
            ].map((s) => (
              <div key={s.num} className="flex flex-col items-center">
                <div 
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                    step > s.num 
                      ? "bg-emerald-500 text-white" 
                      : step === s.num 
                      ? "bg-amber-500 text-slate-950 ring-4 ring-amber-100" 
                      : "bg-white border-2 border-slate-300 text-slate-400"
                  }`}
                >
                  {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <span className="text-[11px] font-semibold text-slate-500 mt-1.5">{s.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-slate-200 shadow-xl">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          {roleMode === "PARENT" ? (
            <form onSubmit={handleParentRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Guardian Full Name *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={parentData.name}
                    onChange={(e) => setParentData({ ...parentData, name: e.target.value })}
                    placeholder="e.g. Woizero Aster Bedane"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                    Phone Number (SMS Alerts) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={parentData.phone}
                      onChange={(e) => setParentData({ ...parentData, phone: e.target.value })}
                      placeholder="+251 922 334 455"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                    Email Address (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={parentData.email}
                      onChange={(e) => setParentData({ ...parentData, email: e.target.value })}
                      placeholder="guardian@example.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                    Relationship to Candidate *
                  </label>
                  <select
                    value={parentData.relationship}
                    onChange={(e) => setParentData({ ...parentData, relationship: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-emerald-500 outline-none bg-white cursor-pointer"
                  >
                    <option value="Mother">Mother</option>
                    <option value="Father">Father</option>
                    <option value="Legal Guardian">Legal Guardian</option>
                    <option value="Sibling / Sponsor">Sibling / Sponsor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                    Child's Candidate ID or Phone (Optional)
                  </label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={parentData.studentId}
                      onChange={(e) => setParentData({ ...parentData, studentId: e.target.value })}
                      placeholder="e.g. std-001 or +251 911 234 567"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Account Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={parentData.password}
                    onChange={(e) => setParentData({ ...parentData, password: e.target.value })}
                    placeholder="Create a strong password"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-800 space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-emerald-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Guardian Privacy & Child Verification</span>
                </p>
                <p className="text-emerald-700 leading-relaxed">
                  You will receive real-time updates on attendance, mock entrance scores, study streaks, and direct advisory messages from school educators.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 cursor-pointer transition-colors"
                >
                  {loading ? "Creating Guardian Account..." : "Create Guardian Account"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : roleMode === "SCHOOL" ? (
            <form onSubmit={handleEducatorRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Educator Full Name *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={educatorData.name}
                    onChange={(e) => setEducatorData({ ...educatorData, name: e.target.value })}
                    placeholder="e.g. Dr. Hailemariam Dessalegn"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-purple-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                    Official Work Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={educatorData.email}
                      onChange={(e) => setEducatorData({ ...educatorData, email: e.target.value })}
                      placeholder="principal@school.edu.et"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-purple-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                    Mobile Phone *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={educatorData.phone}
                      onChange={(e) => setEducatorData({ ...educatorData, phone: e.target.value })}
                      placeholder="+251 91 123 4567"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-purple-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={educatorData.password}
                    onChange={(e) => setEducatorData({ ...educatorData, password: e.target.value })}
                    placeholder="Create a secure password"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-purple-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  School / Preparatory Institution Name *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={educatorData.school}
                    onChange={(e) => setEducatorData({ ...educatorData, school: e.target.value })}
                    placeholder="e.g. Bole Secondary & Preparatory School"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-purple-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                    Institutional Role *
                  </label>
                  <select
                    value={educatorData.role}
                    onChange={(e) => setEducatorData({ ...educatorData, role: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-purple-500 outline-none bg-white cursor-pointer"
                  >
                    <option value="PRINCIPAL">School Principal / Admin</option>
                    <option value="TEACHER">Subject Teacher</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                    Academic Department
                  </label>
                  <select
                    value={educatorData.department}
                    onChange={(e) => setEducatorData({ ...educatorData, department: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-purple-500 outline-none bg-white cursor-pointer"
                  >
                    <option value="Natural Science">Natural Science</option>
                    <option value="Social Science">Social Science</option>
                    <option value="Administration">School Administration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                    Region *
                  </label>
                  <select
                    value={educatorData.region}
                    onChange={(e) => setEducatorData({ ...educatorData, region: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-purple-500 outline-none bg-white cursor-pointer"
                  >
                    {regions.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200/80 text-xs text-purple-900 space-y-1.5">
                <p className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-purple-600" /> B2B Institutional Access
                </p>
                <p className="text-purple-800 leading-relaxed">
                  Upon creating your educator account, you will have instant access to cohort section dispatch, automated question-bank exam creation, student dossiers, and MoE performance reporting.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl font-bold bg-purple-700 hover:bg-purple-800 text-white text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-700/25 cursor-pointer transition-colors"
                >
                  {loading ? "Initializing Institutional Account..." : "Initialize School & Educator Account"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : (
            <>
              {step === 1 && (
                <form onSubmit={handleNext} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Full Name (Candidate) *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="e.g. Abebe Bikila"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Phone Number (SMS Notifications & Login) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="+251 911 234 567"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Email Address (Optional)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="candidate@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={autofillDemo}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 hover:text-amber-700 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Fast Autofill Demo</span>
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 text-sm flex items-center gap-1.5"
                >
                  Next Step <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-2">
                  1. Current Grade Level *
                </label>
                <select
                  value={formData.grade}
                  onChange={(e) => handleChange("grade", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-amber-500 outline-none bg-white font-medium cursor-pointer"
                >
                  <option value="Grade 12">Grade 12 (National Entrance Exam Year)</option>
                  <option value="Grade 11">Grade 11 (Preparatory)</option>
                  <option value="Grade 10">Grade 10 (Secondary Common Curriculum)</option>
                  <option value="Grade 9">Grade 9 (Secondary Foundation Common Curriculum)</option>
                </select>
              </div>

              {formData.grade === "Grade 9" || formData.grade === "Grade 10" ? (
                
                <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/50 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <span>Unified Ethiopian Secondary Curriculum</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200/80 text-emerald-800">
                          {formData.grade}
                        </span>
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        In Grade 9 and 10, Ethiopian students are <strong>not categorized under Natural or Social Science</strong> tracks. You take <strong>both natural and social courses</strong> concurrently. Specialized academic streaming begins in Grade 11.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-emerald-200/60">
                    <div className="bg-white/90 p-3 rounded-xl border border-emerald-100 shadow-2xs">
                      <p className="text-[11px] font-bold text-blue-700 uppercase flex items-center gap-1.5">
                        <FlaskConical className="w-3.5 h-3.5" /> Natural Sciences
                      </p>
                      <p className="text-xs text-slate-600 mt-1">Physics, Chemistry, Biology</p>
                    </div>
                    <div className="bg-white/90 p-3 rounded-xl border border-emerald-100 shadow-2xs">
                      <p className="text-[11px] font-bold text-amber-700 uppercase flex items-center gap-1.5">
                        <Scale className="w-3.5 h-3.5" /> Social Sciences
                      </p>
                      <p className="text-xs text-slate-600 mt-1">History, Geography, Economics, Civics</p>
                    </div>
                    <div className="bg-white/90 p-3 rounded-xl border border-emerald-100 shadow-2xs">
                      <p className="text-[11px] font-bold text-indigo-700 uppercase flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" /> Core Foundations
                      </p>
                      <p className="text-xs text-slate-600 mt-1">Mathematics, English, IT</p>
                    </div>
                  </div>
                </div>
              ) : (
                
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-2">
                    2. Select Your Preparatory Academic Stream *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => handleChange("stream", "Natural Science")}
                      className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                        formData.stream === "Natural Science"
                          ? "border-blue-500 bg-blue-50/50 ring-2 ring-blue-200"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-2">
                        <FlaskConical className="w-5 h-5" />
                      </div>
                      <p className="font-bold text-slate-900 text-sm">Natural Science</p>
                      <p className="text-xs text-slate-500 mt-1">Math, Physics, Chemistry, Biology, Aptitude</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleChange("stream", "Social Science")}
                      className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                        formData.stream === "Social Science"
                          ? "border-amber-500 bg-amber-50/50 ring-2 ring-amber-200"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-2">
                        <Scale className="w-5 h-5" />
                      </div>
                      <p className="font-bold text-slate-900 text-sm">Social Science</p>
                      <p className="text-xs text-slate-500 mt-1">Math, History, Geography, Economics, Civics, Aptitude</p>
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm flex items-center gap-1.5 cursor-pointer hover:bg-slate-50"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-3 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 text-sm flex items-center gap-1.5 cursor-pointer shadow"
                >
                  Next Step <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Region *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={formData.region}
                    onChange={(e) => handleChange("region", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-amber-500 outline-none"
                  >
                    {regions.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  School Name *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.school}
                    onChange={(e) => handleChange("school", e.target.value)}
                    placeholder="e.g. Menelik II Secondary School"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-6 py-3 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 text-sm flex items-center gap-1.5"
                >
                  Next Step <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <form onSubmit={handleFinish} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Target University & Faculty *
                </label>
                <div className="relative">
                  <Target className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.targetUniversity}
                    onChange={(e) => handleChange("targetUniversity", e.target.value)}
                    placeholder="e.g. Addis Ababa University (AAU) - Medicine"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold uppercase text-slate-700">
                    Target Score Goal:
                  </label>
                  <span className="text-sm font-bold text-amber-600">{formData.targetScore} / 600</span>
                </div>
                <input
                  type="range"
                  min="350"
                  max="600"
                  step="5"
                  value={formData.targetScore}
                  onChange={(e) => handleChange("targetScore", Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Pass Threshold (350)</span>
                  <span>Distinction (500)</span>
                  <span>AAU Top Cutoff (560+)</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 space-y-1.5">
                <p className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" /> All Set!
                </p>
                <p className="text-amber-800/90 leading-relaxed">
                  Your personalized study schedule, diagnostic tests, and cutoff projections will be prepared immediately upon registration.
                </p>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3.5 rounded-xl font-bold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 text-sm flex items-center gap-2 shadow-lg shadow-amber-500/25"
                >
                  {loading ? "Activating Account..." : "Launch Student Portal"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </>
      )}

          <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-amber-600 hover:text-amber-700">
              Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
