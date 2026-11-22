import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Check, Building2, GraduationCap, Sparkles } from "lucide-react";
import { SectionHeader } from "../components/typography/SectionHeader";
import { usePageMeta } from "../hooks/usePageMeta";
import { useI18n } from "../i18n";
import {
  SCHOOL_PRICING_PLANS,
  MONTHS_PER_YEAR,
} from "../constants/pricing";
import { MarketingPageHero } from "../components/landing/MarketingPageHero";
import { MarketingCTA, MarketingSteps } from "../components/landing/MarketingSections";
import paymentService from "../services/paymentService";
import useAuthStore from "../store/authStore";

const formatEtb = (amount: number): string => "ETB " + amount.toLocaleString("en-ET");

export default function PricingPage(): React.ReactElement {
  const { t } = useI18n();
  const location = useLocation();
  const { isAuthenticated, role } = useAuthStore();
  usePageMeta(t("public.pages.pricingTitle"), t("public.pages.pricingDescription"));

  const [studentPlanPrices, setStudentPlanPrices] = useState<Record<string, number>>({ monthly: 150, season_pass: 450 });
  const studentPlanIsUnavailable = isAuthenticated && (role || "").toUpperCase() !== "STUDENT";

  useEffect(() => {
    let active = true;
    paymentService.plans("ETB")
      .then((response) => {
        if (!active) return;
        setStudentPlanPrices(Object.fromEntries(response.plans.map((plan) => [plan.id, plan.price])));
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const targetId = location.hash.slice(1);
    if (!targetId) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    });
  }, [location.hash]);

  const contactPlan = (message: string) =>
    `/contact?topic=School%20setup&message=${encodeURIComponent(message)}`;

  const studentSubscriptionPath = (planId: string) => `/student/subscription?plan=${planId}`;
  const studentPlanAction = (planId: string) => isAuthenticated
    ? studentSubscriptionPath(planId)
    : `/register?role=student&next=${encodeURIComponent(studentSubscriptionPath(planId))}`;

  return (
    <div className="public-page min-h-screen bg-white font-sans text-[#261E1A] selection:bg-[#FFF1F2] selection:text-[#881337] dark:bg-[#1C1512] dark:text-stone-100">
      <MarketingPageHero
        title={t("public.pages.pricingTitle")}
        description={t("public.pages.pricingDescription")}
        panelTitle={t("public.marketing.pricing.panelTitle")}
        panelItems={[
          t("public.marketing.pricing.panel1", { price: formatEtb(SCHOOL_PRICING_PLANS[0].monthlyPricePerStudentEtb) }),
          t("public.marketing.pricing.panel2"),
          t("public.marketing.pricing.panel3"),
        ]}
        actions={
          <>
            <a href="#school-plans" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#FBBF24] px-5 py-3 text-sm font-bold text-[#1C1512] transition-colors hover:bg-[#F59E0B] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#4C0519]">
              {t("public.marketing.pricing.exploreSchoolPlans")}<ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a href="#student-plans" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#4C0519]">
              {t("public.studentPricing.navLabel")}
            </a>
          </>
        }
      />

      <MarketingSteps
        id="pricing-flow-heading"
        title={t("public.marketing.pricing.flowTitle")}
        description={t("public.marketing.pricing.flowDescription")}
        tone="cream"
        columns={3}
        items={[
          { title: t("public.marketing.pricing.step1Title"), description: t("public.marketing.pricing.step1Description") },
          { title: t("public.marketing.pricing.step2Title"), description: t("public.marketing.pricing.step2Description") },
          { title: t("public.marketing.pricing.step3Title"), description: t("public.marketing.pricing.step3Description") },
        ]}
      />

      <section id="school-plans" className="section scroll-mt-24 border-b border-[#E7E0D6] bg-white dark:border-white/10 dark:bg-[#1C1512]">
        <div className="container space-y-7 text-start sm:space-y-8">
          <SectionHeader
            title={t("public.marketing.pricing.schoolPlansTitle")}
            subtitle={t("public.marketing.pricing.schoolPlansDescription")}
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {SCHOOL_PRICING_PLANS.map((plan) => (
              <article
                key={plan.id}
                className={`relative flex h-full flex-col rounded-2xl border bg-white p-6 dark:bg-[#261E1A] sm:p-7 ${
                  plan.recommended
                    ? "border-[#881337] shadow-md ring-1 ring-[#881337]/15 dark:border-[#FBBF24]"
                    : "border-[#E7E0D6] shadow-xs dark:border-white/10"
                }`}
              >
                {plan.recommended && (
                  <span className="absolute -top-3 left-5 rounded-full bg-[#881337] px-3 py-1 text-[11px] font-bold text-white dark:bg-[#FBBF24] dark:text-[#1C1512]">
                    {t("public.marketing.pricing.mostPopular")}
                  </span>
                )}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-[#1C1512] dark:text-white">{t(plan.nameKey)}</h3>
                    <p className="mt-1 min-h-12 text-sm leading-5 text-[#57534E] dark:text-stone-300">{t(plan.descriptionKey)}</p>
                  </div>
                  <div className="border-y border-[#E7E0D6] py-4 dark:border-white/10">
                    <p className="text-4xl font-bold tracking-tight text-[#1C1512] dark:text-white">{formatEtb(plan.monthlyPricePerStudentEtb)}</p>
                    <p className="mt-1 text-sm text-[#57534E] dark:text-stone-300">{t("public.marketing.pricing.perStudentMonthly")}</p>
                    <p className="mt-2 text-sm font-medium text-[#7D6F63] dark:text-stone-400">
                      {formatEtb(plan.monthlyPricePerStudentEtb * MONTHS_PER_YEAR)} {t("public.marketing.pricing.perStudentYear")}
                    </p>
                  </div>
                  <ul className="space-y-2.5 pb-4">
                    {plan.featureKeys.map((featureKey) => (
                      <li key={featureKey} className="flex items-start gap-2.5 text-sm leading-5 text-[#57534E] dark:text-stone-300">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
                        <span>{t(`public.marketing.pricing.${featureKey}`)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  to={contactPlan(t("public.marketing.pricing.planInquiryMessage", {
                    plan: t(plan.nameKey),
                    monthly: formatEtb(plan.monthlyPricePerStudentEtb),
                    annual: formatEtb(plan.monthlyPricePerStudentEtb * MONTHS_PER_YEAR),
                  }))}
                  className="mt-auto inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#881337] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#9F1239] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#881337] dark:bg-[#FBBF24] dark:text-[#1C1512] dark:hover:bg-[#F59E0B]"
                >
                  {t("public.marketing.pricing.choosePlan")}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>

          <article className="grid gap-8 rounded-2xl border border-[#E7E0D6] bg-[#FAF8F5] p-6 dark:border-white/10 dark:bg-[#201815] lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:p-8">
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#881337] dark:bg-[#261E1A] dark:text-[#FBBF24]">
                  <Building2 className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-xl font-bold tracking-tight text-[#1C1512] dark:text-white">{t("public.marketing.pricing.enterpriseName")}</h3>
                  <p className="max-w-3xl text-sm leading-6 text-[#57534E] dark:text-stone-300">{t("public.marketing.pricing.enterpriseDescription")}</p>
                  <p className="pt-1 text-lg font-semibold text-[#1C1512] dark:text-white">{t("public.marketing.pricing.contactForPricing")}</p>
                </div>
              </div>
              <ul className="grid gap-3 pl-1 text-sm leading-5 text-[#57534E] dark:text-stone-300 sm:grid-cols-2">
                {[1, 2, 3, 4].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
                    <span>{t(`public.marketing.pricing.enterpriseFeature${item}`)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              to={contactPlan(t("public.marketing.pricing.enterpriseInquiryMessage"))}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#1C1512] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#3A302A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#881337] dark:bg-white dark:text-[#1C1512]"
            >
              {t("public.marketing.pricing.contactEnterprise")}<ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </article>

          <p className="max-w-4xl text-sm leading-6 text-[#57534E] dark:text-stone-300">
            {t("public.marketing.pricing.manualSchoolSetupNote")}
          </p>
        </div>
      </section>

      <section id="student-plans" className="section scroll-mt-24 border-b border-[#E7E0D6] bg-[#FAF8F5] dark:border-white/10 dark:bg-[#1C1512]">
        <div className="container space-y-7 sm:space-y-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF1F2] text-[#881337] dark:bg-[#4C0519]/40 dark:text-[#FBBF24]">
              <GraduationCap className="h-5 w-5" aria-hidden="true" />
            </div>
            <SectionHeader id="student-pricing-heading" title={t("public.studentPricing.title")} subtitle={t("public.studentPricing.description")} />
          </div>
          <p className="mx-auto max-w-3xl rounded-xl border border-[#E7E0D6] bg-white px-4 py-3 text-center text-sm leading-6 text-[#57534E] dark:border-white/10 dark:bg-[#261E1A] dark:text-stone-300">
            {t("public.studentPricing.studentOnlyNote")}
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {(["monthly", "season_pass"] as const).map((planId) => {
              const isSeason = planId === "season_pass";
              const featureCount = isSeason ? 5 : 4;
              const planName = t(`public.studentPricing.${planId}Name`);
              return (
                <article key={planId} className={`relative rounded-2xl border bg-white p-6 shadow-xs dark:bg-[#261E1A] sm:p-7 ${
                  isSeason ? "border-[#881337] ring-1 ring-[#881337]/15 dark:border-[#FBBF24]" : "border-[#E7E0D6] dark:border-white/10"
                }`}>
                  {isSeason && (
                    <span className="absolute -top-3 left-6 rounded-full bg-[#881337] px-3 py-1 text-[11px] font-bold text-white dark:bg-[#FBBF24] dark:text-[#1C1512]">
                      {t("public.studentPricing.popular")}
                    </span>
                  )}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold tracking-tight text-[#1C1512] dark:text-white">{planName}</h3>
                      <p className="mt-1 text-sm leading-6 text-[#57534E] dark:text-stone-300">{t(`public.studentPricing.${planId}Description`)}</p>
                    </div>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF1F2] text-[#881337] dark:bg-[#4C0519]/40 dark:text-[#FBBF24]">
                      <Sparkles className="h-5 w-5" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="mt-5 border-y border-[#E7E0D6] py-4 dark:border-white/10">
                    <p className="text-3xl font-bold tracking-tight text-[#1C1512] dark:text-white">{formatEtb(studentPlanPrices[planId] ?? (isSeason ? 450 : 150))}</p>
                    <p className="mt-1 text-sm text-[#57534E] dark:text-stone-300">{t(`public.studentPricing.${planId}Period`)}</p>
                  </div>
                  <ul className="mt-5 space-y-3">
                    {Array.from({ length: featureCount }, (_, index) => (
                      <li key={index} className="flex items-start gap-2.5 text-sm leading-5 text-[#57534E] dark:text-stone-300">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
                        <span>{t(`public.studentPricing.${planId}Feature${index + 1}`)}</span>
                      </li>
                    ))}
                  </ul>
                  {studentPlanIsUnavailable ? (
                    <button type="button" disabled className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-stone-100 px-4 py-2.5 text-sm font-semibold text-stone-500 dark:bg-white/5 dark:text-stone-400">
                      {t("public.studentPricing.studentAccountOnly")}
                    </button>
                  ) : (
                    <Link
                      to={studentPlanAction(planId)}
                      className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#881337] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#9F1239] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#881337] dark:bg-[#FBBF24] dark:text-[#1C1512] dark:hover:bg-[#F59E0B]"
                    >
                      {t(isAuthenticated ? "public.studentPricing.managePlan" : "public.studentPricing.createStudentAccount")}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section border-t border-[#E7E0D6] bg-[#FAF8F5] dark:border-white/10 dark:bg-[#1C1512]" aria-labelledby="pricing-faq-heading">
        <div className="container grid gap-7 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <SectionHeader id="pricing-faq-heading" align="start" title={t("public.marketing.pricing.faqTitle")} subtitle={t("public.marketing.pricing.flowDescription")} />
          </div>
          <div className="space-y-2.5 lg:col-span-8">
            {[
              [t("public.marketing.pricing.faq1Question"), t("public.marketing.pricing.faq1Answer")],
              [t("public.marketing.pricing.faq2Question"), t("public.marketing.pricing.faq2Answer")],
              [t("public.marketing.pricing.faq3Question"), t("public.marketing.pricing.faq3Answer")],
            ].map(([question, answer]) => (
              <details key={question} className="group rounded-xl border border-[#E7E0D6] bg-white px-4 py-3.5 dark:border-white/10 dark:bg-[#261E1A]">
                <summary className="flex min-h-8 cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-[#1C1512] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#881337] dark:text-white">
                  {question}<span className="text-lg leading-none text-[#881337] group-open:rotate-45 dark:text-[#FBBF24]" aria-hidden="true">+</span>
                </summary>
                <p className="pt-2 text-sm leading-6 text-[#57534E] dark:text-stone-300">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <MarketingCTA
        title={t("public.marketing.pricing.ctaTitle")}
        description={t("public.marketing.pricing.ctaDescription")}
        primaryLabel={t("public.marketing.pricing.startSchoolSetup")}
        primaryTo="/contact?topic=School%20setup"
        secondaryLabel={t("public.studentPricing.navLabel")}
        secondaryTo="/pricing#student-plans"
      />
    </div>
  );
}
