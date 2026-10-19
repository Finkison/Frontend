import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  BarChart3,
  Shield,
  CreditCard,
  ArrowRight,
  FileSpreadsheet,
  CheckCircle2,
  Lock,
  Server,
  Layers,
} from "lucide-react";
import { SectionHeader } from "../components/typography/SectionHeader";
import { SITE_CONTENT } from "../content/siteContent";

export default function SchoolsPage(): React.ReactElement {
  useEffect(() => {
    document.title = "Schools — Finkison";
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#261E1A] font-sans selection:bg-[#FFF1F2] selection:text-[#881337] dark:bg-[#1C1512] dark:text-stone-100">
      {/* 1. HERO SECTION */}
      <section className="section bg-[#4C0519] text-white border-b border-white/10">
        <div className="container space-y-6">
          <SectionHeader
            asH1
            invertColors
            title={SITE_CONTENT.pages.forSchools.title}
            subtitle={SITE_CONTENT.pages.forSchools.subtitle}
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
                  to="/pricing"
                  className="min-h-[44px] px-5 py-2.5 rounded-[6px] border border-white/40 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white active:scale-[0.98]"
                >
                  <span>View pricing</span>
                </Link>
              </div>
            }
          />
        </div>
      </section>

      {/* 2. INSTITUTIONAL CAMPUS ADMINISTRATION & EXAM GOVERNANCE */}
      <section className="section bg-white border-b border-[#E2E8F0] dark:bg-[#1C1512] dark:border-stone-800">
        <div className="container space-y-12">
          <SectionHeader
            title="Institutional examination governance and integrity"
            subtitle="Oversee school-wide assessments with real-time session telemetry, automated continuous assessment compilation, and statutory reporting."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-start">
            <div className="p-6 rounded-[12px] bg-[#FAF8F5] dark:bg-[#261E1A]/40 border border-[#E2E8F0] dark:border-stone-800 space-y-3">
              <div className="w-10 h-10 rounded-[8px] bg-white dark:bg-[#1C1512] border border-[#FECDD3] dark:border-[#881337]/40 flex items-center justify-center text-[#881337] dark:text-[#FBBF24]">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1C1512] dark:text-white">Exam session supervision</h3>
              <p className="text-xs sm:text-sm text-[#57534E] dark:text-stone-300 leading-relaxed">
                Privacy-preserving client heuristics detect focus loss and tab switching without invasive video feeds, safeguarding candidate dignity.
              </p>
            </div>

            <div className="p-6 rounded-[12px] bg-[#FAF8F5] dark:bg-[#261E1A]/40 border border-[#E2E8F0] dark:border-stone-800 space-y-3">
              <div className="w-10 h-10 rounded-[8px] bg-white dark:bg-[#1C1512] border border-[#FECDD3] dark:border-[#881337]/40 flex items-center justify-center text-[#881337] dark:text-[#FBBF24]">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1C1512] dark:text-white">Continuous assessment (CBE)</h3>
              <p className="text-xs sm:text-sm text-[#57534E] dark:text-stone-300 leading-relaxed">
                Automated 2-semester terminal markbook consolidation formatted directly for Ministry of Education reporting requirements.
              </p>
            </div>

            <div className="p-6 rounded-[12px] bg-[#FAF8F5] dark:bg-[#261E1A]/40 border border-[#E2E8F0] dark:border-stone-800 space-y-3">
              <div className="w-10 h-10 rounded-[8px] bg-white dark:bg-[#1C1512] border border-[#FECDD3] dark:border-[#881337]/40 flex items-center justify-center text-[#881337] dark:text-[#FBBF24]">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1C1512] dark:text-white">Cohort stream management</h3>
              <p className="text-xs sm:text-sm text-[#57534E] dark:text-stone-300 leading-relaxed">
                Seamless administration of Natural Science and Social Science tracks across senior cohorts with automated syllabus matching.
              </p>
            </div>

            <div className="p-6 rounded-[12px] bg-[#FAF8F5] dark:bg-[#261E1A]/40 border border-[#E2E8F0] dark:border-stone-800 space-y-3">
              <div className="w-10 h-10 rounded-[8px] bg-white dark:bg-[#1C1512] border border-[#FECDD3] dark:border-[#881337]/40 flex items-center justify-center text-[#881337] dark:text-[#FBBF24]">
                <Server className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1C1512] dark:text-white">Sovereign cloud hosting</h3>
              <p className="text-xs sm:text-sm text-[#57534E] dark:text-stone-300 leading-relaxed">
                All institutional records and gradebooks reside in Addis Ababa Tier-3 domestic datacenters with zero foreign telemetry egress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. STRUCTURAL CONTROL & ROSTER ALLOCATION */}
      <section className="section bg-[#FAF8F5] dark:bg-[#1C1512] border-b border-[#E2E8F0] dark:border-stone-800">
        <div className="container space-y-16">
          <SectionHeader
            title="Manage school classes and teacher assignments"
            subtitle="Configure academic calendars, homeroom sections, and educator permissions from one central console."
          />

          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6 text-start">
              <div className="p-6 rounded-[12px] bg-white dark:bg-[#261E1A]/40 border border-[#E2E8F0] dark:border-stone-800 space-y-2">
                <h3 className="text-base font-bold text-[#1C1512] dark:text-white">
                  Roster and stream administration
                </h3>
                <p className="text-sm sm:text-base text-[#57534E] dark:text-stone-300 leading-relaxed">
                  Configure academic years, create sections for Grades 9 through 12, and import candidate rosters via CSV. Candidate credentials and stream assignments are provisioned automatically.
                </p>
              </div>

              <div className="p-6 rounded-[12px] bg-white dark:bg-[#261E1A]/40 border border-[#E2E8F0] dark:border-stone-800 space-y-2">
                <h3 className="text-base font-bold text-[#1C1512] dark:text-white">
                  Section-level authorization
                </h3>
                <p className="text-sm sm:text-base text-[#57534E] dark:text-stone-300 leading-relaxed">
                  Assign subject educators strictly to designated classroom sections. Faculty access is partitioned to safeguard test integrity and continuous assessment gradebooks.
                </p>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-[12px] border border-[#E2E8F0] dark:border-stone-800 bg-white dark:bg-[#261E1A]/50 p-8 shadow-xs hover:shadow-md transition-shadow space-y-5 text-start">
                <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
                  <div>
                    <span className="text-xs text-[#57534E] dark:text-stone-400">Classroom allocations</span>
                    <h3 className="text-base font-bold text-[#1C1512] dark:text-white">Curriculum architecture</h3>
                  </div>
                  <span className="text-xs font-semibold text-[#881337] dark:text-[#FBBF24] bg-[#FFF1F2] dark:bg-[#881337]/20 px-2.5 py-1 rounded-[6px] border border-[#FECDD3] dark:border-[#881337]/40">
                    Active Semester
                  </span>
                </div>
                <div className="space-y-3 text-xs text-[#57534E] dark:text-stone-300">
                  <div className="p-4 rounded-[8px] bg-[#FAF8F5] dark:bg-[#1C1512] border border-[#E2E8F0] dark:border-stone-800 shadow-xs flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-sm text-[#1C1512] dark:text-white">Natural Science stream</div>
                      <div className="text-xs text-[#57534E] dark:text-stone-400 mt-0.5">Grades 11 & 12 • Physics, Chemistry, Biology, Mathematics</div>
                    </div>
                    <span className="text-xs font-bold text-[#059669] bg-[#ECFDF5] border border-[#A7F3D0] px-2.5 py-1 rounded-[6px]">
                      Syllabus Calibrated
                    </span>
                  </div>
                  <div className="p-4 rounded-[8px] bg-[#FAF8F5] dark:bg-[#1C1512] border border-[#E2E8F0] dark:border-stone-800 shadow-xs flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-sm text-[#1C1512] dark:text-white">Social Science stream</div>
                      <div className="text-xs text-[#57534E] dark:text-stone-400 mt-0.5">Grades 11 & 12 • Economics, Geography, History, Mathematics</div>
                    </div>
                    <span className="text-xs font-bold text-[#059669] bg-[#ECFDF5] border border-[#A7F3D0] px-2.5 py-1 rounded-[6px]">
                      Syllabus Calibrated
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. AGGREGATED SECTION RESULTS & ANALYTICS */}
      <section className="section bg-white dark:bg-[#1C1512] border-b border-[#E2E8F0] dark:border-stone-800">
        <div className="container space-y-12">
          <SectionHeader
            title="Section performance and national entrance forecasts"
            subtitle="Monitor performance trends across natural and social science streams months before official national examination sittings."
          />

          <div className="grid md:grid-cols-3 gap-8 text-start">
            <div className="p-8 rounded-[12px] bg-[#FAF8F5] dark:bg-[#261E1A]/40 border border-[#E2E8F0] dark:border-stone-800 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5 space-y-4">
              <div className="w-12 h-12 rounded-[8px] bg-white dark:bg-[#1C1512] border border-[#FECDD3] dark:border-[#881337]/40 flex items-center justify-center text-[#881337] dark:text-[#FBBF24]">
                <BarChart3 className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-[#1C1512] dark:text-white">Section comparative tracking</h3>
              <p className="text-sm sm:text-base text-[#57534E] dark:text-stone-300 leading-relaxed">
                Track mean scores, completion velocity, and topic mastery across parallel homeroom sections to deploy targeted academic interventions.
              </p>
            </div>

            <div className="p-8 rounded-[12px] bg-[#FAF8F5] dark:bg-[#261E1A]/40 border border-[#E2E8F0] dark:border-stone-800 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5 space-y-4">
              <div className="w-12 h-12 rounded-[8px] bg-white dark:bg-[#1C1512] border border-[#FECDD3] dark:border-[#881337]/40 flex items-center justify-center text-[#881337] dark:text-[#FBBF24]">
                <FileSpreadsheet className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-[#1C1512] dark:text-white">Continuous assessment exports</h3>
              <p className="text-sm sm:text-base text-[#57534E] dark:text-stone-300 leading-relaxed">
                Generate continuous assessment records and grade transcripts formatted for regional education bureau requirements.
              </p>
            </div>

            <div className="p-8 rounded-[12px] bg-[#FAF8F5] dark:bg-[#261E1A]/40 border border-[#E2E8F0] dark:border-stone-800 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5 space-y-4">
              <div className="w-12 h-12 rounded-[8px] bg-white dark:bg-[#1C1512] border border-[#FECDD3] dark:border-[#881337]/40 flex items-center justify-center text-[#881337] dark:text-[#FBBF24]">
                <Shield className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-[#1C1512] dark:text-white">Exam supervision</h3>
              <p className="text-sm sm:text-base text-[#57534E] dark:text-stone-300 leading-relaxed">
                Oversee lab examination sessions with privacy-preserving client heuristics tracking window focus loss without invasive video streams.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BILLING & INSTITUTIONAL SEAT LICENSING */}
      <section className="section bg-[#FAF8F5] dark:bg-[#1C1512] border-b border-[#E2E8F0] dark:border-stone-800">
        <div className="container space-y-12">
          <SectionHeader
            title="Transparent school licensing and domestic payment"
            subtitle="Annual school licensing with simple per-student pricing, domestic payment channels, and official VAT receipts."
          />

          <div className="grid md:grid-cols-2 gap-8 text-start">
            <div className="p-8 rounded-[12px] bg-white dark:bg-[#261E1A]/40 border border-[#E2E8F0] dark:border-stone-800 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5 space-y-4">
              <div className="w-10 h-10 rounded-[8px] bg-[#FAF8F5] dark:bg-[#1C1512] border border-[#FECDD3] dark:border-[#881337]/40 flex items-center justify-center text-[#881337] dark:text-[#FBBF24]">
                <Users className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-[#1C1512] dark:text-white">Flexible seat reallocation</h3>
              <p className="text-sm sm:text-base text-[#57534E] dark:text-stone-300 leading-relaxed">
                Allocate seats across Grades 9–12 with instant reallocation for transferring students at no added fee.
              </p>
            </div>

            <div className="p-8 rounded-[12px] bg-white dark:bg-[#261E1A]/40 border border-[#E2E8F0] dark:border-stone-800 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5 space-y-4">
              <div className="w-10 h-10 rounded-[8px] bg-[#FAF8F5] dark:bg-[#1C1512] border border-[#FECDD3] dark:border-[#881337]/40 flex items-center justify-center text-[#881337] dark:text-[#FBBF24]">
                <CreditCard className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-[#1C1512] dark:text-white">Domestic billing channels</h3>
              <p className="text-sm sm:text-base text-[#57534E] dark:text-stone-300 leading-relaxed">
                Settle school licensing via Telebirr, CBE Birr, or bank transfer with official VAT invoices for school records.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FINAL CALL TO ACTION */}
      <section className="section bg-[#4C0519] text-white">
        <div className="container space-y-8 text-start">
          <SectionHeader
            invertColors
            title="Connect with our school deployment team"
            subtitle="Connect directly with our team to review administrative dashboards, roster onboarding, and custom school licensing."
            actions={
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <Link
                  to="/contact"
                  className="min-h-[48px] px-8 py-3.5 rounded-[6px] bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1C1512] text-sm font-semibold transition-colors inline-flex items-center gap-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#881337] active:scale-[0.98]"
                >
                  <span>Contact us</span>
                  <ArrowRight className="w-4 h-4 text-[#1C1512]" aria-hidden="true" />
                </Link>
                <Link
                  to="/pricing"
                  className="min-h-[48px] px-7 py-3.5 rounded-[6px] border border-white/40 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white active:scale-[0.98]"
                >
                  <span>View pricing</span>
                </Link>
              </div>
            }
          />
        </div>
      </section>
    </div>
  );
}

export { SchoolsPage as ForSchoolsPage };
