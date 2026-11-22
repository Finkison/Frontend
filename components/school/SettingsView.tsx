import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { 
  getSchoolProfile, 
  updateSchoolProfile, 
  requestSchoolSeatExpansion,
  rolloverAcademicYear,
  type AcademicYearRolloverResult,
  type SchoolProfile,
} from "../../services/schoolService";
import PortalPage from "../shared/PortalPage";
import { getApiErrorMessage } from "../../services/api";
import useAuthStore from "../../store/authStore";
import { 
  Building2, 
  ShieldCheck, 
  Save, 
  CheckCircle2, 
  Calendar, 
  ShieldAlert,
  Loader2,
  RefreshCw,
  GraduationCap,
  AlertTriangle
} from "lucide-react";
import { useToast } from "../ui/Toast";

const ROLLOVER_CONFIRMATION_PHRASE = "CONFIRM ROLLOVER";

export default function SchoolSettings(): React.ReactElement {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { role, user } = useAuthStore();
  const isPrincipalOrAdmin = role === "PRINCIPAL" || role === "ADMIN" || user?.role === "PRINCIPAL" || user?.role === "ADMIN";

  const [profile, setProfile] = useState<SchoolProfile>({
    name: user?.school || "",
    code: "",
    region: user?.region || "",
    country: user?.country || "",
    motto: "",
    academic_year: "",
    license_tier: "",
    max_student_seats: null,
    used_seats: null,
    seats_remaining: null,
    seat_utilization_percent: null,
    contact_email: user?.email || "",
    phone: user?.phone || ""
  });

  const [saving, setSaving] = useState(false);
  const [additionalSeats, setAdditionalSeats] = useState("50");
  const [requestingSeats, setRequestingSeats] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileLoadError, setProfileLoadError] = useState(false);

  const [showRolloverModal, setShowRolloverModal] = useState(false);
  const [nextYearString, setNextYearString] = useState("");
  const [archiveGrade12, setArchiveGrade12] = useState(true);
  const [promoteGrades, setPromoteGrades] = useState(true);
  const [rolloverSecurityPhrase, setRolloverSecurityPhrase] = useState("");
  const [rollingOver, setRollingOver] = useState(false);
  const [rolloverSummary, setRolloverSummary] = useState<AcademicYearRolloverResult | null>(null);
  const rolloverDialogRef = useRef<HTMLDivElement>(null);
  const rolloverDialogTitleRef = useRef<HTMLHeadingElement>(null);
  const rolloverTriggerRef = useRef<HTMLButtonElement>(null);
  const nextYearInputRef = useRef<HTMLInputElement>(null);
  const rollingOverRef = useRef(false);
  const seatUsage = typeof profile.seat_utilization_percent === "number"
    ? Math.max(0, Math.min(100, profile.seat_utilization_percent))
    : null;
  const normalizedNextYear = nextYearString.trim().toLowerCase();
  const normalizedCurrentYear = (profile.academic_year || "").trim().toLowerCase();
  const isNextYearInvalid = !normalizedNextYear || normalizedNextYear === normalizedCurrentYear;

  useEffect(() => {
    getSchoolProfile()
      .then((res) => {
        if (res.data) setProfile(res.data);
      })
      .catch(() => setProfileLoadError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!showRolloverModal) return;

    rolloverDialogTitleRef.current?.focus();
    const handleDialogKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !rollingOverRef.current) {
        setShowRolloverModal(false);
        setRolloverSecurityPhrase("");
        return;
      }
      if (event.key !== "Tab") return;

      const focusableElements = rolloverDialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusableElements?.length) return;
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (event.shiftKey && (document.activeElement === firstElement || document.activeElement === rolloverDialogTitleRef.current)) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleDialogKeyDown);
    return () => {
      document.removeEventListener("keydown", handleDialogKeyDown);
      if (rolloverTriggerRef.current && !rolloverTriggerRef.current.disabled) {
        rolloverTriggerRef.current.focus();
      } else {
        nextYearInputRef.current?.focus();
      }
    };
  }, [showRolloverModal]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPrincipalOrAdmin) {
      showToast({
        type: "error",
        title: t("schoolSettings.permissionDeniedTitle"),
        message: t("schoolSettings.profilePermissionDenied"),
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
        title: t("schoolSettings.profileSavedTitle"),
        message: t("schoolSettings.profileSavedMessage"),
      });
    } catch (err: unknown) {
      showToast({
        type: "error",
        title: t("schoolSettings.profileSaveFailedTitle"),
        message: getApiErrorMessage(err) || t("schoolSettings.profileSaveFailedMessage"),
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSeatExpansionRequest = async () => {
    if (!isPrincipalOrAdmin) return;
    const seatCount = Number(additionalSeats);
    if (!Number.isInteger(seatCount) || seatCount < 1 || seatCount > 10000) {
      showToast({
        type: "error",
        title: t("schoolSettings.validationTitle"),
        message: t("schoolSettings.validationMessage"),
      });
      return;
    }

    setRequestingSeats(true);
    try {
      const response = await requestSchoolSeatExpansion({ additional_seats: seatCount });
      showToast({
        type: "success",
        title: t("schoolSettings.requestSuccessTitle"),
        message: `${t("schoolSettings.requestSubmitted")}${response.data.request_reference ? ` ${t("schoolSettings.referenceLabel")}: ${response.data.request_reference}` : ""}`,
      });
    } catch (error: unknown) {
      showToast({
        type: "error",
        title: t("schoolSettings.requestErrorTitle"),
        message: getApiErrorMessage(error) || t("schoolSettings.requestErrorFallback"),
      });
    } finally {
      setRequestingSeats(false);
    }
  };

  const handleExecuteRollover = async () => {
    if (!isPrincipalOrAdmin) {
      showToast({
        type: "error",
        title: t("schoolSettings.permissionDeniedTitle"),
        message: t("schoolSettings.rolloverPermissionDenied"),
      });
      return;
    }

    if (rolloverSecurityPhrase.trim() !== ROLLOVER_CONFIRMATION_PHRASE) {
      showToast({
        type: "error",
        title: t("schoolSettings.securityFailureTitle"),
        message: t("schoolSettings.securityFailureMessage", { phrase: ROLLOVER_CONFIRMATION_PHRASE }),
      });
      return;
    }

    setRollingOver(true);
    rollingOverRef.current = true;
    try {
      const res = await rolloverAcademicYear({
        new_academic_year: nextYearString,
        archive_grade_12: archiveGrade12,
        promote_grades: promoteGrades
      });

      setRolloverSummary(res.data);
      setProfile((prev) => ({
        ...prev,
        academic_year: res.data.new_academic_year || nextYearString,
        used_seats: res.data.current_active_enrolled,
        max_student_seats: res.data.max_seats,
        seats_remaining: res.data.seats_available,
        seat_utilization_percent: res.data.max_seats > 0
          ? Math.round((res.data.current_active_enrolled / res.data.max_seats) * 100)
          : 0,
      }));

      showToast({
        type: "success",
        title: t("schoolSettings.rolloverSuccessTitle"),
        message: t("schoolSettings.rolloverSuccessMessage", {
          year: res.data.new_academic_year,
          promoted: res.data.total_promoted,
          archived: res.data.graduated_alumni_archived,
        }),
      });
    } catch (err: unknown) {
      showToast({
        type: "error",
        title: t("schoolSettings.rolloverFailedTitle"),
        message: getApiErrorMessage(err) || t("schoolSettings.rolloverFailedMessage"),
      });
    } finally {
      rollingOverRef.current = false;
      setRollingOver(false);
    }
  };

  return (
    <PortalPage className="max-w-4xl space-y-8">

      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900 text-amber-400 text-xs font-semibold mb-2">
          <Building2 className="w-3.5 h-3.5" />
          <span>{t("schoolSettings.settingsTitle")}</span>
        </div>
        <h1 className="font-sans text-2xl sm:text-3xl font-bold text-stone-900 dark:text-[#FDFBF7]">
          {t("schoolSettings.settingsTitle")}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-[#A89C90] mt-1">
          {t("schoolSettings.settingsDescription")}
        </p>
      </div>

      {!isPrincipalOrAdmin && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <span className="font-bold block">{t("schoolSettings.readOnlyTitle")}</span>
            <span className="text-amber-800">{t("schoolSettings.readOnlyDescription")}</span>
          </div>
        </div>
      )}

      {profileLoadError && (
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          {t("schoolSettings.profileLoadError")}
        </div>
      )}

      <div className="bg-gradient-to-br from-[#4C0519] to-[#881337] text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
                {profile.license_tier || t("schoolSettings.licenseUnavailable")}
              </span>
              <span className="text-xs text-stone-300">{profile.academic_year
                ? t("schoolSettings.academicYearNamed", { year: profile.academic_year })
                : t("schoolSettings.academicYearNotSet")}</span>
            </div>
            <h2 className="text-xl font-bold font-sans">{t("schoolSettings.seatAllocation")}</h2>
          </div>

          <button
            ref={rolloverTriggerRef}
            type="button"
            onClick={() => navigate("/pricing#school-plans")}
            className="px-4 py-2.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-stone-950 text-xs flex items-center gap-1.5 shadow transition-colors cursor-pointer shrink-0"
          >
            <span>{t("schoolSettings.reviewSeatPricing")}</span>
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-stone-300">
              {t("schoolSettings.usedSeats", {
                used: profile.used_seats ?? "—",
                total: profile.max_student_seats ?? "—",
              })}
            </span>
            {seatUsage !== null && <span className="font-bold text-amber-400">{t("schoolSettings.percentUsed", { percent: seatUsage })}</span>}
          </div>
          {seatUsage !== null && <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden" aria-label={t("schoolSettings.seatUtilizationLabel", { percent: seatUsage })}>
            <div 
              className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${seatUsage}%` }}
            />
          </div>}
          <div className="flex justify-between text-[11px] text-stone-400 dark:text-[#A89C90] pt-1">
            <span>{profile.seats_remaining == null
              ? t("schoolSettings.seatAvailabilityUnavailable")
              : t("schoolSettings.seatsRemaining", { seats: profile.seats_remaining })}</span>
            <span>{loading
              ? t("schoolSettings.loadingLicense")
              : profile.license_tier
                ? t("schoolSettings.licenseOnFile")
                : t("schoolSettings.licenseDetailsUnavailable")}</span>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <h3 className="text-sm font-bold text-white">{t("schoolSettings.moreSeatsTitle")}</h3>
            <p className="mt-1 text-xs leading-5 text-stone-300">
              {t("schoolSettings.moreSeatsDescription")}
            </p>
            {!profile.contact_email && (
              <p className="mt-2 text-xs text-amber-300">{t("schoolSettings.contactEmailHint")}</p>
            )}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <div>
              <label htmlFor="additional-seat-count" className="mb-1 block text-[11px] font-semibold text-stone-300">
                {t("schoolSettings.additionalSeatsLabel")}
              </label>
              <input
                id="additional-seat-count"
                type="number"
                min={1}
                max={10000}
                step={1}
                value={additionalSeats}
                onChange={(event) => setAdditionalSeats(event.target.value)}
                disabled={!isPrincipalOrAdmin || requestingSeats}
                className="w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-300/30 disabled:opacity-60 sm:w-32"
              />
            </div>
            <button
              type="button"
              onClick={() => void handleSeatExpansionRequest()}
              disabled={!isPrincipalOrAdmin || requestingSeats || loading || !profile.contact_email}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-bold text-stone-950 transition-colors hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {requestingSeats && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{requestingSeats ? t("schoolSettings.sendingRequest") : t("schoolSettings.requestCapacityReview")}</span>
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSaveProfile} className="bg-white dark:bg-[#261E1A] rounded-3xl border border-stone-200 dark:border-white/10 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-white/10 pb-4">
          <div>
              <h3 className="font-sans text-lg font-bold text-stone-900 dark:text-[#FDFBF7]">
              {t("schoolSettings.generalInformation")}
            </h3>
            <p className="text-xs text-stone-500 dark:text-[#A89C90]">
              {t("schoolSettings.contactDetailsDescription")}
            </p>
          </div>
          <button
            type="submit"
            disabled={saving || !isPrincipalOrAdmin}
            title={!isPrincipalOrAdmin ? t("schoolSettings.principalEditTitle") : undefined}
            className="px-5 py-2.5 rounded-xl font-bold bg-stone-900 hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? t("schoolSettings.savingProfile") : t("schoolSettings.saveProfile")}</span>
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="school-name" className="block text-xs font-bold uppercase text-stone-700 dark:text-[#E7E0D6] mb-1.5">
              {t("schoolSettings.institutionName")} *
            </label>
            <input
              id="school-name"
              type="text"
              required
              value={profile.name || ""}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-white/10 text-xs focus:border-amber-500 outline-none"
            />
          </div>

          <div>
            <label htmlFor="school-code" className="block text-xs font-bold uppercase text-stone-700 dark:text-[#E7E0D6] mb-1.5">
              {t("schoolSettings.schoolCode")}
            </label>
            <input
              id="school-code"
              type="text"
              disabled
              value={profile.code || ""}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-100 dark:border-white/10 bg-stone-50 dark:bg-[#1C1512] text-stone-500 dark:text-[#A89C90] text-xs cursor-not-allowed font-mono"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="school-motto" className="block text-xs font-bold uppercase text-stone-700 dark:text-[#E7E0D6] mb-1.5">
              {t("schoolSettings.motto")}
            </label>
            <input
              id="school-motto"
              type="text"
              value={profile.motto || ""}
              onChange={(e) => setProfile({ ...profile, motto: e.target.value })}
              placeholder={t("schoolSettings.mottoPlaceholder")}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-white/10 text-xs focus:border-amber-500 outline-none"
            />
          </div>

          <div>
            <label htmlFor="school-contact-email" className="block text-xs font-bold uppercase text-stone-700 dark:text-[#E7E0D6] mb-1.5">
              {t("schoolSettings.contactEmail")}
            </label>
            <input
              id="school-contact-email"
              type="email"
              value={profile.contact_email || ""}
              onChange={(e) => setProfile({ ...profile, contact_email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-white/10 text-xs focus:border-amber-500 outline-none"
            />
          </div>

          <div>
            <label htmlFor="school-phone" className="block text-xs font-bold uppercase text-stone-700 dark:text-[#E7E0D6] mb-1.5">
              {t("schoolSettings.phoneNumber")}
            </label>
            <input
              id="school-phone"
              type="tel"
              value={profile.phone || ""}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-white/10 text-xs focus:border-amber-500 outline-none"
            />
          </div>

          <div>
            <label htmlFor="school-academic-year" className="block text-xs font-bold uppercase text-stone-700 dark:text-[#E7E0D6] mb-1.5">
              {t("schoolSettings.academicYear")}
            </label>
            <input
              id="school-academic-year"
              type="text"
              value={profile.academic_year || ""}
              onChange={(e) => setProfile({ ...profile, academic_year: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-white/10 text-xs focus:border-amber-500 outline-none"
            />
          </div>

          <div>
            <label htmlFor="school-region" className="block text-xs font-bold uppercase text-stone-700 dark:text-[#E7E0D6] mb-1.5">
              {t("schoolSettings.region")}
            </label>
            <input
              id="school-region"
              type="text"
              disabled
              value={profile.region ? `${profile.region}${profile.country ? `, ${profile.country}` : ""}` : t("schoolSettings.notProvided")}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-100 dark:border-white/10 bg-stone-50 dark:bg-[#1C1512] text-stone-500 dark:text-[#A89C90] text-xs cursor-not-allowed"
            />
          </div>
        </div>
      </form>

      <div className="bg-white dark:bg-[#261E1A] rounded-3xl border border-stone-200 dark:border-white/10 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 dark:border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FFF1F2] dark:bg-[#4C0519]/40 text-[#881337] text-[11px] font-bold border border-[#FECDD3] dark:border-[#881337]/50 flex items-center gap-1">
                <RefreshCw className="w-3 h-3 text-[#881337] animate-spin-reverse" />
                <span>{t("schoolSettings.academicLifecycle")}</span>
              </span>
            </div>
            <h3 className="font-sans text-lg font-bold text-stone-900 dark:text-[#FDFBF7] mt-1">
              {t("schoolSettings.academicYearRollover")}
            </h3>
            <p className="text-xs text-stone-500 dark:text-[#A89C90] mt-0.5">
              {t("schoolSettings.rolloverDescription")}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setRolloverSummary(null);
              setRolloverSecurityPhrase("");
              setShowRolloverModal(true);
            }}
            disabled={!isPrincipalOrAdmin || isNextYearInvalid}
            title={!isPrincipalOrAdmin
              ? t("schoolSettings.principalRolloverTitle")
              : isNextYearInvalid
                ? t("schoolSettings.rolloverYearHint")
                : undefined}
            className="px-4 py-2.5 rounded-xl font-bold bg-[#881337] hover:bg-[#9F1239] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <GraduationCap className="w-4 h-4" />
            <span>{t("schoolSettings.startRollover")}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-stone-50 dark:bg-[#1C1512] border border-stone-200/70">
          <div className="p-4 bg-white dark:bg-[#261E1A] rounded-xl border border-stone-200 dark:border-white/10 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-[#A89C90] block">{t("schoolSettings.promotionRangeLabel")}</span>
            <strong className="mt-1 block text-sm text-stone-900 dark:text-[#FDFBF7]">{t("schoolSettings.gradeRange", { start: 1, end: 11 })}</strong>
            <span className="mt-1 block text-[11px] text-stone-500 dark:text-[#A89C90]">{t("schoolSettings.promotesCohort")}</span>
          </div>

          <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">{t("schoolSettings.gradeLabel", { grade: 12 })}</span>
            <strong className="mt-1 block text-sm text-amber-950">{t("schoolSettings.graduationOutcome")}</strong>
            <span className="mt-1 block text-[11px] text-amber-800">{t("schoolSettings.releasesSeats")}</span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 pt-1">
          <div>
            <p id="current-academic-year-label" className="mb-1.5 text-xs font-bold uppercase text-stone-700 dark:text-[#E7E0D6]">
              {t("schoolSettings.currentAcademicYear")}
            </p>
            <div role="group" aria-labelledby="current-academic-year-label" className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-[#1C1512] text-stone-700 dark:text-[#E7E0D6] text-xs font-semibold">
              <Calendar className="w-4 h-4 text-stone-400 dark:text-[#A89C90]" />
              <span>{profile.academic_year || t("schoolSettings.academicYearNotSet")}</span>
            </div>
          </div>

          <div>
            <label htmlFor="new-academic-year" className="block text-xs font-bold uppercase text-stone-700 dark:text-[#E7E0D6] mb-1.5">
              {t("schoolSettings.nextAcademicYear")}
            </label>
            <input
              ref={nextYearInputRef}
              id="new-academic-year"
              type="text"
              maxLength={50}
              value={nextYearString}
              onChange={(e) => setNextYearString(e.target.value)}
              placeholder={t("schoolSettings.newAcademicYearPlaceholder")}
              aria-describedby="new-academic-year-hint"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-white/10 text-xs focus:border-[#881337] outline-none font-semibold text-stone-900 dark:text-[#FDFBF7]"
            />
            <p id="new-academic-year-hint" className="mt-1.5 text-[11px] text-stone-500 dark:text-[#A89C90]">
              {t("schoolSettings.rolloverYearHint")}
            </p>
          </div>
        </div>
      </div>


      {showRolloverModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div ref={rolloverDialogRef} role="dialog" aria-modal="true" aria-labelledby="academic-year-rollover-title" aria-busy={rollingOver} className="bg-white dark:bg-[#261E1A] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">{t("schoolSettings.systemAction")}</span>
                <h3 ref={rolloverDialogTitleRef} id="academic-year-rollover-title" tabIndex={-1} className="font-sans text-xl font-bold text-stone-900 dark:text-[#FDFBF7]">
                  {t("schoolSettings.academicYearRollover")}
                </h3>
                <p className="text-xs text-stone-500 dark:text-[#A89C90] mt-1">
                  {t("schoolSettings.advanceAcademicYear", { currentYear: profile.academic_year, nextYear: nextYearString })}
                </p>
              </div>
            </div>

            {rolloverSummary ? (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>{t("schoolSettings.rolloverCompleted")}</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center pt-2">
                  <div className="p-3 bg-white dark:bg-[#261E1A] rounded-xl border border-emerald-100">
                    <span className="text-[10px] text-stone-400 dark:text-[#A89C90] uppercase font-bold block">{t("schoolSettings.promoted")}</span>
                    <strong className="text-lg font-bold text-emerald-700">{rolloverSummary.total_promoted}</strong>
                    <span className="text-[10px] text-stone-500 dark:text-[#A89C90] block">{t("schoolSettings.students")}</span>
                  </div>
                  <div className="p-3 bg-white dark:bg-[#261E1A] rounded-xl border border-emerald-100">
                    <span className="text-[10px] text-stone-400 dark:text-[#A89C90] uppercase font-bold block">{t("schoolSettings.archived")}</span>
                    <strong className="text-lg font-bold text-stone-700 dark:text-[#E7E0D6]">{rolloverSummary.graduated_alumni_archived}</strong>
                    <span className="text-[10px] text-stone-500 dark:text-[#A89C90] block">{t("schoolSettings.graduates")}</span>
                  </div>
                  <div className="p-3 bg-white dark:bg-[#261E1A] rounded-xl border border-emerald-100">
                    <span className="text-[10px] text-stone-400 dark:text-[#A89C90] uppercase font-bold block">{t("schoolSettings.newAcademicYear")}</span>
                    <strong className="text-xs font-bold text-[#881337] block mt-1">{rolloverSummary.new_academic_year}</strong>
                  </div>
                </div>
                <p className="border-t border-emerald-200 pt-3 text-xs leading-5 text-emerald-900">
                  {t("schoolSettings.rolloverDetails", {
                    classrooms: rolloverSummary.classrooms_created,
                    assignments: rolloverSummary.teaching_assignments_carried_forward,
                    students: rolloverSummary.students_reassigned,
                  })}
                </p>
                <div className="flex justify-end pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowRolloverModal(false);
                      setRolloverSecurityPhrase("");
                    }}
                    className="px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 cursor-pointer"
                  >
                    {t("schoolSettings.close")}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#1C1512] border border-stone-200 dark:border-white/10 space-y-3 text-xs text-stone-600 dark:text-[#E7E0D6]">
                  <div className="font-bold text-stone-800 dark:text-[#FDFBF7] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>{t("schoolSettings.rolloverScopeTitle")}</span>
                  </div>
                  <ul className="space-y-1.5 list-disc list-inside">
                    <li>{t("schoolSettings.rolloverPromotionsScope")}</li>
                    <li>{t("schoolSettings.rolloverGraduationScope")}</li>
                    <li>{t("schoolSettings.rolloverSeatScope")}</li>
                    <li>{t("schoolSettings.rolloverClassroomScope")}</li>
                    <li>{t("schoolSettings.rolloverTeacherScope")}</li>
                    <li>{t("schoolSettings.rolloverOtherGradesScope")}</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={archiveGrade12}
                      onChange={(e) => setArchiveGrade12(e.target.checked)}
                      className="rounded border-stone-300 dark:border-white/20 text-[#881337] focus:ring-[#881337]"
                    />
                    <span className="text-xs font-medium text-stone-700 dark:text-[#E7E0D6]">{t("schoolSettings.archiveGrade12Option", { grade: t("schoolSettings.gradeLabel", { grade: 12 }) })}</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={promoteGrades}
                      onChange={(e) => setPromoteGrades(e.target.checked)}
                      className="rounded border-stone-300 dark:border-white/20 text-[#881337] focus:ring-[#881337]"
                    />
                    <span className="text-xs font-medium text-stone-700 dark:text-[#E7E0D6]">{t("schoolSettings.promoteGradesOption")}</span>
                  </label>
                </div>

                <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-white/10">
                  <label htmlFor="rollover-security-phrase" className="block text-xs font-bold text-rose-800 uppercase tracking-wide">
                    {t("schoolSettings.securityVerification")}: <code className="bg-rose-50 px-1.5 py-0.5 rounded font-mono text-rose-900 border border-rose-200">{ROLLOVER_CONFIRMATION_PHRASE}</code> {t("schoolSettings.typePhraseBelow")}
                  </label>
                  <input
                    id="rollover-security-phrase"
                    type="text"
                    autoComplete="off"
                    autoCapitalize="characters"
                    autoCorrect="off"
                    spellCheck={false}
                    value={rolloverSecurityPhrase}
                    onChange={(e) => setRolloverSecurityPhrase(e.target.value)}
                    placeholder={t("schoolSettings.confirmRolloverPlaceholder")}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 text-xs focus:border-rose-500 outline-none font-mono tracking-wider font-bold text-rose-950 placeholder:font-normal placeholder:tracking-normal placeholder:text-stone-400"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowRolloverModal(false);
                      setRolloverSecurityPhrase("");
                    }}
                    className="px-4 py-2.5 rounded-xl border border-stone-200 dark:border-white/10 text-xs font-bold text-stone-600 dark:text-[#E7E0D6] hover:bg-stone-50 dark:hover:bg-white/5 cursor-pointer"
                  >
                    {t("schoolSettings.cancel")}
                  </button>
                  <button
                    type="button"
                    onClick={handleExecuteRollover}
                    disabled={rollingOver || rolloverSecurityPhrase.trim() !== ROLLOVER_CONFIRMATION_PHRASE}
                    className="px-5 py-2.5 rounded-xl font-bold bg-rose-600 hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
                  >
                    {rollingOver ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{t("schoolSettings.processingRollover")}</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        <span>{t("schoolSettings.confirmRollover")}</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </PortalPage>
  );
}
