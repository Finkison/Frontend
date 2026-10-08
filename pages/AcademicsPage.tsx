import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { 
  BookOpen, 
  Calculator, 
  Atom, 
  FlaskConical, 
  Dna, 
  Brain, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  FileText,
  CheckCircle2,
  Filter,
  Scale
} from "lucide-react";

export default function AcademicsPage(): React.ReactElement {
  const [searchParams] = useSearchParams();
  const initialStream = searchParams.get("stream") === "social" ? "Social Science" : "Natural Science";
  
  const [selectedStream, setSelectedStream] = useState<"Natural Science" | "Social Science">(initialStream as any);
  const [selectedGrade, setSelectedGrade] = useState<number>(12);

  useEffect(() => {
    const streamParam = searchParams.get("stream");
    if (streamParam === "social") setSelectedStream("Social Science");
    else if (streamParam === "natural") setSelectedStream("Natural Science");
  }, [searchParams]);

  const naturalSubjects = [
    {
      id: "math",
      name: "Mathematics",
      icon: <Calculator className="w-6 h-6 text-blue-600" />,
      units: [
        "Unit 1: Sequences & Series (Arithmetic, Geometric, Convergence)",
        "Unit 2: Limits & Continuity (Trigonometric & Algebraic limits)",
        "Unit 3: Derivatives & Applications (Rates of change, Tangents)",
        "Unit 4: Definite & Indefinite Integrals (Fundamental theorem, Area)",
        "Unit 5: 3D Coordinate Geometry & Vectors",
        "Unit 6: Mathematical Proofs & Logic"
      ],
      examWeight: "25% of Entrance Exam",
      totalQuestions: 1850,
      pastYears: ["2016 E.C.", "2015 E.C.", "2014 E.C.", "2013 E.C.", "2012 E.C."]
    },
    {
      id: "physics",
      name: "Physics",
      icon: <Atom className="w-6 h-6 text-blue-600" />,
      units: [
        "Unit 1: Thermodynamics (Laws, Heat Engines, Carnot cycle)",
        "Unit 2: Oscillations & Waves (Doppler effect, Standing waves)",
        "Unit 3: Wave Optics (Interference, Diffraction, Polarization)",
        "Unit 4: Electrostatics & Capacitance",
        "Unit 5: Electromagnetism & Induction (Faraday & Lenz laws)",
        "Unit 6: Atomic & Nuclear Physics"
      ],
      examWeight: "20% of Entrance Exam",
      totalQuestions: 1420,
      pastYears: ["2016 E.C.", "2015 E.C.", "2014 E.C.", "2013 E.C.", "2012 E.C."]
    },
    {
      id: "chemistry",
      name: "Chemistry",
      icon: <FlaskConical className="w-6 h-6 text-blue-600" />,
      units: [
        "Unit 1: Solutions & Colligative Properties",
        "Unit 2: Acid-Base Equilibria (pH calculations, Buffers, Titrations)",
        "Unit 3: Electrochemistry (Galvanic cells, Nernst equation)",
        "Unit 4: Chemical Kinetics (Rate laws, Activation energy)",
        "Unit 5: Organic Chemistry (Hydrocarbons, Functional groups, Polymers)"
      ],
      examWeight: "18% of Entrance Exam",
      totalQuestions: 1350,
      pastYears: ["2016 E.C.", "2015 E.C.", "2014 E.C.", "2013 E.C."]
    },
    {
      id: "biology",
      name: "Biology",
      icon: <Dna className="w-6 h-6 text-blue-600" />,
      units: [
        "Unit 1: Molecular Genetics & Protein Synthesis",
        "Unit 2: Cellular Respiration & Photosynthesis",
        "Unit 3: Human Physiology & Homeostasis",
        "Unit 4: Ecology & Environmental Biology",
        "Unit 5: Evolutionary Biology & Taxonomy"
      ],
      examWeight: "18% of Entrance Exam",
      totalQuestions: 1280,
      pastYears: ["2016 E.C.", "2015 E.C.", "2014 E.C.", "2013 E.C."]
    },
    {
      id: "aptitude",
      name: "Scholastic Aptitude Test (SAT)",
      icon: <Brain className="w-6 h-6 text-blue-600" />,
      units: [
        "Section 1: Verbal Reasoning & Analogies",
        "Section 2: Quantitative Data Interpretation & Logic",
        "Section 3: Spatial Relations & Pattern Recognition",
        "Section 4: Analytical Problem Solving"
      ],
      examWeight: "15% of Entrance Exam",
      totalQuestions: 980,
      pastYears: ["2016 E.C.", "2015 E.C.", "2014 E.C."]
    },
    {
      id: "english",
      name: "English Language",
      icon: <BookOpen className="w-6 h-6 text-blue-600" />,
      units: [
        "Unit 1: Reading Comprehension & Inference",
        "Unit 2: Grammar & Sentence Structure (Tenses, Conditionals)",
        "Unit 3: Vocabulary in Context & Idioms",
        "Unit 4: Communicative Activities & Social Discourse"
      ],
      examWeight: "15% of Entrance Exam",
      totalQuestions: 1450,
      pastYears: ["2016 E.C.", "2015 E.C.", "2014 E.C.", "2013 E.C."]
    }
  ];

  const socialSubjects = [
    {
      id: "history",
      name: "History",
      icon: <BookOpen className="w-6 h-6 text-amber-600" />,
      units: [
        "Unit 1: Medieval Ethiopian State Formation & Foreign Relations",
        "Unit 2: Modern Ethiopian Unification & Battle of Adwa",
        "Unit 3: World Wars & Global Anti-Colonial Movements",
        "Unit 4: The 1974 Ethiopian Revolution & Contemporary Era"
      ],
      examWeight: "22% of Entrance Exam",
      totalQuestions: 1320,
      pastYears: ["2016 E.C.", "2015 E.C.", "2014 E.C."]
    },
    {
      id: "geography",
      name: "Geography",
      icon: <BookOpen className="w-6 h-6 text-amber-600" />,
      units: [
        "Unit 1: Physical Geography of Ethiopia & the Horn",
        "Unit 2: Drainage Systems, Climate Zones & Soil Resources",
        "Unit 3: Population Geography & Urbanization Trends",
        "Unit 4: GIS, Remote Sensing & Topographical Map Reading"
      ],
      examWeight: "20% of Entrance Exam",
      totalQuestions: 1250,
      pastYears: ["2016 E.C.", "2015 E.C.", "2014 E.C."]
    },
    {
      id: "economics",
      name: "Economics",
      icon: <TrendingUp className="w-6 h-6 text-amber-600" />,
      units: [
        "Unit 1: Microeconomics (Demand, Supply, Elasticity, Markets)",
        "Unit 2: Macroeconomic Indicators (GDP, Inflation, Fiscal Policy)",
        "Unit 3: The Ethiopian Economy & Agricultural Sector Transformation",
        "Unit 4: International Trade & Foreign Exchange"
      ],
      examWeight: "20% of Entrance Exam",
      totalQuestions: 1180,
      pastYears: ["2016 E.C.", "2015 E.C.", "2014 E.C."]
    },
    {
      id: "civics",
      name: "Civics & Ethical Education",
      icon: <ShieldCheck className="w-6 h-6 text-amber-600" />,
      units: [
        "Unit 1: Constitutionalism & Rule of Law",
        "Unit 2: Human Rights & Citizen Responsibilities",
        "Unit 3: Justice, Equality & Conflict Resolution",
        "Unit 4: Patriotism, Hard Work & Community Development"
      ],
      examWeight: "15% of Entrance Exam",
      totalQuestions: 1100,
      pastYears: ["2016 E.C.", "2015 E.C.", "2014 E.C."]
    },
    {
      id: "english_soc",
      name: "English Language",
      icon: <BookOpen className="w-6 h-6 text-amber-600" />,
      units: [
        "Unit 1: Advanced Reading Comprehension",
        "Unit 2: Analytical Grammar & Structural Syntax",
        "Unit 3: Lexicon, Collocations & Formal Communication",
        "Unit 4: Academic Writing Mechanics"
      ],
      examWeight: "15% of Entrance Exam",
      totalQuestions: 1450,
      pastYears: ["2016 E.C.", "2015 E.C.", "2014 E.C."]
    },
    {
      id: "aptitude_soc",
      name: "Scholastic Aptitude",
      icon: <Brain className="w-6 h-6 text-amber-600" />,
      units: [
        "Section 1: Verbal Comprehension & Logic",
        "Section 2: Critical Thinking & Data Tables",
        "Section 3: Inductive & Deductive Reasoning",
        "Section 4: Pattern Completion"
      ],
      examWeight: "15% of Entrance Exam",
      totalQuestions: 980,
      pastYears: ["2016 E.C.", "2015 E.C.", "2014 E.C."]
    }
  ];

  const isJunior = selectedGrade <= 10;
  const [juniorCategory, setJuniorCategory] = useState<"all" | "natural" | "social">("all");

  const combinedSubjects = useMemo(() => {
    const map = new Map<string, any>();
    naturalSubjects.forEach((s) => map.set(s.name, s));
    socialSubjects.forEach((s) => map.set(s.name, s));
    return Array.from(map.values());
  }, []);

  const currentSubjects = useMemo(() => {
    if (isJunior) {
      if (juniorCategory === "natural") return naturalSubjects;
      if (juniorCategory === "social") return socialSubjects;
      return combinedSubjects;
    }
    return selectedStream === "Natural Science" ? naturalSubjects : socialSubjects;
  }, [isJunior, juniorCategory, selectedStream, combinedSubjects]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-[#0F2744] via-[#143257] to-[#0F2744] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
            <BookOpen className="w-3.5 h-3.5" />
            Official Ethiopian Curriculum Repository
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
            National Academic Syllabi & Past Exam Archives
          </h1>
          <p className="text-slate-300 text-base max-w-2xl mx-auto leading-relaxed">
            Unit-by-unit curriculum outlines, past entrance papers (2012–2016 E.C.), and exam topic weight distributions approved by the Ministry of Education.
          </p>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-3">
            {/* Grade Switcher */}
            <div className="p-1 rounded-2xl bg-white/10 border border-white/20 backdrop-blur flex">
              {[12, 11, 10, 9].map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGrade(g)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedGrade === g
                      ? "bg-amber-500 text-slate-950 shadow"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  Grade {g}
                </button>
              ))}
            </div>

            {!isJunior ? (
              <div className="p-1 rounded-2xl bg-white/10 border border-white/20 backdrop-blur flex">
                <button
                  onClick={() => setSelectedStream("Natural Science")}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    selectedStream === "Natural Science"
                      ? "bg-white text-slate-950 shadow"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  <FlaskConical className="w-4 h-4 text-sky-500" />
                  <span>Natural Science Stream</span>
                </button>
                <button
                  onClick={() => setSelectedStream("Social Science")}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    selectedStream === "Social Science"
                      ? "bg-white text-slate-950 shadow"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  <Scale className="w-4 h-4 text-amber-500" />
                  <span>Social Science Stream</span>
                </button>
              </div>
            ) : (
              <div className="p-1 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 backdrop-blur flex">
                <button
                  onClick={() => setJuniorCategory("all")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    juniorCategory === "all" ? "bg-white text-slate-950 shadow" : "text-emerald-200 hover:text-white"
                  }`}
                >
                  All Courses (Natural & Social)
                </button>
                <button
                  onClick={() => setJuniorCategory("natural")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    juniorCategory === "natural" ? "bg-white text-slate-950 shadow" : "text-emerald-200 hover:text-white"
                  }`}
                >
                  Natural Sciences
                </button>
                <button
                  onClick={() => setJuniorCategory("social")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    juniorCategory === "social" ? "bg-white text-slate-950 shadow" : "text-emerald-200 hover:text-white"
                  }`}
                >
                  Social Sciences
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Subject List */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {isJunior && (
          <div className="mb-8 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs sm:text-sm font-bold">
                Ethiopian MoE Unified Curriculum for Grade {selectedGrade}
              </p>
              <p className="text-xs text-emerald-700 mt-0.5">
                Students in Grade 9 and 10 are not categorized into streams. You take both Natural Science (Physics, Chemistry, Biology) and Social Science (History, Geography, Economics, Civics) courses concurrently. Stream specialization begins in Grade 11.
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <div>
            <h2 className="font-serif text-2xl font-bold text-slate-900">
              {isJunior ? `Grade ${selectedGrade} Unified Curriculum` : `${selectedStream} — Grade ${selectedGrade}`}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing official national curriculum units and verified question banks.
            </p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/80 text-slate-700 text-xs font-semibold">
            {currentSubjects.length} Core Examination Subjects
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {currentSubjects.map((sub, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                      {sub.icon}
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-xl text-slate-900">{sub.name}</h3>
                      <p className="text-xs font-semibold text-amber-600">{sub.examWeight}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                    {sub.totalQuestions} Questions
                  </span>
                </div>

                <div className="my-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Curriculum Units Covered</p>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {sub.units.map((unit, uIdx) => (
                      <li key={uIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{unit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Archived Past Papers</p>
                  <div className="flex flex-wrap gap-1.5">
                    {sub.pastYears.map((yr, yIdx) => (
                      <span key={yIdx} className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-[11px] font-medium text-slate-700">
                        {yr}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to={`/student/practice?subject=${encodeURIComponent(sub.name)}`}
                  className="px-5 py-2.5 rounded-xl font-bold bg-[#0F2744] hover:bg-[#143257] text-white text-xs flex items-center gap-1.5 shadow transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Practice {sub.name}</span>
                </Link>
                <Link
                  to={`/student/session?subject=${encodeURIComponent(sub.name)}`}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700"
                >
                  1v1 Battle Quiz &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
