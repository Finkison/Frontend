import React, { useState } from "react";
import useAuthStore from "../../store/authStore";
import { 
  Sparkles, 
  Plus, 
  Share2, 
  Check, 
  BookOpen, 
  Filter, 
  Search, 
  Tag, 
  BarChart2, 
  Printer, 
  Copy, 
  Trash2, 
  X,
  Layers,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useToast } from "../ui/Toast";

interface QuestionItem {
  id: string;
  code: string;
  unit: number;
  unitName: string;
  topic: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  bloomLevel: "Recall" | "Understand" | "Apply" | "Analyze";
  difficulty: "Foundational" | "Moderate" | "Challenging";
  studentAccuracy: number; // percentage
  attemptsCount: number;
  shared: boolean;
  author: string;
}

export default function TeacherQuestionBankView(): React.ReactElement {
  const { showToast } = useToast();
  const { user } = useAuthStore();
  const teacherSubject = (user as any)?.subject || "Biology";

  const [selectedUnit, setSelectedUnit] = useState<string>("all");
  const [selectedBloom, setSelectedBloom] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedShareFilter, setSelectedShareFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Selected for bulk test export
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Add question form state
  const [newText, setNewText] = useState("");
  const [newUnit, setNewUnit] = useState(4);
  const [newTopic, setNewTopic] = useState("");
  const [newBloom, setNewBloom] = useState<"Recall" | "Understand" | "Apply" | "Analyze">("Apply");
  const [newDifficulty, setNewDifficulty] = useState<"Foundational" | "Moderate" | "Challenging">("Moderate");
  const [newOptions, setNewOptions] = useState(["", "", "", ""]);
  const [newCorrectIndex, setNewCorrectIndex] = useState(0);
  const [newExplanation, setNewExplanation] = useState("");

  const [questions, setQuestions] = useState<QuestionItem[]>([
    {
      id: "qb-1",
      code: "QB-BIO-401",
      unit: 4,
      unitName: "Cell Physiology & Metabolism",
      topic: "Cellular Respiration & ATP Synthesis",
      text: "Which organelle in eukaryotic cells is responsible for cellular ATP synthesis during aerobic respiration, and what is the primary role of its inner mitochondrial cristae?",
      options: [
        "Ribosome: Peptide bond synthesis",
        "Mitochondria: Maximizing surface area for the electron transport chain",
        "Golgi apparatus: Protein glycosylation and sorting",
        "Endoplasmic reticulum: Calcium ion sequestration"
      ],
      correctIndex: 1,
      explanation: "Mitochondrial cristae provide extensive surface area accommodating high concentrations of ETC Complexes I–IV and ATP synthase enzymes.",
      bloomLevel: "Understand",
      difficulty: "Foundational",
      studentAccuracy: 88,
      attemptsCount: 142,
      shared: true,
      author: "Dr. Aster Bekele"
    },
    {
      id: "qb-2",
      code: "QB-BIO-304",
      unit: 3,
      unitName: "Genetics & Molecular Inheritance",
      topic: "Meiosis & Chromosomal Recombination",
      text: "During which specific sub-stage of Prophase I do homologous chromosome non-sister chromatids form chiasmata and undergo crossing over?",
      options: [
        "Leptotene: Condensation of chromatin",
        "Pachytene: Crossing over and genetic recombination",
        "Diplotene: Dissolution of synaptonemal complex",
        "Diakinesis: Terminalization of chiasmata"
      ],
      correctIndex: 1,
      explanation: "Crossing over occurs during pachytene when the synaptonemal complex stabilizes tetrad pairs.",
      bloomLevel: "Recall",
      difficulty: "Moderate",
      studentAccuracy: 72,
      attemptsCount: 120,
      shared: true,
      author: "Dr. Aster Bekele"
    },
    {
      id: "qb-3",
      code: "QB-BIO-508",
      unit: 5,
      unitName: "Human Organ Systems & Homeostasis",
      topic: "Renal Physiology",
      text: "What primary biophysical mechanism accounts for the ultrafiltration of blood plasma within the glomerulus into Bowman's capsule?",
      options: [
        "Active sodium pumping via ATP hydrolysis",
        "Glomerular capillary hydrostatic pressure exceeding opposing osmotic and capsular pressures",
        "Facilitated diffusion through aquaporin channels",
        "Endocytosis of plasma macromolecules by podocytes"
      ],
      correctIndex: 1,
      explanation: "Net filtration pressure (NFP ~ 10 mmHg) is driven by afferent arteriole glomerular hydrostatic pressure overcoming colloid osmotic and capsular pressures.",
      bloomLevel: "Analyze",
      difficulty: "Challenging",
      studentAccuracy: 54,
      attemptsCount: 96,
      shared: false,
      author: "Dr. Aster Bekele"
    },
    {
      id: "qb-4",
      code: "QB-BIO-412",
      unit: 4,
      unitName: "Cell Physiology & Metabolism",
      topic: "Enzyme Kinetics & Regulation",
      text: "In the presence of a competitive inhibitor, what changes are observed in the Michaelis constant (Km) and maximal velocity (Vmax) of an enzymatic reaction?",
      options: [
        "Km increases while Vmax remains unchanged",
        "Km decreases while Vmax increases",
        "Both Km and Vmax decrease proportionally",
        "Km remains unchanged while Vmax decreases"
      ],
      correctIndex: 0,
      explanation: "Competitive inhibitors bind reversibly to the active site, requiring higher substrate concentration to reach half-maximal velocity (Km increases), but high substrate can still saturate the enzyme (Vmax unchanged).",
      bloomLevel: "Apply",
      difficulty: "Challenging",
      studentAccuracy: 61,
      attemptsCount: 110,
      shared: true,
      author: "Dr. Aster Bekele"
    }
  ]);

  const handleToggleShare = (id: string) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, shared: !q.shared } : q))
    );
    showToast({
      title: "Sharing updated",
      message: "Item sharing permissions with department faculty have been updated.",
      type: "success"
    });
  };

  const handleDuplicate = (q: QuestionItem) => {
    const duplicated: QuestionItem = {
      ...q,
      id: `qb-${Date.now()}`,
      code: `QB-BIO-${Math.floor(100 + Math.random() * 900)}`,
      shared: false,
      studentAccuracy: 0,
      attemptsCount: 0
    };
    setQuestions([duplicated, ...questions]);
    showToast({
      title: "Question duplicated",
      message: `Created duplicate item "${duplicated.code}".`,
      type: "success"
    });
  };

  const handleSelectToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredQuestions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredQuestions.map((q) => q.id));
    }
  };

  const handleExportSelected = () => {
    if (selectedIds.length === 0) {
      showToast({
        title: "No questions selected",
        message: "Select at least one question to export a printable assessment.",
        type: "info"
      });
      return;
    }
    showToast({
      title: "Assessment exported",
      message: `Generated printable test sheet with ${selectedIds.length} items and answer keys.`,
      type: "success"
    });
  };

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim() || newOptions.some((opt) => !opt.trim())) {
      showToast({
        title: "Incomplete item",
        message: "Please fill in the question text and all 4 response choices.",
        type: "error"
      });
      return;
    }

    const newItem: QuestionItem = {
      id: `qb-${Date.now()}`,
      code: `QB-BIO-${Math.floor(100 + Math.random() * 900)}`,
      unit: newUnit,
      unitName: newUnit === 4 ? "Cell Physiology & Metabolism" : newUnit === 3 ? "Genetics & Molecular Inheritance" : "Curriculum Unit",
      topic: newTopic || "General Topic",
      text: newText.trim(),
      options: [...newOptions],
      correctIndex: newCorrectIndex,
      explanation: newExplanation || "Standard textbook rationale aligned with national syllabus.",
      bloomLevel: newBloom,
      difficulty: newDifficulty,
      studentAccuracy: 0,
      attemptsCount: 0,
      shared: true,
      author: "Dr. Aster Bekele"
    };

    setQuestions([newItem, ...questions]);
    setIsAddModalOpen(false);
    setNewText("");
    setNewTopic("");
    setNewOptions(["", "", "", ""]);
    setNewExplanation("");
    showToast({
      title: "Question drafted",
      message: `Item ${newItem.code} added to question bank.`,
      type: "success"
    });
  };

  const filteredQuestions = questions.filter((q) => {
    if (selectedUnit !== "all" && String(q.unit) !== selectedUnit) return false;
    if (selectedBloom !== "all" && q.bloomLevel !== selectedBloom) return false;
    if (selectedDifficulty !== "all" && q.difficulty !== selectedDifficulty) return false;
    if (selectedShareFilter === "shared" && !q.shared) return false;
    if (selectedShareFilter === "private" && q.shared) return false;
    if (searchQuery.trim()) {
      const qLower = searchQuery.toLowerCase();
      const matchText = q.text.toLowerCase().includes(qLower);
      const matchTopic = q.topic.toLowerCase().includes(qLower);
      const matchCode = q.code.toLowerCase().includes(qLower);
      if (!matchText && !matchTopic && !matchCode) return false;
    }
    return true;
  });

  const sharedCount = questions.filter((q) => q.shared).length;

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-[#0F172A] tracking-tight">Question bank</h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
              {teacherSubject}
            </span>
          </div>
          <p className="text-xs text-[#475569] mt-0.5">
            Subject question bank with cognitive levels, difficulty ratings, and discrimination metrics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <button
              type="button"
              onClick={handleExportSelected}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[8px] border border-[#BFDBFE] bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#1D4ED8] text-xs font-semibold shadow-xs cursor-pointer min-h-[40px]"
            >
              <Printer className="w-4 h-4" />
              <span>Export {selectedIds.length} items to test</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-[8px] bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold shadow-xs cursor-pointer min-h-[40px]"
          >
            <Plus className="w-4 h-4" />
            <span>Add question</span>
          </button>
        </div>
      </div>

      {/* Telemetry Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-[#E2E8F0] rounded-[8px] shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total items in bank</div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#0F172A] font-mono">{questions.length}</span>
            <span className="text-xs text-slate-500 font-medium">Verified items</span>
          </div>
        </div>
        <div className="p-4 bg-white border border-[#E2E8F0] rounded-[8px] shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Department shared</div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-700 font-mono">{sharedCount}</span>
            <span className="text-xs text-emerald-600 font-medium">Faculty visible</span>
          </div>
        </div>
        <div className="p-4 bg-white border border-[#E2E8F0] rounded-[8px] shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">National EUEE aligned</div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#1D4ED8] font-mono">100%</span>
            <span className="text-xs text-blue-600 font-medium">MoE syllabus</span>
          </div>
        </div>
        <div className="p-4 bg-white border border-[#E2E8F0] rounded-[8px] shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Average accuracy</div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-700 font-mono">71.2%</span>
            <span className="text-xs text-slate-500 font-medium">Cohort attempts</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Console */}
      <div className="bg-white border border-[#E2E8F0] rounded-[8px] p-3 shadow-xs space-y-3 text-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search question stem, keywords, topic, or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-[#E2E8F0] rounded-[6px] text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#1D4ED8]"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSelectAll}
              className="px-2.5 py-1.5 rounded-[6px] border border-[#E2E8F0] hover:bg-slate-50 text-slate-700 font-semibold cursor-pointer"
            >
              {selectedIds.length === filteredQuestions.length && filteredQuestions.length > 0
                ? "Deselect all"
                : "Select all"}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E2E8F0]">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Unit:</span>
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="px-2 py-1 border border-[#E2E8F0] rounded-[6px] bg-white text-xs"
            >
              <option value="all">All units</option>
              <option value="3">Unit 3: Genetics</option>
              <option value="4">Unit 4: Cell Physiology</option>
              <option value="5">Unit 5: Human Systems</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Cognitive Level:</span>
            <select
              value={selectedBloom}
              onChange={(e) => setSelectedBloom(e.target.value)}
              className="px-2 py-1 border border-[#E2E8F0] rounded-[6px] bg-white text-xs"
            >
              <option value="all">All Bloom levels</option>
              <option value="Recall">Recall</option>
              <option value="Understand">Understand</option>
              <option value="Apply">Apply</option>
              <option value="Analyze">Analyze</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Difficulty:</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-2 py-1 border border-[#E2E8F0] rounded-[6px] bg-white text-xs"
            >
              <option value="all">All difficulties</option>
              <option value="Foundational">Foundational</option>
              <option value="Moderate">Moderate</option>
              <option value="Challenging">Challenging</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Sharing:</span>
            <select
              value={selectedShareFilter}
              onChange={(e) => setSelectedShareFilter(e.target.value)}
              className="px-2 py-1 border border-[#E2E8F0] rounded-[6px] bg-white text-xs"
            >
              <option value="all">All items</option>
              <option value="shared">Department shared</option>
              <option value="private">Private items</option>
            </select>
          </div>
        </div>
      </div>

      {/* Questions Item List */}
      <div className="space-y-3">
        {filteredQuestions.length === 0 ? (
          <div className="bg-white border border-[#E2E8F0] rounded-[8px] p-8 text-center text-slate-500 text-xs shadow-xs">
            No questions match your current search and filter settings.
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const isSelected = selectedIds.includes(q.id);
            return (
              <div
                key={q.id}
                className={`p-4 bg-white border rounded-[8px] space-y-3 text-xs shadow-xs transition-colors ${
                  isSelected ? "border-[#1D4ED8] bg-blue-50/10" : "border-[#E2E8F0]"
                }`}
              >
                {/* Item Meta Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-2.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectToggle(q.id)}
                      className="rounded border-[#E2E8F0] text-[#1D4ED8] focus:ring-0 cursor-pointer"
                    />
                    <span className="font-mono font-semibold text-slate-700">{q.code}</span>
                    <span className="px-2 py-0.5 rounded-[4px] bg-slate-100 text-slate-700 font-semibold text-[10px]">
                      Unit {q.unit} • {q.topic}
                    </span>
                    <span className="px-2 py-0.5 rounded-[4px] bg-slate-100 text-slate-700 font-semibold text-[10px] border border-slate-200">
                      Bloom: {q.bloomLevel}
                    </span>
                    <span className={`px-2 py-0.5 rounded-[4px] font-semibold text-[10px] border ${
                      q.difficulty === "Foundational"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : q.difficulty === "Moderate"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-rose-50 text-rose-700 border-rose-200"
                    }`}>
                      {q.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {q.attemptsCount > 0 && (
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                        <BarChart2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{q.studentAccuracy}% accuracy ({q.attemptsCount} attempts)</span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => handleToggleShare(q.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-[6px] text-[11px] font-semibold border cursor-pointer ${
                        q.shared
                          ? "bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                    >
                      <Share2 className="w-3 h-3" />
                      <span>{q.shared ? "Department shared" : "Private"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDuplicate(q)}
                      title="Duplicate item"
                      className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Question Stem */}
                <div className="font-medium text-[#0F172A] text-sm leading-relaxed">
                  {q.text}
                </div>

                {/* Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 pt-1">
                  {q.options.map((opt, optIdx) => {
                    const isCorrect = optIdx === q.correctIndex;
                    const letter = String.fromCharCode(65 + optIdx);
                    return (
                      <div
                        key={optIdx}
                        className={`p-2.5 rounded-[6px] border text-xs flex items-start gap-2 ${
                          isCorrect
                            ? "bg-emerald-50 text-emerald-900 border-emerald-300 font-semibold"
                            : "bg-[#F8FAFC] border-[#E2E8F0] text-slate-700"
                        }`}
                      >
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono shrink-0 ${
                          isCorrect ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-700"
                        }`}>
                          {letter}
                        </span>
                        <span className="leading-snug">{opt}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Pedagogical Explanation */}
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-[6px] text-[11px] text-slate-600">
                  <span className="font-semibold text-slate-700">Curriculum Rationale:</span> {q.explanation}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Question Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-[8px] shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-[#0F172A]">Add question to item bank</h2>
                <p className="text-xs text-[#475569]">{teacherSubject} curriculum</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateQuestion} className="p-5 space-y-4 text-xs">
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
                  <label className="block font-semibold text-[#0F172A] mb-1">Topic Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Enzyme Catalysis"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E2E8F0] rounded-[6px] text-xs bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0F172A] mb-1">Bloom's Taxonomy Tier</label>
                  <select
                    value={newBloom}
                    onChange={(e) => setNewBloom(e.target.value as any)}
                    className="w-full px-3 py-2 border border-[#E2E8F0] rounded-[6px] bg-white text-xs"
                  >
                    <option value="Recall">Recall</option>
                    <option value="Understand">Understand</option>
                    <option value="Apply">Apply</option>
                    <option value="Analyze">Analyze</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#0F172A] mb-1">Difficulty Level</label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 border border-[#E2E8F0] rounded-[6px] bg-white text-xs"
                  >
                    <option value="Foundational">Foundational</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Challenging">Challenging</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0F172A] mb-1">Question Stem</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter the complete question stem with precision..."
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-[6px] text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#1D4ED8]"
                />
              </div>

              {/* Options */}
              <div>
                <label className="block font-semibold text-[#0F172A] mb-1">
                  Response Options & Correct Answer Key
                </label>
                <div className="space-y-2">
                  {newOptions.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correctAnswerKey"
                        checked={newCorrectIndex === idx}
                        onChange={() => setNewCorrectIndex(idx)}
                        className="text-[#1D4ED8] focus:ring-0 cursor-pointer"
                        title="Mark as correct answer"
                      />
                      <span className="font-mono font-semibold text-slate-500 w-4">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <input
                        type="text"
                        required
                        placeholder={`Option ${String.fromCharCode(65 + idx)} text`}
                        value={opt}
                        onChange={(e) => {
                          const updated = [...newOptions];
                          updated[idx] = e.target.value;
                          setNewOptions(updated);
                        }}
                        className="flex-1 px-3 py-1.5 border border-[#E2E8F0] rounded-[6px] text-xs bg-white"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0F172A] mb-1">
                  Pedagogical Rationale / Explanation
                </label>
                <textarea
                  rows={2}
                  placeholder="Explanation provided to students in answer keys..."
                  value={newExplanation}
                  onChange={(e) => setNewExplanation(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-[6px] text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#1D4ED8]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-2 rounded-[6px] border border-[#E2E8F0] bg-white hover:bg-slate-50 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-[6px] bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-semibold cursor-pointer"
                >
                  Save question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
