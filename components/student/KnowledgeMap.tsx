import React, { useState, useEffect, useMemo } from "react";
import { 
  Network, 
  Brain, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  Target, 
  Zap, 
  Search, 
  ChevronRight,
  Filter,
  GraduationCap
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLearningStore } from "../../store/learningStore";

interface ConceptItem {
  id: string;
  name: string;
  subject: string;
  grade: number;
  unit: number;
  unitName: string;
  prerequisites: string[]; // ids
  mastery: number; // 0 to 100
  stabilityDays: number;
  eueeFrequency: string;
  avgEueeMarks: number;
  status: "mastered" | "in_progress" | "needs_review" | "locked";
  description: string;
}

const SAMPLE_CONCEPTS: ConceptItem[] = [
  // Mathematics
  {
    id: "math_g9_algebra",
    name: "Fundamental Algebraic Operations",
    subject: "Mathematics",
    grade: 9,
    unit: 1,
    unitName: "Real Numbers & Expressions",
    prerequisites: [],
    mastery: 95,
    stabilityDays: 45,
    eueeFrequency: "Medium",
    avgEueeMarks: 4,
    status: "mastered",
    description: "Polynomial operations, factoring quadratics, rational expressions and exponent rules."
  },
  {
    id: "math_g10_linear",
    name: "Linear Equations & Inequalities",
    subject: "Mathematics",
    grade: 10,
    unit: 2,
    unitName: "Algebraic Systems",
    prerequisites: ["math_g9_algebra"],
    mastery: 90,
    stabilityDays: 32,
    eueeFrequency: "High",
    avgEueeMarks: 6,
    status: "mastered",
    description: "Simultaneous 2x2 and 3x3 systems, matrix determinant solutions, graphical boundary representations."
  },
  {
    id: "math_g11_quadratic",
    name: "Quadratic Functions & Discriminants",
    subject: "Mathematics",
    grade: 11,
    unit: 1,
    unitName: "Relations & Functions",
    prerequisites: ["math_g10_linear"],
    mastery: 82,
    stabilityDays: 18,
    eueeFrequency: "Very High",
    avgEueeMarks: 8,
    status: "in_progress",
    description: "Vertex form, nature of roots via discriminant, parabolic optimization in projectile problems."
  },
  {
    id: "math_g12_polynomial",
    name: "Higher-Degree Polynomials & Rational Functions",
    subject: "Mathematics",
    grade: 12,
    unit: 2,
    unitName: "Polynomials",
    prerequisites: ["math_g11_quadratic"],
    mastery: 64,
    stabilityDays: 5,
    eueeFrequency: "Very High",
    avgEueeMarks: 10,
    status: "needs_review",
    description: "Remainder & Factor theorems, synthetic division, finding rational zeros and oblique asymptotes."
  },
  {
    id: "math_g12_calculus_limits",
    name: "Limits & Continuity",
    subject: "Mathematics",
    grade: 12,
    unit: 3,
    unitName: "Introduction to Calculus",
    prerequisites: ["math_g12_polynomial"],
    mastery: 55,
    stabilityDays: 3,
    eueeFrequency: "Very High",
    avgEueeMarks: 12,
    status: "needs_review",
    description: "Epsilon-delta intuition, algebraic evaluation of 0/0 indeterminate forms, continuity on compact intervals."
  },
  {
    id: "math_g12_derivatives",
    name: "Derivatives & Rate of Change",
    subject: "Mathematics",
    grade: 12,
    unit: 4,
    unitName: "Calculus",
    prerequisites: ["math_g12_calculus_limits"],
    mastery: 20,
    stabilityDays: 1,
    eueeFrequency: "Very High",
    avgEueeMarks: 14,
    status: "locked",
    description: "Chain rule, product and quotient rules, implicit differentiation and physical applications."
  },

  // Physics
  {
    id: "phys_g9_vectors",
    name: "Vectors & Scalar Quantities",
    subject: "Physics",
    grade: 9,
    unit: 1,
    unitName: "Physical Quantities",
    prerequisites: [],
    mastery: 92,
    stabilityDays: 38,
    eueeFrequency: "High",
    avgEueeMarks: 6,
    status: "mastered",
    description: "Component decomposition, vector addition via parallelogram rule, dot and cross products."
  },
  {
    id: "phys_g10_kinematics",
    name: "2D Kinematics & Projectile Motion",
    subject: "Physics",
    grade: 10,
    unit: 2,
    unitName: "Motion in Two Dimensions",
    prerequisites: ["phys_g9_vectors"],
    mastery: 85,
    stabilityDays: 24,
    eueeFrequency: "Very High",
    avgEueeMarks: 9,
    status: "mastered",
    description: "Trajectory equations, range, maximum height, flight time with symmetric and elevated landing."
  },
  {
    id: "phys_g11_newtons_laws",
    name: "Newtonian Dynamics & Friction",
    subject: "Physics",
    grade: 11,
    unit: 2,
    unitName: "Dynamics",
    prerequisites: ["phys_g10_kinematics"],
    mastery: 78,
    stabilityDays: 14,
    eueeFrequency: "Very High",
    avgEueeMarks: 11,
    status: "in_progress",
    description: "Free body diagrams, static vs kinetic friction, inclined planes, Atwood machines."
  },
  {
    id: "phys_g12_electromagnetism",
    name: "Electromagnetic Induction & Faraday's Law",
    subject: "Physics",
    grade: 12,
    unit: 4,
    unitName: "Electromagnetism",
    prerequisites: ["phys_g11_newtons_laws"],
    mastery: 48,
    stabilityDays: 3,
    eueeFrequency: "Very High",
    avgEueeMarks: 15,
    status: "needs_review",
    description: "Magnetic flux, Lenz's law direction rule, induced EMF in rotating coils and transformers."
  },

  // Chemistry
  {
    id: "chem_g11_stoichiometry",
    name: "Chemical Stoichiometry & Gas Laws",
    subject: "Chemistry",
    grade: 11,
    unit: 2,
    unitName: "Stoichiometry",
    prerequisites: [],
    mastery: 88,
    stabilityDays: 28,
    eueeFrequency: "Very High",
    avgEueeMarks: 10,
    status: "mastered",
    description: "Limiting reagents, theoretical yield, ideal gas equation PV=nRT, Dalton's law of partial pressures."
  },
  {
    id: "chem_g12_electrochemistry",
    name: "Galvanic Cells & Standard Potentials",
    subject: "Chemistry",
    grade: 12,
    unit: 4,
    unitName: "Electrochemistry",
    prerequisites: ["chem_g11_stoichiometry"],
    mastery: 52,
    stabilityDays: 4,
    eueeFrequency: "Very High",
    avgEueeMarks: 12,
    status: "needs_review",
    description: "Nernst equation, Gibbs free energy relation, electrolytic reduction and Faraday's laws."
  }
];

export default function KnowledgeMap(): React.ReactElement {
  const navigate = useNavigate();
  const { masteryMap, fetchMasteryMap } = useLearningStore();
  const [selectedSubject, setSelectedSubject] = useState<string>("Mathematics");
  const [selectedGrade, setSelectedGrade] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeConcept, setActiveConcept] = useState<ConceptItem>(SAMPLE_CONCEPTS[3]); // Default polynomial

  useEffect(() => {
    fetchMasteryMap();
  }, [fetchMasteryMap]);

  const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "English"];

  const filteredConcepts = useMemo(() => {
    return SAMPLE_CONCEPTS.filter((c) => {
      if (c.subject !== selectedSubject) return false;
      if (selectedGrade !== "all" && c.grade !== selectedGrade) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return c.name.toLowerCase().includes(q) || c.unitName.toLowerCase().includes(q);
      }
      return true;
    });
  }, [selectedSubject, selectedGrade, searchQuery]);

  const subjectStats = useMemo(() => {
    const list = SAMPLE_CONCEPTS.filter((c) => c.subject === selectedSubject);
    if (!list.length) return { avgMastery: 0, masteredCount: 0, reviewCount: 0, totalMarks: 0 };
    const avg = Math.round(list.reduce((acc, cur) => acc + cur.mastery, 0) / list.length);
    const mastered = list.filter((c) => c.status === "mastered").length;
    const review = list.filter((c) => c.status === "needs_review").length;
    const marks = list.reduce((acc, cur) => acc + cur.avgEueeMarks, 0);
    return { avgMastery: avg, masteredCount: mastered, reviewCount: review, totalMarks: marks };
  }, [selectedSubject]);

  const getStatusBadge = (status: ConceptItem["status"]) => {
    switch (status) {
      case "mastered":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Mastered (90%+)
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <Brain className="w-3 h-3" /> In Progress
          </span>
        );
      case "needs_review":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">
            <AlertTriangle className="w-3 h-3" /> Forgetting Risk
          </span>
        );
      case "locked":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            <Lock className="w-3 h-3" /> Prerequisite Required
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold backdrop-blur-md border border-indigo-500/30">
              <Network className="w-3.5 h-3.5" />
              <span>Cognitive Architecture & Prerequisite Dependency Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Curriculum Knowledge Graph
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Why students fail EUEE questions: they attempt Grade 12 concepts without Grade 9-10 mastery.
              Our knowledge graph maps every prerequisite link so you eliminate foundational gaps and lock in 500+ out of 600.
            </p>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-2.5 rounded-2xl text-center">
              <div className="text-2xl font-black text-amber-400">{subjectStats.avgMastery}%</div>
              <div className="text-[11px] text-slate-300 font-medium">Subject Mastery</div>
            </div>
            <button
              onClick={() => navigate("/student/spaced-review")}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>Review Due Concepts</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Subject Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {subjects.map((sub) => (
            <button
              key={sub}
              onClick={() => {
                setSelectedSubject(sub);
                const first = SAMPLE_CONCEPTS.find((c) => c.subject === sub);
                if (first) setActiveConcept(first);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedSubject === sub
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {(["all", 9, 10, 11, 12] as const).map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGrade(g)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedGrade === g
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {g === "all" ? "All Grades" : `G${g}`}
              </button>
            ))}
          </div>

          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
            <span>Prerequisite Learning Progression (Foundations → EUEE Mastery)</span>
            <span>{filteredConcepts.length} Concepts Mapped</span>
          </div>

          <div className="space-y-3">
            {filteredConcepts.map((concept, idx) => {
              const isSelected = activeConcept?.id === concept.id;
              const hasPrereqs = concept.prerequisites.length > 0;

              return (
                <div
                  key={concept.id}
                  onClick={() => setActiveConcept(concept)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative group ${
                    isSelected
                      ? "bg-white border-indigo-600 shadow-md ring-2 ring-indigo-500/20"
                      : "bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-xs"
                  }`}
                >
                  
                  {hasPrereqs && (
                    <div className="absolute -top-3 left-8 w-0.5 h-3 bg-indigo-300" />
                  )}

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        concept.status === "mastered"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                          : concept.status === "needs_review"
                          ? "bg-amber-50 text-amber-600 border border-amber-200"
                          : concept.status === "locked"
                          ? "bg-slate-100 text-slate-400 border border-slate-200"
                          : "bg-blue-50 text-blue-600 border border-blue-200"
                      }`}>
                        G{concept.grade}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {concept.name}
                          </h3>
                          {getStatusBadge(concept.status)}
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1">
                          Unit {concept.unit}: {concept.unitName}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold text-slate-900">{concept.mastery}%</div>
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            concept.mastery >= 85
                              ? "bg-emerald-500"
                              : concept.mastery >= 60
                              ? "bg-blue-500"
                              : "bg-amber-500"
                          }`}
                          style={{ width: `${concept.mastery}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium mt-0.5 block">
                        ~{concept.avgEueeMarks} EUEE Marks
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-5 sticky top-20">
          {activeConcept ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                    Grade {activeConcept.grade} • Unit {activeConcept.unit}
                  </span>
                  {getStatusBadge(activeConcept.status)}
                </div>
                <h2 className="text-xl font-black text-slate-900 leading-tight">
                  {activeConcept.name}
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {activeConcept.description}
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="text-xs text-slate-500 font-medium">Memory Stability</div>
                  <div className="text-lg font-black text-slate-900 mt-0.5">
                    {activeConcept.stabilityDays} Days
                  </div>
                  <div className="text-[10px] text-slate-400">FSRS Retention Window</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="text-xs text-slate-500 font-medium">EUEE Frequency</div>
                  <div className="text-lg font-black text-amber-600 mt-0.5">
                    {activeConcept.eueeFrequency}
                  </div>
                  <div className="text-[10px] text-slate-400">~{activeConcept.avgEueeMarks} Marks in Exam</div>
                </div>
              </div>

              {/* Prerequisite Chain Analysis */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  <span>Prerequisite Dependency Check</span>
                </div>

                {activeConcept.prerequisites.length === 0 ? (
                  <p className="text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                    ✅ Foundation Concept: No prior prerequisites required. Start directly!
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {activeConcept.prerequisites.map((prereqId) => {
                      const prereq = SAMPLE_CONCEPTS.find((c) => c.id === prereqId);
                      if (!prereq) return null;
                      return (
                        <div
                          key={prereq.id}
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-800">{prereq.name}</span>
                            <span className="text-[10px] text-slate-400">G{prereq.grade}</span>
                          </div>
                          <span className={`text-[11px] font-bold ${
                            prereq.mastery >= 80 ? "text-emerald-600" : "text-amber-600"
                          }`}>
                            {prereq.mastery}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* High-Impact Actions */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => navigate("/student/practice")}
                  className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Practice Adaptive Questions for this Concept</span>
                </button>

                <button
                  onClick={() => navigate("/student/ai-tutor")}
                  className="w-full py-2.5 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs rounded-xl border border-indigo-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Brain className="w-4 h-4" />
                  <span>Socratic Tutor: Explain Why This Matters for EUEE</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-8 text-center text-slate-400 text-xs">
              Select any concept node on the left to inspect prerequisite dependencies and mastery telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
