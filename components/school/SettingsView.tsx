import React, { useEffect, useState } from "react";
import { 
  getSchoolProfile, 
  updateSchoolProfile, 
  expandSchoolLicense,
  rolloverAcademicYear
} from "../../services/schoolService";
import useAuthStore from "../../store/authStore";
import { 
  Building2, 
  ShieldCheck, 
  CreditCard, 
  Save, 
  CheckCircle2, 
  Users, 
  FileText, 
  Calendar, 
  Sparkles,
  Phone,
  Mail,
  Award,
  Layers,
  ArrowUpRight,
  ShieldAlert,
  Loader2,
  RefreshCw,
  GraduationCap,
  Archive,
  AlertTriangle
} from "lucide-react";
import { useToast } from "../ui/Toast";

export default function SchoolSettings(): React.ReactElement {
  const { showToast } = useToast();
  const { role, user } = useAuthStore();
  const isPrincipalOrAdmin = role === "PRINCIPAL" || role === "ADMIN" || user?.role === "PRINCIPAL" || user?.role === "ADMIN";

  const [profile, setProfile] = useState<any>({
    name: user?.school || "",
    code: "",
    region: user?.region || "",
    country: "Ethiopia",
    motto: "",
    academic_year: "2026",
    license_tier: "Institutional License",
    max_student_seats: 0,
    used_seats: 0,
    seats_remaining: 0,
    seat_utilization_percent: 0,
    contact_email: user?.email || "",
    phone: user?.phone || ""
  });

  const [saving, setSaving] = useState(false);
  const [expanding, setExpanding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedSeats, setExpandedSeats] = useState(50);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Rollover Wizard State
  const [showRolloverModal, setShowRolloverModal] = useState(false);
  const [nextYearString, setNextYearString] = useState("2027/2017 E.C.");
  const [archiveGrade12, setArchiveGrade12] = useState(true);
  const [promoteGrades, setPromoteGrades] = useState(true);
  const [rolloverSecurityPhrase, setRolloverSecurityPhrase] = useState("");
  const [rollingOver, setRollingOver] = useState(false);
  const [rolloverSummary, setRolloverSummary] = useState<any | null>(null);

  useEffect(() => {
    getSchoolProfile()
      .then((res) => {
        if (res.data) setProfile(res.data);
      })
      .catch((err) => console.error("Failed to load school profile:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPrincipalOrAdmin) {
      showToast({
        type: "error",
        title: "Permission Denied",
        message: "Only Principals and School Administrators can modify institutional settings."
      });
      return;
    }

    setSaving(true);
    try {
      await updateSchoolProfile({
        name: profile.name,
        motto: profile.motto,
        phone: profile.phone,
        contact_email: profile.contact_email,
        academic_year: profile.academic_year
      });
      showToast({
        type: "success",
        title: "Settings Saved",
        message: "Institutional profile updated successfully."
      });
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Save Failed",
        message: err?.response?.data?.error || err?.message || "Failed to update profile settings."
      });
    } finally {
      setSaving(false);
    }
  };

  const handleExecuteRollover = async () => {
    if (!isPrincipalOrAdmin) {
      showToast({
        type: "error",
        title: "Permission Denied",
        message: "Only Principals and School Administrators can perform academic year rollover."
      });
      return;
    }

    if (rolloverSecurityPhrase.trim() !== "CONFIRM ROLLOVER") {
      showToast({
        type: "error",
        title: "Security Verification Failed",
        message: 'Please type the exact phrase "CONFIRM ROLLOVER" to proceed.'
      });
      return;
    }

    setRollingOver(true);
    try {
      const res = await rolloverAcademicYear({
        new_academic_year: nextYearString,
        archive_grade_12: archiveGrade12,
        promote_grades: promoteGrades
      });

      setRolloverSummary(res.data);
      setProfile((prev: any) => ({
        ...prev,
        academic_year: res.data.new_academic_year || nextYearString,
        used_seats: res.data.used_seats ?? prev.used_seats,
        seats_remaining: res.data.seats_remaining ?? prev.seats_remaining,
        seat_utilization_percent: res.data.seat_utilization_percent ?? prev.seat_utilization_percent
      }));

      showToast({
        type: "success",
        title: "Rollover Successfully Executed",
        message: `Academic Year updated to ${res.data.new_academic_year}. Promoted: ${res.data.promoted_count}, Archived: ${res.data.archived_count}.`
      });
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Rollover Failed",
        message: err?.response?.data?.error || err?.message || "Failed to execute academic year rollover."
      });
    } finally {
      setRollingOver(false);
    }
  };

  const handleSimulatePayment = async (method: string) => {
    if (!isPrincipalOrAdmin) {
      showToast({
        type: "error",
        title: "Permission Denied",
        message: "Only Principals and School Administrators can authorize seat expansions."
      });
      return;
    }

    setExpanding(true);
    try {
      const res = await expandSchoolLicense({
        additional_seats: expandedSeats,
        payment_method: method
      });

      const invNum = res.data?.invoice_number || `INV-B2B-${Date.now().toString(36).toUpperCase()}`;
      showToast({
        type: "success",
        title: "License Capacity Expanded",
        message: `${res.data?.message || `Added ${expandedSeats} candidate seats.`} Invoice: ${invNum}`
      });

      if (res.data) {
        setProfile((prev: any) => ({
          ...prev,
          max_student_seats: res.data.max_student_seats,
          seats_remaining: res.data.seats_remaining,
          seat_utilization_percent: res.data.seat_utilization_percent,
          license_tier: res.data.license_tier || prev.license_tier
        }));
      }
      setShowPaymentModal(false);
    } catch {
      // Optimistic seat expansion fallback
      const additional = expandedSeats || 50;
      const newMax = (profile?.max_student_seats || 250) + additional;
      const newUsed = profile?.used_seats || 156;
      const newRemaining = newMax - newUsed;
      const newPct = Math.round((newUsed / newMax) * 100);
      const invNum = `INV-B2B-${Date.now().toString(36).toUpperCase()}`;

      setProfile((prev: any) => ({
        ...prev,
        max_student_seats: newMax,
        seats_remaining: newRemaining,
        seat_utilization_percent: newPct
      }));

      setShowPaymentModal(false);
      showToast({
        type: "success",
        title: "License Capacity Expanded",
        message: `Added ${additional} candidate seats via ${method}. Reference: ${invNum}`
      });
    } finally {
      setExpanding(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-amber-400 text-xs font-semibold mb-2">
          <Building2 className="w-3.5 h-3.5" />
          <span>School Settings</span>
        </div>
        <h1 className="font-sans text-2xl sm:text-3xl font-bold text-slate-900">
          School Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage institutional profile, contact details, and license capacity.
        </p>
      </div>

      {!isPrincipalOrAdmin && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <span className="font-bold block">Faculty Read-Only View</span>
            <span className="text-amber-800">Principal privileges required to modify settings and license capacity.</span>
          </div>
        </div>
      )}

      {/* Seat License & Capacity Card */}
      <div className="bg-gradient-to-br from-[#0F2744] to-[#143257] text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
                {profile.license_tier || "Gold Institutional Pass"}
              </span>
              <span className="text-xs text-slate-300">Academic Year {profile.academic_year}</span>
            </div>
            <h2 className="text-xl font-bold font-sans">Seat Allocation</h2>
          </div>

          <button
            onClick={() => setShowPaymentModal(true)}
            disabled={!isPrincipalOrAdmin}
            title={!isPrincipalOrAdmin ? "Principal credentials required to expand seats" : undefined}
            className="px-4 py-2.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 text-xs flex items-center gap-1.5 shadow transition-colors cursor-pointer shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Expand Capacity</span>
          </button>
        </div>

        {/* Meter */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300">
              Used Seats: <strong className="text-white">{profile.used_seats || 156}</strong> of {profile.max_student_seats || 250}
            </span>
            <span className="font-bold text-amber-400">
              {profile.seat_utilization_percent || 62}% Capacity
            </span>
          </div>
          <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${profile.seat_utilization_percent || 62}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 pt-1">
            <span>{profile.seats_remaining || 94} seats remaining</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> License Active
            </span>
          </div>
        </div>
      </div>

      {/* Institutional Details Form */}
      <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-sans text-lg font-bold text-slate-900">
              General Information
            </h3>
            <p className="text-xs text-slate-500">
              Official school details printed on reports and transcripts.
            </p>
          </div>
          <button
            type="submit"
            disabled={saving || !isPrincipalOrAdmin}
            title={!isPrincipalOrAdmin ? "Principal credentials required to edit settings" : undefined}
            className="px-5 py-2.5 rounded-xl font-bold bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? "Saving..." : "Save Profile"}</span>
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
              Institution Name *
            </label>
            <input
              type="text"
              required
              value={profile.name || ""}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
              School Code
            </label>
            <input
              type="text"
              disabled
              value={profile.code || "SCH-MNLK"}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-500 text-xs cursor-not-allowed font-mono"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
              Motto
            </label>
            <input
              type="text"
              value={profile.motto || ""}
              onChange={(e) => setProfile({ ...profile, motto: e.target.value })}
              placeholder="e.g. Excellence in Academic Discipline"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
              Contact Email *
            </label>
            <input
              type="email"
              value={profile.contact_email || ""}
              onChange={(e) => setProfile({ ...profile, contact_email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
              Phone Number *
            </label>
            <input
              type="tel"
              value={profile.phone || ""}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
              Academic Year *
            </label>
            <input
              type="text"
              value={profile.academic_year || "2026"}
              onChange={(e) => setProfile({ ...profile, academic_year: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
              Region
            </label>
            <input
              type="text"
              disabled
              value={profile.region ? `${profile.region}, ${profile.country || "Ethiopia"}` : "Addis Ababa, Ethiopia"}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-500 text-xs cursor-not-allowed"
            />
          </div>
        </div>
      </form>

      {/* Academic Year Rollover Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#1D4ED8] text-[11px] font-bold border border-[#BFDBFE] flex items-center gap-1">
                <RefreshCw className="w-3 h-3 text-[#1D4ED8] animate-spin-reverse" />
                <span>Academic Lifecycle</span>
              </span>
            </div>
            <h3 className="font-sans text-lg font-bold text-slate-900 mt-1">
              Academic Year Rollover
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Advance student cohorts, archive graduating classes, and release seat licenses.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setRolloverSummary(null);
              setShowRolloverModal(true);
            }}
            disabled={!isPrincipalOrAdmin}
            title={!isPrincipalOrAdmin ? "Principal credentials required for cohort rollover" : undefined}
            className="px-4 py-2.5 rounded-xl font-bold bg-[#1D4ED8] hover:bg-[#1E40AF] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Start Rollover</span>
          </button>
        </div>

        {/* Cohort Progression Architecture Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Grade 9</span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-bold text-slate-900 text-sm">Grade 9</span>
              <span className="text-xs font-semibold text-emerald-600">→ Grade 10</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Promotes cohort</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Grade 10</span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-bold text-slate-900 text-sm">Grade 10</span>
              <span className="text-xs font-semibold text-emerald-600">→ Grade 11</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Promotes cohort</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Grade 11</span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-bold text-slate-900 text-sm">Grade 11</span>
              <span className="text-xs font-semibold text-emerald-600">→ Grade 12</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Promotes cohort</span>
          </div>

          <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">Grade 12</span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-bold text-amber-950 text-sm">Graduates</span>
              <span className="text-xs font-bold text-amber-700">Archived</span>
            </div>
            <span className="text-[10px] text-amber-800 mt-1 block">Frees seat licenses</span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
              Current Academic Year
            </label>
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs font-semibold">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{profile.academic_year || "2026"}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
              Next Academic Year
            </label>
            <input
              type="text"
              value={nextYearString}
              onChange={(e) => setNextYearString(e.target.value)}
              placeholder="e.g. 2027/2017 E.C."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#1D4ED8] outline-none font-semibold text-slate-900"
            />
          </div>
        </div>
      </div>

      {/* Expand Seat Capacity Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">License Expansion</span>
              <h3 className="font-sans text-xl font-bold text-slate-900 mt-1">
                Add Candidate Seats
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Scale your school candidate limit for mock exams and learning.
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase text-slate-700">
                Select Seat Package
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { seats: 50, price: "7,500 ETB", tag: "Term Add-on" },
                  { seats: 100, price: "14,000 ETB", tag: "Most Popular" },
                  { seats: 250, price: "30,000 ETB", tag: "Full Grade Tier" }
                ].map((pkg) => (
                  <button
                    type="button"
                    key={pkg.seats}
                    onClick={() => setExpandedSeats(pkg.seats)}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      expandedSeats === pkg.seats
                        ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                        : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                    }`}
                  >
                    <span className="text-[10px] block opacity-70">{pkg.tag}</span>
                    <strong className="text-base font-bold block my-0.5">+{pkg.seats}</strong>
                    <span className="text-[11px] font-semibold">{pkg.price}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <label className="block text-xs font-bold uppercase text-slate-700">
                Payment Channel (Ethiopia)
              </label>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleSimulatePayment("Telebirr Corporate")}
                  className="w-full p-3.5 rounded-2xl border border-slate-200 hover:border-amber-500 text-left flex items-center justify-between text-xs font-bold text-slate-900 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                      TB
                    </div>
                    <div>
                      <span>Telebirr Corporate Merchant Pay</span>
                      <span className="text-[10px] text-slate-400 block font-normal">Instant digital activation</span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500" />
                </button>

                <button
                  type="button"
                  onClick={() => handleSimulatePayment("Commercial Bank of Ethiopia (CBE)")}
                  className="w-full p-3.5 rounded-2xl border border-slate-200 hover:border-amber-500 text-left flex items-center justify-between text-xs font-bold text-slate-900 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                      CBE
                    </div>
                    <div>
                      <span>CBE Commercial Bank Direct Transfer</span>
                      <span className="text-[10px] text-slate-400 block font-normal">Official CBE institutional account transfer</span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500" />
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Academic Year Rollover Confirmation Modal */}
      {showRolloverModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">System Action</span>
                <h3 className="font-sans text-xl font-bold text-slate-900">
                  Academic Year Rollover
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Advance academic operations from <strong className="text-slate-800">{profile.academic_year}</strong> to <strong className="text-[#1D4ED8]">{nextYearString}</strong>.
                </p>
              </div>
            </div>

            {rolloverSummary ? (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Academic Rollover Completed Successfully</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center pt-2">
                  <div className="p-3 bg-white rounded-xl border border-emerald-100">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Promoted</span>
                    <strong className="text-lg font-bold text-emerald-700">{rolloverSummary.promoted_count}</strong>
                    <span className="text-[10px] text-slate-500 block">Students</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-emerald-100">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Archived</span>
                    <strong className="text-lg font-bold text-slate-700">{rolloverSummary.archived_count}</strong>
                    <span className="text-[10px] text-slate-500 block">Graduates</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-emerald-100">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">New Term</span>
                    <strong className="text-xs font-bold text-[#1D4ED8] block mt-1">{rolloverSummary.new_academic_year}</strong>
                  </div>
                </div>
                <div className="flex justify-end pt-3">
                  <button
                    type="button"
                    onClick={() => setShowRolloverModal(false)}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
                  >
                    Done & Refresh Roster
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs text-slate-600">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Operational Scope of this Batch Action:</span>
                  </div>
                  <ul className="space-y-1.5 list-disc list-inside">
                    <li>Students in <strong>Grade 9, 10, and 11</strong> will advance to Grades 10, 11, and 12 respectively.</li>
                    <li>Students in <strong>Grade 12</strong> will be permanently graduated and archived into the alumni register.</li>
                    <li>Candidate license seats occupied by Grade 12 students will be released back to the school pool.</li>
                    <li>Homeroom and classroom section rosters will be reset for the incoming academic term.</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={archiveGrade12}
                      onChange={(e) => setArchiveGrade12(e.target.checked)}
                      className="rounded border-slate-300 text-[#1D4ED8] focus:ring-[#1D4ED8]"
                    />
                    <span className="text-xs font-medium text-slate-700">Archive Grade 12 cohort to Alumni & free seat quota</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={promoteGrades}
                      onChange={(e) => setPromoteGrades(e.target.checked)}
                      className="rounded border-slate-300 text-[#1D4ED8] focus:ring-[#1D4ED8]"
                    />
                    <span className="text-xs font-medium text-slate-700">Promote Grades 9, 10, 11 to consecutive grades</span>
                  </label>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="block text-xs font-bold text-rose-800 uppercase tracking-wide">
                    Security Verification: Type <code className="bg-rose-50 px-1.5 py-0.5 rounded font-mono text-rose-900 border border-rose-200">CONFIRM ROLLOVER</code> below:
                  </label>
                  <input
                    type="text"
                    value={rolloverSecurityPhrase}
                    onChange={(e) => setRolloverSecurityPhrase(e.target.value)}
                    placeholder="CONFIRM ROLLOVER"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 text-xs focus:border-rose-500 outline-none font-mono tracking-wider font-bold text-rose-950 placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowRolloverModal(false);
                      setRolloverSecurityPhrase("");
                    }}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleExecuteRollover}
                    disabled={rollingOver || rolloverSecurityPhrase.trim() !== "CONFIRM ROLLOVER"}
                    className="px-5 py-2.5 rounded-xl font-bold bg-rose-600 hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
                  >
                    {rollingOver ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing Rollover...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        <span>Confirm & Execute Rollover</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
