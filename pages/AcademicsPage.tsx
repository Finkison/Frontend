import React, { useState, useEffect } from "react";
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
  CheckCircle2,
  ArrowRight,
  Award,
  Target,
  FileSpreadsheet,
  Building2,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import InteractiveScienceShowcase from "../components/science/InteractiveScienceShowcase";
import { SectionHeader } from "../components/typography/SectionHeader";
import { SITE_CONTENT } from "../content/siteContent";

interface GradeProgram {
  grade: number;
  title: string;
  subtitle: string;
  academicStage: string;
  streamType: string;
  challenge: string;
  howWeSupport: {
    title: string;
    description: string;
    icon: React.ReactNode;
  }[];
  whatTheyGet: {
    studentGets: string[];
    schoolGets: string[];
  };
  subjects: {
    name: string;
    stream: string;
    code: string;
    highlight: string;
    icon: React.ReactNode;
  }[];
}

const GRADE_PROGRAMS: GradeProgram[] = [
  // Grade 9
  {
    grade: 9,
    title: "Grade 9 academic program",
    subtitle: "Establishing foundational mastery in secondary mathematics, experimental sciences, and academic English.",
    academicStage: "Lower secondary general transition",
    streamType: "Common core (all students take Natural and Social Sciences)",
    challenge: "Students transition from general primary studies to rigorous high school coursework requiring quantitative problem-solving, laboratory science concepts, and abstract algebraic logic.",
    howWeSupport: [
      {
        title: "Visual conceptual grounding",
        description: "Interactive simulations for 1D and 2D motion, cell biology, atomic structure, and linear equations make abstract concepts tangible before formula memorization.",
        icon: <Atom className="w-5 h-5 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />,
      },
      {
        title: "Diagnostic baseline assessment",
        description: "Adaptive diagnostics identify primary school knowledge gaps early in the academic year to prevent downstream failure.",
        icon: <Target className="w-5 h-5 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />,
      },
      {
        title: "Curriculum vocabulary glossaries",
        description: "Key science and mathematical terminology reinforced with standardized contextual glossaries to ensure high conceptual comprehension.",
        icon: <BookOpen className="w-5 h-5 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />,
      },
      {
        title: "Teacher formative question banks",
        description: "Pre-calibrated unit quiz sets aligned directly to national Grade 9 textbook chapters.",
        icon: <FileSpreadsheet className="w-5 h-5 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />,
      },
    ],
    whatTheyGet: {
      studentGets: [
        "Interactive visual science simulations for Physics, Biology, Chemistry, and Mathematics",
        "Step-by-step worked solutions for every end-of-chapter textbook problem",
        "Automated personal review flashcards for definitions, SI units, and chemical symbols",
        "Foundational score confidence tracking to prepare for senior high school streams",
      ],
      schoolGets: [
        "Standardized Grade 9 diagnostic baseline reports across all homeroom sections",
        "Ready-to-print unit test papers with full answer keys and rubrics",
        "Early warning alerts for students needing remedial algebra and science support",
        "Curriculum tracking dashboard showing syllabus completion against regional calendar",
      ],
    },
    subjects: [
      { name: "Mathematics", stream: "Common", code: "ETH-MAT-G9", highlight: "Algebraic expressions, linear equations, geometry, vectors, and basic trigonometry.", icon: <Calculator className="w-4 h-4 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" /> },
      { name: "Physics", stream: "Common", code: "ETH-PHY-G9", highlight: "Kinematics in 1D, forces, Newton's laws, work, energy, power, and simple machines.", icon: <Atom className="w-4 h-4 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" /> },
      { name: "Chemistry", stream: "Common", code: "ETH-CHM-G9", highlight: "Structure of the atom, periodic table, chemical reactions, equations, and acids and bases.", icon: <FlaskConical className="w-4 h-4 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" /> },
      { name: "Biology", stream: "Common", code: "ETH-BIO-G9", highlight: "Cell structure and function, human body systems, genetics, and Ethiopian ecosystems.", icon: <Dna className="w-4 h-4 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" /> },
      { name: "English Language", stream: "Common", code: "ETH-ENG-G9", highlight: "Reading comprehension strategies, grammatical structures, and expository writing.", icon: <BookOpen className="w-4 h-4 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" /> },
    ],
  },

  // Grade 10
  {
    grade: 10,
    title: "Grade 10 academic program",
    subtitle: "Consolidating core secondary competencies and preparing students for senior stream selection.",
    academicStage: "Mid secondary competency consolidation",
    streamType: "Common core preparatory milestone",
    challenge: "Grade 10 culminates in pivotal streaming decisions. Candidates must balance foundational knowledge across all subjects while identifying natural versus social science strengths.",
    howWeSupport: [
      {
        title: "Streaming diagnostic aptitude",
        description: "Objective psychometric assessments analyze student mastery across STEM and humanities to guide informed stream placement.",
        icon: <Target className="w-5 h-5 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />,
      },
      {
        title: "Comprehensive unit revision sets",
        description: "Multi-chapter practice sets synthesized from Grades 9 and 10 curricula to solidify core knowledge.",
        icon: <BookOpen className="w-5 h-5 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />,
      },
      {
        title: "Advanced STEM laboratory modules",
        description: "Virtual science labs covering chemical reactions, electrical circuits, and genetic inheritance.",
        icon: <FlaskConical className="w-5 h-5 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />,
      },
      {
        title: "Progressive difficulty calibration",
        description: "Questions tiered from knowledge recall to analytical evaluation to build higher-order thinking skills.",
        icon: <TrendingUp className="w-5 h-5 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />,
      },
    ],
    whatTheyGet: {
      studentGets: [
        "Aptitude profile highlighting individual subject strengths for Grade 11 streaming",
        "Over 1,200 curated practice questions with detailed explanations",
        "Comprehensive practice modules accessible across school computer laboratories",
        "Targeted drills for high-frequency exam concept errors",
      ],
      schoolGets: [
        "Cohort streaming analytics to assist deans in section allocations",
        "Standardized mid-year and final examination test blueprints",
        "Teacher gradebook tools with automated statistical distributions",
        "Parent-ready academic progress summaries",
      ],
    },
    subjects: [
      { name: "Mathematics", stream: "Common", code: "ETH-MAT-G10", highlight: "Quadratic equations, coordinate geometry, matrices, determinants, and probability.", icon: <Calculator className="w-4 h-4 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" /> },
      { name: "Physics", stream: "Common", code: "ETH-PHY-G10", highlight: "Electrostatics, current electricity, electromagnetism, and introductory electronics.", icon: <Atom className="w-4 h-4 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" /> },
      { name: "Chemistry", stream: "Common", code: "ETH-CHM-G10", highlight: "Chemical bonding, stoichiometry, periodic properties, and hydrocarbons.", icon: <FlaskConical className="w-4 h-4 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" /> },
      { name: "Biology", stream: "Common", code: "ETH-BIO-G10", highlight: "Biotechnology, human reproduction, evolution, and environmental conservation.", icon: <Dna className="w-4 h-4 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" /> },
      { name: "English Language", stream: "Common", code: "ETH-ENG-G10", highlight: "Advanced reading comprehension, narrative writing, and academic vocabulary.", icon: <BookOpen className="w-4 h-4 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" /> },
    ],
  },

  // Grade 11
  {
    grade: 11,
    title: "Grade 11 academic program",
    subtitle: "Specialized preparatory stream curricula calibrated to advanced university entrance requirements.",
    academicStage: "Senior secondary stream specialization",
    streamType: "Natural Science and Social Science tracks",
    challenge: "Students encounter university-level depth in their chosen stream. Natural science candidates face calculus-based physics and organic chemistry, while social science candidates analyze complex economics and world history.",
    howWeSupport: [
      {
        title: "Stream-specific deep dives",
        description: "Rigorous instructional modules engineered around specialized Grade 11 textbooks and national curriculum benchmarks.",
        icon: <BookOpen className="w-5 h-5 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />,
      },
      {
        title: "Prerequisite concept bridging",
        description: "Identifies and rectifies Grade 9 and 10 gaps before students attempt advanced calculus and thermodynamics.",
        icon: <Target className="w-5 h-5 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />,
      },
      {
        title: "EUEE blueprint alignment",
        description: "Early exposure to national entrance exam question formats, timing constraints, and distractor patterns.",
        icon: <ShieldCheck className="w-5 h-5 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />,
      },
      {
        title: "Continuous assessment gradebooks",
        description: "Automated scoring and gradebook management for school-level term examinations and quizzes.",
        icon: <FileSpreadsheet className="w-5 h-5 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />,
      },
    ],
    whatTheyGet: {
      studentGets: [
        "Full syllabus coverage across all Grade 11 stream subjects",
        "Step-by-step calculus derivations and chemical mechanism animations",
        "Personalized spaced review schedules based on individual retention curves",
        "Instant score conversion estimates projecting future 600-point national standing",
      ],
      schoolGets: [
        "Comparative section analytics across natural and social science classrooms",
        "Teacher assignment matrix identifying curriculum pacing and revision gaps",
        "Standardized unit test builder generating fresh question sets with anti-cheat scrambling",
        "Dedicated administrator metrics for regional educational bureau audits",
      ],
    },
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

  // Grade 12
  {
    grade: 12,
    title: "Grade 12 academic program",
    subtitle: "Comprehensive national examination preparation engineered for university admission cutoff success.",
    academicStage: "Senior preparatory and national exam candidate",
    streamType: "Full stream specialization and national standardized testing",
    challenge: "The Ethiopian University Entrance Examination determines university placement and field of study. Students must synthesize four years of high school curriculum under intense time constraints.",
    howWeSupport: [
      {
        title: "Official past paper archives",
        description: "Official EUEE examinations from 2008 to 2016 E.C. complete with verified answer keys, detailed rubrics, and worked solutions.",
        icon: <Award className="w-5 h-5 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />,
      },
      {
        title: "Bayesian 600-point score calibration",
        description: "Predictive model converts diagnostic performance into estimated national entrance exam scores with +/- 14 point confidence bounds.",
        icon: <TrendingUp className="w-5 h-5 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />,
      },
      {
        title: "Timed national simulation engine",
        description: "Real-time exam simulator replicating official time limits, question pacing, section transitions, and non-invasive proctoring telemetry.",
        icon: <ShieldCheck className="w-5 h-5 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />,
      },
      {
        title: "Targeted high-yield drills",
        description: "Algorithmic review queues that prioritize topics carrying the highest percentage weighting on the official national table of specifications.",
        icon: <Target className="w-5 h-5 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />,
      },
    ],
    whatTheyGet: {
      studentGets: [
        "Unrestricted access to all official EUEE past papers from 2008 to 2016 E.C.",
        "Calibrated 600-point entrance exam score forecasts updated after every practice set",
        "Targeted diagnostic flashcards for high-frequency EUEE formula questions",
        "Step-by-step worked explanations for every question aligned with national textbooks",
      ],
      schoolGets: [
        "Institutional university entrance placement forecast 60 days before national exams",
        "Identification of underperforming sections and subjects for targeted remediation",
        "Automated mock examination generation with option scrambling and anti-cheat protection",
        "Official national curriculum compliance certificate for all classroom subjects",
      ],
    },
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

export default function AcademicsPage(): React.ReactElement {
  useEffect(() => {
    document.title = "Academics overview — Finkison";
  }, []);

  const [selectedGrade, setSelectedGrade] = useState<number>(12);
  const [streamFilter, setStreamFilter] = useState<"All" | "Natural Science" | "Social Science">("All");

  const currentProgram = GRADE_PROGRAMS.find((p) => p.grade === selectedGrade) || GRADE_PROGRAMS[3];

  const filteredSubjects = currentProgram.subjects.filter((s) => {
    if (streamFilter === "All") return true;
    return s.stream === streamFilter || s.stream === "Common";
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#261E1A] font-sans selection:bg-[#FECDD3] selection:text-[#4C0519] dark:bg-[#1C1512] dark:text-slate-100">
      {/* 1. HERO SECTION - Left-aligned to container */}
      <section className="section bg-[#4C0519] text-white border-b border-white/10">
        <div className="container space-y-6">
          <SectionHeader
            asH1
            invertColors
            title={SITE_CONTENT.pages.academics.title}
            subtitle={SITE_CONTENT.pages.academics.subtitle}
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
                  to="/ai-features"
                  className="min-h-[44px] px-5 py-2.5 rounded-[6px] border border-white/40 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <span>Explore AI features</span>
                </Link>
              </div>
            }
          />

          {/* Grade Level Selector */}
          <div className="pt-6 border-t border-white/15">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="text-xs font-semibold text-rose-200">Grades 9–12 comparative academic progression:</span>
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
                      Grade {g}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. GRADE PROGRAM CONTENT */}
      <section className="section bg-white border-b border-[#E8E2D9] dark:bg-[#1C1512] dark:border-white/10">
        <div className="container space-y-16">
          
          {/* Header Overview Card */}
          <div className="p-6 sm:p-10 rounded-[12px] bg-[#FAF8F5] border border-[#E8E2D9] dark:bg-[#261E1A]/50 dark:border-white/10 shadow-xs space-y-6 text-start">
            <div className="space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div className="space-y-2 max-w-3xl">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1C1512] dark:text-white tracking-tight leading-tight">
                    {currentProgram.title}
                  </h2>
                  <p className="text-base sm:text-lg text-[#574C43] dark:text-slate-300 leading-relaxed">
                    {currentProgram.subtitle}
                  </p>
                </div>
                <div className="text-xs text-[#574C43] dark:text-slate-300 space-y-1.5 bg-white dark:bg-[#261E1A] px-4 py-3 rounded-[8px] border border-[#E8E2D9] dark:border-white/10 shadow-xs shrink-0">
                  <div><span className="font-semibold text-[#1C1512] dark:text-white">Stage:</span> {currentProgram.academicStage}</div>
                  <div><span className="font-semibold text-[#1C1512] dark:text-white">Structure:</span> {currentProgram.streamType}</div>
                </div>
              </div>
            </div>

            <div className="pt-5 border-t border-[#E8E2D9] dark:border-white/10">
              <div className="rounded-[8px] bg-white dark:bg-[#261E1A] p-4 sm:p-5 border border-[#E8E2D9] dark:border-white/10">
                <p className="text-sm sm:text-base text-[#574C43] dark:text-slate-300 leading-relaxed">
                  <strong className="text-[#1C1512] dark:text-white font-semibold">The pedagogical reality: </strong>
                  {currentProgram.challenge}
                </p>
              </div>
            </div>
          </div>

          {/* Interventions Grid */}
          <div className="space-y-8 text-start">
            <SectionHeader
              title={`How Finkison supports Grade ${selectedGrade}`}
              subtitle="Instructional tools engineered for classroom teachers, academic heads, and candidates."
              className="mb-6"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentProgram.howWeSupport.map((support) => (
                <div
                  key={support.title}
                  className="p-6 rounded-[12px] bg-white dark:bg-[#261E1A]/40 border border-[#E8E2D9] dark:border-white/10 hover:border-[#FECDD3] dark:hover:border-[#881337]/40 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 text-start hover:-translate-y-0.5"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-[8px] bg-[#FFF1F2] dark:bg-[#881337]/20 border border-[#FECDD3] dark:border-[#881337]/40 flex items-center justify-center text-[#881337] dark:text-[#FBBF24]">
                      {support.icon}
                    </div>
                    <h4 className="text-base font-bold text-[#1C1512] dark:text-white leading-snug">{support.title}</h4>
                    <p className="text-xs sm:text-sm text-[#574C43] dark:text-slate-300 leading-relaxed">
                      {support.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Deliverables: Students vs Schools */}
          <div className="space-y-8 text-start pt-6 border-t border-[#E8E2D9] dark:border-white/10">
            <SectionHeader
              title="What students and schools receive"
              subtitle="Tangible deliverables and diagnostic intelligence for each cohort."
              className="mb-6"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Student Deliverables */}
              <div className="p-8 rounded-[12px] bg-white dark:bg-[#261E1A]/40 border border-[#E8E2D9] dark:border-white/10 hover:border-[#FECDD3] dark:hover:border-[#881337]/40 shadow-xs hover:shadow-md transition-all space-y-6 text-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 text-lg font-bold text-[#1C1512] dark:text-white">
                    <div className="w-8 h-8 rounded-[6px] bg-[#FFF1F2] dark:bg-[#881337]/20 border border-[#FECDD3] dark:border-[#881337]/40 flex items-center justify-center">
                      <GraduationCap className="w-4 h-4 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />
                    </div>
                    <span>What Grade {selectedGrade} students receive</span>
                  </div>
                  <p className="text-xs text-[#574C43] dark:text-slate-300">Direct diagnostic learning assets and practice resources.</p>
                </div>
                <ul className="space-y-3.5 text-xs sm:text-sm text-[#574C43] dark:text-slate-300">
                  {currentProgram.whatTheyGet.studentGets.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-[#881337] dark:text-[#FBBF24] shrink-0 mt-0.5 icon-first-line" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* School Deliverables */}
              <div className="p-8 rounded-[12px] bg-white dark:bg-[#261E1A]/40 border border-[#E8E2D9] dark:border-white/10 hover:border-[#FECDD3] dark:hover:border-[#881337]/40 shadow-xs hover:shadow-md transition-all space-y-6 text-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 text-lg font-bold text-[#1C1512] dark:text-white">
                    <div className="w-8 h-8 rounded-[6px] bg-[#FFF1F2] dark:bg-[#881337]/20 border border-[#FECDD3] dark:border-[#881337]/40 flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />
                    </div>
                    <span>What School Leadership and teachers receive</span>
                  </div>
                  <p className="text-xs text-[#574C43] dark:text-slate-300">Administrative governance, pacing reports, and assessment rubrics.</p>
                </div>
                <ul className="space-y-3.5 text-xs sm:text-sm text-[#574C43] dark:text-slate-300">
                  {currentProgram.whatTheyGet.schoolGets.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-[#881337] dark:text-[#FBBF24] shrink-0 mt-0.5 icon-first-line" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Subjects Framework */}
          <div className="space-y-8 pt-6 border-t border-[#E8E2D9] dark:border-white/10 text-start">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <SectionHeader
                title={`Grade ${selectedGrade} curriculum competencies`}
                subtitle="Mapped directly to Ethiopian national secondary curriculum specifications."
                className="mb-0 max-w-2xl"
              />

              {selectedGrade >= 11 && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#574C43] dark:text-slate-300 font-semibold">Filter:</span>
                  {(["All", "Natural Science", "Social Science"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStreamFilter(s)}
                      className={`px-3.5 py-1.5 rounded-[6px] font-semibold transition-colors cursor-pointer ${
                        streamFilter === s
                          ? "bg-[#881337] text-white shadow-xs"
                          : "bg-white dark:bg-[#261E1A] text-[#574C43] dark:text-slate-300 border border-[#E8E2D9] dark:border-white/10 hover:bg-[#FAF8F5] dark:hover:bg-[#261E1A]/80"
                      }`}
                    >
                      {s}
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
                        <h4 className="text-sm font-bold text-[#1C1512] dark:text-white">{sub.name}</h4>
                      </div>
                      <span className="text-[10px] font-mono font-medium text-[#574C43] dark:text-slate-300 px-2 py-0.5 rounded-[6px] bg-[#F4EFEA] dark:bg-[#261E1A] border border-[#E8E2D9] dark:border-white/10">
                        {sub.stream}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#574C43] dark:text-slate-300 leading-relaxed">
                      {sub.highlight}
                    </p>
                  </div>
                  <div className="text-[10px] text-[#574C43] dark:text-slate-400 font-mono pt-3 border-t border-[#E8E2D9] dark:border-white/10 flex items-center justify-between">
                    <span>{sub.code}</span>
                    <span className="text-[#881337] dark:text-[#FBBF24] font-semibold">National blueprint</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE SCIENCE VISUALS */}
      <section className="section bg-[#FAF8F5] dark:bg-[#1C1512] border-b border-[#E8E2D9] dark:border-white/10">
        <div className="container space-y-12 text-start">
          <SectionHeader
            title="Interactive science simulations"
            subtitle="Secondary students manipulate physical parameters in real-time simulations to master mechanics and molecular concepts."
          />

          <div className="border border-[#E8E2D9] dark:border-white/10 rounded-[12px] bg-white dark:bg-[#261E1A]/40 shadow-xs hover:shadow-md transition-shadow p-6 sm:p-8">
            <InteractiveScienceShowcase />
          </div>
        </div>
      </section>

      {/* 4. FINAL INSTITUTIONAL CTA (Crimson #4C0519) - Left-aligned to container */}
      <section className="section bg-[#4C0519] text-white">
        <div className="container space-y-8 text-start">
          <SectionHeader
            invertColors
            title="Elevate academic outcomes across Grades 9 through 12"
            subtitle="Join secondary and preparatory schools preparing candidates for verifiable national entrance examination success."
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
                  to="/team"
                  className="min-h-[48px] px-7 py-3.5 rounded-[6px] border border-white/40 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <span>Meet our team</span>
                </Link>
              </div>
            }
          />
        </div>
      </section>
    </div>
  );
}
