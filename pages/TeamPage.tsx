import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  TrendingUp,
  Cpu,
  Building2,
  Target,
  ShieldCheck,
  Globe2,
  ArrowRight,
} from "lucide-react";
import { SectionHeader } from "../components/typography/SectionHeader";
import { SITE_CONTENT } from "../content/siteContent";

interface TeamDivision {
  division: string;
  description: string;
  icon: React.ReactNode;
  members: {
    role: string;
    focus: string;
    responsibilities: string[];
  }[];
}

export default function TeamPage(): React.ReactElement {
  useEffect(() => {
    document.title = "Team — Finkison";
  }, []);

  const DIVISIONS: TeamDivision[] = [
    {
      division: "Curriculum alignment and pedagogical review",
      description:
        "Senior Ethiopian subject specialists who map every item, textbook chapter, and competency directly to national secondary curriculum frameworks.",
      icon: <BookOpen className="w-5 h-5 text-[#881337]" aria-hidden="true" />,
      members: [
        {
          role: "Natural Science curriculum lead",
          focus: "Physics, Chemistry, and Biology",
          responsibilities: [
            "Audits Grade 9–12 STEM items against national syllabus competencies",
            "Validates worked solutions for 2008–2016 E.C. national entrance past papers",
          ],
        },
        {
          role: "Social Science and humanities lead",
          focus: "History, Geography, and Economics",
          responsibilities: [
            "Ensures balanced representation of national curriculum historical units and regional geography",
            "Develops EUEE diagnostic sets with verified analytical rationales",
          ],
        },
        {
          role: "English language and verbal lead",
          focus: "Grammar, comprehension, and reasoning",
          responsibilities: [
            "Calibrates EUEE reading passages and vocabulary question banks",
            "Standardizes rubric grading for language diagnostics and mock examinations",
          ],
        },
      ],
    },
    {
      division: "Psychometrics and assessment calibration",
      description:
        "Measurement scientists and statistical modelers who evaluate item difficulty, discrimination indices, and university entrance score distributions.",
      icon: <TrendingUp className="w-5 h-5 text-[#881337]" aria-hidden="true" />,
      members: [
        {
          role: "Lead psychometrician",
          focus: "Item calibration and score forecasting",
          responsibilities: [
            "Calibrates 600-point entrance score predictions against historical cutoff distributions",
            "Validates Item Response Theory difficulty models across preparatory cohorts",
          ],
        },
        {
          role: "Learning diagnostics and retention modeler",
          focus: "Memory decay and spaced review",
          responsibilities: [
            "Calculates personalized spaced review schedules tailored to examination timelines",
            "Analyzes time-per-question telemetry to identify guessing patterns and knowledge gaps",
          ],
        },
      ],
    },
    {
      division: "Educational technology and sovereign infrastructure",
      description:
        "Engineers specializing in domestic cloud infrastructure, high-concurrency exam systems, data privacy, and responsive user experiences.",
      icon: <Cpu className="w-5 h-5 text-[#881337]" aria-hidden="true" />,
      members: [
        {
          role: "Principal infrastructure engineer",
          focus: "Domestic hosting and reliability",
          responsibilities: [
            "Maintains Addis Ababa Tier-3 datacenter clusters with zero foreign data transfer",
            "Enforces AES-256 encryption at rest and automated peak load balancing",
          ],
        },
        {
          role: "Client performance architect",
          focus: "Session recovery and client rendering",
          responsibilities: [
            "Ensures seamless exam state caching and instant recovery during network disconnects",
            "Optimizes interactive science simulations for low-power school desktop labs",
          ],
        },
      ],
    },
    {
      division: "Institutional implementation and regional support",
      description:
        "Field leads who onboard school leadership, train classroom teachers, and coordinate with regional education bureaus.",
      icon: <Building2 className="w-5 h-5 text-[#881337]" aria-hidden="true" />,
      members: [
        {
          role: "Institutional implementation director",
          focus: "School onboarding and leadership advisory",
          responsibilities: [
            "Guides secondary school onboarding, roster imports, and section setup",
            "Coordinates with regional education bureaus on official examination calendars",
          ],
        },
        {
          role: "Educator enablement specialist",
          focus: "Teacher training and classroom feedback",
          responsibilities: [
            "Conducts teacher training for classroom gradebooks and blueprint exam creation",
            "Gathers educator feedback to continuously refine item quality and blueprints",
          ],
        },
      ],
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
            title={SITE_CONTENT.pages.team.title}
            subtitle={SITE_CONTENT.pages.team.subtitle}
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
                  <span>Explore subjects</span>
                </Link>
              </div>
            }
          />
        </div>
      </section>

      {/* 2. LEADERSHIP DIVISIONS */}
      <section className="section bg-[#FAF8F5] dark:bg-[#1C1512] border-b border-[#E2E8F0] dark:border-stone-800">
        <div className="container space-y-12">
          <SectionHeader
            title="Specialized academic and technical divisions"
            subtitle="Every question item, diagnostic score forecast, and exam simulation workflow is developed and verified across four specialized divisions."
          />

          <div className="space-y-8">
            {DIVISIONS.map((div, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-[12px] bg-white dark:bg-[#261E1A]/40 border border-[#E2E8F0] dark:border-stone-800 shadow-xs space-y-6 text-start"
              >
                <div className="flex items-start gap-4 border-b border-stone-100 dark:border-stone-800 pb-5">
                  <div className="w-11 h-11 rounded-[8px] bg-[#FFF1F2] dark:bg-[#881337]/20 border border-[#FECDD3] dark:border-[#881337]/40 flex items-center justify-center shrink-0">
                    {div.icon}
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#1C1512] dark:text-white">
                      {div.division}
                    </h3>
                    <p className="text-sm sm:text-base text-[#57534E] dark:text-stone-300 mt-1 leading-relaxed max-w-3xl">
                      {div.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                  {div.members.map((member, mIdx) => (
                    <div
                      key={mIdx}
                      className="p-5 rounded-[8px] bg-[#FAF8F5] dark:bg-[#1C1512] border border-[#E2E8F0] dark:border-stone-800 space-y-3 flex flex-col justify-between text-start"
                    >
                      <div className="space-y-2">
                        <span className="text-xs font-semibold text-[#881337] dark:text-[#FBBF24] block">
                          {member.focus}
                        </span>
                        <h4 className="text-base font-bold text-[#1C1512] dark:text-white">
                          {member.role}
                        </h4>
                        <ul className="space-y-2 pt-2 border-t border-stone-200/80 dark:border-stone-800 text-xs text-[#57534E] dark:text-stone-300 leading-relaxed">
                          {member.responsibilities.map((resp, rIdx) => (
                            <li key={rIdx} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#881337] dark:bg-[#FBBF24] shrink-0 mt-1.5" aria-hidden="true" />
                              <span>{resp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CORE QUALITY COMMITMENTS (Quality Charter) */}
      <section className="section bg-white dark:bg-[#1C1512] border-b border-[#E2E8F0] dark:border-stone-800">
        <div className="container space-y-12">
          <SectionHeader
            title="Our academic quality charter"
            subtitle="Guiding principles upheld across all examination calibration models, instructional modules, and school deployments."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-start">
            <div className="p-8 rounded-[12px] bg-white dark:bg-[#261E1A]/40 border border-[#E2E8F0] dark:border-stone-800 hover:border-[#FECDD3] dark:hover:border-[#881337]/40 shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 space-y-4">
              <div className="w-12 h-12 rounded-[8px] bg-[#FFF1F2] dark:bg-[#881337]/20 border border-[#FECDD3] dark:border-[#881337]/40 flex items-center justify-center">
                <Target className="w-6 h-6 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-[#1C1512] dark:text-white">
                Zero ungrounded output
              </h3>
              <p className="text-sm sm:text-base text-[#57534E] dark:text-stone-300 leading-relaxed">
                We reject speculative or synthetic curriculum claims. Every question, diagnostic explanation, and formula derivation on Finkison is referenced directly to an approved national curriculum textbook unit.
              </p>
            </div>

            <div className="p-8 rounded-[12px] bg-white dark:bg-[#261E1A]/40 border border-[#E2E8F0] dark:border-stone-800 hover:border-[#FECDD3] dark:hover:border-[#881337]/40 shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 space-y-4">
              <div className="w-12 h-12 rounded-[8px] bg-[#FFF1F2] dark:bg-[#881337]/20 border border-[#FECDD3] dark:border-[#881337]/40 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-[#1C1512] dark:text-white">
                Candidate privacy first
              </h3>
              <p className="text-sm sm:text-base text-[#57534E] dark:text-stone-300 leading-relaxed">
                Candidate assessment results belong solely to students and their authorized schools. We never monetize candidate data or transfer records outside Ethiopia's domestic data centers.
              </p>
            </div>

            <div className="p-8 rounded-[12px] bg-white dark:bg-[#261E1A]/40 border border-[#E2E8F0] dark:border-stone-800 hover:border-[#FECDD3] dark:hover:border-[#881337]/40 shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 space-y-4">
              <div className="w-12 h-12 rounded-[8px] bg-[#FFF1F2] dark:bg-[#881337]/20 border border-[#FECDD3] dark:border-[#881337]/40 flex items-center justify-center">
                <Globe2 className="w-6 h-6 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-[#1C1512] dark:text-white">
                National educational equity
              </h3>
              <p className="text-sm sm:text-base text-[#57534E] dark:text-stone-300 leading-relaxed">
                Finkison is purpose-built for Ethiopia. All curriculum units, diagnostic items, and step-by-step formula derivations are standardized in rigorous English matching official national textbook standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FINAL CALL TO ACTION (Academic Shield #4C0519) */}
      <section className="section bg-[#4C0519] text-white">
        <div className="container space-y-8 text-start">
          <SectionHeader
            invertColors
            title="Connect with our academic and technical leads"
            subtitle="Whether evaluating institutional adoption for your school cohort or reviewing curriculum alignment verification, our team is ready to assist."
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
                  to="/about"
                  className="min-h-[48px] px-7 py-3.5 rounded-[6px] border border-white/40 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white active:scale-[0.98]"
                >
                  <span>About Finkison</span>
                </Link>
              </div>
            }
          />
        </div>
      </section>
    </div>
  );
}
