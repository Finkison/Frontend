import React, { useEffect, useState } from "react";
import { getStudentProfile, updateStudentProfile } from "../../services/studentService";
import useAuthStore from "../../store/authStore";
import { useToast } from "../shared/Toast";
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
  const [profile, setProfile] = useState({
    grade: 12,
    stream: "natural",
    target_score: 620,
    full_name: "",
    school: "Menelik II Secondary School",
    region: "Addis Ababa",
    phone: "+251 911 234 567",
    email: "daniel@finkison.et"
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
          grade: d.grade || 12,
          stream: d.stream || "natural",
          target_score: d.target_score || 620,
          full_name: d.name || user?.fullName || user?.name || "Daniel Finkison",
          school: d.school || prev.school,
          region: d.region || prev.region,
          phone: d.phone || prev.phone,
          email: d.email || prev.email
        }));
      })
      .catch(() => {
        setProfile((prev) => ({
          ...prev,
          full_name: user?.fullName || user?.name || "Daniel Finkison"
        }));
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (profile.target_score < 300 || profile.target_score > 700) {
      showToast({
        type: "error",
        title: "Validation Error",
        message: "National entrance target score must be between 300 and 700 points."
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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-amber-400 font-serif text-2xl font-bold flex items-center justify-center shadow-md shrink-0">
              {(profile.full_name || "D")[0]?.toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl font-bold text-slate-900 tracking-tight">
                  {profile.full_name || "Candidate Profile"}
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200">
                  Grade {profile.grade}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {profile.school} &bull; {profile.region}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>MoE Verified Account</span>
            </span>
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
            <span>Academic Stream & Grade</span>
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
            <span>Cutoff Targets</span>
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
            <span>Institution & Contact</span>
          </button>
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        {activeTab === "academic" && (
          <div className="space-y-5">
            <div>
              <h2 className="font-serif text-lg font-bold text-slate-900">
                Academic Curriculum Level
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Ensure your grade level aligns with your school syllabus. Grade 11-12 enables national entrance mode.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Full Name (Read-Only)
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
                  <option value={9}>Grade 9 (Unified Foundation)</option>
                  <option value={10}>Grade 10 (Unified Secondary)</option>
                  <option value={11}>Grade 11 (Preparatory Track)</option>
                  <option value={12}>Grade 12 (National Entrance Exam Year)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Academic Stream
                </label>
                {profile.grade <= 10 ? (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <span className="font-bold text-slate-800 block">
                      General Secondary Curriculum (Unified Natural & Social Sciences)
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Per Ethiopian Ministry of Education guidelines, Grades 9 & 10 take a unified curriculum. Stream specialization activates in Grade 11.
                    </span>
                  </div>
                ) : (
                  <select
                    value={profile.stream}
                    onChange={(e) => setProfile({ ...profile, stream: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-amber-500 outline-none bg-white font-medium cursor-pointer"
                  >
                    <option value="natural">Natural Science Stream (Math, Physics, Chem, Bio)</option>
                    <option value="social">Social Science Stream (History, Geog, Econ, Civics)</option>
                  </select>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "targets" && (
          <div className="space-y-5">
            <div>
              <h2 className="font-serif text-lg font-bold text-slate-900">
                Entrance Exam Target Thresholds
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Set and recalibrate your cumulative goal out of 700 points to match your preferred university department.
              </p>
            </div>

            <div className="max-w-md space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Target Cumulative Score / 700
                </label>
                <input
                  type="number"
                  min={300}
                  max={700}
                  value={profile.target_score}
                  onChange={(e) => setProfile({ ...profile, target_score: Number(e.target.value) })}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-amber-500 outline-none font-bold"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Reference: Medicine (560+), Software Eng (480+), Engineering (450+).
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "contact" && (
          <div className="space-y-5">
            <div>
              <h2 className="font-serif text-lg font-bold text-slate-900">
                Institutional Affiliation & Contacts
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Your school and regional bureau details for synchronized cohort analytics.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Registered Secondary School
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
                  Administrative Region
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
                  Guardian SMS Phone (For Daily Digest)
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
                  Registered Email Address
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
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm transition-colors"
          >
            <Save className="w-4 h-4 text-amber-400" />
            <span>{saving ? "Saving Changes..." : "Save Profile Details"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
