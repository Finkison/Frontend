import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Check,
  ArrowRight,
  CreditCard,
  Building2,
  FileSpreadsheet,
  Calculator,
  Percent,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { SectionHeader } from "../components/typography/SectionHeader";
import { SITE_CONTENT } from "../content/siteContent";

export default function PricingPage(): React.ReactElement {
  useEffect(() => {
    document.title = "Pricing — Finkison";
  }, []);

  const [candidateSeats, setCandidateSeats] = useState<number>(150);
  const [billingCycle, setBillingCycle] = useState<"annual" | "semester">("annual");

  // Dynamic tier matching
  const getTierInfo = (seats: number) => {
    if (seats <= 50) {
      return {
        id: "starter",
        tierName: "Secondary starter",
        baseRate: 350,
        discountPct: 0,
      };
    } else if (seats <= 200) {
      return {
        id: "school",
        tierName: "Institutional campus",
        baseRate: 280,
        discountPct: 20,
      };
    } else if (seats <= 500) {
      return {
        id: "expanded",
        tierName: "Multi-campus network",
        baseRate: 250,
        discountPct: 29,
      };
    } else {
      return {
        id: "district",
        tierName: "Regional and network",
        baseRate: 220,
        discountPct: 37,
      };
    }
  };

  const currentTier = getTierInfo(candidateSeats);
  const cycleMultiplier = billingCycle === "semester" ? 0.55 : 1.0;
  const effectiveRatePerSeat = Math.round(currentTier.baseRate * cycleMultiplier);
  const subtotalETB = candidateSeats * effectiveRatePerSeat;
  const vatAmountETB = Math.round(subtotalETB * 0.15);
  const totalETB = subtotalETB + vatAmountETB;
  const baselineRate = Math.round(350 * cycleMultiplier);
  const totalSavingsETB = (baselineRate - effectiveRatePerSeat) * candidateSeats;

  const PLANS = [
    {
      id: "starter",
      name: "Secondary starter",
      seats: "Up to 50 active candidate seats",
      pricePerSeat: "350 ETB",
      cadence: "per candidate seat per academic year",
      target: "For single-stream preparatory schools and pilot academic departments.",
      features: [
        "Access to Grades 9, 10, 11, and 12 curriculum question banks",
        "Teacher exam generator with marking schemes and answer keys",
        "Continuous assessment gradebook with spreadsheet exports",
        "Instant client session recovery and local caching",
        "Addis Ababa Tier-3 datacenter hosting with domestic privacy",
      ],
      ctaText: "Select starter plan",
      ctaLink: "/contact?topic=Pricing&plan=starter",
    },
    {
      id: "school",
      name: "Institutional campus",
      seats: "Up to 200 active candidate seats",
      pricePerSeat: "280 ETB",
      cadence: "per candidate seat per academic year",
      target: "For established secondary schools with parallel homeroom sections.",
      badge: "Campus license",
      features: [
        "Full access for all school teachers and department heads",
        "Unlimited teacher exam drafting and custom question replacement",
        "Section-comparative performance telemetry and analytics",
        "Official continuous assessment report card generation",
        "Live test invigilation and non-invasive proctoring supervision",
        "Flexible seat reallocation for transferring candidates",
      ],
      ctaText: "Select campus plan",
      ctaLink: "/contact?topic=Pricing&plan=school",
    },
    {
      id: "district",
      name: "Regional and network",
      seats: "500 or more candidate seats",
      pricePerSeat: "220 ETB",
      cadence: "per candidate seat per academic year",
      target: "For multi-campus school networks, diocese schools, and regional bureaus.",
      features: [
        "Centralized administrative console across multiple campuses",
        "Custom table of specifications calibrated to regional exam calendars",
        "Dedicated on-site educator training and curriculum briefings",
        "Priority technical phone support and dedicated database clustering",
        "Master institutional agreement and official VAT tax invoicing",
        "Comprehensive multi-year historical cohort retention archives",
      ],
      ctaText: "Select regional plan",
      ctaLink: "/contact?topic=Pricing&plan=district",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[#261E1A] font-sans selection:bg-[#FFF1F2] selection:text-[#881337] dark:bg-[#1C1512] dark:text-stone-100">
      {/* 1. HERO SECTION - Left-aligned to container */}
      <section className="section bg-[#4C0519] text-white border-b border-white/10">
        <div className="container space-y-6">
          <SectionHeader
            asH1
            invertColors
            title={SITE_CONTENT.pages.pricing.title}
            subtitle={SITE_CONTENT.pages.pricing.subtitle}
            actions={
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/contact"
                  className="min-h-[44px] px-6 py-2.5 rounded-[6px] bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1C1512] text-sm font-semibold transition-colors inline-flex items-center gap-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#881337] active:scale-[0.98]"
                >
                  <span>Contact us</span>
                  <ArrowRight className="w-4 h-4 text-[#1C1512]" aria-hidden="true" />
                </Link>
                <Link
                  to="/for-schools"
                  className="min-h-[44px] px-5 py-2.5 rounded-[6px] border border-white/40 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white active:scale-[0.98]"
                >
                  <span>For schools</span>
                </Link>
              </div>
            }
          />
        </div>
      </section>

      {/* 2. INTERACTIVE SEAT AND BUDGET CALCULATOR */}
      <section className="section bg-[#FAF8F5] dark:bg-[#1C1512] border-b border-[#E2E8F0] dark:border-stone-800">
        <div className="container space-y-10 text-start">
          <SectionHeader
            title="Seat and licensing calculator"
            subtitle="Calculate per-candidate licensing costs and volume savings based on your school's candidate enrollment."
          />

          <div className="p-6 sm:p-10 rounded-[12px] bg-white dark:bg-[#261E1A]/40 border border-[#E2E8F0] dark:border-stone-800 shadow-xs hover:shadow-md transition-shadow space-y-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[8px] bg-[#FFF1F2] dark:bg-[#881337]/20 border border-[#FECDD3] dark:border-[#881337]/40 flex items-center justify-center text-[#881337] dark:text-[#FBBF24]">
                  <Calculator className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1C1512] dark:text-white">Estimate annual seat allocation</h3>
                  <p className="text-xs text-[#57534E] dark:text-stone-400">Drag the slider or choose a standard cohort preset</p>
                </div>
              </div>

              {/* Billing Cycle Selector */}
              <div className="flex items-center gap-2 p-1 rounded-[8px] bg-stone-100 dark:bg-[#1C1512] border border-stone-200 dark:border-stone-800 text-xs">
                <button
                  type="button"
                  onClick={() => setBillingCycle("annual")}
                  className={`min-h-[36px] px-4 py-1.5 rounded-[6px] font-semibold transition-all cursor-pointer ${
                    billingCycle === "annual"
                      ? "bg-white dark:bg-[#261E1A] text-[#881337] dark:text-[#FBBF24] shadow-xs"
                      : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white"
                  }`}
                >
                  Full academic year
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle("semester")}
                  className={`min-h-[36px] px-4 py-1.5 rounded-[6px] font-semibold transition-all cursor-pointer ${
                    billingCycle === "semester"
                      ? "bg-white dark:bg-[#261E1A] text-[#881337] dark:text-[#FBBF24] shadow-xs"
                      : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white"
                  }`}
                >
                  Semester split (55%)
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-[#57534E] dark:text-stone-300">Active candidate seats</span>
                  <div className="text-3xl font-bold text-[#1C1512] dark:text-white">
                    {candidateSeats}{" "}
                    <span className="text-xs font-normal text-stone-500">enrolled candidates</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">Cohort presets:</span>
                  {[50, 150, 300, 600].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setCandidateSeats(preset)}
                      className={`min-h-[34px] px-3 py-1 rounded-[6px] text-xs font-semibold transition-colors cursor-pointer border ${
                        candidateSeats === preset
                          ? "bg-[#881337] text-white border-[#881337]"
                          : "bg-white dark:bg-[#1C1512] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-white/5"
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <input
                type="range"
                min={20}
                max={1000}
                step={5}
                value={candidateSeats}
                onChange={(e) => setCandidateSeats(Number(e.target.value))}
                aria-label="Active candidate seats slider"
                className="w-full h-2.5 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-[#881337] dark:accent-[#FBBF24]"
              />

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
                <div className="p-4 rounded-[8px] bg-[#FAF8F5] dark:bg-[#1C1512] border border-[#E2E8F0] dark:border-stone-800 space-y-1">
                  <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
                    Recommended tier
                  </span>
                  <div className="text-base font-bold text-[#1C1512] dark:text-white">
                    {currentTier.tierName}
                  </div>
                  <span className="text-[11px] text-[#881337] dark:text-[#FBBF24] font-medium block">
                    {currentTier.discountPct > 0 ? `${currentTier.discountPct}% volume savings` : "Standard baseline"}
                  </span>
                </div>

                <div className="p-4 rounded-[8px] bg-[#FAF8F5] dark:bg-[#1C1512] border border-[#E2E8F0] dark:border-stone-800 space-y-1">
                  <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
                    Rate per seat
                  </span>
                  <div className="text-2xl font-bold text-[#881337] dark:text-[#FBBF24]">
                    {effectiveRatePerSeat} ETB
                  </div>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400 block">
                    per seat / {billingCycle === "semester" ? "semester" : "academic year"}
                  </span>
                </div>

                <div className="p-4 rounded-[8px] bg-[#FAF8F5] dark:bg-[#1C1512] border border-[#E2E8F0] dark:border-stone-800 space-y-1">
                  <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
                    Total subtotal
                  </span>
                  <div className="text-2xl font-bold text-[#1C1512] dark:text-white">
                    {subtotalETB.toLocaleString()} ETB
                  </div>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400 block">
                    + 15% VAT: {vatAmountETB.toLocaleString()} ETB
                  </span>
                </div>

                <div className="p-4 rounded-[8px] bg-[#FAF8F5] dark:bg-[#1C1512] border border-[#E2E8F0] dark:border-stone-800 space-y-1">
                  <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
                    Total with VAT
                  </span>
                  <div className="text-2xl font-bold text-[#1C1512] dark:text-white">
                    {totalETB.toLocaleString()} ETB
                  </div>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium block">
                    {totalSavingsETB > 0 ? `Saved ${totalSavingsETB.toLocaleString()} ETB` : "Official invoice receipt"}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-[#57534E] dark:text-stone-300">
                <ShieldCheck className="w-4 h-4 text-[#881337] dark:text-[#FBBF24] shrink-0" aria-hidden="true" />
                <span>Includes official registered VAT invoice and domestic bank wire remittance details.</span>
              </div>
              <Link
                to={`/contact?topic=Pricing&seats=${candidateSeats}&plan=${currentTier.id}`}
                className="min-h-[44px] px-6 py-2.5 rounded-[6px] bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1C1512] text-xs font-semibold transition-colors inline-flex items-center gap-2 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#881337] active:scale-[0.98]"
              >
                <span>Request official quotation for {candidateSeats} seats</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#1C1512]" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRICING PLANS */}
      <section className="section bg-white border-b border-[#E2E8F0] dark:bg-[#1C1512] dark:border-stone-800">
        <div className="container space-y-12">
          <SectionHeader
            title="School subscription plans"
            subtitle="Choose the plan matching your candidate count. Every plan includes full curriculum access and regular updates."
          />

          <div className="grid md:grid-cols-3 gap-8 text-start">
            {PLANS.map((plan) => {
              const isCampus = plan.id === "school";
              return (
                <div
                  key={plan.id}
                  className={`p-8 sm:p-9 rounded-[12px] bg-white dark:bg-[#261E1A]/40 border ${
                    isCampus
                      ? "border-[#881337] dark:border-[#FBBF24]/60 shadow-md ring-2 ring-[#FECDD3]/40 dark:ring-[#FBBF24]/20"
                      : "border-[#E2E8F0] dark:border-stone-800 shadow-xs"
                  } hover:border-[#FECDD3] dark:hover:border-[#FBBF24]/40 flex flex-col justify-between space-y-8 hover:shadow-lg transition-all duration-200 relative hover:-translate-y-0.5`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3.5 left-8 px-3 py-0.5 rounded-[6px] text-xs font-semibold uppercase tracking-wider bg-[#881337] text-white shadow-xs">
                      {plan.badge}
                    </div>
                  )}

                  <div className="space-y-5">
                    <div className="space-y-1.5">
                      <h3 className="text-xl font-bold text-[#1C1512] dark:text-white tracking-tight">{plan.name}</h3>
                      <p className="text-xs text-[#57534E] dark:text-stone-300 leading-relaxed">{plan.target}</p>
                    </div>

                    <div className="pt-2 pb-5 border-b border-stone-100 dark:border-stone-800 space-y-1">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl sm:text-4xl font-bold text-[#1C1512] dark:text-white tracking-tight">{plan.pricePerSeat}</span>
                        <span className="text-xs font-medium text-[#57534E] dark:text-stone-400">/ candidate</span>
                      </div>
                      <div className="text-xs text-[#881337] dark:text-[#FBBF24] font-semibold">{plan.seats}</div>
                      <div className="text-[11px] text-stone-400 dark:text-stone-400">{plan.cadence}</div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-400 block mb-2">
                        Included tier features
                      </span>
                      <ul className="space-y-3 text-xs text-[#57534E] dark:text-stone-300 leading-relaxed">
                        {plan.features.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2.5">
                            <Check className="w-4 h-4 text-[#881337] dark:text-[#FBBF24] shrink-0 mt-0.5 icon-first-line" aria-hidden="true" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-5 border-t border-stone-100 dark:border-stone-800">
                    <Link
                      to={plan.ctaLink}
                      className="w-full min-h-[44px] px-4 py-2.5 rounded-[6px] bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1C1512] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-[#881337] active:scale-[0.98]"
                    >
                      <span>{plan.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#1C1512]" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. BILLING TERMS & INCLUSIONS */}
      <section className="section bg-[#FAF8F5] dark:bg-[#1C1512] border-b border-[#E2E8F0] dark:border-stone-800">
        <div className="container space-y-12">
          <SectionHeader
            title="Payment options and invoices"
            subtitle="Finkison accommodates school fiscal calendars and regional finance procedures."
          />

          <div className="grid md:grid-cols-3 gap-8 text-start">
            <div className="p-8 rounded-[12px] bg-white dark:bg-[#261E1A]/40 border border-[#E2E8F0] dark:border-stone-800 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5 space-y-4">
              <div className="w-12 h-12 rounded-[8px] bg-[#FFF1F2] dark:bg-[#881337]/20 border border-[#FECDD3] dark:border-[#881337]/40 flex items-center justify-center text-[#881337] dark:text-[#FBBF24]">
                <CreditCard className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-[#1C1512] dark:text-white">Domestic bank transfer and Telebirr</h3>
              <p className="text-sm sm:text-base text-[#57534E] dark:text-stone-300 leading-relaxed">
                School finance offices can remit payments directly via Telebirr merchant accounts, CBE Birr, or commercial bank deposit into our domestic accounts in Addis Ababa.
              </p>
            </div>

            <div className="p-8 rounded-[12px] bg-white dark:bg-[#261E1A]/40 border border-[#E2E8F0] dark:border-stone-800 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5 space-y-4">
              <div className="w-12 h-12 rounded-[8px] bg-[#FFF1F2] dark:bg-[#881337]/20 border border-[#FECDD3] dark:border-[#881337]/40 flex items-center justify-center text-[#881337] dark:text-[#FBBF24]">
                <FileSpreadsheet className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-[#1C1512] dark:text-white">Official tax invoice receipts</h3>
              <p className="text-sm sm:text-base text-[#57534E] dark:text-stone-300 leading-relaxed">
                Every institutional license is accompanied by a registered Value Added Tax receipt and formal service agreement for school accounting records.
              </p>
            </div>

            <div className="p-8 rounded-[12px] bg-white dark:bg-[#261E1A]/40 border border-[#E2E8F0] dark:border-stone-800 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5 space-y-4">
              <div className="w-12 h-12 rounded-[8px] bg-[#FFF1F2] dark:bg-[#881337]/20 border border-[#FECDD3] dark:border-[#881337]/40 flex items-center justify-center text-[#881337] dark:text-[#FBBF24]">
                <Building2 className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-[#1C1512] dark:text-white">Annual seat reallocation</h3>
              <p className="text-sm sm:text-base text-[#57534E] dark:text-stone-300 leading-relaxed">
                If a student moves or changes schools during the first semester, administrators can revoke the unused credential and reassign the active seat to another student.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FINAL CALL TO ACTION (Academic Shield #4C0519) - Left-aligned to container */}
      <section className="section bg-[#4C0519] text-white">
        <div className="container space-y-8 text-start">
          <SectionHeader
            invertColors
            title="Request an institutional quote for your school"
            subtitle="Our team provides customized seat allocations and flexible subscription terms for your academic year."
            actions={
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <Link
                  to="/contact?topic=Pricing"
                  className="min-h-[48px] px-8 py-3.5 rounded-[6px] bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1C1512] text-sm font-semibold transition-colors inline-flex items-center gap-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#881337] active:scale-[0.98]"
                >
                  <span>Contact us</span>
                  <ArrowRight className="w-4 h-4 text-[#1C1512]" aria-hidden="true" />
                </Link>
                <Link
                  to="/for-schools"
                  className="min-h-[48px] px-7 py-3.5 rounded-[6px] border border-white/40 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white active:scale-[0.98]"
                >
                  <span>For schools</span>
                </Link>
              </div>
            }
          />
        </div>
      </section>
    </div>
  );
}
