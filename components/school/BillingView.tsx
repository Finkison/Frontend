import React, { useCallback, useEffect, useState } from "react";
import { ArrowRight, RefreshCw, ShieldCheck, Users } from "lucide-react";
import { getSchoolProfile, type SchoolProfile } from "../../services/schoolService";
import { MONTHS_PER_YEAR, SCHOOL_PRICING_PLANS } from "../../constants/pricing";
import { useI18n } from "../../i18n";
import PageHeader from "../shared/PageHeader";
import PortalPage from "../shared/PortalPage";

const formatEtb = (amount: number): string => `ETB ${amount.toLocaleString("en-ET")}`;

export default function SchoolBillingView(): React.ReactElement {
  const { t } = useI18n();
  const [profile, setProfile] = useState<SchoolProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const response = await getSchoolProfile();
      setProfile(response.data);
    } catch {
      setProfile(null);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const usedSeats = typeof profile?.used_seats === "number" ? profile.used_seats : null;
  const maxSeats = typeof profile?.max_student_seats === "number" ? profile.max_student_seats : null;
  const seatsRemaining = typeof profile?.seats_remaining === "number" ? profile.seats_remaining : null;
  const licenseName = String(profile?.license_tier || "").toLowerCase();
  const selectedPlan = SCHOOL_PRICING_PLANS.find((plan) => licenseName.includes(plan.id));
  const monthlyLicenseTotal = maxSeats === null || !selectedPlan
    ? null
    : maxSeats * selectedPlan.monthlyPricePerStudentEtb;
  const seatUsage = typeof profile?.seat_utilization_percent === "number"
    ? Math.max(0, Math.min(100, profile.seat_utilization_percent))
    : null;

  return (
    <PortalPage className="max-w-5xl space-y-6">
      <PageHeader
        eyebrow={t("public.schoolBilling.eyebrow")}
        title={t("public.schoolBilling.title")}
        description={t("public.schoolBilling.description")}
        secondaryActions={[
          { label: t("public.schoolBilling.viewPricing"), href: "/pricing#school-plans", icon: ArrowRight },
          { label: "Refresh", onClick: () => void loadProfile(), icon: RefreshCw, loading },
        ]}
        primaryAction={{
          label: t("public.schoolBilling.contactSupport"),
          href: `/contact?topic=School%20setup${profile?.name ? `&school=${encodeURIComponent(profile.name)}` : ""}`,
          icon: ShieldCheck,
        }}
      />

      {loadError && (
        <div role="alert" className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-100 sm:flex-row sm:items-center sm:justify-between">
          <span>{t("public.schoolBilling.loadError")}</span>
          <button type="button" onClick={() => void loadProfile()} disabled={loading} className="min-h-9 self-start rounded-lg border border-rose-200 bg-white px-3 text-xs font-semibold text-rose-800 hover:bg-rose-100 disabled:opacity-60 dark:border-rose-900 dark:bg-[#261E1A] dark:text-rose-100 sm:self-auto">Try again</button>
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-2" aria-label={t("public.schoolBilling.detailsLabel")}>
        <article className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-[#261E1A] sm:p-6">
          <div className="flex items-center justify-between text-sm font-medium text-stone-600 dark:text-[#E7E0D6]">
            {t("public.schoolBilling.studentSeats")} <Users className="h-4 w-4 text-[#881337]" aria-hidden="true" />
          </div>
          <p className="mt-4 text-3xl font-semibold tabular-nums text-stone-900 dark:text-[#FDFBF7]">
            {loading ? "…" : usedSeats === null || maxSeats === null ? "—" : `${usedSeats.toLocaleString("en-ET")} / ${maxSeats.toLocaleString("en-ET")}`}
          </p>
          {seatUsage !== null && (
            <>
              <div
                className="mt-4 h-2 overflow-hidden rounded-full bg-stone-100 dark:bg-[#201815]"
                role="progressbar"
                aria-label={t("public.schoolBilling.used", { percent: seatUsage })}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={seatUsage}
              >
                <div className="h-full rounded-full bg-[#881337]" style={{ width: `${seatUsage}%` }} />
              </div>
              <p className="mt-2 text-xs text-stone-600 dark:text-[#E7E0D6]">
                {seatsRemaining === null ? "" : t("public.schoolBilling.seatsRemaining", { seats: seatsRemaining.toLocaleString("en-ET") })}
                {seatsRemaining !== null && " | "}{t("public.schoolBilling.used", { percent: seatUsage })}
              </p>
            </>
          )}
        </article>

        <article className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-[#261E1A] sm:p-6">
          <div className="text-sm font-medium text-stone-600 dark:text-[#E7E0D6]">{t("public.schoolBilling.currentLicense")}</div>
          <p className="mt-4 text-2xl font-semibold text-stone-900 dark:text-[#FDFBF7]">
            {loading ? "…" : profile?.license_tier || t("public.schoolBilling.notAvailable")}
          </p>
          <p className="mt-2 text-xs text-stone-600 dark:text-[#E7E0D6]">
            {profile?.academic_year
              ? t("public.schoolBilling.academicYear", { year: profile.academic_year })
              : t("public.schoolBilling.notAvailable")}
          </p>
        </article>
      </section>

      <p className="space-y-1 rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm leading-6 text-stone-600 dark:border-white/10 dark:bg-[#1C1512] dark:text-[#E7E0D6]">
        <span className="block">{monthlyLicenseTotal === null
          ? t("public.schoolBilling.planPricingNote")
          : t("public.schoolBilling.exactPricingNote", {
            seats: maxSeats?.toLocaleString("en-ET"),
            plan: t(selectedPlan!.nameKey),
            monthly: formatEtb(monthlyLicenseTotal),
            annual: formatEtb(monthlyLicenseTotal * MONTHS_PER_YEAR),
          })}</span>
        <span className="block">{t("public.schoolBilling.manualSetupNote")}</span>
      </p>
    </PortalPage>
  );
}
