import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Calculator,
  Atom,
  FlaskConical,
  Dna,
  BookOpen,
  Globe,
  Landmark,
  TrendingUp,
  ArrowRight,
  ChevronDown,
  Award,
  Target,
  FileSpreadsheet,
  ShieldCheck,
} from "lucide-react";
import InteractiveScienceShowcase from "../components/science/InteractiveScienceShowcase";
import { SectionHeader } from "../components/typography/SectionHeader";
import { useI18n } from "../i18n";

interface GradeProgram {
  grade: number;
  description: string;
  howWeSupport: {
    title: string;
    description: string;
    icon: React.ReactNode;
  }[];
  subjects: {
    name: string;
    stream: string;
    code: string;
    highlight: string;
    icon: React.ReactNode;
  }[];
}

const GRADE_PROGRAMS: GradeProgram[] = [

  {
    grade: 9,
    description: "Build foundations in mathematics, science, and English.",
    howWeSupport: [
      {
        title: "Visual learning",
        description: "Explore motion, cells, atoms, and equations.",
        icon: <Atom className="w-5 h-5 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />,
      },
      {
        title: "Check prior knowledge",
        description: "Identify topics to review.",
        icon: <Target className="w-5 h-5 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />,
      },
      {
        title: "Subject vocabulary",
        description: "Review key science and maths terms.",
        icon: <BookOpen className="w-5 h-5 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />,
      },
      {
        title: "Practise questions",
        description: "Practise Grade 9 textbook questions.",
        icon: <FileSpreadsheet className="w-5 h-5 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />,
      },
    ],
    subjects: [
      { name: "Mathematics", stream: "Common", code: "ETH-MAT-G9", highlight: "Algebraic expressions, linear equations, geometry, vectors, and basic trigonometry.", icon: <Calculator className="w-4 h-4 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" /> },
      { name: "Physics", stream: "Common", code: "ETH-PHY-G9", highlight: "Kinematics in 1D, forces, Newton's laws, work, energy, power, and simple machines.", icon: <Atom className="w-4 h-4 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" /> },
      { name: "Chemistry", stream: "Common", code: "ETH-CHM-G9", highlight: "Structure of the atom, periodic table, chemical reactions, equations, and acids and bases.", icon: <FlaskConical className="w-4 h-4 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" /> },
      { name: "Biology", stream: "Common", code: "ETH-BIO-G9", highlight: "Cell structure and function, human body systems, genetics, and Ethiopian ecosystems.", icon: <Dna className="w-4 h-4 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" /> },
      { name: "English Language", stream: "Common", code: "ETH-ENG-G9", highlight: "Reading comprehension strategies, grammatical structures, and expository writing.", icon: <BookOpen className="w-4 h-4 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" /> },
    ],
  },

  {
    grade: 10,
    description: "Strengthen core subjects and prepare for Grade 11 streams.",
    howWeSupport: [
      {
        title: "Review subject strengths",
        description: "Review progress across science and humanities.",
        icon: <Target className="w-5 h-5 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />,
      },
      {
        title: "Review across units",
        description: "Practise key ideas from Grades 9 and 10.",
        icon: <BookOpen className="w-5 h-5 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />,
      },
      {
        title: "Interactive science activities",
        description: "Explore chemistry, circuits, and genetics.",
        icon: <FlaskConical className="w-5 h-5 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />,
      },
      {
        title: "Build problem-solving skills",
        description: "Build from recall to problem-solving.",
        icon: <TrendingUp className="w-5 h-5 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />,
      },
    ],
    subjects: [
      { name: "Mathematics", stream: "Common", code: "ETH-MAT-G10", highlight: "Quadratic equations, coordinate geometry, matrices, determinants, and probability.", icon: <Calculator className="w-4 h-4 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" /> },
      { name: "Physics", stream: "Common", code: "ETH-PHY-G10", highlight: "Electrostatics, current electricity, electromagnetism, and introductory electronics.", icon: <Atom className="w-4 h-4 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" /> },
      { name: "Chemistry", stream: "Common", code: "ETH-CHM-G10", highlight: "Chemical bonding, stoichiometry, periodic properties, and hydrocarbons.", icon: <FlaskConical className="w-4 h-4 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" /> },
      { name: "Biology", stream: "Common", code: "ETH-BIO-G10", highlight: "Biotechnology, human reproduction, evolution, and environmental conservation.", icon: <Dna className="w-4 h-4 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" /> },
      { name: "English Language", stream: "Common", code: "ETH-ENG-G10", highlight: "Advanced reading comprehension, narrative writing, and academic vocabulary.", icon: <BookOpen className="w-4 h-4 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" /> },
    ],
  },

  {
    grade: 11,
    description: "Study specialized subjects and begin preparing for entrance exams.",
    howWeSupport: [
      {
        title: "Study stream subjects",
        description: "Explore topics in your chosen Grade 11 stream.",
        icon: <BookOpen className="w-5 h-5 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />,
      },
      {
        title: "Review key foundations",
        description: "Review foundations for advanced study.",
        icon: <Target className="w-5 h-5 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />,
      },
      {
        title: "Practise exam questions",
        description: "Practise exam formats and timing.",
        icon: <ShieldCheck className="w-5 h-5 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />,
      },
      {
        title: "Track assessment results",
        description: "Organize class results by subject.",
        icon: <FileSpreadsheet className="w-5 h-5 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />,
      },
    ],
    subjects: [
      { name: "Mathematics (Natural)", stream: "Natural Science", code: "ETH-MAT-G11N", highlight: "Relations, functions, complex numbers, vectors in 3D, and trigonometric identities.", icon: <Calculator className="w-4 h-4 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" /> },
      { name: "Physics", stream: "Natural Science", code: "ETH-PHY-G11", highlight: "Kinematics in 2D, circular motion, work, energy, wave motion, and thermodynamics.", icon: <Atom className="w-4 h-4 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" /> },
      { name: "Chemistry", stream: "Natural Science", code: "ETH-CHM-G11", highlight: "Atomic structure, chemical bonding, states of matter, and chemical kinetics.", icon: <FlaskConical className="w-4 h-4 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" /> },
      { name: "Biology", stream: "Natural Science", code: "ETH-BIO-G11", highlight: "Enzymes, cellular respiration, photosynthesis, genetics, and plant anatomy.", icon: <Dna className="w-4 h-4 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" /> },
      { name: "Mathematics (Social)", stream: "Social Science", code: "ETH-MAT-G11S", highlight: "Consumer math, financial mathematics, probability distributions, and statistics.", icon: <Calculator className="w-4 h-4 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" /> },
      { name: "Economics", stream: "Social Science", code: "ETH-ECO-G11", highlight: "Microeconomic consumer theory, elasticity, production costs, and market structures.", icon: <TrendingUp className="w-4 h-4 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" /> },
      { name: "Geography", stream: "Social Science", code: "ETH-GEO-G11", highlight: "Geomorphology, atmospheric science, population demographics, and map reading.", icon: <Globe className="w-4 h-4 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" /> },
      { name: "History", stream: "Social Science", code: "ETH-HIS-G11", highlight: "World civilizations, medieval Ethiopian dynasties, and African anti-colonial resistance.", icon: <Landmark className="w-4 h-4 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" /> },
      { name: "English Language", stream: "Common", code: "ETH-ENG-G11", highlight: "Advanced syntax, voice transformations, academic lexis, and essay composition.", icon: <BookOpen className="w-4 h-4 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" /> },
    ],
  },

  {
    grade: 12,
    description: "Review secondary subjects and practise for entrance exams.",
    howWeSupport: [
      {
        title: "Past exam questions",
        description: "Practise entrance questions with worked solutions.",
        icon: <Award className="w-5 h-5 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />,
      },
      {
        title: "Track practice progress",
        description: "Use results to choose what to review.",
        icon: <TrendingUp className="w-5 h-5 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />,
      },
      {
        title: "Timed exam practice",
        description: "Practise to a time limit and review answers.",
        icon: <ShieldCheck className="w-5 h-5 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />,
      },
      {
        title: "Review by topic",
        description: "Revisit topics that need practice.",
        icon: <Target className="w-5 h-5 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />,
      },
    ],
    subjects: [
      { name: "Mathematics (Natural)", stream: "Natural Science", code: "ETH-MAT-G12N", highlight: "Limits, continuity, differential calculus, integral calculus, and 3D analytic geometry.", icon: <Calculator className="w-4 h-4 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" /> },
      { name: "Physics", stream: "Natural Science", code: "ETH-PHY-G12", highlight: "Thermodynamics, heat engines, wave optics, modern physics, nuclear physics, and electronics.", icon: <Atom className="w-4 h-4 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" /> },
      { name: "Chemistry", stream: "Natural Science", code: "ETH-CHM-G12", highlight: "Equilibrium systems, acid-base equilibria, electrochemistry, and polymers and biochemistry.", icon: <FlaskConical className="w-4 h-4 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" /> },
      { name: "Biology", stream: "Natural Science", code: "ETH-BIO-G12", highlight: "Molecular genetics, DNA replication, protein synthesis, evolution, and human organ systems.", icon: <Dna className="w-4 h-4 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" /> },
      { name: "Mathematics (Social)", stream: "Social Science", code: "ETH-MAT-G12S", highlight: "Business mathematics, linear programming, matrix algebra, and applied calculus.", icon: <Calculator className="w-4 h-4 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" /> },
      { name: "Economics", stream: "Social Science", code: "ETH-ECO-G12", highlight: "Macroeconomic aggregates, fiscal and monetary policy, international trade, and Ethiopian economy.", icon: <TrendingUp className="w-4 h-4 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" /> },
      { name: "Geography", stream: "Social Science", code: "ETH-GEO-G12", highlight: "Geographic information systems, economic geography, global issues, and Ethiopian geography.", icon: <Globe className="w-4 h-4 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" /> },
      { name: "History", stream: "Social Science", code: "ETH-HIS-G12", highlight: "Modern Ethiopian diplomatic history, Pan-Africanism, the Cold War, and contemporary global history.", icon: <Landmark className="w-4 h-4 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" /> },
      { name: "English Language", stream: "Common", code: "ETH-ENG-G12", highlight: "College entrance aptitude, reading comprehension mastery, discourse markers, and advanced vocabulary.", icon: <BookOpen className="w-4 h-4 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" /> },
    ],
  },
];

const LEARNING_SUPPORT_FEATURES = [
  { translationKey: "public.academics.supportLessons", icon: <BookOpen className="h-4 w-4" aria-hidden="true" /> },
  { translationKey: "public.academics.supportPractice", icon: <FileSpreadsheet className="h-4 w-4" aria-hidden="true" /> },
  { translationKey: "public.academics.supportAssessment", icon: <ShieldCheck className="h-4 w-4" aria-hidden="true" /> },
  { translationKey: "public.academics.supportProgress", icon: <TrendingUp className="h-4 w-4" aria-hidden="true" /> },
];

import { usePageMeta } from "../hooks/usePageMeta";

export default function AcademicsPage(): React.ReactElement {
  const { t } = useI18n();
  usePageMeta(
    t("public.academics.pageTitle"),
    t("public.academics.pageDescription")
  );

  const [selectedGrade, setSelectedGrade] = useState<number>(12);
  const [streamFilter, setStreamFilter] = useState<"All" | "Natural Science" | "Social Science">("All");

  const currentProgram = GRADE_PROGRAMS.find((p) => p.grade === selectedGrade) || GRADE_PROGRAMS[3];

  const filteredSubjects = currentProgram.subjects.filter((s) => {
    if (streamFilter === "All") return true;
    return s.stream === streamFilter || s.stream === "Common";
  });

  return (
    <div className="public-page min-h-screen bg-[#FAF8F5] text-[#261E1A] font-sans selection:bg-[#FECDD3] selection:text-[#4C0519] dark:bg-[#1C1512] dark:text-stone-100">

      <section className="section bg-[#4C0519] text-white border-b border-white/10">
        <div className="container space-y-6">
          <SectionHeader
            asH1
            invertColors
            title={t("public.academics.heading")}
            subtitle={t("public.academics.pageSubtitle")}
            actions={
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/ai-features"
                  className="min-h-[44px] px-5 py-2.5 rounded-[6px] border border-white/40 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <span>{t("public.academics.exploreTools")}</span>
                </Link>
              </div>
            }
          />

          <div className="pt-6 border-t border-white/15">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="text-xs font-semibold text-rose-200">{t("public.academics.chooseGrade")}</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[9, 10, 11, 12].map((g) => {
                  const isSelected = selectedGrade === g;
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => {
                        setSelectedGrade(g);
                        if (g <= 10) setStreamFilter("All");
                      }}
                      className={`px-5 py-2.5 rounded-[6px] text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#FBBF24] text-[#1C1512] shadow-sm font-bold ring-2 ring-[#FBBF24]/50"
                          : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                      }`}
                    >
                      {t("public.academics.grade", { grade: g })}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#E8E2D9] bg-white py-5 dark:border-white/10 dark:bg-[#1C1512]">
        <div className="container">
          <details className="group">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 rounded-xl border border-[#E8E2D9] px-4 py-3 text-sm font-semibold text-[#261E1A] transition-colors hover:bg-[#FAF8F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#881337] dark:border-white/10 dark:text-white dark:hover:bg-white/5">
              <span>{t("public.academics.scienceTitle")}</span>
              <span className="text-xs font-medium text-[#574C43] group-open:hidden dark:text-stone-300">{t("public.academics.viewActivities")}</span>
              <span className="hidden text-xs font-medium text-[#574C43] group-open:inline dark:text-stone-300">{t("public.academics.hideActivities")}</span>
            </summary>
            <p className="py-3 text-sm text-[#574C43] dark:text-stone-300">{t("public.academics.scienceDescription")}</p>
            <div className="border border-[#E8E2D9] dark:border-white/10 rounded-[12px] bg-[#FAF8F5] dark:bg-[#261E1A]/40 p-4 sm:p-6">
              <InteractiveScienceShowcase />
            </div>
          </details>
        </div>
      </section>

      <section className="section bg-[#FAF8F5] border-b border-[#E8E2D9] dark:bg-[#1C1512] dark:border-white/10">
        <div className="container space-y-8 sm:space-y-10">

          <div className="p-6 sm:p-10 rounded-[12px] bg-white border border-[#E8E2D9] dark:bg-[#261E1A]/50 dark:border-white/10 shadow-xs space-y-6 text-start">
            <div className="space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div className="space-y-2 max-w-3xl">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1C1512] dark:text-white tracking-tight leading-tight">
                    {t("public.academics.grade", { grade: selectedGrade })}
                  </h2>
                  <p className="text-base sm:text-lg text-[#574C43] dark:text-stone-300 leading-relaxed">
                    {currentProgram.description}
                  </p>
                  <p className="max-w-2xl text-xs leading-relaxed text-[#766A61] dark:text-stone-400">
                    {t("public.academics.catalogNote")}
                  </p>
                </div>
              </div>
            </div>

          </div>

          <div className="text-start">
            <details className="group rounded-xl border border-[#E8E2D9] bg-white dark:border-white/10 dark:bg-[#261E1A]/30">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-sm font-semibold text-[#261E1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#881337] dark:text-white">
                <span>{t("public.academics.supportTitle", { grade: selectedGrade })}</span>
                <ChevronDown className="h-4 w-4 shrink-0 text-[#574C43] transition-transform group-open:rotate-180 dark:text-stone-300" aria-hidden="true" />
              </summary>
              <div className="grid grid-cols-1 gap-3 border-t border-[#E8E2D9] p-4 dark:border-white/10 sm:grid-cols-2">
              {LEARNING_SUPPORT_FEATURES.map((support) => (
                <div
                  key={support.translationKey}
                  className="flex min-h-14 items-center gap-3 rounded-lg border border-[#E8E2D9] bg-[#FAF8F5] p-3 dark:border-white/10 dark:bg-[#1C1512]"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FFF1F2] text-[#881337] dark:bg-[#881337]/20 dark:text-[#FBBF24]">{support.icon}</span>
                  <h4 className="text-sm font-semibold text-[#1C1512] dark:text-white">{t(support.translationKey)}</h4>
                </div>
              ))}
              </div>
            </details>
          </div>

          <div className="space-y-8 pt-6 border-t border-[#E8E2D9] dark:border-white/10 text-start">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <SectionHeader
                title={t("public.academics.subjectsTitle", { grade: selectedGrade })}
                className="mb-0 max-w-2xl"
              />

              {selectedGrade >= 11 && (
                <div className="flex flex-wrap items-center gap-2 text-xs" role="group" aria-label={t("public.academics.filterLabel")}>
                  {(["All", "Natural Science", "Social Science"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStreamFilter(s)}
                      className={`px-3.5 py-1.5 rounded-[6px] font-semibold transition-colors cursor-pointer ${
                        streamFilter === s
                          ? "bg-[#881337] text-white shadow-xs"
                          : "bg-white dark:bg-[#261E1A] text-[#574C43] dark:text-stone-300 border border-[#E8E2D9] dark:border-white/10 hover:bg-[#FAF8F5] dark:hover:bg-[#261E1A]/80"
                      }`}
                    >
                      {t(s === "All" ? "public.academics.allStreams" : s === "Natural Science" ? "public.academics.naturalScience" : "public.academics.socialScience")}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSubjects.map((sub) => (
                <div
                  key={sub.code}
                  className="p-6 rounded-[12px] bg-white dark:bg-[#261E1A]/40 border border-[#E8E2D9] dark:border-white/10 hover:border-[#FECDD3] dark:hover:border-[#881337]/40 shadow-xs hover:shadow-md transition-all duration-200 space-y-3 flex flex-col justify-between text-start hover:-translate-y-0.5"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-[6px] bg-[#FFF1F2] dark:bg-[#881337]/20 border border-[#FECDD3] dark:border-[#881337]/40 text-[#881337] dark:text-[#FBBF24]">
                          {sub.icon}
                        </div>
                        <h4 className="text-sm font-bold text-[#1C1512] dark:text-white">
                          {sub.name}
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono font-medium text-[#574C43] dark:text-stone-300 px-2 py-0.5 rounded-[6px] bg-[#F4EFEA] dark:bg-[#261E1A] border border-[#E8E2D9] dark:border-white/10">
                        {t(sub.stream === "Common" ? "public.academics.common" : sub.stream === "Natural Science" ? "public.academics.naturalScience" : "public.academics.socialScience")}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-[#574C43] dark:text-stone-300 sm:text-sm">
                      {sub.highlight}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-[#4C0519] text-white">
        <div className="container space-y-8 text-start">
          <SectionHeader
            invertColors
            title={t("public.academics.helpTitle")}
            actions={
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <Link
                  to="/contact"
                  className="min-h-[48px] px-8 py-3.5 rounded-[6px] bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1C1512] text-sm font-semibold transition-colors inline-flex items-center gap-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FBBF24]"
                >
                  <span>{t("public.academics.contact")}</span>
                  <ArrowRight className="w-4 h-4 text-[#1C1512]" aria-hidden="true" />
                </Link>
              </div>
            }
          />
        </div>
      </section>
    </div>
  );
}
