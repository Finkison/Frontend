import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  TrendingUp,
  Award,
  ArrowRight,
  Calendar,
  ShieldCheck,
  Target,
  FileCheck,
  Layers,
  GraduationCap,
} from "lucide-react";
import { SectionHeader } from "../components/typography/SectionHeader";
import { SITE_CONTENT } from "../content/siteContent";

export default function StudentsPage(): React.ReactElement {
  useEffect(() => {
    document.title = "Students — Finkison";
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#261E1A] font-sans selection:bg-[#FFF1F2] selection:text-[#881337] dark:bg-[#1C1512] dark:text-stone-100">
      {/* 1. HERO SECTION */}
      <section className="section bg-[#4C0519] text-white border-b border-white/10">
        <div className="container space-y-6">
          <SectionHeader
            asH1
            invertColors
            title={SITE_CONTENT.pages.forStudents.title}
            subtitle={SITE_CONTENT.pages.forStudents.subtitle}
            actions={
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/register?role=student"
                  className="min-h-[44px] px-6 py-2.5 rounded-[6px] bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1C1512] text-sm font-semibold transition-colors inline-flex items-center gap-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#881337] active:scale-[0.98]"
                >
                  <span>Get started</span>
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

      {/* 2. DIAGNOSTIC MASTERY & PREPARATION ARCHITECTURE */}
      <section className="section bg-white border-b border-[#E2E8F0] dark:bg-[#1C1512] dark:border-stone-800">
        <div className="container space-y-12">
          <SectionHeader
            title="Syllabus diagnostics and entrance preparation"
            subtitle="Master core curriculum concepts, practice with authentic national papers, and track university entrance readiness."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-start">
            <div className="p-6 rounded-[12px] bg-[#FAF8F5] dark:bg-[#261E1A]/40 border border-[#E2E8F0] dark:border-stone-800 space-y-3">
              <div className="w-10 h-10 rounded-[8px] bg-white dark:bg-[#1C1512] border border-[#FECDD3] dark:border-[#881337]/40 flex items-center justify-center text-[#881337] dark:text-[#FBBF24]">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1C1512] dark:text-white">Diagnostic knowledge mapping</h3>
              <p className="text-xs sm:text-sm text-[#57534E] dark:text-stone-300 leading-relaxed">
                Adaptive diagnostics trace prerequisite foundational concepts across Grades 9 through 12 to resolve root learning gaps.
              </p>
            </div>

            <div className="p-6 rounded-[12px] bg-[#FAF8F5] dark:bg-[#261E1A]/40 border border-[#E2E8F0] dark:border-stone-800 space-y-3">
              <div className="w-10 h-10 rounded-[8px] bg-white dark:bg-[#1C1512] border border-[#FECDD3] dark:border-[#881337]/40 flex items-center justify-center text-[#881337] dark:text-[#FBBF24]">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1C1512] dark:text-white">National past paper archive</h3>
              <p className="text-xs sm:text-sm text-[#57534E] dark:text-stone-300 leading-relaxed">
                Authentic 2008–2016 E.C. national entrance examinations with official step-by-step worked solutions and marking rubrics.
              </p>
            </div>

            <div className="p-6 rounded-[12px] bg-[#FAF8F5] dark:bg-[#261E1A]/40 border border-[#E2E8F0] dark:border-stone-800 space-y-3">
              <div className="w-10 h-10 rounded-[8px] bg-white dark:bg-[#1C1512] border border-[#FECDD3] dark:border-[#881337]/40 flex items-center justify-center text-[#881337] dark:text-[#FBBF24]">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1C1512] dark:text-white">Bayesian score prediction</h3>
              <p className="text-xs sm:text-sm text-[#57534E] dark:text-stone-300 leading-relaxed">
                600-point national entrance score projections calibrated against historical university cutoffs with confidence bounds.
              </p>
            </div>

            <div className="p-6 rounded-[12px] bg-[#FAF8F5] dark:bg-[#261E1A]/40 border border-[#E2E8F0] dark:border-stone-800 space-y-3">
              <div className="w-10 h-10 rounded-[8px] bg-white dark:bg-[#1C1512] border border-[#FECDD3] dark:border-[#881337]/40 flex items-center justify-center text-[#881337] dark:text-[#FBBF24]">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1C1512] dark:text-white">Spaced revision schedule</h3>
              <p className="text-xs sm:text-sm text-[#57534E] dark:text-stone-300 leading-relaxed">
                Algorithmic scheduling queues review questions right before memory decay sets in, cementing long-term exam retention.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOUNDATIONAL MASTERY & LESSON OUTLINES */}
      <section className="section bg-[#FAF8F5] dark:bg-[#1C1512] border-b border-[#E2E8F0] dark:border-stone-800">
        <div className="container space-y-16">
          <SectionHeader
            title="Curriculum lessons, adaptive practice, and past papers"
            subtitle="Work through organized textbook units, inspect step-by-step derivations, and test your skills at your own pace."
          />

          <div className="grid md:grid-cols-3 gap-8 text-start">
            <div className="p-8 rounded-[12px] bg-white dark:bg-[#261E1A]/40 border border-[#E2E8F0] dark:border-stone-800 hover:border-[#FECDD3] dark:hover:border-[#881337]/40 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5 duration-200 space-y-4">
              <div className="w-12 h-12 rounded-[8px] bg-[#FFF1F2] dark:bg-[#881337]/20 border border-[#FECDD3] dark:border-[#881337]/40 flex items-center justify-center text-[#881337] dark:text-[#FBBF24]">
                <BookOpen className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-[#1C1512] dark:text-white">Textbook lesson outlines</h3>
              <p className="text-sm sm:text-base text-[#57534E] dark:text-stone-300 leading-relaxed">
                Structured unit summaries synthesized from official textbooks, highlighting core formulas, theorem proofs, and definitions.
              </p>
            </div>

            <div className="p-8 rounded-[12px] bg-white dark:bg-[#261E1A]/40 border border-[#E2E8F0] dark:border-stone-800 hover:border-[#FECDD3] dark:hover:border-[#881337]/40 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5 duration-200 space-y-4">
              <div className="w-12 h-12 rounded-[8px] bg-[#FFF1F2] dark:bg-[#881337]/20 border border-[#FECDD3] dark:border-[#881337]/40 flex items-center justify-center text-[#881337] dark:text-[#FBBF24]">
                <TrendingUp className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-[#1C1512] dark:text-white">Step-by-step worked solutions</h3>
              <p className="text-sm sm:text-base text-[#57534E] dark:text-stone-300 leading-relaxed">
                Clear mathematical and conceptual breakdowns for challenging questions, cross-referenced to syllabus units.
              </p>
            </div>

            <div className="p-8 rounded-[12px] bg-white dark:bg-[#261E1A]/40 border border-[#E2E8F0] dark:border-stone-800 hover:border-[#FECDD3] dark:hover:border-[#881337]/40 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5 duration-200 space-y-4">
              <div className="w-12 h-12 rounded-[8px] bg-[#FFF1F2] dark:bg-[#881337]/20 border border-[#FECDD3] dark:border-[#881337]/40 flex items-center justify-center text-[#881337] dark:text-[#FBBF24]">
                <Award className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-[#1C1512] dark:text-white">Official national archives</h3>
              <p className="text-sm sm:text-base text-[#57534E] dark:text-stone-300 leading-relaxed">
                Authentic national examination papers from 2008 to 2016 E.C. with verified answer keys and scoring rubrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. STUDY RESILIENCE */}
      <section className="section bg-white border-b border-[#E2E8F0] dark:bg-[#1C1512] dark:border-stone-800">
        <div className="container space-y-12">
          <SectionHeader
            title="Examination autosave and offline resilience"
            subtitle="Finkison preserves your test progress safely even if your internet connection fluctuates."
          />

          <div className="grid md:grid-cols-2 gap-8 text-start">
            <div className="p-8 rounded-[12px] bg-[#FAF8F5] dark:bg-[#261E1A]/40 border border-[#E2E8F0] dark:border-stone-800 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5 duration-200 space-y-4">
              <div className="w-12 h-12 rounded-[8px] bg-white dark:bg-[#1C1512] border border-[#FECDD3] dark:border-[#881337]/40 flex items-center justify-center text-[#881337] dark:text-[#FBBF24]">
                <ShieldCheck className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-[#1C1512] dark:text-white">Autosave on every answer</h3>
              <p className="text-sm sm:text-base text-[#57534E] dark:text-stone-300 leading-relaxed">
                Every answer saves locally the instant it is selected, ensuring uninterrupted practice during power or network outages.
              </p>
            </div>

            <div className="p-8 rounded-[12px] bg-[#FAF8F5] dark:bg-[#261E1A]/40 border border-[#E2E8F0] dark:border-stone-800 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5 duration-200 space-y-4">
              <div className="w-12 h-12 rounded-[8px] bg-white dark:bg-[#1C1512] border border-[#FECDD3] dark:border-[#881337]/40 flex items-center justify-center text-[#881337] dark:text-[#FBBF24]">
                <GraduationCap className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-[#1C1512] dark:text-white">University placement alignment</h3>
              <p className="text-sm sm:text-base text-[#57534E] dark:text-stone-300 leading-relaxed">
                Compare your target scores against official university faculty cutoff benchmarks across public institutions in Ethiopia.
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
            title="Begin your curriculum preparation today"
            subtitle="Create your candidate profile or review secondary syllabus requirements across Grades 9, 10, 11, and 12."
            actions={
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <Link
                  to="/register?role=student"
                  className="min-h-[48px] px-8 py-3.5 rounded-[6px] bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1C1512] text-sm font-semibold transition-colors inline-flex items-center gap-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#881337] active:scale-[0.98]"
                >
                  <span>Get started</span>
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

export { StudentsPage as ForStudentsPage };
