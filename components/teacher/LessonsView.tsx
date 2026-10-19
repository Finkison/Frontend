import React, { useState } from "react";
import useAuthStore from "../../store/authStore";
import { 
  BookOpen, 
  Plus, 
  Clock, 
  Calendar, 
  Check, 
  Search, 
  Filter, 
  Printer, 
  Layers, 
  X, 
  ChevronRight,
  FileText,
  Target,
  Sparkles,
  Users
} from "lucide-react";
import { useToast } from "../ui/Toast";

interface LessonBlock {
  phase: string;
  durationMins: number;
  activity: string;
  notes: string;
}

interface LessonPlanItem {
  id: string;
  code: string;
  title: string;
  unit: number;
  unitName: string;
  sections: string[];
  durationMins: number;
  competencyOutcome: string;
  textbookReference: string;
  status: "Ready" | "In progress" | "Draft";
  scheduledDate: string;
  structure: LessonBlock[];
  differentiation: {
    scaffolding: string;
    extension: string;
  };
}

export default function TeacherLessonsView(): React.ReactElement {
  const { showToast } = useToast();
  const { user } = useAuthStore();
  const teacherSubject = (user as any)?.subject || "Biology";

  const [selectedUnit, setSelectedUnit] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLesson, setSelectedLesson] = useState<LessonPlanItem | null>(null);
  const [isCreatingModalOpen, setIsCreatingModalOpen] = useState(false);

  // New lesson form state
  const [newTitle, setNewTitle] = useState("");
  const [newUnit, setNewUnit] = useState(4);
  const [newCompetency, setNewCompetency] = useState("");
  const [newTextbookRef, setNewTextbookRef] = useState("");
  const [newSections, setNewSections] = useState<string[]>(["12-A", "12-B"]);

  const [lessons, setLessons] = useState<LessonPlanItem[]>([
    {
      id: "l-1",
      code: "BIO-12-4.1",
      title: "Introduction to Cellular Energetics & ATP Structure",
      unit: 4,
      unitName: "Cell Physiology & Metabolism",
      sections: ["12-A", "12-B"],
      durationMins: 45,
      competencyOutcome: "Explain the biochemical architecture of ATP and how phosphoanhydride bond hydrolysis drives endergonic cellular work.",
      textbookReference: "MoE Grade 12 Biology, Chapter 4, pp. 112–119",
      status: "Ready",
      scheduledDate: "Today, Period 2",
      structure: [
        { phase: "Starter (00–05m)", durationMins: 5, activity: "Retrieval Quiz", notes: "Review endergonic vs exergonic reactions on whiteboard." },
        { phase: "Direct Instruction (05–20m)", durationMins: 15, activity: "Biochemical Modeling", notes: "Demonstrate ATP hydrolysis stoichiometry (ATP + H2O -> ADP + Pi + 30.5 kJ/mol)." },
        { phase: "Guided Practice (20–35m)", durationMins: 15, activity: "Phosphorylation Exercises", notes: "Pair students to calculate energy coupling in sodium-potassium ATPase pump." },
        { phase: "Plenary & Exit Ticket (35–45m)", durationMins: 10, activity: "Formative Check", notes: "3-question rapid exit ticket on ATP synthesis mechanisms." }
      ],
      differentiation: {
        scaffolding: "Provide annotated biochemical diagram templates for students scoring < 60%.",
        extension: "Calculate thermodynamic free energy delta G in non-standard cellular conditions."
      }
    },
    {
      id: "l-2",
      code: "BIO-12-4.2",
      title: "Glycolysis & Cytoplasmic Fermentation Pathways",
      unit: 4,
      unitName: "Cell Physiology & Metabolism",
      sections: ["12-A", "12-B"],
      durationMins: 45,
      competencyOutcome: "Trace the 10-step enzymatic sequence of glycolysis from glucose to pyruvate, identifying net ATP and NADH yield.",
      textbookReference: "MoE Grade 12 Biology, Chapter 4, pp. 120–128",
      status: "Ready",
      scheduledDate: "Tomorrow, Period 4",
      structure: [
        { phase: "Starter (00–05m)", durationMins: 5, activity: "ATP Yield Flash Recall", notes: "Quick question on substrate-level phosphorylation." },
        { phase: "Direct Instruction (05–20m)", durationMins: 15, activity: "Pathway Mapping", notes: "Energy investment phase vs energy payoff phase diagrams." },
        { phase: "Guided Practice (20–35m)", durationMins: 15, activity: "Enzyme Regulation Analysis", notes: "Phosphofructokinase allosteric regulation problem set in small groups." },
        { phase: "Plenary & Exit Ticket (35–45m)", durationMins: 10, activity: "Pathway Summary", notes: "Summarize lactate vs ethanol fermentation in oxygen-depleted environments." }
      ],
      differentiation: {
        scaffolding: "Step-by-step flowchart with missing cofactor blanks.",
        extension: "Analyze Pasteur effect and Warburg effect in rapid tumor glycolysis."
      }
    },
    {
      id: "l-3",
      code: "BIO-12-4.3",
      title: "Citric Acid Cycle & Oxidative Phosphorylation",
      unit: 4,
      unitName: "Cell Physiology & Metabolism",
      sections: ["12-A"],
      durationMins: 45,
      competencyOutcome: "Diagram mitochondrial electron transport chain complexes I–IV, proton motive force, and chemiosmotic ATP synthase action.",
      textbookReference: "MoE Grade 12 Biology, Chapter 4, pp. 129–137",
      status: "In progress",
      scheduledDate: "Thursday, Period 1",
      structure: [
        { phase: "Starter (00–05m)", durationMins: 5, activity: "Mitochondrial Anatomy Recall", notes: "Label inner mitochondrial membrane and matrix cristae." },
        { phase: "Direct Instruction (05–20m)", durationMins: 15, activity: "ETC Flow Mechanics", notes: "Detail NADH and FADH2 electron donation and proton pumping." },
        { phase: "Guided Practice (20–35m)", durationMins: 15, activity: "Uncoupler Analysis", notes: "Predict effect of DNP uncoupling chemical on ATP yield and thermogenesis." },
        { phase: "Plenary & Exit Ticket (35–45m)", durationMins: 10, activity: "Calculation Check", notes: "Calculate theoretical maximum 30–32 ATP yield per glucose molecule." }
      ],
      differentiation: {
        scaffolding: "Physical paper models representing protons crossing through ATP synthase channel.",
        extension: "Research cyanide poison inhibition on Cytochrome c oxidase (Complex IV)."
      }
    },
    {
      id: "l-4",
      code: "BIO-12-3.4",
      title: "Mendelian Genetics: Dihybrid Crosses & Gene Linkage",
      unit: 3,
      unitName: "Genetics & Molecular Inheritance",
      sections: ["12-B"],
      durationMins: 45,
      competencyOutcome: "Calculate 9:3:3:1 phenotypic ratios, testcross outcomes, and identify recombinant frequencies indicative of autosomal linkage.",
      textbookReference: "MoE Grade 12 Biology, Chapter 3, pp. 84–95",
      status: "Ready",
      scheduledDate: "Friday, Period 3",
      structure: [
        { phase: "Starter (00–05m)", durationMins: 5, activity: "Monohybrid 3:1 Check", notes: "Quick review of law of segregation." },
        { phase: "Direct Instruction (05–20m)", durationMins: 15, activity: "Punnett Grid Modeling", notes: "Demonstrate independent assortment with seed shape and color." },
        { phase: "Guided Practice (20–35m)", durationMins: 15, activity: "Problem Set", notes: "Students solve 3 complex inheritance scenarios individually." },
        { phase: "Plenary & Exit Ticket (35–45m)", durationMins: 10, activity: "Self-Check", notes: "Swap and peer grade practice calculations." }
      ],
      differentiation: {
        scaffolding: "Pre-printed 4x4 Punnett grids with gamete headers filled in.",
        extension: "Chi-square goodness-of-fit test on experimental offspring counts."
      }
    }
  ]);

  const handleCreateLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newLesson: LessonPlanItem = {
      id: `l-${Date.now()}`,
      code: `BIO-12-${newUnit}.${lessons.length + 1}`,
      title: newTitle.trim(),
      unit: newUnit,
      unitName: newUnit === 4 ? "Cell Physiology & Metabolism" : newUnit === 3 ? "Genetics & Molecular Inheritance" : "Unit Studies",
      sections: newSections,
      durationMins: 45,
      competencyOutcome: newCompetency || "Explain core subject competencies aligned with MoE national secondary standards.",
      textbookReference: newTextbookRef || `MoE Grade 12 Biology, Chapter ${newUnit}`,
      status: "Ready",
      scheduledDate: "Next week",
      structure: [
        { phase: "Starter (00–05m)", durationMins: 5, activity: "Prior knowledge recall", notes: "Bellringer question." },
        { phase: "Direct Instruction (05–20m)", durationMins: 15, activity: "Core concept lecture", notes: "Instruction and whiteboard modeling." },
        { phase: "Guided Practice (20–35m)", durationMins: 15, activity: "Structured problem set", notes: "Collaborative student tasks." },
        { phase: "Plenary & Exit Ticket (35–45m)", durationMins: 10, activity: "Exit ticket check", notes: "Formative verification check." }
      ],
      differentiation: {
        scaffolding: "Provide structured study guide and visual vocabulary bank.",
        extension: "Higher-order analytical problem solving."
      }
    };

    setLessons([newLesson, ...lessons]);
    setIsCreatingModalOpen(false);
    setNewTitle("");
    setNewCompetency("");
    setNewTextbookRef("");
    showToast({
      title: "Lesson plan created",
      message: `Lesson "${newLesson.title}" has been saved to your scheme of work.`,
      type: "success"
    });
  };

  const filteredLessons = lessons.filter((l) => {
    if (selectedUnit !== "all" && String(l.unit) !== selectedUnit) return false;
    if (searchQuery.trim() && !l.title.toLowerCase().includes(searchQuery.toLowerCase()) && !l.code.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-[#0F172A] tracking-tight">Lessons</h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
              {teacherSubject}
            </span>
          </div>
          <p className="text-xs text-[#475569] mt-0.5">
            Lesson plans, textbook alignments, and pacing guides for assigned sections.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreatingModalOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-[8px] bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold shadow-xs cursor-pointer min-h-[40px]"
        >
          <Plus className="w-4 h-4" />
          <span>New lesson plan</span>
        </button>
      </div>

      {/* Telemetry Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-[#E2E8F0] rounded-[8px] shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Planned lessons</div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#0F172A] font-mono">{lessons.length}</span>
            <span className="text-xs text-slate-500 font-medium">Semester 1</span>
          </div>
        </div>
        <div className="p-4 bg-white border border-[#E2E8F0] rounded-[8px] shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Ready to teach</div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-700 font-mono">
              {lessons.filter((l) => l.status === "Ready").length}
            </span>
            <span className="text-xs text-emerald-600 font-medium">Materials verified</span>
          </div>
        </div>
        <div className="p-4 bg-white border border-[#E2E8F0] rounded-[8px] shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Pacing</div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#1D4ED8] font-mono">Unit 4</span>
            <span className="text-xs text-blue-600 font-medium">On schedule</span>
          </div>
        </div>
        <div className="p-4 bg-white border border-[#E2E8F0] rounded-[8px] shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Teaching load</div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-700 font-mono">12 hrs</span>
            <span className="text-xs text-slate-500 font-medium">16 periods</span>
          </div>
        </div>
      </div>

      {/* Search & Unit Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 border border-[#E2E8F0] rounded-[8px] shadow-xs text-xs">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by lesson code or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-[#E2E8F0] rounded-[6px] text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#1D4ED8]"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="px-2.5 py-1.5 border border-[#E2E8F0] rounded-[6px] bg-white text-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#1D4ED8]"
            >
              <option value="all">All curriculum units</option>
              <option value="3">Unit 3: Genetics & Molecular Inheritance</option>
              <option value="4">Unit 4: Cell Physiology & Metabolism</option>
              <option value="5">Unit 5: Human Systems</option>
            </select>
          </div>
        </div>

        <div className="text-slate-500 text-[11px] self-center">
          Period duration: 45 minutes
        </div>
      </div>

      {/* Lessons Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-[8px] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Lesson code & topic</th>
                <th className="py-3 px-4">Curriculum unit</th>
                <th className="py-3 px-4">Sections</th>
                <th className="py-3 px-4">Scheduled window</th>
                <th className="py-3 px-4">Textbook alignment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-[#0F172A]">
              {filteredLessons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                    No lesson plans found for the selected unit filter.
                  </td>
                </tr>
              ) : (
                filteredLessons.map((les) => (
                  <tr key={les.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#0F172A]">{les.title}</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">{les.code}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-[4px] bg-slate-100 text-slate-700 font-semibold text-[11px]">
                        Unit {les.unit}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        {les.sections.map((s) => (
                          <span key={s} className="px-1.5 py-0.5 bg-[#EFF6FF] text-[#1D4ED8] rounded font-semibold text-[10px] border border-[#BFDBFE]">
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{les.scheduledDate}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-500 max-w-xs truncate text-[11px]">
                      {les.textbookReference}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        les.status === "Ready"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}>
                        {les.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedLesson(les)}
                        className="px-2.5 py-1.5 rounded-[6px] border border-[#E2E8F0] hover:bg-[#EFF6FF] text-[#1D4ED8] font-semibold text-xs cursor-pointer inline-flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View plan</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lesson Plan Detail Drawer / Modal */}
      {selectedLesson && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-[8px] shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {selectedLesson.code}
                  </span>
                  <h2 className="text-base font-semibold text-[#0F172A]">{selectedLesson.title}</h2>
                </div>
                <p className="text-xs text-[#475569] mt-0.5">
                  Unit {selectedLesson.unit}: {selectedLesson.unitName} • 45 Minutes
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLesson(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {/* Target Learning Outcome */}
              <div className="p-3.5 bg-[#EFF6FF] border border-[#BFDBFE] rounded-[6px] space-y-1">
                <div className="font-semibold text-[#1D4ED8] flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" />
                  <span>Learning outcome</span>
                </div>
                <p className="text-[#0F172A] leading-relaxed">
                  {selectedLesson.competencyOutcome}
                </p>
                <div className="text-[11px] text-slate-500 pt-1">
                  Textbook: <span className="font-medium text-slate-700">{selectedLesson.textbookReference}</span>
                </div>
              </div>

              {/* 45-Minute Lesson Breakdown Timeline */}
              <div>
                <h3 className="font-semibold text-[#0F172A] mb-2">Instructional structure</h3>
                <div className="space-y-2">
                  {selectedLesson.structure.map((phase, idx) => (
                    <div key={idx} className="p-3 border border-[#E2E8F0] rounded-[6px] bg-[#F8FAFC]">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#0F172A]">{phase.phase}</span>
                        <span className="font-mono text-[11px] text-slate-500 font-semibold px-2 py-0.5 rounded bg-white border border-[#E2E8F0]">
                          {phase.activity}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-1">
                        {phase.notes}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pedagogical Differentiation */}
              <div>
                <h3 className="font-semibold text-[#0F172A] mb-2">Differentiation</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 border border-amber-200 bg-amber-50/40 rounded-[6px]">
                    <div className="font-semibold text-amber-800 text-[11px]">Scaffolding</div>
                    <p className="text-slate-600 text-[11px] mt-1">{selectedLesson.differentiation.scaffolding}</p>
                  </div>
                  <div className="p-3 border border-blue-200 bg-blue-50/40 rounded-[6px]">
                    <div className="font-semibold text-blue-800 text-[11px]">Extension</div>
                    <p className="text-slate-600 text-[11px] mt-1">{selectedLesson.differentiation.extension}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] border border-[#E2E8F0] bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print lesson plan</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedLesson(null)}
                className="px-3.5 py-1.5 rounded-[6px] border border-[#E2E8F0] bg-white hover:bg-slate-50 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Lesson Modal */}
      {isCreatingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-[8px] shadow-xl w-full max-w-lg">
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-[#0F172A]">Create new lesson plan</h2>
                <p className="text-xs text-[#475569]">{teacherSubject} curriculum</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreatingModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateLesson} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#0F172A] mb-1">Lesson Topic & Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Enzyme Catalysis and Substrate Specificity"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-[6px] text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#1D4ED8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0F172A] mb-1">Curriculum Unit</label>
                  <select
                    value={newUnit}
                    onChange={(e) => setNewUnit(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#E2E8F0] rounded-[6px] bg-white text-xs"
                  >
                    <option value={1}>Unit 1: Biochemical Fundamentals</option>
                    <option value={2}>Unit 2: Cellular Structures</option>
                    <option value={3}>Unit 3: Genetics & Molecular Inheritance</option>
                    <option value={4}>Unit 4: Cell Physiology & Metabolism</option>
                    <option value={5}>Unit 5: Human Systems</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#0F172A] mb-1">Assigned Sections</label>
                  <input
                    type="text"
                    disabled
                    value="12-A, 12-B"
                    className="w-full px-3 py-2 border border-[#E2E8F0] rounded-[6px] bg-slate-50 text-slate-600 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0F172A] mb-1">Target Competency Outcome</label>
                <textarea
                  rows={2}
                  placeholder="What should students master by the end of this 45-minute lesson?"
                  value={newCompetency}
                  onChange={(e) => setNewCompetency(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-[6px] text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#1D4ED8]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0F172A] mb-1">MoE Textbook Reference</label>
                <input
                  type="text"
                  placeholder="e.g. Grade 12 Biology, Chapter 4, pp. 138–146"
                  value={newTextbookRef}
                  onChange={(e) => setNewTextbookRef(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-[6px] text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#1D4ED8]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingModalOpen(false)}
                  className="px-3 py-2 rounded-[6px] border border-[#E2E8F0] bg-white hover:bg-slate-50 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-[6px] bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-semibold cursor-pointer"
                >
                  Save lesson plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
