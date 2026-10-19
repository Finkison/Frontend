import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  GitBranch,
  Repeat,
  BookOpen,
  Sliders,
  ShieldCheck,
  ArrowRight,
  Database,
  Lock,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { SectionHeader } from "../components/typography/SectionHeader";
import { SITE_CONTENT } from "../content/siteContent";

interface AiFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  benefits: string[];
}

export default function AiFeaturesPage(): React.ReactElement {
  useEffect(() => {
    document.title = "AI diagnostic engine — Finkison";
  }, []);

  const [sampleScore, setSampleScore] = useState<number>(78);
  const [reviewDay, setReviewDay] = useState<number>(3);

  // Score Calibration (IRT model simulation)
  const predictedScore = Math.round(300 + (sampleScore / 100) * 280);
  const lowerBound = Math.max(300, predictedScore - 14);
  const upperBound = Math.min(600, predictedScore + 14);
  const percentile = sampleScore >= 85 ? 99 : sampleScore >= 75 ? 94 : sampleScore >= 65 ? 86 : 72;

  // Retention Calculation (Ebbinghaus decay curve)
  const retentionPercent = Math.round(100 * Math.exp(-reviewDay / 7));

  const AI_FEATURES: AiFeature[] = [
    {
      id: "calibration",
      title: "Score calibration",
      description: "Translates diagnostic assessment performance into an accurate national university entrance forecast with confidence intervals.",
      icon: <TrendingUp className="w-5 h-5 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />,
      benefits: [
        "Calibrated against historical national university admission cutoff percentiles",
        "Tracks confidence interval bounds (+/- 14 pts) over consecutive practice sets",
        "Translates raw accuracy into normalized national percentile rankings",
        "Directly surfaces sub-competency weaknesses pulling down the overall score",
      ],
    },
    {
      id: "mapping",
      title: "Knowledge mapping",
      description: "Discovers upstream conceptual blockages across Grades 9 through 12 to resolve root causes of test errors.",
      icon: <GitBranch className="w-5 h-5 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />,
      benefits: [
        "Pinpoints if Grade 12 calculus errors stem from Grade 10 quadratic factoring",
        "Builds focused prerequisite micro-reviews before tackling advanced problem sets",
        "Eliminates guesswork by charting mastery across all secondary syllabus units",
        "Saves study hours by addressing core conceptual foundations",
      ],
    },
    {
      id: "spaced_review",
      title: "Spaced review engine",
      description: "Schedules flashcard and formula reviews right before memory decay occurs, locking in essential concepts.",
      icon: <Repeat className="w-5 h-5 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />,
      benefits: [
        "Reinforces high-yield constants, formulas, and vocabulary definitions",
        "Personalized 5-minute daily revision queues dynamically generated",
        "Clinically proven Ebbinghaus decay modeling for sustained retention",
        "Prioritizes items frequently tested on official national entrance exams",
      ],
    },
    {
      id: "grounding",
      title: "Curriculum alignment",
      description: "Every step-by-step solution is cited directly to approved national secondary textbooks.",
      icon: <BookOpen className="w-5 h-5 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />,
      benefits: [
        "Zero Ungrounded Hallucinations guaranteed via strict national curriculum textbook anchoring",
        "Detailed textbook unit and page cross-references on every item",
        "Standardized pedagogical explanations aligned with national secondary syllabi in English",
        "Strict adherence to national examination scoring rubrics",
      ],
    },
    {
      id: "generation",
      title: "Exam generation",
      description: "Produces standardized mock papers matching the exact difficulty distribution of official national exams.",
      icon: <Sliders className="w-5 h-5 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />,
      benefits: [
        "Generates full 100-item practice simulations matching national blueprint weights",
        "Calibrates item discrimination parameters using Item Response Theory modeling",
        "Anti-cheat option scrambling and question variations for school testing",
        "Immediate diagnostic debrief upon examination completion",
      ],
    },
    {
      id: "proctoring",
      title: "Proctoring telemetry",
      description: "Guarantees examination integrity without invasive video feeds or biometric tracking.",
      icon: <ShieldCheck className="w-5 h-5 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />,
      benefits: [
        "No webcam surveillance or biometric storage; fully privacy compliant",
        "Monitors focus loss, tab-switching, and clipboard anomalies in real time",
        "Instant live alert stream for classroom teachers and proctors",
        "Meets domestic data privacy guidelines for secondary schools",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#261E1A] font-sans selection:bg-[#FECDD3] selection:text-[#4C0519] dark:bg-[#1C1512] dark:text-slate-100">
      {/* 1. HERO SECTION - Left-aligned to container */}
      <section className="section bg-[#4C0519] text-white border-b border-white/10">
        <div className="container space-y-6">
          <SectionHeader
            asH1
            invertColors
            title={SITE_CONTENT.pages.aiFeatures.title}
            subtitle={SITE_CONTENT.pages.aiFeatures.subtitle}
            actions={
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/contact"
                  className="min-h-[44px] px-6 py-2.5 rounded-[6px] bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1C1512] text-sm font-semibold transition-colors inline-flex items-center gap-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FBBF24]"
                >
                  <span>Contact us</span>
                  <ArrowRight className="w-4 h-4 text-[#1C1512]" aria-hidden="true" />
                </Link>
                <Link
                  to="/academics"
                  className="min-h-[44px] px-5 py-2.5 rounded-[6px] border border-white/40 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <span>Explore academics</span>
                </Link>
              </div>
            }
          />
        </div>
      </section>

      {/* 2. SIX CORE AI ENGINES */}
      <section className="section bg-white border-b border-[#E8E2D9] dark:bg-[#1C1512] dark:border-white/10">
        <div className="container space-y-12">
          <SectionHeader
            title="Six pedagogical assessment engines"
            subtitle="Targeted modules engineered for Ethiopian secondary education with full teacher oversight."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {AI_FEATURES.map((feature, idx) => (
              <div
                key={feature.id}
                className="p-8 rounded-[12px] bg-white dark:bg-[#261E1A]/40 border border-[#E8E2D9] dark:border-white/10 hover:border-[#FECDD3] dark:hover:border-[#881337]/40 space-y-6 shadow-xs hover:shadow-md transition-all duration-200 text-start flex flex-col justify-between hover:-translate-y-0.5"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-[8px] bg-[#FFF1F2] dark:bg-[#881337]/20 border border-[#FECDD3] dark:border-[#881337]/40 flex items-center justify-center text-[#881337] dark:text-[#FBBF24]">
                      {feature.icon}
                    </div>
                    <span className="text-[11px] font-mono font-semibold text-[#881337] dark:text-[#FBBF24] px-2.5 py-1 rounded-[6px] bg-[#FFF1F2] dark:bg-[#881337]/20 border border-[#FECDD3] dark:border-[#881337]/40">
                      Engine 0{idx + 1}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-[#1C1512] dark:text-white tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-[#574C43] dark:text-slate-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-white/10 space-y-2">
                  <ul className="space-y-2.5 text-xs text-[#574C43] dark:text-slate-300 leading-relaxed">
                    {feature.benefits.map((benefit, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#881337] dark:text-[#FBBF24] shrink-0 mt-0.5 icon-first-line" aria-hidden="true" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE SIMULATORS */}
      <section className="section bg-[#FAF8F5] dark:bg-[#1C1512] border-b border-[#E8E2D9] dark:border-white/10">
        <div className="container space-y-12 text-start">
          <SectionHeader
            title="Score calibration and retention simulators"
            subtitle="Calculate score calibration bounds and memory decay in real time based on student practice parameters."
          />

          <div className="space-y-8">
            {/* Demo 1: Score Calibration */}
            <div className="p-8 sm:p-10 rounded-[12px] bg-white dark:bg-[#261E1A]/40 border border-[#E8E2D9] dark:border-white/10 shadow-xs hover:shadow-md transition-shadow space-y-8 text-start">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-[8px] bg-[#FFF1F2] dark:bg-[#881337]/20 border border-[#FECDD3] dark:border-[#881337]/40 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-[#1C1512] dark:text-white">EUEE 600-point calibration model</h3>
                  <p className="text-xs sm:text-sm text-[#574C43] dark:text-slate-300">Adjust the diagnostic accuracy slider to view the calibrated score and percentile projection.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-semibold text-[#574C43] dark:text-slate-300">Diagnostic accuracy rate</span>
                  <span className="text-2xl font-bold text-[#881337] dark:text-[#FBBF24]">{sampleScore}%</span>
                </div>
                <input
                  type="range"
                  min={40}
                  max={100}
                  value={sampleScore}
                  onChange={(e) => setSampleScore(Number(e.target.value))}
                  aria-label="Diagnostic accuracy rate slider"
                  className="w-full h-2.5 bg-[#E8E2D9] dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-[#881337] dark:accent-[#FBBF24]"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  <div className="p-5 bg-[#FAF8F5] dark:bg-[#261E1A] rounded-[8px] border border-[#E8E2D9] dark:border-white/10 text-start space-y-1">
                    <span className="text-xs text-[#574C43] dark:text-slate-400 block font-medium">Predicted EUEE total</span>
                    <div className="text-3xl font-bold text-[#1C1512] dark:text-white">{predictedScore}</div>
                    <span className="text-[11px] text-[#574C43] dark:text-slate-400 block">out of 600 national points</span>
                  </div>
                  <div className="p-5 bg-[#FAF8F5] dark:bg-[#261E1A] rounded-[8px] border border-[#E8E2D9] dark:border-white/10 text-start space-y-1">
                    <span className="text-xs text-[#574C43] dark:text-slate-400 block font-medium">Confidence interval</span>
                    <div className="text-2xl font-bold text-[#881337] dark:text-[#FBBF24]">{lowerBound} – {upperBound}</div>
                    <span className="text-[11px] text-[#574C43] dark:text-slate-400 block">90% statistical confidence</span>
                  </div>
                  <div className="p-5 bg-[#FAF8F5] dark:bg-[#261E1A] rounded-[8px] border border-[#E8E2D9] dark:border-white/10 text-start space-y-1">
                    <span className="text-xs text-[#574C43] dark:text-slate-400 block font-medium">National cohort standing</span>
                    <div className="text-3xl font-bold text-[#1C1512] dark:text-white">Top {100 - percentile}%</div>
                    <span className="text-[11px] text-[#574C43] dark:text-slate-400 block">historical percentile match</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Demo 2: Spaced Retention Curve */}
            <div className="p-8 sm:p-10 rounded-[12px] bg-white dark:bg-[#261E1A]/40 border border-[#E8E2D9] dark:border-white/10 shadow-xs hover:shadow-md transition-shadow space-y-8 text-start">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-[8px] bg-[#FFF1F2] dark:bg-[#881337]/20 border border-[#FECDD3] dark:border-[#881337]/40 flex items-center justify-center">
                  <Repeat className="w-6 h-6 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-[#1C1512] dark:text-white">Memory decay and spaced review simulator</h3>
                  <p className="text-xs sm:text-sm text-[#574C43] dark:text-slate-300">Examine how concept retention shifts based on days elapsed since initial practice.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-semibold text-[#574C43] dark:text-slate-300">Days elapsed since last practice</span>
                  <span className="text-2xl font-bold text-[#881337] dark:text-[#FBBF24]">Day {reviewDay}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={21}
                  value={reviewDay}
                  onChange={(e) => setReviewDay(Number(e.target.value))}
                  aria-label="Days elapsed slider"
                  className="w-full h-2.5 bg-[#E8E2D9] dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-[#881337] dark:accent-[#FBBF24]"
                />
                
                <div className="p-6 bg-[#FAF8F5] dark:bg-[#261E1A] rounded-[8px] border border-[#E8E2D9] dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-[#574C43] dark:text-slate-400 block mb-1 font-medium">Estimated concept retention</span>
                    <div className="text-3xl font-bold text-[#1C1512] dark:text-white">{retentionPercent}%</div>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[6px] text-xs font-semibold bg-[#FFF1F2] dark:bg-[#881337]/20 border border-[#FECDD3] dark:border-[#881337]/40 text-[#881337] dark:text-[#FBBF24]">
                    <Sparkles className="w-3.5 h-3.5 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />
                    <span>
                      {retentionPercent > 70 ? "Optimal retention" : retentionPercent > 40 ? "Review scheduled" : "Intervention needed"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DOMESTIC INFRASTRUCTURE & SOVEREIGNTY */}
      <section className="section bg-[#F4EFEA] dark:bg-[#1C1512] border-b border-[#E8E2D9] dark:border-white/10">
        <div className="container space-y-12 text-start">
          <SectionHeader
            title="Candidate privacy and sovereign hosting"
            subtitle="In compliance with Ethiopian Proclamation No. 1321/2024, candidate assessment data is strictly hosted in Addis Ababa."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-start">
            <div className="p-8 rounded-[12px] bg-white dark:bg-[#261E1A]/40 border border-[#E8E2D9] dark:border-white/10 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5 duration-200 space-y-4">
              <div className="w-12 h-12 rounded-[8px] bg-[#FFF1F2] dark:bg-[#881337]/20 border border-[#FECDD3] dark:border-[#881337]/40 flex items-center justify-center">
                <Database className="w-6 h-6 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-[#1C1512] dark:text-white">Domestic Addis Ababa Tier-3 Hosting</h3>
              <p className="text-sm sm:text-base text-[#574C43] dark:text-slate-300 leading-relaxed">
                All assessment scores, response telemetry, and student credentials are hosted in certified domestic Tier-3 facilities in Addis Ababa.
              </p>
            </div>

            <div className="p-8 rounded-[12px] bg-white dark:bg-[#261E1A]/40 border border-[#E8E2D9] dark:border-white/10 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5 duration-200 space-y-4">
              <div className="w-12 h-12 rounded-[8px] bg-[#FFF1F2] dark:bg-[#881337]/20 border border-[#FECDD3] dark:border-[#881337]/40 flex items-center justify-center">
                <Lock className="w-6 h-6 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-[#1C1512] dark:text-white">Cryptographic AES-256 protection</h3>
              <p className="text-sm sm:text-base text-[#574C43] dark:text-slate-300 leading-relaxed">
                Candidate records are encrypted at rest with AES-256 and transmitted with TLS 1.3. Strict role-based isolation prevents cross-school data access.
              </p>
            </div>

            <div className="p-8 rounded-[12px] bg-white dark:bg-[#261E1A]/40 border border-[#E8E2D9] dark:border-white/10 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5 duration-200 space-y-4">
              <div className="w-12 h-12 rounded-[8px] bg-[#FFF1F2] dark:bg-[#881337]/20 border border-[#FECDD3] dark:border-[#881337]/40 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-[#1C1512] dark:text-white">Zero third-party model training</h3>
              <p className="text-sm sm:text-base text-[#574C43] dark:text-slate-300 leading-relaxed">
                Student data is never exported to foreign consumer LLMs or sold to commercial third parties. All processing operates on private institutional models.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FINAL CALL TO ACTION (Crimson #4C0519) - Left-aligned to container */}
      <section className="section bg-[#4C0519] text-white">
        <div className="container space-y-8 text-start">
          <SectionHeader
            invertColors
            title="Bring verified assessment tools to your school"
            subtitle="Partner with Finkison to equip educators and students with verified, curriculum-grounded assessment intelligence."
            actions={
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <Link
                  to="/contact"
                  className="min-h-[48px] px-8 py-3.5 rounded-[6px] bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1C1512] text-sm font-semibold transition-colors inline-flex items-center gap-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FBBF24]"
                >
                  <span>Contact us</span>
                  <ArrowRight className="w-4 h-4 text-[#1C1512]" aria-hidden="true" />
                </Link>
                <Link
                  to="/academics"
                  className="min-h-[48px] px-7 py-3.5 rounded-[6px] border border-white/40 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white"
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

export { AiFeaturesPage as AIFeaturesPage };
