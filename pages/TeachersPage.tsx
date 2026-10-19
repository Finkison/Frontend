import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FileSpreadsheet,
  ArrowRight,
  Clock,
  Layers,
  CheckCircle2,
  Edit3,
  FileCheck,
  Printer,
  Sparkles,
} from "lucide-react";
import { SectionHeader } from "../components/typography/SectionHeader";
import { SITE_CONTENT } from "../content/siteContent";

export default function TeachersPage(): React.ReactElement {
  useEffect(() => {
    document.title = "Teachers — Finkison";
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#261E1A] font-sans selection:bg-[#FFF1F2] selection:text-[#881337] dark:bg-[#1C1512] dark:text-stone-100">
      {/* 1. HERO SECTION */}
      <section className="section bg-[#4C0519] text-white border-b border-white/10">
        <div className="container space-y-6">
          <SectionHeader
            asH1
            invertColors
            title={SITE_CONTENT.pages.forTeachers.title}
            subtitle={SITE_CONTENT.pages.forTeachers.subtitle}
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
                  to="/academics"
                  className="min-h-[44px] px-5 py-2.5 rounded-[6px] border border-white/40 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white active:scale-[0.98]"
                >
                  <span>Explore curriculum</span>
                </Link>
              </div>
            }
          />
        </div>
      </section>

      {/* 2. EXAM GENERATION & EDITORIAL CONTROL */}
      <section className="section bg-white border-b border-[#E2E8F0] dark:bg-[#1C1512] dark:border-stone-800">
        <div className="container space-y-12">
          <SectionHeader
            title="Curriculum assessment studio with educator editorial control"
            subtitle="Build balanced examinations aligned with national secondary specifications while retaining complete editorial authority over every item."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-start">
            <div className="p-6 rounded-[12px] bg-[#FAF8F5] dark:bg-[#261E1A]/40 border border-[#E2E8F0] dark:border-stone-800 space-y-3">
              <div className="w-10 h-10 rounded-[8px] bg-white dark:bg-[#1C1512] border border-[#FECDD3] dark:border-[#881337]/40 flex items-center justify-center text-[#881337] dark:text-[#FBBF24]">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1C1512] dark:text-white">Blueprint-calibrated generation</h3>
              <p className="text-xs sm:text-sm text-[#57534E] dark:text-stone-300 leading-relaxed">
                Automated multi-unit item distribution mirrors official national examination formats, preventing early-chapter clustering.
              </p>
            </div>

            <div className="p-6 rounded-[12px] bg-[#FAF8F5] dark:bg-[#261E1A]/40 border border-[#E2E8F0] dark:border-stone-800 space-y-3">
              <div className="w-10 h-10 rounded-[8px] bg-white dark:bg-[#1C1512] border border-[#FECDD3] dark:border-[#881337]/40 flex items-center justify-center text-[#881337] dark:text-[#FBBF24]">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1C1512] dark:text-white">100% Teacher verification gate</h3>
              <p className="text-xs sm:text-sm text-[#57534E] dark:text-stone-300 leading-relaxed">
                Educators review every question stem, edit distractors, swap items from the repository, and approve the paper before publication.
              </p>
            </div>

            <div className="p-6 rounded-[12px] bg-[#FAF8F5] dark:bg-[#261E1A]/40 border border-[#E2E8F0] dark:border-stone-800 space-y-3">
              <div className="w-10 h-10 rounded-[8px] bg-white dark:bg-[#1C1512] border border-[#FECDD3] dark:border-[#881337]/40 flex items-center justify-center text-[#881337] dark:text-[#FBBF24]">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1C1512] dark:text-white">Item discrimination analytics</h3>
              <p className="text-xs sm:text-sm text-[#57534E] dark:text-stone-300 leading-relaxed">
                Item response theory diagnostics calculate difficulty parameters and distractor efficacy to ensure valid testing.
              </p>
            </div>

            <div className="p-6 rounded-[12px] bg-[#FAF8F5] dark:bg-[#261E1A]/40 border border-[#E2E8F0] dark:border-stone-800 space-y-3">
              <div className="w-10 h-10 rounded-[8px] bg-white dark:bg-[#1C1512] border border-[#FECDD3] dark:border-[#881337]/40 flex items-center justify-center text-[#881337] dark:text-[#FBBF24]">
                <Printer className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1C1512] dark:text-white">Dual delivery channels</h3>
              <p className="text-xs sm:text-sm text-[#57534E] dark:text-stone-300 leading-relaxed">
                Publish exams directly to online student consoles with automated grading, or export verified print-ready PDF exam papers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THREE STEP WORKFLOW */}
      <section className="section bg-[#FAF8F5] dark:bg-[#1C1512] border-b border-[#E2E8F0] dark:border-stone-800">
        <div className="container space-y-8 text-start">
          <SectionHeader
            title="How teachers generate exams in 3 steps"
            subtitle="Draft, verify, and publish curriculum-aligned assessments in minutes."
          />
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-[12px] bg-white dark:bg-[#261E1A]/40 border border-[#E2E8F0] dark:border-stone-800 space-y-3">
              <span className="text-xs font-mono font-bold text-[#881337] dark:text-[#FBBF24] px-2.5 py-1 rounded bg-[#FFF1F2] dark:bg-[#881337]/20 border border-[#FECDD3] dark:border-[#881337]/40 inline-block">Step 1</span>
              <h3 className="text-base font-bold text-[#1C1512] dark:text-white">Select curriculum units</h3>
              <p className="text-xs sm:text-sm text-[#57534E] dark:text-stone-300">Choose secondary grade level and target syllabus units with custom item counts.</p>
            </div>
            <div className="p-6 rounded-[12px] bg-white dark:bg-[#261E1A]/40 border border-[#E2E8F0] dark:border-stone-800 space-y-3">
              <span className="text-xs font-mono font-bold text-[#881337] dark:text-[#FBBF24] px-2.5 py-1 rounded bg-[#FFF1F2] dark:bg-[#881337]/20 border border-[#FECDD3] dark:border-[#881337]/40 inline-block">Step 2</span>
              <h3 className="text-base font-bold text-[#1C1512] dark:text-white">Verify questions and rubrics</h3>
              <p className="text-xs sm:text-sm text-[#57534E] dark:text-stone-300">Review generated items, swap distractors, or insert custom departmental questions.</p>
            </div>
            <div className="p-6 rounded-[12px] bg-white dark:bg-[#261E1A]/40 border border-[#E2E8F0] dark:border-stone-800 space-y-3">
              <span className="text-xs font-mono font-bold text-[#881337] dark:text-[#FBBF24] px-2.5 py-1 rounded bg-[#FFF1F2] dark:bg-[#881337]/20 border border-[#FECDD3] dark:border-[#881337]/40 inline-block">Step 3</span>
              <h3 className="text-base font-bold text-[#1C1512] dark:text-white">Assign online or print</h3>
              <p className="text-xs sm:text-sm text-[#57534E] dark:text-stone-300">Publish to student sections for online sitting or export print-ready PDF exam papers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. STUDENT DETAIL & CONTINUOUS ASSESSMENT GRADEBOOK */}
      <section className="section bg-white dark:bg-[#1C1512] border-b border-[#E2E8F0] dark:border-stone-800">
        <div className="container space-y-12">
          <SectionHeader
            title="Section gradebooks and student progress"
            subtitle="Real-time gradebooks allow teachers to inspect topic-level errors and calculate continuous assessment totals."
          />

          <div className="grid md:grid-cols-3 gap-8 text-start">
            <div className="p-8 rounded-[12px] bg-[#FAF8F5] dark:bg-[#261E1A]/40 border border-[#E2E8F0] dark:border-stone-800 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5 space-y-4">
              <div className="w-12 h-12 rounded-[8px] bg-white dark:bg-[#1C1512] border border-[#FECDD3] dark:border-[#881337]/40 flex items-center justify-center text-[#881337] dark:text-[#FBBF24]">
                <FileSpreadsheet className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-[#1C1512] dark:text-white">Continuous assessment gradebooks</h3>
              <p className="text-sm sm:text-base text-[#57534E] dark:text-stone-300 leading-relaxed">
                Test scores populate directly into continuous assessment sheets with customizable weighting and instant PDF export.
              </p>
            </div>

            <div className="p-8 rounded-[12px] bg-[#FAF8F5] dark:bg-[#261E1A]/40 border border-[#E2E8F0] dark:border-stone-800 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5 space-y-4">
              <div className="w-12 h-12 rounded-[8px] bg-white dark:bg-[#1C1512] border border-[#FECDD3] dark:border-[#881337]/40 flex items-center justify-center text-[#881337] dark:text-[#FBBF24]">
                <Layers className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-[#1C1512] dark:text-white">Sub-competency breakdown</h3>
              <p className="text-sm sm:text-base text-[#57534E] dark:text-stone-300 leading-relaxed">
                Inspect performance by curriculum objective to determine whether score drops stem from calculation errors or conceptual gaps.
              </p>
            </div>

            <div className="p-8 rounded-[12px] bg-[#FAF8F5] dark:bg-[#261E1A]/40 border border-[#E2E8F0] dark:border-stone-800 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5 space-y-4">
              <div className="w-12 h-12 rounded-[8px] bg-white dark:bg-[#1C1512] border border-[#FECDD3] dark:border-[#881337]/40 flex items-center justify-center text-[#881337] dark:text-[#FBBF24]">
                <Clock className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-[#1C1512] dark:text-white">Pacing and time tracking</h3>
              <p className="text-sm sm:text-base text-[#57534E] dark:text-stone-300 leading-relaxed">
                Inspect time spent per question to identify students who rush through reading passages or struggle with quantitative items.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FINAL CALL TO ACTION */}
      <section className="section bg-[#4C0519] text-white">
        <div className="container space-y-8 text-start">
          <SectionHeader
            invertColors
            title="Equip your teachers with curriculum assessment tools"
            subtitle="Connect with our educational team to get started or explore curriculum question banks for your subject."
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

export { TeachersPage as ForTeachersPage };
