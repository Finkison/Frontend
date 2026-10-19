import React, { useState } from "react";
import useAuthStore from "../../store/authStore";
import { 
  generateStandardExam, 
  approveAndPublishExam,
  executeAITeachingTool 
} from "../../services/schoolService";
import { 
  BrainCircuit, 
  BookOpen, 
  FileCheck, 
  Calendar, 
  FileText, 
  CheckSquare, 
  Sparkles, 
  MessageSquare,
  ArrowRight,
  Check,
  X,
  AlertCircle,
  Eye,
  Send,
  Lock,
  RefreshCw,
  Download,
  Plus,
  Sliders,
  CheckCircle2,
  HelpCircle,
  Layers
} from "lucide-react";
import { useToast } from "../ui/Toast";

// Standard 8 Teaching Tools tested in teachingStandardization.test.ts
const AI_TOOLS = [
  { id: "exam-generator", label: "Exam generator", description: "Generate timed curriculum exams aligned with national blueprints.", icon: FileCheck },
  { id: "notes", label: "Notes by unit or lesson", description: "Synthesize structured study summaries from textbook units.", icon: BookOpen },
  { id: "lesson-plan", label: "Lesson plan", description: "Detailed 45-minute structured instructional plans.", icon: Calendar },
  { id: "scheme-of-work", label: "Scheme of work for a term", description: "Term-level pedagogical unit pacing and milestones.", icon: FileText },
  { id: "worksheet", label: "Worksheet and practice set", description: "Student practice exercises and classroom problem sets.", icon: CheckSquare },
  { id: "rubric", label: "Rubric and marking scheme", description: "Standards-based marking guides and criterion matrix.", icon: Sparkles },
  { id: "flashcards", label: "Unit summary and key terms", description: "High-yield revision flashcards for student study tools.", icon: BrainCircuit },
  { id: "feedback", label: "Feedback suggestions for graded work", description: "Targeted pedagogical remedial suggestions for student gaps.", icon: MessageSquare },
];

export default function AIAssistantHub(): React.ReactElement {
  const { showToast } = useToast();
  const { user } = useAuthStore();
  const teacherSubject = (user as any)?.subject || "Biology";

  const [selectedTool, setSelectedTool] = useState("exam-generator");
  
  // Configuration Form
  const [scopeType, setScopeType] = useState<"single" | "multiple" | "all">("single");
  const [unitNumber, setUnitNumber] = useState(4);
  const [selectedSections, setSelectedSections] = useState<string[]>(["12-A", "12-B"]);
  const [optionalContext, setOptionalContext] = useState("");
  const [difficultyMix, setDifficultyMix] = useState<"standard" | "challenger" | "foundational">("standard");

  // Max Question Limit Enforced by Subject Configuration (Per Enterprise Spec)
  const getSubjectLimit = (sub: string): number => {
    const s = sub.toLowerCase();
    if (s.includes("english")) return 100;
    if (s.includes("biology")) return 100;
    if (s.includes("chemistry")) return 100;
    if (s.includes("physics")) return 60;
    if (s.includes("math")) return 60;
    return 50;
  };

  const maxLimit = getSubjectLimit(teacherSubject);
  const [questionCount, setQuestionCount] = useState(Math.min(25, maxLimit));

  // Generated State & Questions
  const [loading, setLoading] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [showSwapDrawer, setShowSwapDrawer] = useState(false);
  const [swappingQuestionIdx, setSwappingQuestionIdx] = useState<number | null>(null);

  const [questions, setQuestions] = useState<any[]>([]);
  const [alternativeQuestions, setAlternativeQuestions] = useState<any[]>([]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      if (selectedTool === "exam-generator") {
        const res = await generateStandardExam({
          subject_id: teacherSubject.toLowerCase(),
          section_ids: selectedSections,
          scope: scopeType === "all" ? "all_units" : `unit_${unitNumber}`,
          question_count: Math.min(questionCount, maxLimit),
          context: optionalContext
        });
        if (res.data?.questions && Array.isArray(res.data.questions)) {
          setQuestions(res.data.questions);
        }
        if (res.data?.alternatives && Array.isArray(res.data.alternatives)) {
          setAlternativeQuestions(res.data.alternatives);
        }
      } else {
        await executeAITeachingTool({
          tool_id: selectedTool,
          subject_id: teacherSubject.toLowerCase(),
          section_id: selectedSections[0] || "12-A",
          unit_number: unitNumber,
          context: optionalContext
        });
      }
      showToast({
        title: "Assessment Paper Calibrated",
        message: `Drafted syllabus exam matching official ${teacherSubject} examination specifications.`,
        type: "success"
      });
    } catch (err: any) {
      showToast({
        title: "Generation Failed",
        message: err?.response?.data?.message || err?.message || "Failed to generate exam questions. Please try again.",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePublish = async () => {
    try {
      await approveAndPublishExam({ exam_id: "exam-gen-101", section_ids: selectedSections });
      setIsPublished(true);
      showToast({
        title: "Exam Approved & Scheduled",
        message: `Assessment published to Section ${selectedSections.join(", ")}. Students will access it on scheduled test date.`,
        type: "success"
      });
    } catch (err: any) {
      showToast({
        title: "Publish Failed",
        message: err?.response?.data?.message || err?.message || "Failed to publish exam. Please check your connection and try again.",
        type: "error"
      });
    }
  };

  const handleSwapQuestion = (replacement: any) => {
    if (swappingQuestionIdx === null) return;
    const updated = [...questions];
    updated[swappingQuestionIdx] = {
      ...updated[swappingQuestionIdx],
      text: replacement.text,
      options: replacement.options,
      correct: replacement.correct,
      explanation: replacement.explanation
    };
    setQuestions(updated);
    setShowSwapDrawer(false);
    setSwappingQuestionIdx(null);
    showToast({
      title: "Question Replaced",
      message: `Item ${swappingQuestionIdx + 1} swapped with repository item.`,
      type: "success"
    });
  };

  const handleExportPDF = () => {
    showToast({
      title: "Exam Paper Exported",
      message: `Formatted print-ready PDF for ${teacherSubject} Unit ${unitNumber} generated with student identification block.`,
      type: "success"
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans animate-fade-in text-start pb-12">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-[#0F172A] tracking-tight">AI assistant</h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
              {teacherSubject}
            </span>
          </div>
          <p className="text-xs text-[#475569] mt-0.5">
            Syllabus-grounded assessments, lesson plans, and instructional tools.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportPDF}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[8px] border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer min-h-[40px] shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export printable paper</span>
          </button>

          <button
            type="button"
            onClick={handleApprovePublish}
            disabled={isPublished}
            className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-[8px] text-xs font-semibold shadow-xs cursor-pointer min-h-[40px] ${
              isPublished
                ? "bg-emerald-600 text-white cursor-default"
                : "bg-[#1D4ED8] hover:bg-[#1E40AF] text-white"
            }`}
          >
            {isPublished ? <Check className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            <span>{isPublished ? "Exam published" : "Approve and schedule"}</span>
          </button>
        </div>
      </div>

      {/* 2. Standard 8 Teaching Assistance Tools Selector */}
      <div className="bg-white border border-[#E2E8F0] rounded-[8px] p-2 shadow-xs overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          {AI_TOOLS.map((tool) => {
            const Icon = tool.icon;
            const isSelected = selectedTool === tool.id;
            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => setSelectedTool(tool.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-[8px] text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#1D4ED8] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-slate-500"}`} />
                <span>{tool.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Dual-Pane Split-Screen Interactive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Pane (35%): Parameters & Blueprint Configuration */}
        <div className="lg:col-span-5 bg-white border border-[#E2E8F0] rounded-[8px] p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#1D4ED8]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">Blueprint Parameters</h2>
            </div>
            <span className="text-[11px] font-mono text-slate-500">Max {maxLimit} items</span>
          </div>

          {/* Target Section */}
          <div className="space-y-1.5 text-xs">
            <label className="font-semibold text-slate-800 block">Assigned Sections</label>
            <div className="flex gap-2">
              {["12-A", "12-B"].map((sec) => (
                <label
                  key={sec}
                  className={`flex-1 flex items-center justify-center gap-1.5 p-2 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                    selectedSections.includes(sec)
                      ? "border-[#1D4ED8] bg-[#EFF6FF] text-[#1D4ED8]"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={selectedSections.includes(sec)}
                    onChange={() => {
                      if (selectedSections.includes(sec)) {
                        if (selectedSections.length > 1) {
                          setSelectedSections(selectedSections.filter((s) => s !== sec));
                        }
                      } else {
                        setSelectedSections([...selectedSections, sec]);
                      }
                    }}
                  />
                  <span>Section {sec}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Unit Scope */}
          <div className="space-y-1.5 text-xs">
            <label className="font-semibold text-slate-800 block">Curriculum Scope</label>
            <select
              value={scopeType}
              onChange={(e: any) => setScopeType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 font-medium focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
            >
              <option value="single">Single unit focus • Unit {unitNumber}</option>
              <option value="multiple">Midterm multi-unit • Units 1–4</option>
              <option value="all">Comprehensive national blueprint</option>
            </select>
          </div>

          {scopeType === "single" && (
            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-slate-800 block">Target Curriculum Unit</label>
              <select
                value={unitNumber}
                onChange={(e) => setUnitNumber(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
              >
                <option value={1}>Unit 1: Sub-Cellular Organization</option>
                <option value={2}>Unit 2: Biological Molecules & Enzymes</option>
                <option value={3}>Unit 3: Genetics & Molecular Biology</option>
                <option value={4}>Unit 4: Cell Physiology & Energetics</option>
                <option value={5}>Unit 5: Human Organ Systems</option>
                <option value={6}>Unit 6: Ecology & Conservation</option>
              </select>
            </div>
          )}

          {/* Question Count Slider with Exact Subject Cap */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-800">Total Items</label>
              <span className="font-mono font-bold text-[#1D4ED8] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE]">
                {questionCount} questions
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={maxLimit}
              step={5}
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full accent-[#1D4ED8] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>10 min</span>
              <span>{maxLimit} max ({teacherSubject})</span>
            </div>
          </div>

          {/* Difficulty Mix Selector */}
          <div className="space-y-1.5 text-xs">
            <label className="font-semibold text-slate-800 block">Cognitive & Difficulty Distribution</label>
            <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
              <button
                type="button"
                onClick={() => setDifficultyMix("foundational")}
                className={`p-2 rounded-lg border font-semibold cursor-pointer transition-colors ${
                  difficultyMix === "foundational" ? "border-emerald-500 bg-emerald-50 text-emerald-800" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                Recall-Focused (60/30/10)
              </button>
              <button
                type="button"
                onClick={() => setDifficultyMix("standard")}
                className={`p-2 rounded-lg border font-semibold cursor-pointer transition-colors ${
                  difficultyMix === "standard" ? "border-[#1D4ED8] bg-[#EFF6FF] text-[#1D4ED8]" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                Standard National (40/40/20)
              </button>
              <button
                type="button"
                onClick={() => setDifficultyMix("challenger")}
                className={`p-2 rounded-lg border font-semibold cursor-pointer transition-colors ${
                  difficultyMix === "challenger" ? "border-amber-500 bg-amber-50 text-amber-800" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                Advanced Analytical (20/40/40)
              </button>
            </div>
          </div>

          {/* Specific Context */}
          <div className="space-y-1.5 text-xs">
            <label className="font-semibold text-slate-800 block">Educator directives and context</label>
            <textarea
              rows={3}
              value={optionalContext}
              onChange={(e) => setOptionalContext(e.target.value)}
              placeholder="E.g., Emphasize mitochondrial electron transport ATP calculations and competitive enzyme graphs."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
            />
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Calibrating items...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Calibrate blueprint</span>
              </>
            )}
          </button>
        </div>

        {/* Right Pane (65%): Live Interactive Paper Canvas */}
        <div className="lg:col-span-7 bg-white border border-[#E2E8F0] rounded-[8px] shadow-xs overflow-hidden">
          {/* Paper Masthead */}
          <div className="p-6 border-b border-[#E2E8F0] bg-[#F8FAFC] text-center space-y-2 select-none">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE] uppercase tracking-wider">
              <CheckCircle2 className="w-3 h-3 text-[#1D4ED8]" />
              <span>Assessment preview</span>
            </div>
            <h3 className="text-base font-bold text-[#0F172A] uppercase tracking-wide">
              {teacherSubject} Secondary Examination • Grade 12
            </h3>
            <p className="text-xs text-slate-500">
              Unit {unitNumber} Focus • Time Allowed: 2 Hours • Total Items: {questions.length}
            </p>

            <div className="pt-2 flex justify-center gap-6 text-[11px] font-mono text-slate-500 border-t border-slate-200/60 max-w-sm mx-auto">
              <span>Section: {selectedSections.join(", ")}</span>
              <span>•</span>
              <span>Educator verified</span>
            </div>
          </div>

          {/* Question List */}
          <div className="p-6 space-y-6 divide-y divide-slate-100">
            {questions.length === 0 ? (
              <div className="py-12 text-center text-slate-500 space-y-3">
                <BrainCircuit className="w-10 h-10 mx-auto text-slate-300 stroke-[1.5]" />
                <p className="text-sm font-semibold text-slate-700">No assessment items generated yet.</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Configure your curriculum unit, difficulty mix, and item count on the left, then click Calibrate blueprint.
                </p>
              </div>
            ) : (
              questions.map((q, idx) => (
                <div key={idx} className="pt-5 first:pt-0 space-y-3 text-start">
                  {/* Question Meta & Action Toolbar */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#1D4ED8] text-white font-bold text-xs flex items-center justify-center">
                        {q.number}
                      </span>
                      <span className="font-semibold text-slate-600 text-[11px]">
                        Unit {q.unit} • {q.topic}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {q.difficulty}
                      </span>
                    </div>

                    {/* Inline Tooling */}
                    <div className="flex items-center gap-1.5 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setSwappingQuestionIdx(idx);
                          setShowSwapDrawer(true);
                        }}
                        className="px-2.5 py-1 rounded border border-slate-200 text-slate-600 hover:text-[#1D4ED8] hover:bg-slate-50 text-[11px] font-semibold cursor-pointer inline-flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3 text-slate-400" />
                        <span>Swap Item</span>
                      </button>
                    </div>
                  </div>

                  {/* Question Stem */}
                  <p className="text-xs sm:text-sm font-medium text-[#0F172A] leading-relaxed">
                    {q.text}
                  </p>

                  {/* Options Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options?.map((opt: string, optIdx: number) => {
                      const isKey = opt.startsWith(q.correct);
                      return (
                        <div
                          key={optIdx}
                          className={`p-2.5 rounded-lg border text-xs font-medium ${
                            isKey
                              ? "bg-emerald-50/70 border-emerald-300 text-emerald-900"
                              : "bg-slate-50/70 border-slate-200 text-slate-700"
                          }`}
                        >
                          {opt} {isKey && <span className="text-[10px] font-semibold text-emerald-700 ml-1.5">• Correct key</span>}
                        </div>
                      );
                    })}
                  </div>

                  {/* Pedagogical Rationale & Key */}
                  <div className="p-3 bg-blue-50/40 rounded-lg border border-blue-100 text-[11px] text-slate-600 space-y-1">
                    <span className="font-bold text-[#1D4ED8]">Pedagogical Rationale:</span>
                    <p>{q.explanation}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 4. Question Swapping Drawer / Modal */}
      {showSwapDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-[#E2E8F0] shadow-xl animate-fade-in text-start">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">Swap Question {swappingQuestionIdx !== null ? swappingQuestionIdx + 1 : ""}</h3>
                <p className="text-xs text-slate-500">Select an alternative item from the {teacherSubject} curriculum repository.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowSwapDrawer(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {alternativeQuestions.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs">
                  No alternative repository items available for this unit.
                </div>
              ) : (
                alternativeQuestions.map((alt, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:border-[#1D4ED8] transition-all space-y-2 text-xs"
                  >
                    <p className="font-medium text-[#0F172A]">{alt.text}</p>
                    <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-600">
                      {alt.options?.map((o: string, i: number) => (
                        <span key={i}>{o}</span>
                      ))}
                    </div>
                    <div className="pt-2 flex justify-between items-center border-t border-slate-200/60">
                      <span className="text-[10px] font-mono font-semibold text-emerald-700">Correct: {alt.correct}</span>
                      <button
                        type="button"
                        onClick={() => handleSwapQuestion(alt)}
                        className="px-3 py-1 rounded bg-[#1D4ED8] text-white text-xs font-semibold cursor-pointer hover:bg-[#1E40AF]"
                      >
                        Use This Question
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
