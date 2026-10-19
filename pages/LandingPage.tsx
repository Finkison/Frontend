import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  GraduationCap,
  BookOpen,
  Award,
  Check,
  Quote,
  TrendingUp,
  FlaskConical,
  FileText,
} from "lucide-react";

import {
  HeroCarousel,
  PricingSection,
  StatsCounter,
} from "../components/landing";
import {
  Accordion,
  BackToTop,
  CookieBanner,
} from "../components/ui";
import { SectionHeader } from "../components/typography/SectionHeader";
import { SITE_CONTENT } from "../content/siteContent";

export default function LandingPage(): React.ReactElement {
  // Core Pedagogical Value System: Learn • Innovate • Achieve
  const CORE_VALUES = [
    {
      step: "01",
      pillar: "Learn",
      title: "Concept-first curriculum mastery",
      tagline: "Deep secondary syllabus understanding",
      description:
        "Structured unit breakdowns covering Grades 9 through 12. Deconstruct complex formulas, theorems, and definitions with verified step-by-step problem derivations.",
      bullets: [
        "Grades 9–12 national textbook alignment",
        "Step-by-step mathematical & scientific derivations",
        "Clear conceptual grounding over rote memorization",
      ],
      link: "/academics",
      linkText: "Explore curriculum tracks",
    },
    {
      step: "02",
      pillar: "Innovate",
      title: "Interactive STEM labs & adaptive diagnostics",
      tagline: "Visual simulation & weakness targeting",
      description:
        "Manipulate physics wave mechanics, chemistry molecular orbitals, and genetics in real time. Adaptive diagnostics pinpoint foundational learning gaps before exam day.",
      bullets: [
        "Interactive virtual science laboratories",
        "Diagnostic prerequisite knowledge mapping",
        "Algorithmic spaced repetition for long-term recall",
      ],
      link: "/ai-features",
      linkText: "Explore STEM & diagnostic engines",
    },
    {
      step: "03",
      pillar: "Achieve",
      title: "Verifiable examination mastery & confidence",
      tagline: "Authentic national entrance readiness",
      description:
        "Practice with authentic 2008–2016 national entrance past papers paired with official worked solutions, rubrics, and 3-hour timed simulations.",
      bullets: [
        "Complete 2008–2016 E.C. past examination archive",
        "Official worked solutions and marking rubrics",
        "Timed national examination practice simulations",
      ],
      link: "/for-students",
      linkText: "Explore candidate preparation",
    },
  ];

  // Secondary Academic Streams
  const CURRICULUM_TRACKS = [
    {
      icon: <GraduationCap className="w-6 h-6 text-[#881337]" aria-hidden="true" />,
      title: "Natural Science stream",
      grade: "Grades 11 and 12",
      description: "Advanced Physics, Chemistry, Biology, and Natural Mathematics for engineering and medicine university placements.",
      link: "/academics",
    },
    {
      icon: <BookOpen className="w-6 h-6 text-[#881337]" aria-hidden="true" />,
      title: "Social Science stream",
      grade: "Grades 11 and 12",
      description: "Comprehensive Economics, Geography, History, and Social Mathematics for humanities and business placements.",
      link: "/academics",
    },
    {
      icon: <Building2 className="w-6 h-6 text-[#881337]" aria-hidden="true" />,
      title: "Secondary foundation",
      grade: "Grades 9 and 10",
      description: "Unified national curriculum establishing core competency benchmarks across General Science, Mathematics, and English.",
      link: "/academics",
    },
    {
      icon: <Award className="w-6 h-6 text-[#881337]" aria-hidden="true" />,
      title: "EUEE national revision",
      grade: "Candidate senior cohorts",
      description: "Authentic 2008–2016 past papers, timed entrance simulations, and Bayesian score prediction (+/- 14 points).",
      link: "/academics",
    },
  ];

  // Grounded Pedagogical Perspectives with Empirical Institutional Standards
  const TESTIMONIALS = [
    {
      quote: "Syllabus-balanced exam generation with verified keys has transformed our departmental preparation. Teachers focus directly on resolving student learning gaps.",
      author: "Senior Academic Dean",
      role: "Secondary School Leadership",
      school: "Preparatory Curriculum Division",
      region: "Addis Ababa",
      metricBadge: "Curriculum Blueprints",
    },
    {
      quote: "Step-by-step worked solutions for Grade 12 past papers gave our candidates complete clarity on official entrance marking schemes before exam day.",
      author: "Natural Sciences Lead",
      role: "Physics & Chemistry Department",
      school: "Secondary Science Faculty",
      region: "Hawassa",
      metricBadge: "Worked Solutions",
    },
    {
      quote: "Diagnostic score calibration pinpointed exactly which foundational topics were holding back my entrance scores. Spaced review kept formulas fresh all semester.",
      author: "Senior Candidate Scholar",
      role: "Grade 12 Entrance Matriculation",
      school: "Pre-Engineering Track",
      region: "Adama",
      metricBadge: "Score Calibration",
    },
  ];

  // Frequently Asked Questions
  const FAQS = [
    {
      id: "curriculum-fidelity",
      question: "How does Finkison support student preparation for national exams?",
      answer: "All practice sets and question banks adhere directly to the Ethiopian General Education Curriculum Framework (EGECF). Adaptive diagnostics target prerequisite gaps early across secondary subjects.",
    },
    {
      id: "exam-analytics",
      question: "How does the diagnostic scoring model calculate university entrance readiness?",
      answer: "The platform uses Item Response Theory algorithms calibrated against Ethiopian national examination standards to provide accurate score predictions and prerequisite gap analyses.",
    },
    {
      id: "homeroom-roster",
      question: "How does a school director assign teachers to classroom sections?",
      answer: "School directors create homeroom sections and assign verified subject educators through the portal. Teachers access only the rosters and gradebooks for their designated classes.",
    },
    {
      id: "ai-safeguards",
      question: "What controls do teachers have over AI-generated examinations?",
      answer: "Teachers retain complete editorial control. Educators review every question stem, edit distractors, swap items from the repository, and approve the paper before it is published.",
    },
    {
      id: "sovereign-hosting",
      question: "How are student privacy and institutional records protected?",
      answer: "All candidate submissions and study records are protected with industry-standard AES-256 encryption. Student data is strictly confidential, never sold, and never used to train commercial AI models.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 font-sans selection:bg-[#FECDD3] selection:text-[#4C0519] transition-colors">
      {/* SECTION 1: HERO */}
      <HeroCarousel />

      {/* SECTION 2: CORE VALUES — LEARN, INNOVATE, ACHIEVE */}
      <section className="section bg-white border-b border-stone-200" aria-labelledby="core-values-heading">
        <div className="container space-y-12">
          <SectionHeader
            id="core-values-heading"
            title={SITE_CONTENT.landing.partners.title}
            subtitle={SITE_CONTENT.landing.partners.subtitle}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch text-start">
            {CORE_VALUES.map((val) => (
              <div
                key={val.step}
                className="p-8 rounded-2xl bg-[#FAF8F5] border border-stone-200 hover:border-[#881337]/40 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group space-y-6"
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#881337] bg-[#FFF1F2] border border-[#FECDD3] px-3 py-1 rounded-full inline-flex items-center gap-1.5 font-mono">
                      <span>Pillar {val.step}</span>
                      <span>•</span>
                      <span>{val.pillar}</span>
                    </span>
                    <span className="text-2xl font-black text-stone-200 group-hover:text-[#881337]/30 transition-colors font-mono">
                      {val.step}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-stone-900 leading-snug">
                      {val.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#881337]">
                      {val.tagline}
                    </p>
                    <p className="text-sm text-stone-600 leading-relaxed pt-1">
                      {val.description}
                    </p>
                  </div>

                  <ul className="space-y-2.5 pt-2 text-xs sm:text-sm text-stone-700">
                    {val.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-[#881337] shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-stone-200/80">
                  <Link
                    to={val.link}
                    className="text-xs sm:text-sm font-semibold text-[#881337] hover:text-[#9F1239] inline-flex items-center gap-1.5 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>{val.linkText}</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: FEATURES (Institutional Architectural Capabilities) */}
      <section className="section bg-[#FAF8F5] border-b border-stone-200" aria-labelledby="features-heading">
        <div className="container space-y-16">
          <SectionHeader
            id="features-heading"
            title={SITE_CONTENT.landing.featuresHeader.title}
            subtitle={SITE_CONTENT.landing.featuresHeader.subtitle}
          />

          {/* Academic Bento Grid: Clean, Authoritative Institutional Capabilities */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Bento Card 1: Diagnostic Intelligence with Bayesian Score Prediction (Col 7) */}
            <div className="lg:col-span-7 rounded-2xl bg-white border border-stone-200/90 shadow-xs hover:shadow-md transition-all p-6 sm:p-8 flex flex-col justify-between text-start space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#881337] bg-[#FFF1F2] border border-[#FECDD3] px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-[#881337]" aria-hidden="true" />
                    <span>Psychometric AI Engine</span>
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-stone-900 leading-snug">
                  Target foundational knowledge gaps before exam day
                </h3>
                <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                  Predict entrance exam cutoffs and eliminate knowledge deficits using psychometric analytics and syllabus-grounded learning curves.
                </p>

                {/* Mandatory Psychometric Compliance Bullets */}
                <ul className="space-y-2.5 pt-2 text-xs sm:text-sm text-stone-700">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#881337] shrink-0 mt-0.5" aria-hidden="true" />
                    <span>
                      <strong className="text-stone-900">Score calibration:</strong> Bayesian regression calibrated against historical university cutoffs with +/- 14 point confidence bounds
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#881337] shrink-0 mt-0.5" aria-hidden="true" />
                    <span>
                      <strong className="text-stone-900">Knowledge mapping:</strong> Traces prerequisite foundational concepts across Grades 9 through 12 to resolve underlying test errors
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#881337] shrink-0 mt-0.5" aria-hidden="true" />
                    <span>
                      <strong className="text-stone-900">Spaced review:</strong> Algorithmic scheduling targeting retention before exam day
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#881337] shrink-0 mt-0.5" aria-hidden="true" />
                    <span>
                      <strong className="text-stone-900">Curriculum alignment:</strong> Direct syllabus integration guaranteeing Zero ungrounded hallucinations
                    </span>
                  </li>
                </ul>
              </div>

              {/* Card Action */}
              <div className="pt-6 border-t border-stone-100">
                <Link
                  to="/ai-features"
                  className="text-xs sm:text-sm font-semibold text-[#881337] hover:text-[#9F1239] inline-flex items-center gap-1.5 group"
                >
                  <span>Explore AI learning engine</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                </Link>
              </div>
            </div>

            {/* Bento Card 2: Curriculum Blueprint Exam Generator (Col 5) */}
            <div className="lg:col-span-5 rounded-2xl bg-white border border-stone-200/90 shadow-xs hover:shadow-md transition-all p-6 sm:p-8 flex flex-col justify-between text-start space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#881337] bg-[#FFF1F2] border border-[#FECDD3] px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#881337]" aria-hidden="true" />
                    <span>Assessment Studio</span>
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-stone-900 leading-snug">
                  {SITE_CONTENT.landing.featureRows.examGen.title}
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  {SITE_CONTENT.landing.featureRows.examGen.description}
                </p>

                <ul className="space-y-2.5 pt-2 text-xs sm:text-sm text-stone-700">
                  {SITE_CONTENT.landing.featureRows.examGen.bullets.map((b, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2.5">
                      <Check className="w-3.5 h-3.5 text-[#881337] shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card Action */}
              <div className="pt-6 border-t border-stone-100">
                <Link
                  to="/for-teachers"
                  className="text-xs sm:text-sm font-semibold text-[#881337] hover:text-[#9F1239] inline-flex items-center gap-1.5 group"
                >
                  <span>{SITE_CONTENT.landing.featureRows.examGen.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                </Link>
              </div>
            </div>

            {/* Bento Card 3: Interactive STEM Science Simulations (Col 5) */}
            <div className="lg:col-span-5 rounded-2xl bg-white border border-stone-200/90 shadow-xs hover:shadow-md transition-all p-6 sm:p-8 flex flex-col justify-between text-start space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#881337] bg-[#FFF1F2] border border-[#FECDD3] px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5">
                    <FlaskConical className="w-3.5 h-3.5 text-[#881337]" aria-hidden="true" />
                    <span>Virtual Laboratory</span>
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-stone-900 leading-snug">
                  {SITE_CONTENT.landing.featureRows.stemSimulations.title}
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  {SITE_CONTENT.landing.featureRows.stemSimulations.subtitle}
                </p>

                <ul className="space-y-2.5 pt-2 text-xs sm:text-sm text-stone-700">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-3.5 h-3.5 text-[#881337] shrink-0 mt-0.5" aria-hidden="true" />
                    <span>Virtual laboratories anchored to national secondary syllabus units</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-3.5 h-3.5 text-[#881337] shrink-0 mt-0.5" aria-hidden="true" />
                    <span>Real-time parameter adjustments for mechanics, genetics, and molecular orbitals</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-3.5 h-3.5 text-[#881337] shrink-0 mt-0.5" aria-hidden="true" />
                    <span>Instant feedback and detailed step-by-step problem derivations</span>
                  </li>
                </ul>
              </div>

              {/* Card Action */}
              <div className="pt-6 border-t border-stone-100">
                <Link
                  to="/academics"
                  className="text-xs sm:text-sm font-semibold text-[#881337] hover:text-[#9F1239] inline-flex items-center gap-1.5 group"
                >
                  <span>Explore science curriculum</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                </Link>
              </div>
            </div>

            {/* Bento Card 4: National Past Papers Archive (Col 7) */}
            <div className="lg:col-span-7 rounded-2xl bg-white border border-stone-200/90 shadow-xs hover:shadow-md transition-all p-6 sm:p-8 flex flex-col justify-between text-start space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#881337] bg-[#FFF1F2] border border-[#FECDD3] px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#881337]" aria-hidden="true" />
                    <span>Entrance Examination Archive</span>
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-stone-900 leading-snug">
                  {SITE_CONTENT.landing.featureRows.pastPapers.title}
                </h3>
                <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                  {SITE_CONTENT.landing.featureRows.pastPapers.description}
                </p>

                <ul className="space-y-2.5 pt-2 text-xs sm:text-sm text-stone-700">
                  {SITE_CONTENT.landing.featureRows.pastPapers.bullets.map((b, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#881337] shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card Action */}
              <div className="pt-6 border-t border-stone-100">
                <Link
                  to="/for-students"
                  className="text-xs sm:text-sm font-semibold text-[#881337] hover:text-[#9F1239] inline-flex items-center gap-1.5 group"
                >
                  <span>{SITE_CONTENT.landing.featureRows.pastPapers.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: CATEGORIES / ACADEMIC STREAMS */}
      <section className="section bg-white border-b border-stone-200 transition-colors" aria-labelledby="tracks-heading">
        <div className="container space-y-12">
          <SectionHeader
            id="tracks-heading"
            title={SITE_CONTENT.landing.curriculumTracks.title}
            subtitle={SITE_CONTENT.landing.curriculumTracks.subtitle}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {CURRICULUM_TRACKS.map((track, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#FAF8F5] border border-stone-200/90 hover:border-[#881337]/40 shadow-xs hover:shadow-md transition-all text-start flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-white border border-stone-200/80 flex items-center justify-center text-[#881337] shadow-xs">
                    {track.icon}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#881337] block">
                      {track.grade}
                    </span>
                    <h3 className="text-lg font-bold text-stone-900 mt-1">
                      {track.title}
                    </h3>
                  </div>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    {track.description}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-stone-200/60">
                  <Link
                    to={track.link}
                    className="text-xs font-semibold text-[#881337] hover:text-[#9F1239] inline-flex items-center gap-1.5"
                  >
                    <span>View track syllabus</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: TESTIMONIALS (Pedagogical Accreditation) */}
      <section className="section bg-[#FAF8F5] border-b border-stone-200 transition-colors" aria-labelledby="testimonials-heading">
        <div className="container space-y-12">
          <SectionHeader
            id="testimonials-heading"
            title={SITE_CONTENT.landing.testimonials.title}
            subtitle={SITE_CONTENT.landing.testimonials.subtitle}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="p-6 lg:p-8 rounded-2xl bg-white border border-stone-200 hover:border-[#881337]/30 shadow-xs hover:shadow-md transition-all text-start flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[#881337]">
                    <Quote className="w-8 h-8 opacity-40 text-[#881337]" aria-hidden="true" />
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#FFF1F2] border border-[#FECDD3] text-[#881337]">
                      {t.metricBadge}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-stone-700 leading-relaxed italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-stone-100">
                  <p className="font-bold text-stone-900 text-sm">{t.author}</p>
                  <p className="text-xs text-[#881337] font-medium">{t.role}</p>
                  <p className="text-xs text-stone-500">{t.school} • {t.region}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: STATS (Institutional Metrics) */}
      <section className="section bg-white border-b border-stone-200 transition-colors" aria-labelledby="stats-heading">
        <div className="container space-y-12">
          <SectionHeader
            id="stats-heading"
            title={SITE_CONTENT.landing.stats.title}
            subtitle={SITE_CONTENT.landing.stats.subtitle}
          />
          <StatsCounter />
        </div>
      </section>

      {/* SECTION 7: PRICING WITH MONTHLY / ANNUAL BILLING TOGGLE */}
      <section className="section bg-[#FAF8F5] border-b border-stone-200 transition-colors" aria-labelledby="pricing-heading">
        <div className="container space-y-12">
          <SectionHeader
            id="pricing-heading"
            title={SITE_CONTENT.landing.pricing.title}
            subtitle={SITE_CONTENT.landing.pricing.subtitle}
          />
          <PricingSection />

          <div className="pt-2 text-start">
            <Link to="/pricing" className="text-sm font-semibold text-[#881337] hover:underline inline-flex items-center gap-1.5">
              <span>{SITE_CONTENT.landing.pricing.learnMore}</span>
              <ArrowRight className="w-4 h-4 text-[#881337]" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 8: FREQUENTLY ASKED QUESTIONS */}
      <section className="section bg-white border-b border-stone-200 transition-colors" aria-labelledby="faq-heading">
        <div className="container space-y-12">
          <SectionHeader
            id="faq-heading"
            align="center"
            title={SITE_CONTENT.landing.faq.title}
            subtitle={SITE_CONTENT.landing.faq.subtitle}
          />

          <div className="max-w-3xl mx-auto w-full">
            <Accordion items={FAQS} allowMultiple={false} defaultOpenId="curriculum-fidelity" />
          </div>
        </div>
      </section>

      {/* SECTION 9: FINAL CALL TO ACTION BANNER */}
      <section className="section bg-[#4C0519] text-white" aria-labelledby="cta-heading">
        <div className="container space-y-8 text-center flex flex-col items-center">
          <div className="space-y-4 max-w-2xl mx-auto text-center">
            <h2 id="cta-heading" className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-tight">
              {SITE_CONTENT.landing.ctaBanner.title}
            </h2>
            <p className="text-base sm:text-lg text-stone-100 leading-relaxed reading-text mx-auto">
              {SITE_CONTENT.landing.ctaBanner.subtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3.5 items-center justify-center pt-2">
            <Link
              to="/contact"
              className="min-h-[48px] px-8 py-3.5 rounded-[6px] bg-[#FBBF24] hover:bg-[#F59E0B] active:bg-[#D97706] text-[#1C1512] text-sm font-bold transition-all duration-150 inline-flex items-center gap-2 shadow-sm hover:shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FBBF24] focus:ring-offset-2 focus:ring-offset-[#4C0519]"
            >
              <span>{SITE_CONTENT.landing.ctaBanner.primaryButton}</span>
              <ArrowRight className="w-4 h-4 text-[#1C1512]" aria-hidden="true" />
            </Link>
            <Link
              to="/login"
              className="min-h-[48px] px-7 py-3.5 rounded-[6px] border border-white/40 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-colors flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#4C0519]"
            >
              <span>Sign in</span>
            </Link>
          </div>

          <div className="text-xs text-stone-300 pt-4 border-t border-white/10 font-mono">
            {SITE_CONTENT.landing.ctaBanner.supportLine}
          </div>
        </div>
      </section>

      {/* Floating Back to Top Button */}
      <BackToTop />

      {/* Educational Privacy & Essential Cookie Consent Notice */}
      <CookieBanner />
    </div>
  );
}
