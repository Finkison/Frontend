import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStudentProfile, updateStudentProfile } from "../../services/studentService";
import useAuthStore from "../../store/authStore";
import { useToast } from "../ui/Toast";
import { 
  User, 
  BookOpen, 
  Target, 
  Shield, 
  CheckCircle2, 
  Save, 
  MapPin, 
  School, 
  Phone, 
  Mail, 
  AlertCircle 
} from "lucide-react";

export default function Profile(): React.ReactElement {
  const user = useAuthStore((s) => s.user);
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<"academic" | "targets" | "contact">("academic");
  const initialGrade = typeof user?.grade === "number" ? user.grade : parseInt(String(user?.grade || "12").replace(/\D/g, "")) || 12;

  const [profile, setProfile] = useState<{
    grade: number;
    stream: string;
    target_score: number;
    full_name: string;
    school: string;
    region: string;
    phone: string;
    email: string;
  }>({
    grade: initialGrade,
    stream: user?.stream || "natural",
    target_score: user?.targetScore || 500,
    full_name: user?.fullName || user?.name || "",
    school: user?.school || "",
    region: user?.region || "",
    phone: user?.phone || "",
    email: user?.email || ""
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    getStudentProfile()
      .then((res) => {
        const d = res.data || {};
        setProfile((prev) => ({
          ...prev,
          grade: Number(d.grade) || prev.grade,
          stream: d.stream || prev.stream,
          target_score: Number(d.target_score) || prev.target_score,
          full_name: d.name || user?.fullName || user?.name || prev.full_name,
          school: d.school || user?.school || prev.school,
          region: d.region || user?.region || prev.region,
          phone: d.phone || user?.phone || prev.phone,
          email: d.email || user?.email || prev.email
        }));
      })
      .catch(() => {
        setProfile((prev) => ({
          ...prev,
          full_name: user?.fullName || user?.name || prev.full_name
        }));
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (profile.target_score < 250 || profile.target_score > 600) {
      showToast({
        type: "error",
        title: "Validation Error",
        message: "National entrance target score must be between 250 and 600 points."
      });
      return;
    }

    setSaving(true);
    try {
      await updateStudentProfile({
        grade: profile.grade,
        stream: profile.stream,
        target_score: profile.target_score,
        school: profile.school,
        region: profile.region
      });

      showToast({
        type: "success",
        title: "Profile Saved Successfully",
        message: "Academic stream, school affiliation, and target goals updated."
      });
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Failed to Update Profile",
        message: err?.message || "An unexpected error occurred while saving your details."
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-amber-400 font-sans text-2xl font-bold flex items-center justify-center shadow-md shrink-0">
              {(profile.full_name || "D")[0]?.toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-sans text-2xl font-bold text-slate-900 tracking-tight">
                  {profile.full_name || "Candidate Profile"}
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200">
                  Grade {profile.grade}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-800 text-[10px] font-bold border border-sky-200">
                  {profile.grade <= 10
                    ? "General Secondary Track"
                    : profile.stream === "social"
                    ? "Social Science Track"
                    : "Natural Science Track"}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {profile.school} &bull; {profile.region}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <span className="px-3 py-1.5 rounded-xl bg-sky-50 text-sky-800 border border-sky-200 text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#0369A1]" />
              <span>Verified Student Account</span>
            </span>
            <Link
              to="/student/settings"
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-[#0369A1]" />
              <span>Security & Devices</span>
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("academic")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "academic"
                ? "bg-slate-900 text-white shadow-2xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Academic</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("targets")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "targets"
                ? "bg-slate-900 text-white shadow-2xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Targets</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("contact")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "contact"
                ? "bg-slate-900 text-white shadow-2xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Contact & School</span>
          </button>
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        {activeTab === "academic" && (
          <div className="space-y-5">
            <div>
              <h2 className="font-sans text-lg font-bold text-slate-900">
                Academic Level
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Ensure your grade level aligns with your curriculum.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.full_name}
                  disabled
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 text-slate-600 font-semibold cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Grade Level
                </label>
                <select
                  value={profile.grade}
                  onChange={(e) => {
                    const newGrade = Number(e.target.value);
                    setProfile({
                      ...profile,
                      grade: newGrade,
                      stream: newGrade <= 10 ? "General Secondary" : (profile.stream === "General Secondary" ? "natural" : profile.stream)
                    });
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-amber-500 outline-none bg-white font-medium cursor-pointer"
                >
                  <option value={9}>Grade 9</option>
                  <option value={10}>Grade 10</option>
                  <option value={11}>Grade 11</option>
                  <option value={12}>Grade 12</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Academic Stream
                </label>
                {profile.grade <= 10 ? (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-800">
                        General Secondary Curriculum (Unified)
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-800">
                        Grades 9 & 10
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mb-2.5">
                      National core curriculum determined at registration. Stream specialization begins in Grade 11.
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {["Physics", "Chemistry", "Biology", "Mathematics", "English", "History", "Geography", "Civics", "IT"].map((sub) => (
                        <span key={sub} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-700">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <select
                      value={profile.stream}
                      onChange={(e) => setProfile({ ...profile, stream: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-amber-500 outline-none bg-white font-medium cursor-pointer"
                    >
                      <option value="natural">Natural Science</option>
                      <option value="social">Social Science</option>
                    </select>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-800">
                          Registered Curriculum Track
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-sky-100 text-sky-800 border border-sky-200">
                          {profile.stream === "social" ? "Social Science" : "Natural Science"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mb-2.5">
                        Selected during registration. Configures your lessons, test banks, and university department cutoffs.
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {(profile.stream === "social"
                          ? ["History", "Geography", "Economics", "Mathematics", "English", "Civics & Aptitude"]
                          : ["Physics", "Chemistry", "Biology", "Mathematics", "English", "Technical Drawing", "Civics & Aptitude"]
                        ).map((sub) => (
                          <span key={sub} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-700">
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "targets" && (
          <div className="space-y-5">
            <div>
              <h2 className="font-sans text-lg font-bold text-slate-900">
                Entrance Exam Targets
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Set your cumulative goal score out of 600 to match university admissions.
              </p>
            </div>

            <div className="max-w-md space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Target Score (/600)
                </label>
                <input
                  type="number"
                  min={250}
                  max={600}
                  value={profile.target_score}
                  onChange={(e) => setProfile({ ...profile, target_score: Number(e.target.value) })}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-amber-500 outline-none font-bold"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Reference: Medicine (510+), Software Eng (450+), Engineering (400+).
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "contact" && (
          <div className="space-y-5">
            <div>
              <h2 className="font-sans text-lg font-bold text-slate-900">
                School & Contact Information
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Your school and contact details.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  School
                </label>
                <input
                  type="text"
                  value={profile.school}
                  onChange={(e) => setProfile({ ...profile, school: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Region
                </label>
                <select
                  value={profile.region}
                  onChange={(e) => setProfile({ ...profile, region: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-amber-500 outline-none bg-white cursor-pointer"
                >
                  <option value="Addis Ababa">Addis Ababa</option>
                  <option value="Oromia">Oromia</option>
                  <option value="Amhara">Amhara</option>
                  <option value="Tigray">Tigray</option>
                  <option value="Sidama">Sidama</option>
                  <option value="Dire Dawa">Dire Dawa</option>
                  <option value="Harari">Harari</option>
                  <option value="Somali">Somali</option>
                  <option value="Afar">Afar</option>
                  <option value="Benishangul-Gumuz">Benishangul-Gumuz</option>
                  <option value="Gambela">Gambela</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Guardian Phone
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        )}

        {/* Footer Save Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-[#87CEFA] hover:bg-[#6BBBF5] active:bg-[#4FA9EA] text-[#0B1B3A] font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-[#0B1B3A]" />
            <span>{saving ? "Saving..." : "Save Profile"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
