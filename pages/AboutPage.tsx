import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  TrendingUp,
  Cpu,
  Building2,
  Target,
  ArrowRight,
  School,
  UserCheck,
  GraduationCap,
  Globe2,
} from "lucide-react";
import { SectionHeader } from "../components/typography/SectionHeader";
import { SITE_CONTENT } from "../content/siteContent";

export default function AboutPage(): React.ReactElement {
  useEffect(() => {
    document.title = "About Finkison — Finkison";

    if (window.location.hash) {
      const id = window.location.hash.replace("#", "");
      const elem = document.getElementById(id);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#261E1A] font-sans selection:bg-[#FFF1F2] selection:text-[#881337] dark:bg-[#1C1512] dark:text-stone-100">
      {/* 1. HERO SECTION - Left-aligned to container */}
      <section className="section bg-white dark:bg-[#1C1512] border-b border-[#E2E8F0] dark:border-stone-800">
        <div className="container space-y-8">
          <SectionHeader
            asH1
            title={SITE_CONTENT.pages.about.title}
            subtitle={SITE_CONTENT.pages.about.subtitle}
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
                  to="/team"
                  className="min-h-[44px] px-5 py-2.5 rounded-[6px] border border-[#E2E8F0] dark:border-white/20 hover:bg-stone-50 dark:hover:bg-white/10 text-[#1C1512] dark:text-white text-sm font-semibold transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#881337] active:scale-[0.98]"
                >
                  <span>Meet our team</span>
                </Link>
              </div>
            }
          />
        </div>
      </section>

      {/* 2. MISSION AND FOUNDING PRINCIPLES */}
      <section className="section bg-[#FAF8F5] dark:bg-[#1C1512] border-b border-[#E2E8F0] dark:border-stone-800">
        <div className="container space-y-12">
          <SectionHeader
            title="Curriculum fidelity and educational equity"
            subtitle="Our core principles guide platform development, assessment calibration, and secondary school enablement across Ethiopia."
          />

          <div className="grid md:grid-cols-3 gap-8 text-start">
            <div className="p-8 rounded-[12px] bg-white dark:bg-[#261E1A]/40 border border-[#E2E8F0] dark:border-stone-800 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5 duration-200 space-y-4">
              <div className="w-12 h-12 rounded-[8px] bg-[#FFF1F2] dark:bg-[#881337]/20 border border-[#FECDD3] dark:border-[#881337]/40 flex items-center justify-center text-[#881337] dark:text-[#FBBF24]">
                <BookOpen className="w-6 h-6 text-[#881337]" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-[#1C1512] dark:text-white">
                National curriculum alignment
              </h3>
              <p className="text-sm sm:text-base text-[#57534E] dark:text-stone-300 leading-relaxed">
                Every lesson outline, worked solution, and mock exam is mapped directly to approved Ethiopian national secondary textbooks across all units in Grades 9 through 12.
              </p>
            </div>

            <div className="p-8 rounded-[12px] bg-white dark:bg-[#261E1A]/40 border border-[#E2E8F0] dark:border-stone-800 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5 duration-200 space-y-4">
              <div className="w-12 h-12 rounded-[8px] bg-[#FFF1F2] dark:bg-[#881337]/20 border border-[#FECDD3] dark:border-[#881337]/40 flex items-center justify-center text-[#881337] dark:text-[#FBBF24]">
                <TrendingUp className="w-6 h-6 text-[#881337]" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-[#1C1512] dark:text-white">
                Empirical psychometric calibration
              </h3>
              <p className="text-sm sm:text-base text-[#57534E] dark:text-stone-300 leading-relaxed">
                We replace arbitrary percentages with calibrated entrance score forecasts modeled on historical university cutoffs, giving students clear confidence ranges before exam day.
              </p>
            </div>

            <div className="p-8 rounded-[12px] bg-white dark:bg-[#261E1A]/40 border border-[#E2E8F0] dark:border-stone-800 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5 duration-200 space-y-4">
              <div className="w-12 h-12 rounded-[8px] bg-[#FFF1F2] dark:bg-[#881337]/20 border border-[#FECDD3] dark:border-[#881337]/40 flex items-center justify-center text-[#881337] dark:text-[#FBBF24]">
                <Globe2 className="w-6 h-6 text-[#881337]" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-[#1C1512] dark:text-white">
                National educational equity
              </h3>
              <p className="text-sm sm:text-base text-[#57534E] dark:text-stone-300 leading-relaxed">
                Standardized across all regional states in clear, textbook-aligned English to give every student an equal path to university admission regardless of geographic location.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INSTITUTIONAL INFRASTRUCTURE FOR SCHOOLS */}
      <section className="section bg-white dark:bg-[#1C1512] border-b border-[#E2E8F0] dark:border-stone-800" id="schools">
        <div className="container space-y-12">
          <SectionHeader
            title="Academic infrastructure for secondary schools"
            subtitle="Finkison provides unified academic governance, cohort performance analytics, and automated exam generation for preparatory and secondary schools."
          />

          <div className="grid md:grid-cols-3 gap-8 text-start">
            <div className="p-8 rounded-[12px] bg-white dark:bg-[#261E1A]/40 border border-[#E2E8F0] dark:border-stone-800 hover:border-[#FECDD3] dark:hover:border-[#881337]/40 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5 duration-200 space-y-4">
              <div className="w-12 h-12 rounded-[8px] bg-[#FFF1F2] dark:bg-[#881337]/20 border border-[#FECDD3] dark:border-[#881337]/40 flex items-center justify-center text-[#881337] dark:text-[#FBBF24]">
                <School className="w-6 h-6 text-[#881337]" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-[#1C1512] dark:text-white">
                Institutional governance
              </h3>
              <p className="text-sm sm:text-base text-[#57534E] dark:text-stone-300 leading-relaxed">
                Principals and academic deans monitor cohort velocity, projected admission cutoffs, and export statutory continuous assessment reports with full audit integrity.
              </p>
            </div>

            <div className="p-8 rounded-[12px] bg-white dark:bg-[#261E1A]/40 border border-[#E2E8F0] dark:border-stone-800 hover:border-[#FECDD3] dark:hover:border-[#881337]/40 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5 duration-200 space-y-4" id="teachers">
              <div className="w-12 h-12 rounded-[8px] bg-[#FFF1F2] dark:bg-[#881337]/20 border border-[#FECDD3] dark:border-[#881337]/40 flex items-center justify-center text-[#881337] dark:text-[#FBBF24]">
                <UserCheck className="w-6 h-6 text-[#881337]" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-[#1C1512] dark:text-white">
                Classroom assessment integrity
              </h3>
              <p className="text-sm sm:text-base text-[#57534E] dark:text-stone-300 leading-relaxed">
                Subject educators draft standardized tests across units, verify answer keys before publishing, and manage continuous assessment records with zero manual calculation overhead.
              </p>
            </div>

            <div className="p-8 rounded-[12px] bg-white dark:bg-[#261E1A]/40 border border-[#E2E8F0] dark:border-stone-800 hover:border-[#FECDD3] dark:hover:border-[#881337]/40 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5 duration-200 space-y-4">
              <div className="w-12 h-12 rounded-[8px] bg-[#FFF1F2] dark:bg-[#881337]/20 border border-[#FECDD3] dark:border-[#881337]/40 flex items-center justify-center text-[#881337] dark:text-[#FBBF24]">
                <GraduationCap className="w-6 h-6 text-[#881337]" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-[#1C1512] dark:text-white">
                Candidate academic mastery
              </h3>
              <p className="text-sm sm:text-base text-[#57534E] dark:text-stone-300 leading-relaxed">
                Candidates access structured textbook summaries, interactive science simulations, timed entrance trials, and verified past papers with worked solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TEAM AND LEADERSHIP DIVISIONS */}
      <section className="section bg-[#FAF8F5] dark:bg-[#1C1512] border-b border-[#E2E8F0] dark:border-stone-800" id="team">
        <div className="container space-y-12">
          <SectionHeader
            title="Guided by Ethiopian curriculum specialists and measurement scientists"
            subtitle="Every assessment item, score prediction model, and school deployment workflow is verified across four academic divisions."
          />

          <div className="p-8 sm:p-10 rounded-[16px] bg-white dark:bg-[#261E1A]/60 border border-[#E2E8F0] dark:border-stone-800 shadow-xs space-y-8 text-start">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-[8px] bg-[#FFF1F2] dark:bg-[#881337]/20 border border-[#FECDD3] dark:border-[#881337]/40 flex items-center justify-center text-[#881337] dark:text-[#FBBF24]">
                  <BookOpen className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="text-base font-bold text-[#1C1512] dark:text-white">Curriculum alignment</h3>
                <p className="text-xs sm:text-sm text-[#57534E] dark:text-stone-300 leading-relaxed">
                  Subject matter specialists mapping all items to approved national textbooks.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-[8px] bg-[#FFF1F2] dark:bg-[#881337]/20 border border-[#FECDD3] dark:border-[#881337]/40 flex items-center justify-center text-[#881337] dark:text-[#FBBF24]">
                  <Target className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="text-base font-bold text-[#1C1512] dark:text-white">Psychometrics</h3>
                <p className="text-xs sm:text-sm text-[#57534E] dark:text-stone-300 leading-relaxed">
                  Statistical scientists modeling item difficulty and university entrance score distributions.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-[8px] bg-[#FFF1F2] dark:bg-[#881337]/20 border border-[#FECDD3] dark:border-[#881337]/40 flex items-center justify-center text-[#881337] dark:text-[#FBBF24]">
                  <Cpu className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="text-base font-bold text-[#1C1512] dark:text-white">Domestic engineering</h3>
                <p className="text-xs sm:text-sm text-[#57534E] dark:text-stone-300 leading-relaxed">
                  Tier-3 Addis Ababa cloud hosting, AES-256 candidate security, and low-latency testing.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-[8px] bg-[#FFF1F2] dark:bg-[#881337]/20 border border-[#FECDD3] dark:border-[#881337]/40 flex items-center justify-center text-[#881337] dark:text-[#FBBF24]">
                  <Building2 className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="text-base font-bold text-[#1C1512] dark:text-white">School enablement</h3>
                <p className="text-xs sm:text-sm text-[#57534E] dark:text-stone-300 leading-relaxed">
                  On-site workshops for administrators and direct educator onboarding.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <span className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
                Learn more about our educational research methodologies, faculty, and technical team.
              </span>
              <Link
                to="/team"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#881337] dark:text-[#FBBF24] hover:underline"
              >
                <span>Meet our leadership team</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FINAL CALL TO ACTION (Academic Shield #4C0519) - Left-aligned to container */}
      <section className="section bg-[#4C0519] text-white">
        <div className="container space-y-8 text-start">
          <SectionHeader
            invertColors
            title="Equip your secondary school with Finkison"
            subtitle="Connect with our academic team to discuss school onboarding, educator workshops, or student license allocations."
            className="text-white"
            actions={
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <Link
                  to="/contact"
                  className="min-h-[48px] px-8 py-3.5 rounded-[6px] bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1C1512] text-sm font-semibold transition-colors inline-flex items-center gap-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#881337] active:scale-[0.98]"
                >
                  <span>Contact us</span>
                  <ArrowRight className="w-4 h-4 text-[#1C1512]" aria-hidden="true" />
                </Link>
                <Link
                  to="/academics"
                  className="min-h-[48px] px-7 py-3.5 rounded-[6px] border border-white/40 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white active:scale-[0.98]"
                >
                  <span>Explore academics</span>
                </Link>
              </div>
            }
          />
        </div>
      </section>
    </div>
  );
}
